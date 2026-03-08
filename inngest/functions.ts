import { inngest } from "./client";
import { RetryAfterError } from "inngest";
import { supabaseAdmin } from "../lib/supabase";
import { groqClient } from "../lib/groq";
import { getProvider, getVoiceById, LANGUAGE_CODES } from "../lib/voice-config";
import { plunk } from "../lib/plunk";
import { buildVideoReadyEmail } from "../lib/email-templates";
import { renderWithCreatomate } from "../actions/render";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scene {
    scene_script: string;
    image_prompt: string;
}

interface ScriptData {
    title: string;
    total_script: string;
    scenes: Scene[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Splits text into chunks of roughly MAX_CHARS characters, breaking at sentence boundaries */
function splitTextIntoChunks(text: string, maxChars: number = 400): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxChars && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += sentence;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

/** Upload raw bytes to Supabase Storage and return the public URL */
async function uploadToStorage(
    bucket: string,
    path: string,
    body: ArrayBuffer | Buffer,
    contentType: string
): Promise<string> {
    const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(path, body, { contentType, upsert: true });

    if (error) throw new Error(`Storage upload failed (${bucket}/${path}): ${error.message}`);

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

/** Build a simple SRT caption file from scenes and total duration (seconds) */
function buildSRT(scenes: Scene[], totalDurationSeconds: number): string {
    const secPerScene = totalDurationSeconds / scenes.length;

    return scenes
        .map((scene, i) => {
            const start = i * secPerScene;
            const end = (i + 1) * secPerScene;
            const fmt = (s: number) => {
                const h = Math.floor(s / 3600).toString().padStart(2, "0");
                const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
                const sec = Math.floor(s % 60).toString().padStart(2, "0");
                const ms = Math.round((s % 1) * 1000).toString().padStart(3, "0");
                return `${h}:${m}:${sec},${ms}`;
            };
            return `${i + 1}\n${fmt(start)} --> ${fmt(end)}\n${scene.scene_script.trim()}\n`;
        })
        .join("\n");
}

/** Parse video duration string like "30-40" → midpoint in seconds (35) */
function parseDurationSeconds(videoDuration: string): number {
    const parts = videoDuration.replace(/[^0-9-]/g, "").split("-").map(Number);
    const avg = parts.length === 2 ? (parts[0] + parts[1]) / 2 : parts[0] ?? 60;
    return avg;
}

// ─── TTS: Deepgram ────────────────────────────────────────────────────────────

async function generateDeepgramAudio(
    text: string,
    voiceId: string
): Promise<ArrayBuffer> {
    const response = await fetch(
        `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(voiceId)}`,
        {
            method: "POST",
            headers: {
                Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        }
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Deepgram TTS failed: ${response.status} ${err}`);
    }

    return response.arrayBuffer();
}

/** 
 * Generate SRT captions from audio URL using Deepgram STT.
 * Uses the Nova-2 model for best accuracy.
 */
async function generateDeepgramCaptions(
    audioUrl: string,
    language: string
): Promise<string> {
    const langCode = LANGUAGE_CODES[language] || "en";

    // Call Deepgram STT with utterances enabled
    const response = await fetch(
        `https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&utterances=true&punctuate=true&language=${langCode}`,
        {
            method: "POST",
            headers: {
                Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: audioUrl }),
        }
    );

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Deepgram STT failed: ${response.status} ${err}`);
    }

    const data = await response.json();
    const utterances = data.results?.utterances;

    if (!utterances || utterances.length === 0) {
        // Fallback: If no utterances, return empty or try to get from transcript
        const transcript = data.results?.channels[0]?.alternatives[0]?.transcript;
        if (transcript) {
            return `1\n00:00:00,000 --> 00:00:10,000\n${transcript}\n`;
        }
        return "";
    }

    // Convert utterances to SRT
    const srt = utterances
        .map((utt: any, i: number) => {
            const fmtTime = (s: number) => {
                const h = Math.floor(s / 3600).toString().padStart(2, "0");
                const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
                const sec = Math.floor(s % 60).toString().padStart(2, "0");
                const ms = Math.round((s % 1) * 1000).toString().padStart(3, "0");
                return `${h}:${m}:${sec},${ms}`;
            };
            return `${i + 1}\n${fmtTime(utt.start)} --> ${fmtTime(utt.end)}\n${utt.transcript.trim()}\n`;
        })
        .join("\n");

    return srt;
}

// ─── TTS: Fonadalabs ──────────────────────────────────────────────────────────

async function generateFonadalabsAudio(
    text: string,
    voiceId: string,
    language: string
): Promise<ArrayBuffer> {
    // Fonadalabs expects full language names (e.g. "Hindi", "Marathi") 
    const langCode = language;
    // Limit to 250 chars per chunk to avoid hitting the 30-second audio generation limit
    // (466 chars was ~35s)
    const chunks = splitTextIntoChunks(text, 250);
    console.log(`Splitting FonadaLabs text into ${chunks.length} chunks...`);

    const audioChunks: ArrayBuffer[] = [];

    for (let i = 0; i < chunks.length; i++) {
        console.log(`Generating audio for chunk ${i + 1}/${chunks.length}...`);
        const response = await fetch("https://api.fonada.ai/tts/generate-audio-large", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.FONADALABS_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: chunks[i],
                voice: voiceId,
                language: langCode,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Fonadalabs TTS failed on chunk ${i + 1}: ${response.status} ${err}`);
        }

        audioChunks.push(await response.arrayBuffer());
    }

    // Merge audio chunks
    if (audioChunks.length === 1) return audioChunks[0];

    const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
    const mergedBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
        mergedBuffer.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
    }

    return mergedBuffer.buffer as ArrayBuffer;
}

// ─── Inngest Functions ────────────────────────────────────────────────────────

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.name || "World"}!` };
    }
);

export const generateVideo = inngest.createFunction(
    { id: "generate-video", retries: 5 },
    { event: "video/generate" },
    async ({ event, step }) => {
        console.log("Inngest received event data:", event.data);
        const { seriesId, testMock } = event.data;

        if (!seriesId) {
            console.error("No seriesId found in event data!");
            throw new Error("No seriesId provided. In the Inngest Dev Server 'Data' box, please provide: { \"seriesId\": \"...\" }");
        }

        // ── Step 1: Fetch Series data from Supabase ───────────────────────────
        const series = await step.run("fetch-series-data", async () => {
            const { data, error } = await supabaseAdmin
                .from("series")
                .select("*")
                .eq("id", seriesId)
                .single();

            if (error) throw new Error(`Failed to fetch series: ${error.message}`);
            return data;
        });

        // ── Step 1.5: Create Placeholder Video Project ────────────────────────
        const videoProjectId = await step.run("create-video-placeholder", async () => {
            const { data, error } = await supabaseAdmin
                .from("video_projects")
                .insert({
                    series_id: seriesId,
                    user_id: series.user_id,
                    title: "Generating...",
                    total_script: "",
                    scenes: [],
                    status: "generating",
                })
                .select("id")
                .single();

            if (error) throw new Error(`Failed to create video placeholder: ${error.message}`);
            return data.id;
        });

        // ── Step 2: Generate Video Script using Gemini ────────────────────────
        const scriptData = await step.run("generate-video-script", async () => {
            if (testMock) {
                console.log("Mock Mode: Returning sample script data.");
                return {
                    title: "Mock Video Title",
                    total_script: "This is a mock script for testing purposes.",
                    scenes: [
                        {
                            scene_script: "Mock scene 1",
                            image_prompt: "Mock image prompt 1"
                        }
                    ]
                } as ScriptData;
            }

            const prompt = `You are an expert video content creator. Generate a high-quality video script, title, and image prompts for a short-form video based on the following series data:
- Niche: ${series.niche}
- Duration: ${series.video_duration}
- Video Style: ${series.video_style}
- Language: ${series.language}

Rules:
1. The script must be natural, engaging, and suitable for a voiceover.
2. Generate 4-5 scenes if duration is 30-40 seconds.
3. Generate 5-6 scenes if duration is 60-70 seconds.
4. Each scene must include:
   - "scene_script": The actual spoken words for this segment.
   - "image_prompt": A detailed visual description for image generation, matching the ${series.video_style} style.
5. The "total_script" field should contain the full concatenated script.
6. Respond ONLY with valid JSON — no markdown, no explanation.

Expected Output Structure:
{
  "title": "Compelling Video Title",
  "total_script": "Full script here...",
  "scenes": [
    {
      "scene_script": "Segment text...",
      "image_prompt": "Visual description..."
    }
  ]
}`;

            console.log("Starting Groq script generation for series:", seriesId);

            try {
                const completion = await groqClient.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                    temperature: 0.7,
                });

                const rawText = completion.choices[0]?.message?.content;
                if (!rawText) throw new Error("Groq returned no text.");

                const value: ScriptData = JSON.parse(rawText);
                if (!value) throw new Error("Groq returned no value.");

                console.log("Script generated successfully via Groq:", value.title);
                return value as ScriptData;

            } catch (err: any) {
                console.error("Groq Error:", err.message);
                if (err.status === 429 || err.message?.includes('429') || err.message?.includes('rate_limit')) {
                    throw new RetryAfterError(`Groq rate limit hit, retrying in 1 minute`, "1m");
                }
                throw new Error(`Script generation failed: ${err.message}`);
            }
        });

        // Guard: ensure Gemini returned usable scenes
        if (!scriptData.scenes || scriptData.scenes.length === 0) {
            throw new Error("Script generation returned no scenes. Cannot proceed with audio, captions, or images.");
        }

        // ── Step 3: Generate Voice (TTS) ──────────────────────────────────────
        const voice = await step.run("generate-voice", async () => {
            const provider = series.model_name || getProvider(series.language);
            const langCode = series.model_lang_code || (LANGUAGE_CODES[series.language] ?? series.language);

            // Map internal ID (e.g. "fonadalabs-dhwani") to provider's voiceId (e.g. "Dhwani")
            const internalVoiceId: string = series.voice_id;
            const voiceOption = getVoiceById(internalVoiceId);
            const actualVoiceId = voiceOption ? voiceOption.voiceId : (internalVoiceId.startsWith("fonadalabs-") ? internalVoiceId.replace("fonadalabs-", "") : internalVoiceId);

            const script: string = scriptData.total_script;
            const fileName = `${seriesId}-${Date.now()}.mp3`;

            let audioBuffer: ArrayBuffer;
            if (provider === "deepgram") {
                audioBuffer = await generateDeepgramAudio(script, actualVoiceId);
            } else {
                audioBuffer = await generateFonadalabsAudio(script, actualVoiceId, series.language);
            }

            const audioUrl = await uploadToStorage(
                "video-audio",
                fileName,
                audioBuffer,
                "audio/mpeg"
            );

            return { audioUrl };
        });

        // ── Step 4: Generate Captions (SRT) ──────────────────────────────────
        const captions = await step.run("generate-captions", async () => {
            const srtContent = await generateDeepgramCaptions(voice.audioUrl, series.language);

            const srtBuffer = Buffer.from(srtContent, "utf-8");
            const fileName = `${seriesId}-${Date.now()}.srt`;

            const captionsUrl = await uploadToStorage(
                "video-captions",
                fileName,
                srtBuffer,
                "text/plain"
            );

            return { captionsUrl };
        });

        // ── Step 5: Generate Images via Hugging Face (free, Flux model) ─────────
        const images = await step.run("generate-images", async () => {
            const imageUrls: string[] = [];
            const hfToken = process.env.HUGGINGFACE_API_KEY;

            if (!hfToken) throw new Error("HUGGINGFACE_API_KEY is not set. Get a free token at huggingface.co/settings/tokens");

            for (const [i, scene] of scriptData.scenes.entries()) {
                console.log(`Generating image for scene ${i + 1}:`, scene.image_prompt);

                try {
                    const hfResponse = await fetch(
                        "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${hfToken}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                inputs: scene.image_prompt,
                                parameters: { width: 576, height: 1024 },
                            }),
                            signal: AbortSignal.timeout(120000),
                        }
                    );

                    if (!hfResponse.ok) {
                        const err = await hfResponse.text();
                        // Model loading — retry after 30s
                        if (hfResponse.status === 503) {
                            throw new RetryAfterError(`HuggingFace model loading, retrying in 30s`, "30s");
                        }
                        throw new Error(`HuggingFace API failed (${hfResponse.status}): ${err}`);
                    }

                    const buffer = Buffer.from(await hfResponse.arrayBuffer());
                    const fileName = `${seriesId}/scene-${i + 1}-${Date.now()}.jpg`;
                    const url = await uploadToStorage("video-images", fileName, buffer, "image/jpeg");

                    console.log(`Scene ${i + 1} image uploaded:`, url);
                    imageUrls.push(url);

                } catch (err: any) {
                    if (err instanceof RetryAfterError) throw err;
                    console.error(`Scene ${i + 1} image generation failed:`, err.message);
                    throw new Error(`Image generation failed for scene ${i + 1}: ${err.message}`);
                }
            }

            return { imageUrls };
        });

        // ── Step 6: Save everything to Supabase ───────────────────────────────
        await step.run("save-everything", async () => {
            // Update the existing video project record
            const { error: updateProjectError } = await supabaseAdmin
                .from("video_projects")
                .update({
                    title: scriptData.title,
                    total_script: scriptData.total_script,
                    scenes: scriptData.scenes,
                    audio_url: voice.audioUrl,
                    captions_url: captions.captionsUrl,
                    image_urls: images.imageUrls,
                    status: "ready",
                    updated_at: new Date().toISOString(),
                })
                .eq("id", videoProjectId);

            if (updateProjectError) throw new Error(`Failed to update video project: ${updateProjectError.message}`);

            // Mark series video_status as completed (non-fatal if column doesn't exist)
            const { error: updateSeriesError } = await supabaseAdmin
                .from("series")
                .update({ video_status: "completed" })
                .eq("id", seriesId);

            if (updateSeriesError) {
                console.warn(`Could not update series video_status: ${updateSeriesError.message}`);
            }

            return { success: true };
        });

        // ── Step 6.5: Trigger Creatomate Video Render ──────────────────────────
        await step.run("trigger-video-render", async () => {
            try {
                // Fetch the saved video project to get captions URL and style
                const { data: project, error: projectError } = await supabaseAdmin
                    .from("video_projects")
                    .select("captions_url, audio_url, image_urls")
                    .eq("id", videoProjectId)
                    .single();

                if (projectError || !project) {
                    console.warn(`[Creatomate] Could not fetch project for render: ${projectError?.message}`);
                    return { skipped: true, reason: "project not found" };
                }

                // Fetch the SRT content from the captions URL
                let srtContent = "";
                if (project.captions_url) {
                    try {
                        const srtRes = await fetch(project.captions_url);
                        if (srtRes.ok) srtContent = await srtRes.text();
                    } catch (srtErr: any) {
                        console.warn(`[Creatomate] Could not fetch SRT content: ${srtErr.message}`);
                    }
                }

                const durationSeconds = parseDurationSeconds(series.video_duration);
                const captionStyle = series.caption_style || "classic";

                // Construct webhook URL for progress/completion tracking
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
                const webhookUrl = `${appUrl}/api/webhooks/creatomate`;

                // Trigger the actual Creatomate render directly
                const renderRes = await renderWithCreatomate({
                    videoProjectId,
                    imageUrls: project.image_urls || [],
                    audioUrl: project.audio_url || "",
                    srtContent,
                    captionStyle,
                    durationSeconds,
                    webhookUrl,
                });

                if (!renderRes.success || !renderRes.renderId) {
                    console.error(`[Creatomate] Render trigger failed: ${renderRes.error}`);
                    return { triggered: false, error: renderRes.error };
                }

                console.log(`[Creatomate] Render triggered! renderId: ${renderRes.renderId} status: ${renderRes.status}`);

                // Save the render ID back to Supabase
                if (renderRes.renderId) {
                    await supabaseAdmin
                        .from("video_projects")
                        .update({
                            render_id: renderRes.renderId,
                            status: "rendering",
                        })
                        .eq("id", videoProjectId);
                }

                return { triggered: true, renderId: renderRes.renderId, status: renderRes.status };

            } catch (renderErr: any) {
                // Non-fatal — video assets are already saved, render can be triggered manually
                console.error("[Creatomate] Failed to trigger render:", renderErr.message);
                return { triggered: false, error: renderErr.message };
            }
        });

        // ── Step 7: Send Email Notification via Plunk ─────────────────────────
        await step.run("send-email-notification", async () => {
            try {
                if (!plunk) {
                    console.warn("[Email] Plunk client not initialized — skipping email notification.");
                    return { skipped: true, reason: "PLUNK_SECRET_KEY not set" };
                }

                // Look up user's email from Supabase Auth
                const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
                    series.user_id
                );

                if (userError || !userData?.user?.email) {
                    console.warn(`[Email] Could not fetch user email: ${userError?.message ?? "no email found"}`);
                    return { skipped: true, reason: "user email not found" };
                }

                const userEmail = userData.user.email;
                const userName =
                    userData.user.user_metadata?.full_name ||
                    userData.user.user_metadata?.name ||
                    userEmail.split("@")[0];

                // First image as thumbnail
                const thumbnailUrl = images.imageUrls?.[0] ?? undefined;

                // Build the HTML email
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
                const htmlBody = buildVideoReadyEmail({
                    userName,
                    videoTitle: scriptData.title,
                    thumbnailUrl,
                    videoUrl: undefined, // video_url populated after render; omit for now
                    niche: series.niche,
                    duration: series.video_duration,
                    language: series.language,
                    appUrl,
                    videoProjectId,
                });

                // Send email via Plunk
                await plunk.emails.send({
                    to: userEmail,
                    subject: `🎬 Your video "${scriptData.title}" is ready!`,
                    body: htmlBody,
                });

                console.log(`[Email] Notification sent to ${userEmail} for video: ${scriptData.title}`);
                return { sent: true, to: userEmail };

            } catch (emailErr: any) {
                // Non-fatal — video is already saved, email failure should not break the pipeline
                console.error("[Email] Failed to send notification:", emailErr.message);
                return { sent: false, error: emailErr.message };
            }
        });

        return { success: true, seriesId };
    }
);
