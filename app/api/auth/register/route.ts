import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to create users without triggering confirmation emails
// (avoids Supabase free-tier rate limit of 2 emails/hour)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Email, password, and name are required." },
                { status: 400 }
            );
        }

        // admin.createUser with email_confirm:true skips the confirmation email
        // and immediately activates the account
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: name },
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, userId: data.user?.id });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
