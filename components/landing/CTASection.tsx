"use client";

export default function CTASection() {
    return (
        <section className="py-28 relative">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="relative rounded-3xl overflow-hidden border border-rose-500/30 bg-gradient-to-br from-indigo-900/40 via-rose-900/20 to-black p-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-rose-600/5 pointer-events-none" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

                    <span className="section-badge mb-6 block w-fit mx-auto">Get Started Today</span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Your content empire<br />starts <span className="gradient-text">right now</span>
                    </h2>
                    <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
                        Join 50,000+ creators and brands generating viral short videos with AI. Free 14-day trial. No credit card needed.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#"
                            className="btn-primary px-10 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-rose-500/40"
                        >
                            🚀 Start Free — No Card Required
                        </a>
                        <a
                            href="#"
                            className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                        >
                            See all features →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
