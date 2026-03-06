
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function renderVideoFromProject(projectId: string) {
    console.log(`\n🚀 Starting FREE local render for project: ${projectId}`);

    // 1. Fetch data from Supabase
    const { data: project, error } = await supabase
        .from("video_projects")
        .select("*")
        .eq("id", projectId)
        .single();

    if (error || !project) {
        console.error("❌ Error fetching project:", error?.message || "Not found");
        return;
    }

    if (!project.audio_url || !project.srt_content || !project.image_urls) {
        console.error("❌ Project is missing required data (audio, captions, or images). Generate them first via Inngest!");
        return;
    }

    const compositionId = "MainVideo"; // Matches id in Root.tsx
    const entryPath = path.resolve("remotion", "index.ts");
    const outputPath = path.resolve("public", `video-${projectId}.mp4`);

    try {
        console.log("🛠️  Bundling Remotion project (this might take a few seconds)...");
        const bundleLocation = await bundle({
            entryPoint: entryPath,
            webpackOverride: (config) => config,
        });

        console.log("🔍 Selecting composition...");
        const inputProps = {
            audioUrl: project.audio_url,
            srtContent: project.srt_content,
            imageUrls: project.image_urls,
            videoStyle: project.video_style || "default",
            captionStyle: project.caption_style || "classic",
            durationInFrames: project.duration_in_frames || 600,
        };

        const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: compositionId,
            inputProps,
        });

        console.log(`🎬 Rendering ${composition.durationInFrames} frames to: ${outputPath}`);
        console.log("⏳ Rendering started... (this uses your local CPU/GPU for FREE)");

        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: "h264",
            outputLocation: outputPath,
            inputProps,
            onProgress: ({ progress }) => {
                const percent = (progress * 100).toFixed(0);
                process.stdout.write(`\r📊 Progress: ${percent}%`);
            },
        });

        console.log("\n\n✅ SUCCESS! Video rendered for FREE.");
        console.log(`📁 Location: ${outputPath}`);
    } catch (err) {
        console.error("\n❌ Render failed:", err);
    }
}

// Get project ID from command line argument
const projectId = process.argv[2];
if (!projectId) {
    console.error("Please provide a project ID: npx ts-node local-render.ts <project-id>");
    process.exit(1);
}

renderVideoFromProject(projectId);
