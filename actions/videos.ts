"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export interface VideoProject {
    id: string;
    series_id: string;
    title: string;
    total_script: string;
    scenes: any[];
    audio_url: string;
    captions_url: string;
    image_urls: string[];
    status: string;
    created_at: string;
}

export async function getVideos() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const { data, error } = await supabaseAdmin
            .from("video_projects")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching videos:", error);
            throw new Error(`Failed to fetch videos: ${error.message}`);
        }

        return { success: true, data: data as VideoProject[] };
    } catch (err: any) {
        console.error("getVideos failure:", err);
        return { success: false, error: err.message };
    }
}
