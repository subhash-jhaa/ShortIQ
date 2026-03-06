"use client";

import { VideoProject } from "@/actions/videos";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    Clock,
    Video as VideoIcon,
    Music,
    Type,
    ExternalLink,
    Download,
    FileText,
    Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface VideoDetailsModalProps {
    video: VideoProject | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VideoDetailsModal({ video, open, onOpenChange }: VideoDetailsModalProps) {
    if (!video) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-[#0d0d14] border-white/10 overflow-hidden flex flex-col">
                <DialogHeader className="p-6 border-b border-white/5 shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 text-left">
                            <DialogTitle className="text-2xl font-black text-white">{video.title}</DialogTitle>
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                                <Clock size={12} />
                                Generated {formatDistanceToNow(new Date(video.created_at))} ago
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1">
                                {video.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                    {/* Left Column: Scene Breakdown */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 border-r border-white/5">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon size={16} className="text-rose-400" />
                                Scene Breakdown
                            </h3>
                            <div className="space-y-6">
                                {video.scenes.map((scene, idx) => (
                                    <div key={idx} className="group space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 border border-white/10">
                                                {idx + 1}
                                            </div>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="relative w-32 aspect-[9/16] rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                                                {video.image_urls?.[idx] ? (
                                                    <Image
                                                        src={video.image_urls[idx]}
                                                        alt={`Scene ${idx + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-white/70 leading-relaxed italic">
                                                    "{scene.scene_script}"
                                                </div>
                                                <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                                    <p className="text-[10px] text-indigo-400/50 uppercase font-black tracking-wider mb-1">AI Visual Prompt</p>
                                                    <p className="text-xs text-indigo-200/60 line-clamp-2">
                                                        {scene.image_prompt}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Full Script & Downloads */}
                    <div className="w-full lg:w-80 bg-white/[0.01] overflow-y-auto p-6 space-y-8 shrink-0">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={16} className="text-blue-400" />
                                Full Script
                            </h3>
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-white/50 leading-loose max-h-64 overflow-y-auto custom-scrollbar">
                                {video.total_script}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                                <Download size={16} className="text-emerald-400" />
                                Assets
                            </h3>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    asChild
                                    className="w-full justify-start gap-3 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 h-12 rounded-xl text-white/70"
                                >
                                    <a href={video.audio_url} target="_blank">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            <Music size={16} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-xs font-bold text-white">Voiceover Audio</p>
                                            <p className="text-[10px] text-white/30">Download MP3</p>
                                        </div>
                                        <ExternalLink size={14} className="text-white/20" />
                                    </a>
                                </Button>
                                <Button
                                    variant="outline"
                                    asChild
                                    className="w-full justify-start gap-3 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 h-12 rounded-xl text-white/70"
                                >
                                    <a href={video.captions_url} target="_blank">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                                            <Type size={16} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-xs font-bold text-white">Video Captions</p>
                                            <p className="text-[10px] text-white/30">Download SRT</p>
                                        </div>
                                        <ExternalLink size={14} className="text-white/20" />
                                    </a>
                                </Button>
                                {video.video_url && (
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="w-full justify-start gap-3 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/30 h-10 rounded-xl text-indigo-100"
                                    >
                                        <a href={video.video_url} target="_blank">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                <VideoIcon size={16} />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-xs font-bold text-white uppercase tracking-tight">Full Video (MP4)</p>
                                            </div>
                                            <Download size={14} className="text-white/20" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <Link href={`/dashboard/series/${video.series_id}`}>
                                <Button variant="ghost" className="w-full text-white/30 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest">
                                    View Original Series
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
