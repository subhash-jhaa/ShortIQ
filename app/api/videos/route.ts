import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: videos, error } = await supabaseAdmin
            .from("video_projects")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching videos:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(videos || []);
    } catch (err: any) {
        console.error("API GET videos failure:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
