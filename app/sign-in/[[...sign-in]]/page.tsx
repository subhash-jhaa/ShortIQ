"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            setError("Invalid email or password.");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b]">
            <div className="w-full max-w-sm rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl">
                <div className="mb-6 flex flex-col items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M5 3l14 9-14 9V3z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">
                            Short<span className="text-violet-400">IQ</span>
                        </span>
                    </Link>
                    <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                    <p className="mt-1 text-sm text-gray-400">Sign in to your ShortIQ account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 placeholder-white/20"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 placeholder-white/20"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-semibold py-2.5 text-sm transition-colors"
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    No account?{" "}
                    <Link href="/sign-up" className="text-cyan-500 hover:text-cyan-400">
                        Sign up free
                    </Link>
                </p>
            </div>
        </div>
    );
}
