import React from "react";
import HeroSection from "../features/landing/components/HeroSection";
import MissionSection from "../features/landing/components/MissionSection";
import CommitSection from "../features/landing/components/CommitSection";
import PartnerSection from "../features/landing/components/PartnerSection";
import FaqSection from "../features/landing/components/FaqSection";
import ContactSection from "../features/landing/components/ContactSection";
import Domains from "../features/landing/components/Domains";
import EventHero from "../features/landing/components/EventsHero";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-bg relative transition-colors duration-300">
      {/* Global Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      
      {/* Sections */}
      <div className="relative z-10">
        <HeroSection />
        <MissionSection />
        <EventHero />
        <Domains />
        <CommitSection />
        <PartnerSection />
        <FaqSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default Home;
