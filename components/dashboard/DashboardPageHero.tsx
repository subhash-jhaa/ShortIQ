import React from "react";

interface DashboardPageHeroProps {
    icon: React.ReactNode;
    badgeText: string;
    titleFirst: string;
    titleHighlight: string;
    description: string;
    highlightClassName?: string;
    action?: React.ReactNode;
}

export function DashboardPageHero({
    icon,
    badgeText,
    titleFirst,
    titleHighlight,
    description,
    highlightClassName = "text-primary",
    action
}: DashboardPageHeroProps) {
    return (
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-[#0d0d14] border border-gray-200 dark:border-white/10 p-6 sm:p-10 md:p-14 shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent blur-3xl rounded-full -mr-40 -mt-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary font-medium text-xs sm:text-sm mb-4 sm:mb-6 border border-primary/20">
                        {icon}
                        {badgeText}
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 sm:mb-4">
                        {titleFirst} <br />
                        <span className={highlightClassName}>
                            {titleHighlight}
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-white/60 leading-relaxed">
                        {description}
                    </p>
                </div>

                {action && (
                    <div className="w-full md:w-auto shrink-0">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
