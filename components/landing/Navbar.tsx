"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { isSignedIn } = useUser();
    const { signOut } = useClerk();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 pointer-events-none">
            <div
                className={`max-w-5xl mx-auto h-16 flex items-center justify-between px-6 transition-all duration-500 pointer-events-auto rounded-2xl border ${scrolled
                    ? "bg-white/90 dark:bg-black/80 backdrop-blur-xl border-gray-200/50 dark:border-white/10 shadow-lg"
                    : "bg-white/50 dark:bg-white/5 backdrop-blur-md border-transparent"
                    }`}
            >
                {/* Logo */}
                <a href="#" className="flex items-center gap-2 group shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M5 3l14 9-14 9V3z"
                                fill="white"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
                        Short<span className="text-violet-600 dark:text-violet-400">IQ</span>
                    </span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {["Features", "How It Works", "Platforms", "Pricing", "Testimonials"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                            className="text-sm text-gray-600 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white transition-colors font-medium whitespace-nowrap"
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* CTAs */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-4">
                        {!isSignedIn ? (
                            <>
                                <Link href="/sign-in" className="text-sm text-gray-600 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white transition-colors font-medium px-2 py-2">
                                    Sign In
                                </Link>
                                <Link href="/sign-up" className="btn-primary text-sm px-5 py-2.5 rounded-xl font-semibold shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/dashboard" className="text-sm text-gray-600 dark:text-white/70 hover:text-indigo-600 dark:hover:text-white transition-colors font-medium px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="text-sm text-gray-400 dark:text-white/50 hover:text-indigo-600 dark:hover:text-white border border-gray-200 dark:border-white/10 px-4 py-2 rounded-xl transition-colors"
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                    </div>

                    <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-white/10 ml-1" />
                    <ThemeToggle />

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-gray-600 dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            {menuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-2 max-w-5xl mx-auto bg-white/95 dark:bg-black/90 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-top-2 duration-300 pointer-events-auto">
                    <div className="flex flex-col gap-4">
                        {["Features", "How It Works", "Platforms", "Pricing", "Testimonials"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                                onClick={() => setMenuOpen(false)}
                                className="text-gray-600 dark:text-white/80 hover:text-indigo-600 dark:hover:text-white text-base font-bold transition-colors py-2"
                            >
                                {item}
                            </a>
                        ))}
                        <div className="h-px bg-gray-100 dark:bg-white/10 my-2" />
                        {!isSignedIn ? (
                            <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="btn-primary text-base px-6 py-3 rounded-xl font-bold text-center w-full shadow-lg">
                                Get Started Free
                            </Link>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMenuOpen(false)}
                                    className="text-gray-900 dark:text-white text-base font-bold py-2"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        signOut({ callbackUrl: "/" });
                                    }}
                                    className="text-gray-500 dark:text-white/50 hover:text-indigo-600 dark:hover:text-white text-base font-medium text-left py-2"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
