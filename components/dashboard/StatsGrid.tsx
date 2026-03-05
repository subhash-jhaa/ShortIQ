"use client";

interface StatsGridProps {
    credits?: number | string;
    videoCount?: number;
    seriesCount?: number;
    activeSchedules?: number;
}

export function StatsGrid({
    credits,
    videoCount = 0,
    seriesCount = 0,
    activeSchedules = 0
}: StatsGridProps) {
    const stats = [
        { label: "Videos Generated", value: videoCount.toLocaleString(), icon: "🎬", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { label: "Active Series", value: seriesCount.toLocaleString(), icon: "📈", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { label: "Active Schedules", value: activeSchedules.toLocaleString(), icon: "📅", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        { label: "Credits Left", value: credits?.toLocaleString() || "10,000", icon: "💎", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <div key={stat.label} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl border ${stat.border}`}>
                            {stat.icon}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 text-white/30 uppercase tracking-widest">
                            Live
                        </span>
                    </div>
                    <div className="text-3xl font-black text-white mb-1 leading-tight">{stat.value}</div>
                    <div className="text-xs text-white/40 font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}
