"use client";

import { useEffect, useState } from "react";
import { getVideos, VideoProject } from "@/actions/videos";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Video, Clock, ExternalLink, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { VideoDetailsModal } from "@/components/dashboard/VideoDetailsModal";

export default function VideosPage() {
    const [videos, setVideos] = useState<VideoProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<VideoProject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchVideos = async () => {
        const res = await getVideos();
        if (res.success) {
            setVideos(res.data || []);
        } else {
            toast.error(res.error || "Failed to load videos");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchVideos();
        const hasGenerating = videos.some(v => v.status === "generating");

        // Poll every 5 seconds if there's a generation in progress
        // Poll every 30 seconds otherwise to check for new scheduled videos
        const interval = setInterval(() => {
            if (hasGenerating || videos.length === 0) {
                fetchVideos();
            }
        }, hasGenerating ? 5000 : 30000);

        return () => clearInterval(interval);
    }, [videos.length, videos.some(v => v.status === "generating")]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white/20 gap-3">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm font-medium text-white/40">Loading your videos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">My Videos</h1>
                    <p className="text-white/35 text-sm">Manage and preview all your generated video assets</p>
                </div>
                <button
                    onClick={fetchVideos}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                >
                    <Loader2 className={isLoading ? "animate-spin" : ""} size={16} />
                    Refresh
                </button>
            </div>

            {videos.length === 0 ? (
                <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video size={32} className="text-white/20" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">No videos yet</h3>
                    <p className="text-white/40 text-sm max-w-sm mx-auto mb-8">
                        Once you trigger generation for a series, your video assets will appear here.
                    </p>
                    <Link
                        href="/dashboard/series"
                        className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                    >
                        Go to Series
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            onClick={() => {
                                setSelectedVideo(video);
                                setIsModalOpen(true);
                            }}
                            className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-all cursor-pointer"
                        >
                            {/* Thumbnail Area */}
                            <div className="relative aspect-video w-full overflow-hidden bg-white/5">
                                {video.status === "generating" ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400 gap-3 bg-indigo-500/5">
                                        <Loader2 className="animate-spin" size={24} />
                                        <span className="text-[10px] uppercase font-bold tracking-widest">Generating Video...</span>
                                    </div>
                                ) : (
                                    <>
                                        {video.image_urls?.[0] ? (
                                            <Image
                                                src={video.image_urls[0]}
                                                alt={video.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/5">
                                                <Video size={48} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40">
                                                <Play size={20} fill="white" className="ml-1" />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                                    {video.status}
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-5">
                                <h3 className="text-white font-bold truncate text-base mb-1 group-hover:text-indigo-400 transition-colors">
                                    {video.title}
                                </h3>

                                <div className="flex items-center gap-4 text-white/30 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {formatDistanceToNow(new Date(video.created_at))} ago
                                    </div>
                                    {video.status === "ready" && video.image_urls && (
                                        <div className="flex items-center gap-1.5">
                                            <Video size={12} />
                                            {video.image_urls.length} Scenes
                                        </div>
                                    )}
                                </div>

                                {video.status === "ready" && (
                                    <div className="mt-5 flex gap-2">
                                        <Link
                                            href={video.audio_url || "#"}
                                            target="_blank"
                                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 py-2 rounded-lg text-xs font-semibold transition-all"
                                        >
                                            Audio <ExternalLink size={10} />
                                        </Link>
                                        <Link
                                            href={video.captions_url || "#"}
                                            target="_blank"
                                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 py-2 rounded-lg text-xs font-semibold transition-all"
                                        >
                                            SRT <ExternalLink size={10} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <VideoDetailsModal
                video={selectedVideo}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </div>
    );
}
