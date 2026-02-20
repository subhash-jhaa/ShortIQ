"use client";

const features = [
    {
        icon: "🤖",
        title: "AI Script & Video Generation",
        desc: "Describe your idea in plain English and watch ShortIQ transform it into a fully produced short video with voiceover, captions, and stock footage — in minutes.",
        color: "indigo",
    },
    {
        icon: "📅",
        title: "Smart Auto-Scheduling",
        desc: "Our AI analyses your audience's behaviour and schedules your content at peak engagement times for maximum reach on every platform.",
        color: "rose",
    },
    {
        icon: "🎨",
        title: "Brand Customisation",
        desc: "Add your logo, brand colours, custom fonts and watermarks. Maintain a consistent identity across all your video content automatically.",
        color: "indigo",
    },
    {
        icon: "📊",
        title: "Cross-Platform Analytics",
        desc: "Unified dashboard showing views, watch time, engagement, and conversions across YouTube, Instagram, TikTok, Facebook, and email — all in one place.",
        color: "rose",
    },
    {
        icon: "🌐",
        title: "Auto-Translate & Dub",
        desc: "Expand your reach globally. ShortIQ auto-translates scripts and dubs voiceovers into 50+ languages with natural-sounding AI voices.",
        color: "indigo",
    },
    {
        icon: "⚡",
        title: "Bulk Video Generation",
        desc: "Create tens or hundreds of unique variations of your video for A/B testing, repurposing, or rolling out entire campaign series at once.",
        color: "rose",
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-28 relative">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="font-bold tracking-tight">ShortIQ.ai</span>
                    <h2 className="section-heading mt-4">Everything you need to <span className="gradient-text">go viral</span></h2>
                    <p className="section-sub">
                        A complete AI-powered video creation and distribution suite built for modern content creators and brands.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f) => (
                        <div key={f.title} className="glass-card group hover:border-rose-500/30 transition-all duration-300">
                            <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform text-left">{f.icon}</span>
                            <h3 className="text-white font-bold mb-3 text-left">{f.title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed text-left">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
