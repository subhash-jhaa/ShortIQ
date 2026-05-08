"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, ChevronDown, Check, Globe, Loader2 } from "lucide-react";
import { languages as staticLanguages, type Language } from "@/lib/voice-config";

// ── Types from the /api/voices endpoint ─────────────────────────────
interface VoiceOption {
    id: string;
    name: string;
    gender: "male" | "female";
    provider: "deepgram" | "sarvam";
    voiceId: string;
}

interface VoiceResult {
    language: string;
    provider: "deepgram" | "sarvam";
    voices: VoiceOption[];
}

// ── Props ────────────────────────────────────────────────────────────
interface LanguageVoiceSelectionProps {
    selectedLanguage: string;
    selectedVoice: string;
    onLanguageSelect: (lang: string) => void;
    onVoiceSelect: (voice: string) => void;
}

// ── Sub-Components ──────────────────────────────────────────────────

function LanguageDropdown({ 
    languages, 
    selected, 
    isOpen, 
    onToggle, 
    onSelect,
    dropdownRef 
}: { 
    languages: Language[], 
    selected: string, 
    isOpen: boolean, 
    onToggle: () => void, 
    onSelect: (lang: string) => void,
    dropdownRef: React.RefObject<HTMLDivElement>
}) {
    const current = languages.find(l => l.language === selected);
    
    return (
        <div className="relative flex flex-col gap-2 w-full sm:w-64" ref={dropdownRef}>
            <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                <Globe size={11} /> Select Language
            </label>
            <button
                onClick={onToggle}
                className="flex items-center justify-between gap-3 px-4 py-3 w-full rounded-xl bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white shadow-sm dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all"
            >
                <div className="flex items-center gap-2.5">
                    {current ? <span className="text-xl leading-none">{current.countryFlag}</span> : <Globe size={18} className="text-gray-400 dark:text-white/30" />}
                    <span className={`font-semibold text-sm ${current ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-white/30"}`}>
                        {current?.language ?? "Choose language"}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-500 dark:text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full z-50 bg-white dark:bg-[#111114] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden py-1 max-h-[260px] overflow-y-auto">
                    {languages.map((lang) => (
                        <button
                            key={lang.language}
                            onMouseDown={(e) => { e.preventDefault(); onSelect(lang.language); }}
                            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors ${selected === lang.language ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" : "text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-lg leading-none">{lang.countryFlag}</span>
                                <span className="font-medium">{lang.language}</span>
                            </div>
                            {selected === lang.language && <Check size={14} className="text-indigo-400 shrink-0" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function VoiceCard({ 
    voice, 
    isSelected, 
    isPlaying, 
    isLoading, 
    onSelect, 
    onTogglePreview 
}: { 
    voice: VoiceOption, 
    isSelected: boolean, 
    isPlaying: boolean, 
    isLoading: boolean, 
    onSelect: () => void, 
    onTogglePreview: (id: string, vId: string) => void 
}) {
    return (
        <div
            onClick={onSelect}
            className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group ${isSelected ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/10" : "bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.06] hover:border-gray-300"}`}
        >
            <div className="flex items-center gap-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onTogglePreview(voice.id, voice.voiceId); }}
                    disabled={isLoading}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${isLoading ? "bg-indigo-500/20" : isPlaying ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:text-indigo-500"}`}
                >
                    {isLoading ? <Loader2 size={17} className="animate-spin" /> : isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-white/80"}`}>{voice.name}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border ${voice.gender === "female" ? "bg-pink-500/10 text-pink-400/70 border-pink-500/15" : "bg-blue-500/10 text-blue-400/70 border-blue-500/15"}`}>
                            {voice.gender}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-white/25 mt-0.5">{voice.provider} · {voice.voiceId}</p>
                </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-gray-200 dark:border-white/10"}`}>
                {isSelected && <Check size={12} strokeWidth={3} />}
            </div>
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────────────

export function LanguageVoiceSelection({
    selectedLanguage,
    selectedVoice,
    onLanguageSelect,
    onVoiceSelect,
}: LanguageVoiceSelectionProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [playingVoice, setPlayingVoice] = useState<string | null>(null);
    const [loadingPreview, setLoadingPreview] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [voiceResult, setVoiceResult] = useState<VoiceResult | null>(null);
    const [voicesLoading, setVoicesLoading] = useState(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const [audioError, setAudioError] = useState<string | null>(null);

    const allLanguages: Language[] = staticLanguages;
    const currentLang = allLanguages.find((l) => l.language === selectedLanguage);
    const onVoiceSelectRef = useRef(onVoiceSelect);
    onVoiceSelectRef.current = onVoiceSelect;

    const fetchVoices = useCallback(async (language: string) => {
        setVoicesLoading(true);
        setVoiceError(null);
        setVoiceResult(null);
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setPlayingVoice(null);

        try {
            const res = await fetch(`/api/voices?language=${encodeURIComponent(language)}`);
            if (!res.ok) throw new Error(`Failed to fetch voices (${res.status})`);
            const data: VoiceResult = await res.json();
            setVoiceResult(data);
            if (data.voices.length > 0) onVoiceSelectRef.current(data.voices[0].id);
        } catch (err: any) {
            setVoiceError(err.message || "Failed to load voices");
        } finally {
            setVoicesLoading(false);
        }
    }, []);

    useEffect(() => { if (selectedLanguage) fetchVoices(selectedLanguage); }, [selectedLanguage, fetchVoices]);

    useEffect(() => {
        const handler = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => () => audioRef.current?.pause(), []);

    const togglePreview = async (voiceId: string, voiceName: string) => {
        setAudioError(null);
        if (playingVoice === voiceId) { audioRef.current?.pause(); setPlayingVoice(null); return; }
        audioRef.current?.pause();
        setLoadingPreview(voiceId);

        try {
            const params = new URLSearchParams({ voice: voiceName, language: selectedLanguage });
            const response = await fetch(`/api/tts-preview?${params.toString()}`);
            if (!response.ok) throw new Error("Preview failed");
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const newAudio = new Audio(blobUrl);
            audioRef.current = newAudio;
            setLoadingPreview(null);
            setPlayingVoice(voiceId);
            await newAudio.play();
            newAudio.onended = () => { setPlayingVoice(null); URL.revokeObjectURL(blobUrl); };
        } catch (err: any) {
            setAudioError(`Preview unavailable for "${voiceName}".`);
            setPlayingVoice(null);
            setLoadingPreview(null);
        }
    };

    return (
        <div className="flex flex-col gap-8 text-gray-900 dark:text-white">
            <div>
                <h2 className="text-xl font-bold">Language & Voice</h2>
                <p className="text-sm text-gray-500 dark:text-white/35 mt-1">Pick a language and tone.</p>
            </div>

            {audioError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">⚠️ {audioError}</div>}

            <div className="flex flex-col sm:flex-row items-end gap-3">
                <LanguageDropdown 
                    languages={allLanguages} 
                    selected={selectedLanguage} 
                    isOpen={dropdownOpen} 
                    onToggle={() => setDropdownOpen(!dropdownOpen)} 
                    onSelect={(l) => { onLanguageSelect(l); setDropdownOpen(false); }}
                    dropdownRef={dropdownRef}
                />

                {currentLang && voiceResult && (
                    <div className="flex-1 flex items-center gap-4 px-5 py-3 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/20 h-[52px]">
                        <span className="text-2xl leading-none opacity-80">{currentLang.countryFlag}</span>
                        <div>
                            <p className="text-sm font-bold text-indigo-300 leading-tight">{currentLang.language}</p>
                            <p className="text-[11px] text-indigo-400/50 leading-tight">Using {voiceResult.provider} model · {voiceResult.voices.length} voices</p>
                        </div>
                    </div>
                )}
            </div>

            {voicesLoading && (
                <div className="flex items-center justify-center gap-3 py-12">
                    <Loader2 size={20} className="animate-spin text-indigo-400" />
                    <span className="text-sm text-gray-500 dark:text-white/40 font-medium">Loading...</span>
                </div>
            )}

            {voiceError && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{voiceError}</div>}

            {voiceResult && voiceResult.voices.length > 0 && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-white/50 uppercase tracking-wider">Available Voices</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {voiceResult.voices.map((voice) => (
                            <VoiceCard 
                                key={voice.id} 
                                voice={voice} 
                                isSelected={selectedVoice === voice.id} 
                                isPlaying={playingVoice === voice.id} 
                                isLoading={loadingPreview === voice.id} 
                                onSelect={() => onVoiceSelect(voice.id)} 
                                onTogglePreview={togglePreview} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
