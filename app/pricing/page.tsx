"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Check, Zap, Rocket, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for getting started",
        features: [
            "3 AI Videos per month",
            "Standard Voiceovers",
            "Auto-scheduling to 1 platform",
            "720p Resolution"
        ],
        cta: "Get Started",
        icon: <Zap className="text-emerald-400" size={24} />,
        popular: false
    },
    {
        name: "Pro",
        price: "$19",
        description: "Best for content creators",
        features: [
            "20 AI Videos per month",
            "Premium AI Voices",
            "Auto-scheduling to all platforms",
            "1080p Resolution",
            "No Watermark"
        ],
        cta: "Upgrade to Pro",
        icon: <Rocket className="text-indigo-400" size={24} />,
        popular: true
    },
    {
        name: "Business",
        price: "$49",
        description: "For agencies and brands",
        features: [
            "Unlimited AI Videos",
            "Custom Voice Cloning",
            "Multi-account management",
            "Priority Rendering",
            "Dedicated Support"
        ],
        cta: "Go Unlimited",
        icon: <Crown className="text-amber-400" size={24} />,
        popular: false
    }
];

export default function PricingPage() {
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const router = useRouter();

    const handleSubscribe = async (planName: string) => {
        if (!user) {
            router.push("/sign-up");
            return;
        }

        // In Clerk Billing, you typically redirect to the billing portal or trigger a checkout
        // For this demo, we'll open the Clerk User Profile's billing section
        // Note: You must enable Clerk Billing in the Dashboard first.
        openUserProfile();
    };

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                    Simple, Transparent <span className="text-indigo-500">Pricing</span>
                </h1>
                <p className="text-xl text-white/40 max-w-2xl mx-auto">
                    Choose the plan that fits your content strategy and start generating viral shorts today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative p-8 rounded-[40px] border transition-all hover:scale-[1.02] flex flex-col ${plan.popular
                                ? "bg-indigo-500/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/10"
                                : "bg-white/5 border-white/10"
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                                {plan.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-black">{plan.price}</span>
                                <span className="text-white/40">/month</span>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {plan.description}
                            </p>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-sm text-white/80">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <Check className="text-emerald-400" size={12} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            onClick={() => handleSubscribe(plan.name)}
                            className={`w-full h-14 rounded-2xl font-black text-base shadow-lg transition-all active:scale-95 ${plan.popular
                                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                                    : "bg-white text-black hover:bg-slate-100"
                                }`}
                        >
                            {plan.cta}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center text-white/20 text-sm">
                <p>All plans include a 7-day money-back guarantee. No questions asked.</p>
            </div>
        </div>
    );
}
