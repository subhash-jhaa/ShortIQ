"use server";

import { auth } from "@clerk/nextjs/server";

import { supabaseAdmin } from "@/lib/supabase";
import { rateLimitedAction } from "@/lib/rate-limit";

export interface VideoProject {
    id: string;
    user_id: string;
    series_id: string;
    title: string;
    total_script: string;
    scenes: any[];
    audio_url?: string;
    captions_url?: string;
    image_urls?: string[];
    video_url?: string;
    status: 'generating' | 'ready' | 'failed' | 'cancelled' | 'rendering';
    created_at: string;
    updated_at: string;
}

export const getVideos = rateLimitedAction("standard", async () => {
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
});

export const getVideoById = rateLimitedAction("standard", async (videoId: string) => {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const { data, error } = await supabaseAdmin
            .from("video_projects")
            .select("*")
            .eq("id", videoId)
            .eq("user_id", userId)
            .single();

        if (error) {
            console.error("Error fetching video:", error);
            throw new Error(`Failed to fetch video: ${error.message}`);
        }

        return { success: true, data: data as VideoProject };
    } catch (err: any) {
        console.error("getVideoById failure:", err);
        return { success: false, error: err.message };
    }
});

export const cancelVideoGeneration = rateLimitedAction("strict", async (videoId: string) => {
    const { userId } = await auth();
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
});
export const deleteVideo = rateLimitedAction("strict", async (videoId: string) => {
    const { userId } = await auth();
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
});
