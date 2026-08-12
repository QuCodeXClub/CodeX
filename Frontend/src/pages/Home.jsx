import React, { Suspense } from "react";
import HeroSection from "../features/landing/components/HeroSection";
import lazyWithRetry from "../utils/lazyWithRetry";

// Lazy load below-the-fold sections to improve initial load time with auto-retry on build updates
const MissionSection = lazyWithRetry(() => import("../features/landing/components/MissionSection"));
const PartnerSection = lazyWithRetry(() => import("../features/landing/components/PartnerSection"));
const FaqSection = lazyWithRetry(() => import("../features/landing/components/FaqSection"));
const ContactSection = lazyWithRetry(() => import("../features/landing/components/ContactSection"));
const Domains = lazyWithRetry(() => import("../features/landing/components/Domains"));
const EventHero = lazyWithRetry(() => import("../features/landing/components/EventsHero"));


const Home = () => {
  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      {/* Sections */}
      <div className="relative z-10">
        <HeroSection />
        
        <Suspense fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div>
          </div>
        }>
          <MissionSection />
          <EventHero />
          <Domains />
          <PartnerSection />
          <FaqSection />
          <ContactSection />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
