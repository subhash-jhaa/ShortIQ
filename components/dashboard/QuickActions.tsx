"use client";

import Link from "next/link";

export function QuickActions() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="space-y-3">
                {[
                    { href: "/dashboard/create", label: "Generate AI Video", primary: true },
                    { href: "/dashboard/series", label: "Schedule Content" },
                    { href: "/dashboard/billing", label: "Upgrade Plan", secondary: true },
                ].map((action, i) => (
                    <Link key={i} href={action.href} className="block">
                        <button className={`w-full p-4 rounded-xl text-sm font-bold transition-all mb-3 ${
                            action.primary 
                                ? "bg-primary text-white shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98]" 
                                : "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 shadow-sm"
                            } ${action.secondary ? "text-gray-500 dark:text-white/50" : ""}`}>
                            {action.label}
                        </button>
                    </Link>
                ))}
            </div>

            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 mt-8 shadow-lg dark:shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                <div className="text-xs font-black mb-3 uppercase tracking-widest text-primary">Pro Tip</div>
                <p className="text-sm font-medium leading-relaxed mb-4 text-gray-600 dark:text-white/70">
                    Connect your TikTok and Instagram accounts to enable automatic posting!
                </p>
                <button className="text-[11px] font-black uppercase bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors border border-primary/20 text-primary">
                    Manage Accounts →
                </button>
            </div>
        </div>
    );
}
