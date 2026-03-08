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
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300 border border-white/30">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M5 3l14 9-14 9V3z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            Short<span className="text-white/70">IQ</span>
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
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M5 3l14 9-14 9V3z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold dark:text-white">ShortIQ</span>
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
