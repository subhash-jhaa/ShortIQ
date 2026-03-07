"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function HeroSection() {
    const [typed, setTyped] = useState("");
    const { isSignedIn } = useUser();
    const words = ["YouTube Shorts", "Instagram Reels", "TikTok Videos", "Facebook Clips", "Email Campaigns"];
    const wordIndex = useRef(0);
    const charIndex = useRef(0);
    const deleting = useRef(false);

    useEffect(() => {
        const tick = () => {
            const current = words[wordIndex.current];
            if (!deleting.current) {
                setTyped(current.slice(0, charIndex.current + 1));
                charIndex.current++;
                if (charIndex.current === current.length) {
                    deleting.current = true;
                    setTimeout(tick, 1800);
                    return;
                }
            } else {
                setTyped(current.slice(0, charIndex.current - 1));
                charIndex.current--;
                if (charIndex.current === 0) {
                    deleting.current = false;
                    wordIndex.current = (wordIndex.current + 1) % words.length;
                }
            }
            setTimeout(tick, deleting.current ? 60 : 95);
        };
        const t = setTimeout(tick, 400);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-40 overflow-hidden">
            <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[700px] h-[700px] bg-rose-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-300 text-sm font-medium mb-8 animate-fade-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                    </span>
                    AI-Powered • Auto-Schedule • Multi-Platform
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-fade-up animation-delay-100">
                    Generate & Schedule
                    <br />
                    <span className="gradient-text">AI Short Videos</span>
                    <br />
                    <span className="text-white/60 text-4xl sm:text-5xl lg:text-6xl">for </span>
                    <span className="text-rose-400 typewriter">{typed}</span>
                    <span className="typewriter-cursor">|</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg text-white/60 mb-10 leading-relaxed animate-fade-up animation-delay-200">
                    ShortIQ uses cutting-edge AI to create stunning short-form videos from your ideas, then automatically schedules and publishes them across all your social channels — all from one powerful dashboard.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up animation-delay-300">
                    {!isSignedIn ? (
                        <Link href="/sign-up" className="btn-primary px-8 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-rose-500/20 flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M5 3l14 9-14 9V3z" fill="white" />
                            </svg>
                            Start Generating Free
                        </Link>
                    ) : (
                        <Link
                            href="/dashboard"
                            className="btn-primary px-8 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-rose-500/20 flex items-center gap-2"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="9" y1="21" x2="9" y2="9" />
                            </svg>
                            Go to Dashboard
                        </Link>
                    )}
                    <a
                        href="#how-it-works"
                        className="px-8 py-4 rounded-2xl text-base font-semibold text-white border border-white/20 hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
                        </svg>
                        Watch Demo
                    </a>
                </div>

                <div className="flex flex-wrap justify-center gap-8 animate-fade-up animation-delay-400">
                    {[
                        { value: "500K+", label: "Videos Generated" },
                        { value: "50K+", label: "Active Creators" },
                        { value: "12M+", label: "Total Views Driven" },
                        { value: "5", label: "Platforms Supported" },
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center">
                            <span className="text-3xl font-extrabold gradient-text">{stat.value}</span>
                            <span className="text-sm text-white/50 mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none rounded-3xl" />
                    <div className="dashboard-mockup rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-rose-900/20 mx-auto max-w-4xl">
                        <div className="bg-[#0d0d14] px-4 py-3 flex items-center gap-3 border-b border-white/10">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="flex-1 bg-white/5 rounded-md h-6 mx-8 flex items-center px-3">
                                <span className="text-xs text-white/40">app.shortIQ.ai/dashboard</span>
                            </div>
                        </div>

                        <div className="bg-[#0a0a12] p-6 grid grid-cols-3 gap-4 min-h-[300px]">
                            <div className="col-span-1 space-y-3">
                                {["📋 Projects", "🎬 Generate", "📅 Schedule", "📊 Analytics", "⚙️ Settings"].map((item) => (
                                    <div
                                        key={item}
                                        className={`px-3 py-2 rounded-lg text-sm text-center ${item.includes("Generate")
                                            ? "bg-rose-600/30 text-rose-300 font-semibold"
                                            : "text-white/50 hover:bg-white/5"
                                            }`}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="col-span-2 space-y-4">
                                <div className="bg-white/5 rounded-xl p-4">
                                    <div className="text-xs text-white/40 mb-2">AI Prompt</div>
                                    <div className="text-sm text-white/80 font-mono text-left">
                                        "Create a 30-second product showcase for my tech startup with upbeat music..."
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {["YouTube", "Instagram", "TikTok", "Facebook"].map((p) => (
                                        <div key={p} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                            <span className="text-xs text-white/70">{p} — Scheduled</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gradient-to-r from-indigo-600/20 to-rose-600/20 rounded-xl p-4 border border-indigo-500/20">
                                    <div className="text-xs text-indigo-300 mb-1 text-left">🎬 Generating video...</div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full animate-pulse" />
                                    </div>
                                    <div className="text-xs text-white/40 mt-1 text-left">75% complete</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
