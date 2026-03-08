"use client";

interface DashboardHeaderProps {
    firstName?: string | null;
}

export function DashboardHeader({ firstName }: DashboardHeaderProps) {
    return (
        <header>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-indigo-500 to-rose-400 bg-clip-text text-transparent">{firstName || "Creator"}</span>! 👋
            </h1>
            <p className="text-gray-500 dark:text-white/50 font-medium">Manage your AI video empire and automation from here.</p>
        </header>
    );
}
