import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShortIQ — AI Short Video Generator & Scheduler",
  description:
    "ShortIQ uses cutting-edge AI to create stunning short-form videos and automatically schedules them across YouTube, Instagram, TikTok, Facebook, and email. Start for free.",
  keywords: [
    "AI video generator",
    "short video scheduler",
    "YouTube Shorts automation",
    "Instagram Reels AI",
    "TikTok video creator",
    "social media scheduler",
    "SaaS video tool",
  ],
  openGraph: {
    title: "ShortIQ — AI Short Video Generator & Scheduler",
    description:
      "Generate and auto-schedule AI short videos for YouTube, Instagram, TikTok, Facebook, and email — all from one powerful dashboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
