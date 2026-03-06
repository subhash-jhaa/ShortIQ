"use server";

import { auth } from "@/lib/auth";
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
    video_url?: string;
    srt_content?: string;
    duration_in_frames?: number;
    render_id?: string;
    created_at: string;
}

export async function getVideos() {
    const session = await auth();
    const userId = session?.user?.id;
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

export async function cancelVideoGeneration(videoId: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const { error } = await supabaseAdmin
            .from("video_projects")
            .update({ status: "cancelled" })
            .eq("id", videoId)
            .eq("user_id", userId);

        if (error) {
            console.error("Error cancelling video:", error);
            throw new Error(`Failed to cancel video: ${error.message}`);
        }

        return { success: true };
    } catch (err: any) {
        console.error("cancelVideoGeneration failure:", err);
        return { success: false, error: err.message };
    }
}
export async function deleteVideo(videoId: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const { error } = await supabaseAdmin
            .from("video_projects")
            .delete()
            .eq("id", videoId)
            .eq("user_id", userId);

        if (error) {
            console.error("Error deleting video:", error);
            throw new Error(`Failed to delete video: ${error.message}`);
        }

        return { success: true };
    } catch (err: any) {
        console.error("deleteVideo failure:", err);
        return { success: false, error: err.message };
    }
}
