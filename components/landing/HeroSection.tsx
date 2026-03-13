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
        <section className="relative min-h-screen flex items-center justify-center pt-12 overflow-hidden">
            <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none transition-opacity duration-500" />
            
            {/* Background Orbs from Mockup */}
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -delay-1000" />
            
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

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-300">
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
            </div>
        </section>
    );
}
