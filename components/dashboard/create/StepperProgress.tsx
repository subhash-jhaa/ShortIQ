"use client";

import { Check } from "lucide-react";

const STEPS = [
    { label: "Niche" },
    { label: "Language & Voice" },
    { label: "Background Music" },
    { label: "Video Style" },
    { label: "Caption Style" },
    { label: "Schedule" },
];

interface StepperProgressProps {
    currentStep: number;
}

export function StepperProgress({ currentStep }: StepperProgressProps) {
    return (
        <div className="w-full py-6 px-2">
            <div className="flex items-center justify-between relative">
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isUpcoming = index > currentStep;

                    return (
                        <div
                            key={step.label}
                            className="flex flex-col items-center relative z-10 flex-1"
                        >
                            {/* Connector line (between circles) */}
                            {index < STEPS.length - 1 && (
                                <div
                                    className="absolute top-[18px] left-[calc(50%+18px)] h-[2px] transition-all duration-500 ease-out"
                                    style={{
                                        width: "calc(100% - 36px)",
                                        background: isCompleted
                                            ? "linear-gradient(90deg, #6366f1, #818cf8)"
                                            : "rgba(255,255,255,0.08)",
                                    }}
                                />
                            )}

                            {/* Circle */}
                            <div
                                className={`
                                    relative w-9 h-9 rounded-full flex items-center justify-center
                                    text-sm font-bold transition-all duration-300 border-2
                                    ${isCompleted
                                        ? "bg-indigo-500 border-indigo-500 text-white shadow-[0_0_16px_rgba(99,102,241,0.45)]"
                                        : isActive
                                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.35)]"
                                            : "bg-white/5 border-white/10 text-white/30"
                                    }
                                `}
                            >
                                {isCompleted ? (
                                    <Check size={16} strokeWidth={3} />
                                ) : (
                                    <span>{index + 1}</span>
                                )}

                                {/* Active ring pulse */}
                                {isActive && (
                                    <span className="absolute inset-0 rounded-full border-2 border-indigo-400/40 animate-ping" />
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`
                                    mt-2.5 text-xs font-medium tracking-wide whitespace-nowrap
                                    transition-colors duration-300
                                    ${isCompleted
                                        ? "text-indigo-400"
                                        : isActive
                                            ? "text-white"
                                            : "text-white/25"
                                    }
                                `}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
