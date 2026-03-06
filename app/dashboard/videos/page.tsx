"use client";

import { useEffect, useState } from "react";
import { getVideos, VideoProject, cancelVideoGeneration, deleteVideo } from "@/actions/videos";
import { formatDistanceToNow, differenceInMinutes } from "date-fns";
import { Loader2, Video, Clock, ExternalLink, Play, XCircle, Eye, Download, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { VideoDetailsModal } from "@/components/dashboard/VideoDetailsModal";
import { VideoPreviewModal } from "@/components/dashboard/VideoPreviewModal";

export default function VideosPage() {
    const [videos, setVideos] = useState<VideoProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<VideoProject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewVideo, setPreviewVideo] = useState<VideoProject | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const fetchVideos = async () => {
        const res = await getVideos();
        if (res.success) {
            setVideos(res.data || []);
        } else {
            toast.error(res.error || "Failed to load videos");
        }
        setIsLoading(false);
    };

    const handleCancel = async (videoId: string) => {
        if (!confirm("Are you sure you want to cancel this generation?")) return;

        toast.promise(cancelVideoGeneration(videoId), {
            loading: 'Cancelling generation...',
            success: () => {
                fetchVideos();
                return 'Generation cancelled';
            },
            error: 'Failed to cancel generation'
        });
    };

    useEffect(() => {
        fetchVideos();
        const hasGenerating = videos.some(v => v.status === "generating");

        // Polling for data
        const pollRate = (hasGenerating || videos.length === 0) ? 5000 : 30000;
        const dataInterval = setInterval(fetchVideos, pollRate);

        // Timer for the 5-minute cancel button UI
        const timerInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 10000); // Check every 10s for the timer

        return () => {
            clearInterval(dataInterval);
            clearInterval(timerInterval);
        };
    }, [videos.length, videos.some(v => v.status === "generating")]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white/20 gap-3">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm font-medium text-white/40">Loading your videos...</p>
            </div>
        );
    }

    const handleDelete = async (videoId: string) => {
        if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) return;
        try {
            const res = await deleteVideo(videoId);
            if (res.success) {
                toast.success("Video deleted");
                fetchVideos(); // Refresh the list
            } else {
                toast.error(res.error || "Failed to delete video");
            }
        } catch (err) {
            toast.error("Error deleting video");
        }
    };

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
                                if (video.status === "ready") {
                                    setPreviewVideo(video);
                                    setIsPreviewOpen(true);
                                }
                            }}
                            className={`bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-all ${video.status === "ready" ? "cursor-pointer" : "cursor-default"}`}
                        >
                            {/* Thumbnail Area */}
                            <div className="relative aspect-video w-full overflow-hidden bg-white/5">
                                {(video.status === "generating" || video.status === "cancelled") ? (
                                    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${video.status === 'cancelled' ? 'text-white/20 bg-white/5' : 'text-indigo-400 bg-indigo-500/5'
                                        }`}>
                                        {video.status === 'generating' ? (
                                            <>
                                                <Loader2 className="animate-spin" size={24} />
                                                <span className="text-[10px] uppercase font-bold tracking-widest">Generating Video...</span>

                                                {/* Cancel Button - Only after 5 minutes */}
                                                {differenceInMinutes(currentTime, new Date(video.created_at)) >= 5 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCancel(video.id);
                                                        }}
                                                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider border border-rose-500/20 transition-all active:scale-95"
                                                    >
                                                        <XCircle size={14} />
                                                        Cancel Generation
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={32} />
                                                <span className="text-[10px] uppercase font-bold tracking-widest">Generation Cancelled</span>
                                            </>
                                        )}
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
                                {video.video_url ? (
                                    <Link
                                        href={video.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-3 left-3 px-3 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-black/50 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:scale-105 active:scale-95"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Download size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Download MP4</span>
                                    </Link>
                                ) : video.status === "ready" && (
                                    <div className="absolute top-3 left-3 px-3 h-9 rounded-full bg-white/10 backdrop-blur-md text-white/40 flex items-center justify-center gap-2 border border-white/5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <Download size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">No MP4 Link</span>
                                    </div>
                                )}

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(video.id);
                                    }}
                                    className="absolute top-3 right-3 p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 backdrop-blur-md z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
                                    title="Delete Video"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider z-10">
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
                                    <div className="mt-5 flex flex-col gap-2">
                                        <div className="flex gap-2">
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

                                        {video.video_url && (
                                            <Link
                                                href={video.video_url}
                                                target="_blank"
                                                className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
                                            >
                                                <Download size={14} />
                                                Download MP4
                                            </Link>
                                        )}
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

            {previewVideo && (
                <VideoPreviewModal
                    video={previewVideo}
                    isOpen={isPreviewOpen}
                    onClose={() => {
                        setIsPreviewOpen(false);
                        setPreviewVideo(null);
                    }}
                />
            )}
        </div>
    );
}
