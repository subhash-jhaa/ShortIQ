"use client";

import { useState, useEffect } from "react";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2 group">
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
                    <span className="text-xl font-bold text-white tracking-tight">
                        Short<span className="text-violet-400">IQ</span>
                    </span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {["Features", "How It Works", "Platforms", "Pricing", "Testimonials"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                            className="text-sm text-white/70 hover:text-white transition-colors font-medium"
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* CTAs */}
                <div className="hidden md:flex items-center gap-3">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm text-white/70 hover:text-white transition-colors font-medium px-4 py-2">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="btn-primary text-sm px-5 py-2.5 rounded-xl font-semibold">
                                Start Free Trial
                            </button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <a
                            href="/dashboard"
                            className="text-sm text-white/70 hover:text-white transition-colors font-medium px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5"
                        >
                            Dashboard
                        </a>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-9 h-9 border border-white/10"
                                }
                            }}
                        />
                    </SignedIn>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white p-2"
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

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex flex-col gap-4">
                    {["Features", "How It Works", "Platforms", "Pricing", "Testimonials"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                            onClick={() => setMenuOpen(false)}
                            className="text-white/80 hover:text-white text-sm font-medium"
                        >
                            {item}
                        </a>
                    ))}
                    <SignedOut>
                        <SignUpButton mode="modal">
                            <button className="btn-primary text-sm px-5 py-2.5 rounded-xl font-semibold text-center w-full">
                                Start Free Trial
                            </button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="flex flex-col gap-3">
                            <a
                                href="/dashboard"
                                className="text-white/80 hover:text-white text-sm font-medium px-2"
                            >
                                Dashboard
                            </a>
                            <div className="flex items-center gap-3 px-2 py-1">
                                <UserButton afterSignOutUrl="/" />
                                <span className="text-sm text-white/80 font-medium">My Account</span>
                            </div>
                        </div>
                    </SignedIn>
                </div>
            )}
        </header>
    );
}
