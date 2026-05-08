"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function HeroSection() {
    const { isSignedIn } = useUser();

    const decorativeIcons = [
        { className: "left-[-5%] md:left-[5%] top-[10%] md:top-[15%] w-24 h-24 md:w-36 md:h-36", content: (
            <g transform="translate(80, 80)">
                <circle className="ico-fill" cx="0" cy="0" r="44"/><rect className="ico" x="-22" y="-14" width="32" height="14" rx="4"/><circle className="ico" cx="-6" cy="-2" r="8"/><circle className="ico" cx="-6" cy="-2" r="4"/><rect className="ico" x="-20" y="-22" width="10" height="8" rx="2"/><circle className="ico-fill2" cx="18" cy="-8" r="3" style={{ opacity: 1 }}/><line className="ico" x1="-6" y1="10" x2="-14" y2="26"/><line className="ico" x1="-6" y1="10" x2="-6" y2="26"/><line className="ico" x1="-6" y1="10" x2="2" y2="26"/>
            </g>
        )},
        { className: "hidden lg:block left-[10%] bottom-[10%] w-36 h-36", content: (
            <g transform="translate(80, 80)">
                <circle className="ico-fill" cx="0" cy="0" r="44"/><rect className="ico" x="-24" y="-20" width="48" height="42" rx="4"/><line className="ico" x1="-24" y1="-8" x2="24" y2="-8"/><line className="ico" x1="-12" y1="-24" x2="-12" y2="-14"/><line className="ico" x1="12" y1="-24" x2="12" y2="-14"/><circle className="ico-fill2" cx="-14" cy="0" r="2.5" style={{ opacity: 1 }}/><circle className="ico-fill2" cx="-2" cy="0" r="2.5" style={{ opacity: 1 }}/><circle className="ico-fill2" cx="10" cy="0" r="2.5" style={{ opacity: 1 }}/><circle className="ico-fill2" cx="-14" cy="10" r="2.5" style={{ opacity: 1 }}/><circle className="ico-fill2" cx="-2" cy="10" r="2.5" style={{ opacity: 1 }}/><circle className="ico" cx="14" cy="12" r="9" style={{ fill: 'var(--brand-primary)', fillOpacity: 0.2 }}/><line className="ico" x1="14" y1="12" x2="14" y2="7"/><line className="ico" x1="14" y1="12" x2="18" y2="14"/>
            </g>
        )},
        { className: "hidden lg:block left-[20%] top-[10%] w-36 h-36", content: (
            <g transform="translate(80, 80)">
                <circle className="ico-fill" cx="0" cy="0" r="44"/><path className="ico" d="M-20,8 Q-24,-2 -14,-8 Q-14,-22 0,-22 Q12,-22 16,-12 Q24,-14 24,0 Q24,12 14,12 L-16,12 Q-24,12 -20,4 Z"/><line className="ico" x1="0" y1="8" x2="0" y2="-4"/><polyline className="ico" points="-7,0 0,-8 7,0"/>
            </g>
        )},
        { className: "right-[-5%] md:right-[5%] top-[10%] md:top-[15%] w-24 h-24 md:w-36 md:h-36", content: (
            <g transform="translate(80, 80)">
                <circle className="ico-fill" cx="0" cy="0" r="44"/><rect className="ico" x="-8" y="-22" width="16" height="24" rx="8"/><path className="ico" d="M-18,0 Q-18,16 0,16 Q18,16 18,0"/><line className="ico" x1="0" y1="16" x2="0" y2="24"/><line className="ico" x1="-10" y1="24" x2="10" y2="24"/><path className="ico" d="M-32,-6 Q-28,-14 -32,-22" style={{ opacity: 0.5, stroke: 'var(--brand-primary)' }}/><path className="ico" d="M32,-6 Q28,-14 32,-22" style={{ opacity: 0.5, stroke: 'var(--brand-primary)' }}/>
            </g>
        )},
        { className: "hidden lg:block right-[10%] bottom-[10%] w-36 h-36", content: (
            <g transform="translate(80, 80)">
                <circle className="ico-fill" cx="0" cy="0" r="44"/><rect className="ico" x="-26" y="-18" width="52" height="36" rx="4"/><rect className="ico-fill2" x="-18" y="4" width="20" height="5" rx="2" style={{ opacity: 0.9 }}/><rect className="ico-fill2" x="6" y="4" width="10" height="5" rx="2" style={{ opacity: 0.9 }}/><rect className="ico-fill2" x="-18" y="12" width="14" height="5" rx="2" style={{ opacity: 0.9 }}/><rect className="ico-fill2" x="0" y="12" width="16" height="5" rx="2" style={{ opacity: 0.9 }}/><polygon className="ico" points="-8,-12 8,-4 -8,4" style={{ fill: 'var(--brand-primary)', fillOpacity: 0.25 }}/>
            </g>
        )},
        { className: "hidden lg:block right-[20%] top-[10%] w-36 h-36", content: (
            <g transform="translate(80, 80)">
                <circle className="ico-fill" cx="0" cy="0" r="44"/><rect className="ico" x="-26" y="-16" width="52" height="32" rx="3"/><rect className="ico-fill2" x="-22" y="-12" width="6" height="8" rx="1" style={{ opacity: 0.9 }}/><rect className="ico-fill2" x="-22" y="4" width="6" height="8" rx="1" style={{ opacity: 0.9 }}/><rect className="ico-fill2" x="16" y="-12" width="6" height="8" rx="1" style={{ opacity: 0.9 }}/><rect className="ico-fill2" x="16" y="4" width="6" height="8" rx="1" style={{ opacity: 0.9 }}/><polygon className="ico" points="-6,-10 10,0 -6,10" style={{ fill: 'var(--brand-primary)', fillOpacity: 0.3 }}/>
            </g>
        )}
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-32 sm:pt-40 lg:pt-20 overflow-hidden">
            <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none transition-opacity duration-500" />

            {/* Decorative Static Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {decorativeIcons.map((icon, i) => (
                    <svg key={i} className={`hero-svg-icon ${icon.className}`} viewBox="0 0 160 160">
                        {icon.content}
                    </svg>
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-8">
                <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8 animate-fade-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                        AI-Powered • Auto-Schedule • Multi-Platform
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-[900] text-gray-900 dark:text-white leading-[1.1] tracking-[-0.05em] mb-8 animate-fade-up animation-delay-100 transition-colors">
                        Generate & Schedule
                        <span className="text-primary block">AI Short Videos</span>
                    </h1>

                    <p className="max-w-xl text-base sm:text-lg text-gray-600 dark:text-white/60 mb-12 leading-relaxed animate-fade-up animation-delay-200 transition-colors font-medium">
                        Transform long videos into engaging short-form content for TikTok, Reels, & Shorts automatically. Schedule posts with powerful AI insights.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-up animation-delay-300 w-full lg:w-auto">
                        <Link href="/sign-up" className="w-full sm:w-auto btn-primary px-10 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-primary/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                            Start Creating Free
                        </Link>
                        <a
                            href="#how-it-works"
                            className="w-full sm:w-auto px-10 py-4 rounded-2xl text-base font-bold text-gray-900 dark:text-white border-2 border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                            Book a Demo
                        </a>
                    </div>
                </div>

                {/* Hero Image / Phone Mockup */}
                <div className="relative flex items-center justify-center lg:justify-end animate-fade-up animation-delay-400">
                    <div className="relative w-full max-w-[450px] aspect-[9/16] lg:aspect-auto">
                        {/* Glow effect behind the phone */}
                        <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full scale-110 -z-10" />
                        
                        <div className="relative perspective-1000">
                            <img 
                                src="/mobile.png" 
                                alt="ShortIQ App Preview" 
                                className="w-full h-auto"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
