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
            <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none transition-opacity duration-500" />
            
            {/* Background Orbs from Mockup */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -delay-1000" />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[150px]" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8 animate-fade-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    AI-Powered • Auto-Schedule • Multi-Platform
                </div>

                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-[900] text-gray-900 dark:text-white leading-[0.95] tracking-[-0.05em] mb-8 animate-fade-up animation-delay-100 transition-colors">
                    Generate & Schedule
                    <br />
                    <span className="text-primary">AI Short Videos</span>
                </h1>

                <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-white/60 mb-12 leading-relaxed animate-fade-up animation-delay-200 transition-colors font-medium">
                    Transform long videos into engaging short-form content for TikTok, Reels, & Shorts automatically. Schedule posts with powerful AI insights.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-up animation-delay-300">
                    <Link href="/sign-up" className="btn-primary px-10 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-primary/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                        Start Creating Free
                    </Link>
                    <a
                        href="#how-it-works"
                        className="px-10 py-4 rounded-2xl text-base font-bold text-gray-900 dark:text-white border-2 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        Book a Demo
                    </a>
                </div>

                <div className="mt-20 relative">
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white dark:from-[#0a0a0b] via-white/80 dark:via-[#0a0a0b]/80 to-transparent z-20 pointer-events-none transition-all duration-500" />
                    <div className="glass-card relative overflow-hidden rounded-[40px] bg-white dark:bg-[#0d0d14] border-8 border-gray-100 dark:border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-primary/10 mx-auto max-w-5xl transition-all">
                        {/* Browser Window Header */}
                        <div className="bg-gray-50 dark:bg-[#0d0d14] px-6 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-white/10 transition-colors">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                            </div>
                            <div className="flex-1 bg-gray-200/50 dark:bg-white/5 rounded-xl h-8 mx-12 flex items-center px-4">
                                <span className="text-[11px] text-gray-500 dark:text-white/40 font-bold uppercase tracking-widest">Dashboard • ShortIQ.ai</span>
                            </div>
                        </div>

                        {/* Dashboard Simulation */}
                        <div className="bg-[#fcfcfd] dark:bg-[#0a0a12] p-8 grid grid-cols-12 gap-6 transition-colors min-h-[500px]">
                            {/* Left Widget - Timeline */}
                            <div className="col-span-12 lg:col-span-8 space-y-6">
                                <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-[800] text-gray-900 dark:text-white tracking-tight uppercase">Generation Timeline</h3>
                                        <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-tighter">AI Active</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className={`flex-1 aspect-video rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden relative group cursor-pointer ${i === 3 ? 'ring-2 ring-primary shadow-lg scale-105' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
                                                <div className="absolute inset-0 bg-gray-900" />
                                                {i === 3 && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                                            <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-primary ${i === 3 ? 'w-[75%]' : 'w-0'}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Performance Analytics</div>
                                        <div className="flex items-end gap-2 h-24">
                                            {[40, 70, 45, 90, 65, 100, 85].map((h, i) => (
                                                <div key={i} className="flex-1 bg-gray-100 dark:bg-white/5 rounded-t-lg relative group">
                                                    <div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg duration-500" style={{ height: `${h}%` }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Engagement Rate</div>
                                        <div className="flex items-center justify-center h-24">
                                            <div className="w-20 h-20 rounded-full border-[8px] border-gray-100 dark:border-white/5 relative flex items-center justify-center">
                                                <svg className="absolute inset-0 transform -rotate-90">
                                                    <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="200" strokeDashoffset="40" className="text-primary" />
                                                </svg>
                                                <span className="text-lg font-black text-gray-900 dark:text-white">82%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Widget - Post Schedule */}
                            <div className="col-span-12 lg:col-span-4 space-y-6 text-left">
                                <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm h-full">
                                    <div className="text-sm font-[800] text-gray-900 dark:text-white tracking-tight uppercase mb-6">Upcoming Posts</div>
                                    <div className="space-y-4">
                                        {["TikTok Series #14", "Instagram Reel #2", "YouTube Short"].map((post, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                                    <span className="text-xs font-black">{i + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-black text-gray-800 dark:text-white/90">{post}</div>
                                                    <div className="text-[10px] font-bold text-gray-500 dark:text-white/40 mt-0.5">Tomorrow, 9:00 AM</div>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-6 rounded-3xl bg-primary/5 dark:bg-primary/10 border border-primary/20 text-center">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Queue Health</div>
                                        <div className="text-2xl font-[900] text-primary transition-colors">Excellent</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
