import React from "react";
import { ChevronRight } from "lucide-react";

export interface TabItem {
    id: string;
    name: string;
    icon: React.ReactNode;
    href?: string;
}

interface TabbedPageLayoutProps {
    tabs: TabItem[];
    activeTab: string;
    onTabClick: (tab: TabItem) => void;
    sidebarTitle: string;
    sidebarExtra?: React.ReactNode;
    children: React.ReactNode;
}

export function TabbedPageLayout({
    tabs,
    activeTab,
    onTabClick,
    sidebarTitle,
    sidebarExtra,
    children
}: TabbedPageLayoutProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-3 space-y-2">
                <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2 sm:mb-4 px-3">
                    {sidebarTitle}
                </h3>
                <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 custom-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabClick(tab)}
                            className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap md:whitespace-normal ${
                                activeTab === tab.id
                                    ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                                    : "text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-transparent"
                            }`}
                        >
                            <span className={activeTab === tab.id ? "text-primary" : "text-gray-400 dark:text-white/40"}>
                                {tab.icon}
                            </span>
                            {tab.name}
                            {activeTab === tab.id && (
                                <ChevronRight size={16} className="hidden md:block ml-auto opacity-50" />
                            )}
                        </button>
                    ))}
                </div>

                {sidebarExtra}
            </div>

            {/* Content Area */}
            <div className="md:col-span-9">
                <div className="bg-white dark:bg-[#0d0d14] rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 md:p-10 shadow-sm dark:shadow-none min-h-[400px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
