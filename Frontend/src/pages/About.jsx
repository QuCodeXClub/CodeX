import React from "react";
import AboutHero from "../features/about/components/AboutHero";
import AboutFlagshipEvents from "../features/about/components/AboutFlagshipEvents";
import AboutCulture from "../features/about/components/AboutCulture";
import AboutCTA from "../features/about/components/AboutCTA";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen relative font-sans">
      <div className="relative z-10">
        <AboutHero />
        <AboutFlagshipEvents />
        <AboutCulture />
        <AboutCTA />
      </div>
    </div>
  );
};

export default About;
