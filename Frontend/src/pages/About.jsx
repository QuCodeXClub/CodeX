import React, { useEffect, memo } from "react";
import { useLocation } from "react-router-dom";
import AboutHero from "../features/about/components/AboutHero";
import AboutFlagshipEvents from "../features/about/components/AboutFlagshipEvents";
import AboutCulture from "../features/about/components/AboutCulture";
import AboutCTA from "../features/about/components/AboutCTA";

const About = () => {
  const location = useLocation();

  // Scroll smoothly to the target section (e.g. #events, #community, #hero)
  useEffect(() => {
    const rawTarget =
      location.state?.scrollTo ||
      (location.hash ? location.hash.replace("#", "") : null);

    if (rawTarget) {
      const targetId = rawTarget.toLowerCase();

      const scrollToTarget = () => {
        if (targetId === "hero" || targetId === "about") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return true;
        }

        const el = document.getElementById(targetId);
        if (el) {
          const navbarOffset = window.innerWidth < 768 ? 64 : 80;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = Math.max(0, Math.floor(elementPosition - navbarOffset));

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          return true;
        }
        return false;
      };

      if (!scrollToTarget()) {
        const timer = setTimeout(scrollToTarget, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.hash, location.state]);

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

export default memo(About);
