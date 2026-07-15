import React from "react";
import HeroSection from "../features/landing/components/HeroSection";
import MissionSection from "../features/landing/components/MissionSection";
import WhyJoin from "../features/landing/components/WhyJoin";
import CommitSection from "../features/landing/components/CommitSection";
import PartnerSection from "../features/landing/components/PartnerSection";
import ContactSection from "../features/landing/components/ContactSection";
import GradientPulse from "../features/landing/components/GradientPulse";
import Domains from "../features/landing/components/Domains";

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <MissionSection />
      <WhyJoin />
      <Domains />
      <CommitSection />
      <PartnerSection />
      <ContactSection />
      <GradientPulse />
    </div>
  );
};

export default Home;
