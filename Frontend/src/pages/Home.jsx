import React, { lazy, Suspense } from "react";
import HeroSection from "../features/landing/components/HeroSection";

// Lazy load below-the-fold sections to improve initial load time
const MissionSection = lazy(() => import("../features/landing/components/MissionSection"));
const PartnerSection = lazy(() => import("../features/landing/components/PartnerSection"));
const FaqSection = lazy(() => import("../features/landing/components/FaqSection"));
const ContactSection = lazy(() => import("../features/landing/components/ContactSection"));
const Domains = lazy(() => import("../features/landing/components/Domains"));
const EventHero = lazy(() => import("../features/landing/components/EventsHero"));


const Home = () => {
  
  return (
    <div className="flex flex-col min-h-screen bg-bg relative transition-colors duration-300">
      {/* Global Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 transform-gpu"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      
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
