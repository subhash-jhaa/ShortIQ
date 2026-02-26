"use client";

export function QuickActions() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-white">Quick Actions</h2>
            <div className="space-y-3">
                <button className="w-full p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 text-white text-sm font-bold shadow-xl shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Generate AI Video
                </button>
                <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all shadow-sm">
                    Schedule Content
                </button>
                <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-bold hover:bg-white/10 transition-all shadow-sm">
                    Upgrade Plan
                </button>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600/40 to-violet-700/40 border border-indigo-500/20 text-white mt-8 shadow-xl relative overflow-hidden group backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                <div className="text-xs font-black mb-3 uppercase tracking-widest text-indigo-300">Pro Tip</div>
                <p className="text-sm font-medium leading-relaxed mb-4 text-white/70">
                    Connect your TikTok and Instagram accounts to enable automatic posting!
                </p>
                <button className="text-[11px] font-black uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-white/10">
                    Manage Accounts →
                </button>
            </div>
        </div>
    );
}
