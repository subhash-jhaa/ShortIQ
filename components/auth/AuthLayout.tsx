"use client";

import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    heading?: string;
    headingSubtitle?: string;
    sidebarGradient?: string;
}

const steps = [
    { number: 1, text: "Sign in or create your account" },
    { number: 2, text: "Configure your workspace and tools" },
    { number: 3, text: "Start generating stunning AI videos" },
];

export default function AuthLayout({ children, title, subtitle, heading, headingSubtitle, sidebarGradient }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row bg-white dark:bg-gray-950 transition-colors font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Left Side - Gradient Branding */}
            <div className={`relative hidden w-full md:flex md:w-[42%] flex-col justify-between ${sidebarGradient || "bg-gradient-to-br from-indigo-600 via-violet-600 to-rose-500"} p-12 lg:p-16 text-white overflow-hidden`}>
                {/* Subtle dark overlay for depth */}
                <div className="absolute inset-0 bg-black/10" />

                {/* Top content */}
                <div className="relative z-10 flex flex-col gap-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group w-fit">
                        <div className="flex items-center justify-center rounded-xl transition-all">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:animate-pulse">
                                <rect width="24" height="24" rx="6" fill="url(#rose_anim_auth)" />
                                <path d="M18 5H6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M9 12H6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M9 19H6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path
                                    d="M13 12.003a0.7 0.7 0 0 1 1.062-.597l3.498 2.098a0.7 0.7 0 0 1 0 1.203l-3.498 2.098a0.7 0.7 0 0 1-1.062-.598z"
                                    fill="white"
                                />
                                <defs>
                                    <linearGradient id="rose_anim_auth" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#fb7185">
                                            <animate attributeName="stop-color" values="#fb7185; #fda4af; #fb7185" dur="3s" repeatCount="indefinite" />
                                        </stop>
                                        <stop offset="1" stopColor="#e11d48">
                                            <animate attributeName="stop-color" values="#e11d48; #be123c; #e11d48" dur="3s" repeatCount="indefinite" />
                                        </stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            Short<span className="text-rose-200">IQ</span>
                        </span>
                    </Link>

                    {/* Content */}
                    <div className="flex flex-col gap-0 max-w-sm">
                        <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                            {title || "Transform Your Content with AI-Powered Scripts"}
                        </h1>
                        <p className="text-white/80 text-lg mb-12 leading-relaxed">
                            {subtitle || "Create your free account and start generating viral shorts instantly."}
                        </p>
                    </div>
                </div>

                {/* Step Cards */}
                <div className="relative z-10 flex gap-3 mt-auto">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="flex-1 p-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex flex-col items-start transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/25 text-white font-bold mb-3 text-sm border border-white/30">
                                {step.number}
                            </div>
                            <h3 className="text-white text-sm font-medium leading-tight">
                                {step.text}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Footer Copyright */}
                <div className="relative z-10 mt-8 text-[11px] text-white/50 font-medium">
                    © {new Date().getFullYear()} ShortIQ. All rights reserved.
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex w-full md:w-[58%] items-center justify-center p-8 bg-white dark:bg-gray-950 relative overflow-hidden transition-colors">
                {/* Mobile Logo Only */}
                <div className="absolute top-8 left-8 md:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-xl transition-all">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="active:scale-95 transition-transform">
                                <rect width="24" height="24" rx="6" fill="url(#rose_anim_auth_mob)" />
                                <path d="M18 5H6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M9 12H6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M9 19H6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                <path
                                    d="M13 12.003a0.7 0.7 0 0 1 1.062-.597l3.498 2.098a0.7 0.7 0 0 1 0 1.203l-3.498 2.098a0.7 0.7 0 0 1-1.062-.598z"
                                    fill="white"
                                />
                                <defs>
                                    <linearGradient id="rose_anim_auth_mob" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#fb7185">
                                            <animate attributeName="stop-color" values="#fb7185; #fda4af; #fb7185" dur="3s" repeatCount="indefinite" />
                                        </stop>
                                        <stop offset="1" stopColor="#e11d48">
                                            <animate attributeName="stop-color" values="#e11d48; #be123c; #e11d48" dur="3s" repeatCount="indefinite" />
                                        </stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="text-xl font-bold dark:text-white">Short<span className="text-rose-600 dark:text-rose-400">IQ</span></span>
                    </Link>
                </div>

                <div className="w-full max-w-[420px] flex flex-col items-center">
                    {/* Script Heading */}
                    <div className="mb-10 text-center">
                        <h2 className="text-4xl font-script mb-2 tracking-wide drop-shadow-sm select-none bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 bg-clip-text text-transparent">
                            {heading || "Get Started"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold text-xs tracking-tight uppercase opacity-70">
                            {headingSubtitle || "Create your free account to continue"}
                        </p>
                    </div>

                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
