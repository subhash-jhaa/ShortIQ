"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
    LayoutDashboard,
    PlusCircle,
    PlaySquare,
    Video,
    BookOpen,
    CreditCard,
    Settings,
    ArrowUpCircle,
    UserCircle
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const mainNavItems = [
        { name: "Series", href: "/dashboard/series", icon: <PlaySquare size={22} /> },
        { name: "Videos", href: "/dashboard/videos", icon: <Video size={22} /> },
        { name: "Guides", href: "/dashboard/guides", icon: <BookOpen size={22} /> },
        { name: "Billing", href: "/dashboard/billing", icon: <CreditCard size={22} /> },
        { name: "Settings", href: "/dashboard/settings", icon: <Settings size={22} /> },
    ];

    const footerItems = [
        { name: "Upgrade", href: "/dashboard/upgrade", icon: <ArrowUpCircle size={20} /> },
        { name: "Profile Settings", href: "/dashboard/profile", icon: <UserCircle size={20} /> },
    ];

    return (
        <div className="flex min-h-screen bg-[#0a0a0b] text-white font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-[#0d0d14] border-r border-white/10 flex flex-col">
                <div className="p-6 shrink-0">
                    {/* Sidebar Header: Logo & Overview */}
                    <div className="mb-8">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 3l14 9-14 9V3z" fill="white" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Short<span className="text-violet-400">IQ</span>
                            </span>
                        </Link>

                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-semibold transition-all bg-[#1e1e2d] border border-white/5 text-indigo-400 shadow-sm"
                        >
                            <LayoutDashboard size={22} className="text-indigo-400" />
                            Overview
                        </Link>
                    </div>

                    {/* Create New Series Button - Light Style */}
                    <Link
                        href="/dashboard/create"
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#0d0d14] py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-lg mb-8 active:scale-[0.98]"
                    >
                        <PlusCircle size={20} />
                        Create New Series
                    </Link>

                    {/* Main Options */}
                    <nav className="space-y-1.5 text-white/50">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl text-[16px] font-medium transition-all hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)] group"
                            >
                                <span className="text-white/20 group-hover:text-indigo-400 transition-colors">
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="mt-auto p-6 border-t border-white/5 space-y-1 shrink-0">
                    {footerItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Dashboard Header */}
                <header className="h-16 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-end px-8 shrink-0">
                    {mounted && (
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-8 h-8"
                                }
                            }}
                        />
                    )}
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
