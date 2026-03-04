import { inngest } from "./client";
import { RetryAfterError } from "inngest";
import { supabaseAdmin } from "@/lib/supabase";
import { GoogleGenAI } from "@google/genai";
import { getProvider, LANGUAGE_CODES } from "@/lib/voice-config";

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

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

// ─── TTS: Fonadalabs ──────────────────────────────────────────────────────────

async function generateFonadalabsAudio(
    text: string,
    voiceId: string,
    language: string
): Promise<ArrayBuffer> {
    const langCode = LANGUAGE_CODES[language] ?? language;

    const response = await fetch("https://api.fonadalabs.com/v1/tts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.FONADALABS_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            voice: voiceId,
            language: langCode,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Fonadalabs TTS failed: ${response.status} ${err}`);
    }

    return response.arrayBuffer();
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
        const { seriesId } = event.data;

        if (!seriesId) {
            console.error("No seriesId found in event data!");
            throw new Error("No seriesId provided. Please send a test event with { 'data': { 'seriesId': '...' } }");
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

        // ── Step 2: Generate Video Script using Gemini ────────────────────────
        const scriptData = await step.run("generate-video-script", async () => {
            const prompt = `
        You are an expert video content creator. Generate a high-quality video script, title, and image prompts for a Short-form video based on the following series data:
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
        6. Respond in strict JSON format only.

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
        }
      `;

            console.log("Starting Gemini script generation for series:", seriesId);

            // Increased timeout to 60s for real script generation
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Gemini API Timeout (60s)")), 60000)
            );

            try {
                console.log("Calling Gemini API with model: gemini-2.0-flash...");
                const geminiCall = client.models.generateContent({
                    model: "gemini-2.0-flash", // Use stable 2.0 flash which is confirmed available
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json", // This is the correct field for the SDK client.models interface
                    },
                });

                const response = await Promise.race([geminiCall, timeout]) as Awaited<typeof geminiCall>;
                console.log("Gemini API call finished.");

                const rawText = response.text;
                if (!rawText) throw new Error("Gemini returned no text.");

                const value: ScriptData = JSON.parse(rawText);
                if (!value) throw new Error("Gemini returned no value.");

                console.log("Script generated successfully:", value.title);
                return value as ScriptData;

            } catch (err: any) {
                console.error("Gemini Error or Timeout:", err.message);
                // Retry after 5 minutes on quota exceeded (429)
                if (err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED')) {
                    throw new RetryAfterError(`Gemini quota exceeded, retrying in 5 minutes`, 5 * 60 * 1000);
                }
                throw new Error(`Real script generation failed: ${err.message}. Please check your Gemini API quota/connection.`);
            }
        });

        // ── Step 3: Generate Voice (TTS) ──────────────────────────────────────
        const voice = await step.run("generate-voice", async () => {
            const provider = getProvider(series.language);
            const voiceId: string = series.voice_id;
            const script: string = scriptData.total_script;
            const fileName = `${seriesId}-${Date.now()}.mp3`;

            let audioBuffer: ArrayBuffer;
            if (provider === "deepgram") {
                audioBuffer = await generateDeepgramAudio(script, voiceId);
            } else {
                audioBuffer = await generateFonadalabsAudio(script, voiceId, series.language);
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
            const durationSec = parseDurationSeconds(series.video_duration);
            const srtContent = buildSRT(scriptData.scenes, durationSec);

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

        // ── Step 5: Generate Images via Gemini Imagen ─────────────────────────
        const images = await step.run("generate-images", async () => {
            const imageUrls: string[] = [];

            for (const [i, scene] of scriptData.scenes.entries()) {
                console.log(`Generating image for scene ${i + 1}:`, scene.image_prompt);

                // Increased timeout to 120s per image for real quality
                const imgTimeout = new Promise<null>((_, reject) =>
                    setTimeout(() => reject(new Error(`Image ${i + 1} timed out after 120s`)), 120000)
                );

                try {
                    const imgCall = client.models.generateImages({
                        model: "imagen-3.0-generate-001",
                        prompt: scene.image_prompt,
                        config: {
                            numberOfImages: 1,
                            outputMimeType: "image/jpeg",
                            aspectRatio: "9:16",
                        },
                    });

                    const response = await Promise.race([imgCall, imgTimeout]);
                    const imageBytes = (response as any)?.generatedImages?.[0]?.image?.imageBytes;

                    if (!imageBytes) {
                        throw new Error(`No image bytes returned for scene ${i + 1}. Check API response.`);
                    }

                    const buffer = Buffer.from(imageBytes, "base64");
                    const fileName = `${seriesId}/scene-${i + 1}-${Date.now()}.jpg`;
                    const url = await uploadToStorage("video-images", fileName, buffer, "image/jpeg");

                    console.log(`Scene ${i + 1} image uploaded:`, url);
                    imageUrls.push(url);

                } catch (err: any) {
                    console.error(`Scene ${i + 1} image generation failed:`, err.message);
                    if (err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED')) {
                        throw new RetryAfterError(`Gemini quota exceeded on image ${i + 1}, retrying in 5 minutes`, 5 * 60 * 1000);
                    }
                    throw new Error(`Real image generation failed for scene ${i + 1}: ${err.message}`);
                }
            }

            return { imageUrls };
        });

        // ── Step 6: Save everything to Supabase ───────────────────────────────
        await step.run("save-everything", async () => {
            // Insert into video_projects table
            const { error: insertError } = await supabaseAdmin
                .from("video_projects")
                .insert({
                    series_id: seriesId,
                    title: scriptData.title,
                    total_script: scriptData.total_script,
                    scenes: scriptData.scenes,
                    audio_url: voice.audioUrl,
                    captions_url: captions.captionsUrl,
                    image_urls: images.imageUrls,
                    status: "ready",
                });

            if (insertError) throw new Error(`Failed to save video project: ${insertError.message}`);

            // Mark series video_status as completed (non-fatal if column doesn't exist)
            const { error: updateError } = await supabaseAdmin
                .from("series")
                .update({ video_status: "completed" })
                .eq("id", seriesId);

            if (updateError) {
                console.warn(`Could not update series video_status (column may not exist): ${updateError.message}`);
            }

            return { success: true };
        });

        return { success: true, seriesId };
    }
);
