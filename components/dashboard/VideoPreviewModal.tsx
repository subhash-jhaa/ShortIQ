"use client";

import { useState } from "react";
import { VideoProject } from "@/actions/videos";
import { X, Download, Loader2 } from "lucide-react";

interface VideoPreviewModalProps {
    video: VideoProject;
    isOpen: boolean;
    onClose: () => void;
}

export function VideoPreviewModal({ video, isOpen, onClose }: VideoPreviewModalProps) {
    const [isLoading, setIsLoading] = useState(true);

    if (!isOpen) return null;

    // Ensure duration has a fallback
    const durationInFrames = (video as any).duration_in_frames || 1800;

    // We expect the final Creatomate render URL to be on `video.video_url`
    const videoUrl = (video as any).video_url;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md mx-4 rounded-2xl bg-[#0d0d0f] border border-white/10 overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <h2 className="text-sm font-bold text-white truncate">{video.title}</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Player */}
                <div className="bg-black aspect-[9/16] w-full flex items-center justify-center relative">
                    {videoUrl ? (
                        <>
                            {isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30 z-10">
                                    <Loader2 size={32} className="animate-spin" />
                                    <span className="text-xs">Loading video…</span>
                                </div>
                            )}
                            <video
                                src={videoUrl}
                                controls
                                onLoadedData={() => setIsLoading(false)}
                                className="w-full h-full object-contain"
                            />
                        </>
                    ) : (
                        <div className="text-white/20 text-center text-sm px-8">
                            <p>No preview available yet.</p>
                            <p className="text-xs mt-1 opacity-60">
                                {video.status === "rendering" ? "Video is currently rendering in the cloud..." : "Video generation has not completed."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 flex items-center justify-between border-t border-white/5">
                    <p className="text-xs text-white/30">
                        {Math.round(durationInFrames / 30)}s
                    </p>
                    {video.audio_url && (
                        <a
                            href={video.audio_url}
                            download
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all"
                        >
                            <Download size={12} />
                            Audio
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
