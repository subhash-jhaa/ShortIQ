"use client";

import { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { Main } from "@/remotion/Main";
import { VideoProject } from "@/actions/videos";
import { X, Download, Loader2 } from "lucide-react";

interface VideoPreviewModalProps {
    video: VideoProject;
    isOpen: boolean;
    onClose: () => void;
}

export function VideoPreviewModal({ video, isOpen, onClose }: VideoPreviewModalProps) {
    const [srtContent, setSrtContent] = useState("");
    const [loadingSrt, setLoadingSrt] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        if ((video as any).srt_content) {
            setSrtContent((video as any).srt_content);
            return;
        }
        if ((video as any).captions_url) {
            setLoadingSrt(true);
            fetch((video as any).captions_url)
                .then((r) => r.text())
                .then((text) => setSrtContent(text))
                .catch(console.error)
                .finally(() => setLoadingSrt(false));
        }
    }, [isOpen, video]);

    if (!isOpen) return null;

    const durationInFrames = (video as any).duration_in_frames || 1800;
    const imageUrls: string[] = video.image_urls || [];
    const captionStyle: string = (video as any).caption_style || "classic";

    const canPreview = imageUrls.length > 0;

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
                <div className="bg-black aspect-[9/16] w-full flex items-center justify-center">
                    {loadingSrt ? (
                        <div className="flex flex-col items-center gap-3 text-white/30">
                            <Loader2 size={32} className="animate-spin" />
                            <span className="text-xs">Loading preview…</span>
                        </div>
                    ) : canPreview ? (
                        <Player
                            component={Main}
                            durationInFrames={durationInFrames}
                            compositionWidth={1080}
                            compositionHeight={1920}
                            fps={30}
                            style={{ width: "100%", height: "100%" }}
                            controls
                            inputProps={{
                                audioUrl: video.audio_url || "",
                                srtContent,
                                imageUrls,
                                captionStyle,
                                videoStyle: "realistic",
                                durationInFrames,
                            }}
                        />
                    ) : (
                        <div className="text-white/20 text-center text-sm px-8">
                            <p>No preview available yet.</p>
                            <p className="text-xs mt-1 opacity-60">Images are still generating.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 flex items-center justify-between border-t border-white/5">
                    <p className="text-xs text-white/30">
                        {durationInFrames} frames · {Math.round(durationInFrames / 30)}s · 30fps
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
