import ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { supabaseAdmin } from "./supabase";
import { parseSrt } from "./srt";
import { CAPTION_STYLES } from "./caption-styles";

// Resolve the actual ffmpeg binary path at runtime
// (ffmpeg-static's default export gets mangled by Turbopack to a virtual path)
function findFfmpegPath(): string {
    // Try common locations
    const candidates = [
        // Direct node_modules path from project root
        path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe"),
        path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    // Fallback: try the default import (may work outside Turbopack)
    try {
        const staticPath = require("ffmpeg-static");
        if (staticPath && fs.existsSync(staticPath)) return staticPath;
    } catch {}

    throw new Error("FFmpeg binary not found. Ensure ffmpeg-static is installed.");
}

// Prevent Fast Refresh from re-initializing FFmpeg path multiple times
let resolvedFfmpegPath: string | null = (global as any)._resolvedFfmpegPath || null;

if (!resolvedFfmpegPath) {
    resolvedFfmpegPath = findFfmpegPath();
    ffmpeg.setFfmpegPath(resolvedFfmpegPath);
    (global as any)._resolvedFfmpegPath = resolvedFfmpegPath;
    console.log(`[FFmpeg] Initialized binary: ${resolvedFfmpegPath}`);
}

// Caption styles and SRT parser imported from shared modules

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function downloadToFile(url: string, filePath: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download: ${url} (${response.status})`);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
}

function escapeFFmpegText(text: string): string {
    // For -filter_complex_script (file-based): no shell escaping layer,
    // only FFmpeg drawtext-level escaping is needed.
    // Replace straight apostrophes with curly ones to avoid quote-boundary issues.
    return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\u2019")
        .replace(/"/g, "")
        .replace(/:/g, "\\:")
        .replace(/%/g, "%%");
}

// ─── Main Render Function ────────────────────────────────────────────────────

export interface FFmpegRenderProps {
    imageUrls: string[];
    audioUrl: string;
    srtContent: string;
    captionStyle: string;
    durationSeconds: number;
}

export async function renderVideoWithFFmpeg(props: FFmpegRenderProps): Promise<{
    success: boolean;
    videoUrl?: string;
    error?: string;
}> {
    const { imageUrls, audioUrl, srtContent, captionStyle, durationSeconds } = props;
    const tmpDir = path.join(os.tmpdir(), `ffmpeg-render-${Date.now()}`);

    try {
        // Create temp directory
        fs.mkdirSync(tmpDir, { recursive: true });

        // Re-apply FFmpeg path inside the function (safety net for Turbopack module isolation)
        const ffmpegBin = (global as any)._resolvedFfmpegPath || findFfmpegPath();
        ffmpeg.setFfmpegPath(ffmpegBin);
        console.log(`[FFmpeg] Starting render with binary: ${ffmpegBin}`);
        console.log(`[FFmpeg] ${imageUrls.length} images, ${durationSeconds}s duration`);

        // ── Step 1: Download all assets ──────────────────────────────────
        const imagePaths: string[] = [];
        for (let i = 0; i < imageUrls.length; i++) {
            const imgPath = path.join(tmpDir, `scene-${i}.jpg`);
            await downloadToFile(imageUrls[i], imgPath);
            imagePaths.push(imgPath);
            console.log(`[FFmpeg] Downloaded image ${i + 1}/${imageUrls.length}`);
        }

        const audioPath = path.join(tmpDir, "audio.mp3");
        await downloadToFile(audioUrl, audioPath);
        console.log(`[FFmpeg] Downloaded audio`);

        // ── Step 2: Create image slideshow input file ────────────────────
        // FFmpeg concat demuxer format: each image shown for imageDuration seconds
        const imageDuration = durationSeconds / imageUrls.length;
        const concatFilePath = path.join(tmpDir, "images.txt");
        const concatContent = imagePaths
            .map((p) => `file '${p.replace(/\\/g, "/")}'\nduration ${imageDuration}`)
            .join("\n");
        // Add last image again (FFmpeg concat requires it for last frame)
        fs.writeFileSync(
            concatFilePath,
            concatContent + `\nfile '${imagePaths[imagePaths.length - 1].replace(/\\/g, "/")}'\n`
        );

        // ── Step 3: Build caption drawtext filters ───────────────────────
        const style = CAPTION_STYLES[captionStyle] || CAPTION_STYLES.classic;
        const captions = parseSrt(srtContent);

        function toFFmpegColor(col?: string): string {
            if (!col) return "black@0.5";
            if (col.startsWith("rgba(")) {
                const match = col.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                if (match) {
                    const [_, r, g, b, a] = match;
                    const hex = "#" + [r, g, b].map((x) => parseInt(x).toString(16).padStart(2, "0")).join("");
                    return `${hex}@${a}`;
                }
            }
            return col;
        }

        // Font path for FFmpeg drawtext — Windows drive colon must be escaped (C\:/)
        function getFontPath(fontFamily: string): string {
            const winFonts = "C\\:/Windows/Fonts/";
            const fontMap: Record<string, string> = {
                "Arial":       winFonts + "arialbd.ttf",
                "Courier New": winFonts + "cour.ttf",
                "Impact":      winFonts + "impact.ttf",
                "Montserrat":  winFonts + "arialbd.ttf",
                "Inter":       winFonts + "arialbd.ttf",
            };
            return fontMap[fontFamily] || (winFonts + "arialbd.ttf");
        }

        const fontPath = getFontPath(style.fontFamily);
        const fontColor = toFFmpegColor(style.color);
        const borderColor = toFFmpegColor(style.borderColor);
        const shadowColor = toFFmpegColor(style.shadowColor);

        const drawtextFilters = captions.map((cue) => {
            const escapedText = escapeFFmpegText(cue.text);
            const parts = [
                `drawtext=fontfile='${fontPath}'`,
                `text='${escapedText}'`,
                `fontsize=56`,
                `fontcolor=${fontColor}`,
                `borderw=4`,
                `bordercolor=${borderColor}`,
                `shadowcolor=${shadowColor}`,
                `shadowx=3`,
                `shadowy=3`,
                `x=(w-text_w)/2`,
                `y=h*0.78`,
                `enable='between(t\\,${cue.start}\\,${cue.end})'`,
            ];
            return parts.join(":");
        });

        // Combine filters: scale to 1080x1920 + caption overlays
        // NOTE: zoompan is intentionally removed — it's too CPU-heavy for local rendering
        const videoFilters = [
            `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1`,
            ...drawtextFilters,
        ];

        // Write filter_complex to a file to bypass Windows shell quoting issues
        const filterScriptPath = path.join(tmpDir, "filters.txt");
        fs.writeFileSync(filterScriptPath, videoFilters.join(","), "utf-8");

        // ── Step 4: Render with FFmpeg ───────────────────────────────────
        const outputPath = path.join(tmpDir, "output.mp4");

        await new Promise<void>((resolve, reject) => {
            const command = ffmpeg()
                // Image slideshow input
                .input(concatFilePath)
                .inputOptions(["-f", "concat", "-safe", "0"])
                // Audio input
                .input(audioPath)
                // Use filter script file instead of inline filter_complex
                .outputOptions([
                    "-filter_complex_script", filterScriptPath,
                    "-c:v", "libx264",        // H.264 codec
                    "-preset", "fast",         // Balance speed vs compression
                    "-crf", "23",              // Good quality
                    "-c:a", "aac",             // AAC audio
                    "-b:a", "128k",            // Audio bitrate
                    "-shortest",               // End when shortest input ends
                    "-pix_fmt", "yuv420p",     // Compatibility
                    "-movflags", "+faststart",  // Web-optimized
                ])
                .output(outputPath)
                .on("start", (cmd) => {
                    console.log("[FFmpeg] Command:", cmd);
                })
                .on("progress", (progress) => {
                    if (progress.percent) {
                        console.log(`[FFmpeg] Progress: ${Math.round(progress.percent)}%`);
                    }
                })
                .on("error", (err) => {
                    console.error("[FFmpeg] Error:", err.message);
                    reject(err);
                })
                .on("end", () => {
                    console.log("[FFmpeg] Render complete!");
                    resolve();
                });

            command.run();
        });

        // ── Step 5: Upload to Supabase Storage ──────────────────────────
        const videoBuffer = fs.readFileSync(outputPath);
        const fileName = `rendered-${Date.now()}.mp4`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from("video-renders")
            .upload(fileName, videoBuffer, {
                contentType: "video/mp4",
                upsert: true,
            });

        if (uploadError) {
            // Try creating the bucket if it doesn't exist
            if (uploadError.message.includes("not found") || uploadError.message.includes("Bucket")) {
                console.log("[FFmpeg] Creating 'video-renders' bucket...");
                await supabaseAdmin.storage.createBucket("video-renders", { public: true });
                const { error: retryError } = await supabaseAdmin.storage
                    .from("video-renders")
                    .upload(fileName, videoBuffer, {
                        contentType: "video/mp4",
                        upsert: true,
                    });
                if (retryError) throw new Error(`Upload failed after bucket creation: ${retryError.message}`);
            } else {
                throw new Error(`Upload failed: ${uploadError.message}`);
            }
        }

        const { data: urlData } = supabaseAdmin.storage
            .from("video-renders")
            .getPublicUrl(fileName);

        console.log(`[FFmpeg] Video uploaded: ${urlData.publicUrl}`);

        return { success: true, videoUrl: urlData.publicUrl };

    } catch (err: any) {
        console.error("[FFmpeg] Render failed:", err.message);
        return { success: false, error: err.message };
    } finally {
        // Cleanup temp directory
        try {
            if (fs.existsSync(tmpDir)) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        } catch (cleanErr) {
            console.warn("[FFmpeg] Cleanup warning:", cleanErr);
        }
    }
}
