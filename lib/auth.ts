import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

// Supabase client for credential verification (uses anon key + Supabase Auth)
const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string;
                const password = credentials?.password as string;
                if (!email || !password) return null;

                // Use Supabase Auth to verify credentials — 100% local, no DNS redirects
                const { data, error } = await supabaseAuth.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error || !data.user) {
                    console.error("[Auth] Supabase sign-in failed:", error?.message);
                    return null;
                }

                return {
                    id: data.user.id,
                    email: data.user.email!,
                    name:
                        data.user.user_metadata?.full_name ||
                        data.user.user_metadata?.name ||
                        email.split("@")[0],
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    session: { strategy: "jwt" },
    pages: {
        signIn: "/sign-in",
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
});
