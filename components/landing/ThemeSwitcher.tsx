"use client";

interface ThemeSwitcherProps {
    current: string;
    onChange: (t: string) => void;
}

export default function ThemeSwitcher({ current, onChange }: ThemeSwitcherProps) {
    const themes = [
        { id: "midnight-sunset", label: "Indigo", color: "#6366f1" },
        { id: "matrix-green", label: "Emerald", color: "#10b981" },
        { id: "solar-gold", label: "Slate", color: "#a1a1aa" },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-2xl shadow-2xl">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    className={`relative px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${current === t.id
                        ? "bg-white/10 text-white shadow-lg border border-white/20"
                        : "text-white/40 hover:text-white/70"
                        }`}
                >
                    {current === t.id && (
                        <span
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                            style={{ background: t.color }}
                        />
                    )}
                    {t.label}
                </button>
            ))}
        </div>
    );
}
