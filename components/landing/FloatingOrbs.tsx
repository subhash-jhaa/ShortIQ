"use client";

export default function FloatingOrbs({ theme }: { theme: string }) {
    return (
        <div className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 theme-${theme}`}>
            <div className="noise-overlay" />
            <div className="vignette" />
            <div className="modern-grid" />
            <div className="orb orb-1" style={{ background: `radial-gradient(circle, var(--orb-1-color, #6366f1), transparent 70%)` }} />
            <div className="orb orb-2" style={{ background: `radial-gradient(circle, var(--orb-2-color, #f43f5e), transparent 70%)` }} />
            <div className="orb orb-3" style={{ background: `radial-gradient(circle, var(--orb-3-color, #8b5cf6), transparent 70%)` }} />
        </div>
    );
}
