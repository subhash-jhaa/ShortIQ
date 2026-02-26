"use client";

export function RecentProjects() {
    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white">Recent Projects</h2>
                <button className="text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group cursor-pointer shadow-sm">
                        <div className="w-16 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/20 uppercase tracking-tighter overflow-hidden border border-white/5">
                            Preview
                        </div>
                        <div className="flex-1">
                            <div className="text-[15px] font-bold text-white/80 mb-1 group-hover:text-rose-300 transition-colors">
                                AI Shorts Series #{i}
                            </div>
                            <div className="text-xs text-white/30 font-medium">
                                Generated 2 hours ago • <span className="text-white/40">YouTube, TikTok</span>
                            </div>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                            Ready
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-6 rounded-2xl border-2 border-dashed border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-white/20 hover:text-indigo-400 font-bold text-sm flex items-center justify-center gap-2 group">
                <span className="text-xl group-hover:scale-125 transition-transform">+</span> Create New Project
            </button>
        </div>
    );
}
