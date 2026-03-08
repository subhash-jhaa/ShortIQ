"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    const pathname = usePathname();
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(path);
    };

    const mainNavItems = [
        { name: "Series", href: "/dashboard/series", icon: <PlaySquare size={22} /> },
        { name: "Videos", href: "/dashboard/videos", icon: <Video size={22} /> },
        { name: "Guide", href: "/dashboard/guide", icon: <BookOpen size={22} /> },
        { name: "Billing", href: "/dashboard/billing", icon: <CreditCard size={22} /> },
        { name: "Settings", href: "/dashboard/settings", icon: <Settings size={22} /> },
    ];

    const footerItems = [
        { name: "Upgrade", href: "/dashboard/upgrade", icon: <ArrowUpCircle size={20} /> },
        { name: "Profile Settings", href: "/dashboard/profile", icon: <UserCircle size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0b] text-gray-900 dark:text-white font-sans overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-[#0d0d14] border-r border-gray-200 dark:border-white/10 flex flex-col overflow-y-auto custom-scrollbar transition-colors duration-300">
                <div className="p-6 shrink-0">
                    {/* Sidebar Header: Logo & Overview */}
                    <div className="mb-8">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 3l14 9-14 9V3z" fill="white" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Short<span className="text-violet-600 dark:text-violet-400">IQ</span>
                            </span>
                        </Link>

                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[16px] font-semibold transition-all ${isActive("/dashboard")
                                ? "bg-indigo-50 dark:bg-[#1e1e2d] border border-indigo-100 dark:border-white/5 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            <LayoutDashboard size={22} className={isActive("/dashboard") ? "text-indigo-500 dark:text-indigo-400" : "text-gray-300 dark:text-white/20"} />
                            Overview
                        </Link>
                    </div>

                    {/* Create New Series Button */}
                    <Link
                        href="/dashboard/create"
                        className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all shadow-lg mb-8 active:scale-[0.98] ${isActive("/dashboard/create")
                            ? "bg-rose-500 text-white shadow-rose-500/20"
                            : "bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-slate-100 text-white dark:text-[#0d0d14]"
                            }`}
                    >
                        <PlusCircle size={20} />
                        Create New Series
                    </Link>

                    {/* Main Nav Items */}
                    <nav className="space-y-1.5 text-gray-500 dark:text-white/50">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-[16px] font-medium transition-all group ${isActive(item.href)
                                    ? "bg-indigo-50 dark:bg-[#1e1e2d] border border-indigo-100 dark:border-white/5 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                    : "text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <span className={`${isActive(item.href) ? "text-indigo-500 dark:text-indigo-400" : "text-gray-300 dark:text-white/20"} group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="mt-auto p-6 border-t border-gray-100 dark:border-white/5 space-y-1 shrink-0">
                    {footerItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(item.href)
                                ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
                                : "text-gray-400 dark:text-white/30 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            <span className={isActive(item.href) ? "text-indigo-500 dark:text-indigo-400" : ""}>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Dashboard Header */}
                <header className="h-16 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 flex items-center justify-end px-8 shrink-0 transition-colors duration-300">
                    {mounted && isLoaded && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-white/50">{user?.primaryEmailAddress?.emailAddress}</span>
                            <button
                                onClick={() => signOut({ redirectUrl: "/" })}
                                className="text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-gray-50 dark:bg-[#0a0a0b] transition-colors duration-300">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
