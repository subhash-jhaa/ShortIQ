"use client";

import { useEffect, useState } from "react";
import { SeriesCard } from "./SeriesCard";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export function RecentProjects() {
    const [series, setSeries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSeries = async () => {
        try {
            const res = await fetch("/api/series");
            const data = await res.json();
            if (Array.isArray(data)) {
                setSeries(data);
            }
        } catch (error) {
            console.error("Failed to fetch series:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeries();
    }, []);

    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white">Your Series</h2>
                <Link href="/dashboard/series">
                    <button className="text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">
                        View All
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-white/20 gap-3 bg-white/[0.02] rounded-3xl border border-dashed border-white/5">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-sm font-medium">Loading your series...</p>
                </div>
            ) : series.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {series.map((item) => (
                        <SeriesCard key={item.id} series={item} onRefresh={fetchSeries} />
                    ))}
                </div>
            ) : (
                <div className="h-64 flex flex-col items-center justify-center text-white/20 gap-4 bg-white/[0.02] rounded-3xl border border-dashed border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <Plus size={24} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-white/40">No series created yet</p>
                        <p className="text-xs">Start by creating your first automated series</p>
                    </div>
                </div>
            )}

            <Link href="/dashboard/create">
                <button className="w-full py-8 rounded-2xl border-2 border-dashed border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all text-white/20 hover:text-rose-400 font-extrabold text-sm flex flex-col items-center justify-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500/20 transition-all">
                        <Plus size={20} className="group-hover:text-rose-400" />
                    </div>
                    <span>Create New Series</span>
                </button>
            </Link>
        </div>
    );
}
