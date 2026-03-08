"use client";

import Link from "next/link";

export function QuickActions() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="space-y-3">
                <Link href="/dashboard/create">
                    <button className="w-full p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 text-white text-sm font-bold shadow-xl shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all mb-3">
                        Generate AI Video
                    </button>
                </Link>
                <Link href="/dashboard/series">
                    <button className="w-full p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all shadow-sm mb-3">
                        Schedule Content
                    </button>
                </Link>
                <Link href="/dashboard/billing">
                    <button className="w-full p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all shadow-sm">
                        Upgrade Plan
                    </button>
                </Link>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-violet-600/10 dark:from-indigo-600/40 dark:to-violet-700/40 border border-indigo-200 dark:border-indigo-500/20 mt-8 shadow-lg dark:shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 dark:bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                <div className="text-xs font-black mb-3 uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Pro Tip</div>
                <p className="text-sm font-medium leading-relaxed mb-4 text-gray-600 dark:text-white/70">
                    Connect your TikTok and Instagram accounts to enable automatic posting!
                </p>
                <button className="text-[11px] font-black uppercase bg-indigo-100 dark:bg-white/10 hover:bg-indigo-200 dark:hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200 dark:border-white/10 text-indigo-700 dark:text-white">
                    Manage Accounts →
                </button>
            </div>
        </div>
    );
}
