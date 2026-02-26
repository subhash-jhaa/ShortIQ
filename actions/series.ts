"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export interface SeriesData {
    seriesName: string;
    niche: string;
    language: string;
    voice: string;
    backgroundMusic: string[];
    videoStyle: string;
    captionStyle: string;
    videoDuration: string;
    platforms: string[];
    publishTime: string;
}

export async function createSeries(data: SeriesData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const { error } = await supabaseAdmin.from("series").insert({
            user_id: userId,
            series_name: data.seriesName,
            niche: data.niche,
            language: data.language,
            voice_id: data.voice,
            background_music: data.backgroundMusic,
            video_style: data.videoStyle,
            caption_style: data.captionStyle,
            video_duration: data.videoDuration,
            platforms: data.platforms,
            publish_time: data.publishTime,
        });

        if (error) {
            console.error("Error creating series:", error);
            throw new Error(`Failed to save series: ${error.message}`);
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (err: any) {
        console.error("createSeries failure:", err);
        return { success: false, error: err.message };
    }
}
