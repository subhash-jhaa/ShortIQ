"use client";

import { useEffect, useState } from "react";
import { SeriesCard } from "@/components/dashboard/SeriesCard";
import { Loader2, PlaySquare, Plus } from "lucide-react";
import Link from "next/link";

export default function SeriesPage() {
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 dark:text-white/20 gap-3">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm font-medium text-gray-500 dark:text-white/40">Loading your series...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Automated Series</h1>
                    <p className="text-gray-500 dark:text-white/35 text-sm">Manage your video automation projects and triggers</p>
                </div>
                <Link href="/dashboard/create">
                    <button className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20 active:scale-95">
                        <Plus size={20} />
                        Create New
                    </button>
                </Link>
            </div>

            {series.length === 0 ? (
                <div className="bg-white dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center shadow-sm dark:shadow-none">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-transparent">
                        <PlaySquare size={32} className="text-gray-400 dark:text-white/20" />
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">No series yet</h3>
                    <p className="text-gray-500 dark:text-white/40 text-sm max-w-sm mx-auto mb-8">
                        Create your first automated series to start generating viral short-form content.
                    </p>
                    <Link
                        href="/dashboard/create"
                        className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                    >
                        Get Started
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {series.map((item) => (
                        <SeriesCard key={item.id} series={item} onRefresh={fetchSeries} />
                    ))}
                </div>
            )}
        </div>
    );
}
