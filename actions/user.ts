"use server";

import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function getUserProfile() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return null;
    }

    try {
        console.log(`[getUserProfile] Searching for user_id: ${userId}`);
        // 1. Try to fetch the user from Supabase
        const { data: profile, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (profile) {
            console.log(`[getUserProfile] Found existing profile for: ${userId}`);
            return profile;
        }

        if (error && error.code !== 'PGRST116') {
            console.error(`[getUserProfile] Supabase query error:`, error);
            throw error;
        }

        // 2. If user doesn't exist, sync from NextAuth session
        console.log("[getUserProfile] Profile not found. Syncing from session...");
        const email = session?.user?.email;
        const full_name = session?.user?.name || email?.split('@')[0] || '';

        console.log(`[getUserProfile] Upserting user: ${email} (${userId})`);

        const { data: newProfile, error: upsertError } = await supabaseAdmin
            .from('users')
            .upsert(
                {
                    user_id: userId,
                    email: email,
                    name: full_name,
                    credits: 10000 // Default value
                },
                { onConflict: 'user_id' }
            )
            .select()
            .single();

        if (upsertError) {
            console.error(`[getUserProfile] Upsert failed:`, upsertError);
            throw upsertError;
        }

        console.log("✅ [getUserProfile] Successfully synced to Supabase!");
        return newProfile;

    } catch (error: any) {
        console.error("❌ [getUserProfile] Final Error:", error.message || error);
        return null;
    }
}
