"use client";

import { useState } from "react";
import FloatingOrbs from "@/components/landing/FloatingOrbs";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PlatformsSection from "@/components/landing/PlatformsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import ThemeSwitcher from "@/components/landing/ThemeSwitcher";

export default function Home() {
  const [theme, setTheme] = useState("midnight-sunset");

  return (
    <div className={`shortiq-root theme-${theme}`}>
      <FloatingOrbs theme={theme} />
      <Navbar />
      <main>
        <HeroSection />
        <PlatformsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <ThemeSwitcher current={theme} onChange={setTheme} />
    </div>
  );
}
