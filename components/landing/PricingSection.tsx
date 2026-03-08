"use client";

const plans = [
    {
        name: "Starter",
        price: "₹19",
        period: "/month",
        desc: "Perfect for solo creators just getting started.",
        features: [
            "30 AI videos / month",
            "3 platforms",
            "Basic analytics",
            "720p export",
            "Email scheduling",
            "Community support",
        ],
        highlight: false,
        cta: "Start Free Trial",
    },
    {
        name: "Pro",
        price: "₹49",
        period: "/month",
        desc: "For creators and small teams who publish consistently.",
        features: [
            "150 AI videos / month",
            "All 5 platforms",
            "Advanced analytics",
            "1080p + 4K export",
            "Auto-scheduling AI",
            "Brand kit & watermark",
            "Priority support",
        ],
        highlight: true,
        cta: "Get Pro — Most Popular",
    },
    {
        name: "Business",
        price: "₹129",
        period: "/month",
        desc: "For agencies and brands running at scale.",
        features: [
            "Unlimited AI videos",
            "All 5 platforms + API",
            "Cross-platform analytics",
            "4K + bulk export",
            "Custom AI voice cloning",
            "White-label dashboard",
            "Dedicated account manager",
        ],
        highlight: false,
        cta: "Start Business Trial",
    },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-28 relative">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="section-badge">Pricing</span>
                    <h2 className="section-heading mt-4">Simple, <span className="gradient-text">transparent pricing</span></h2>
                    <p className="section-sub">
                        All plans include a 14-day free trial. No credit card required.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-3xl p-8 border transition-all duration-500 ${plan.highlight
                                ? "bg-gradient-to-b from-rose-50 dark:from-indigo-600/20 to-white dark:to-rose-600/10 border-rose-200 dark:border-rose-500/50 shadow-xl dark:shadow-2xl shadow-rose-500/10 dark:shadow-rose-500/20 scale-105 z-10"
                                : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                } relative`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white text-xs font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1 text-left transition-colors">{plan.name}</h3>
                                <div className="flex items-end gap-1 mb-2">
                                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors">{plan.price}</span>
                                    <span className="text-gray-400 dark:text-white/40 pb-1 transition-colors">{plan.period}</span>
                                </div>
                                <p className="text-gray-600 dark:text-white/60 text-sm text-left transition-colors">{plan.desc}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-gray-700 dark:text-white/80 text-left transition-colors">
                                        <svg className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="#"
                                className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.highlight
                                    ? "btn-primary shadow-lg shadow-rose-500/30 dark:shadow-rose-900/40"
                                    : "border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                                    }`}
                            >
                                {plan.cta}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
