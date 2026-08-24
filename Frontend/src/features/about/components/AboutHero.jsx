import React, { memo } from "react";
import contentData from "../../../data/content.json";

const heroData = contentData?.about?.hero;

/**
 * AboutHero Component
 * 
 * Renders the top hero section of the About page showcasing CodeX's motto,
 * glowing badge, dynamic title styling, and concise mission statement.
 */
const AboutHero = () => {
  if (!heroData) return null;

  return (
    <section
      id="hero"
      aria-label="About Hero Section"
      className="relative flex flex-col items-center justify-center overflow-hidden pt-12 md:pt-20 pb-8 md:pb-12 px-4 sm:px-6 lg:px-16 mt-4 md:mt-8"
    >
      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Title */}
        <div className="relative mb-6 md:mb-8">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-32 bg-accent/15 blur-3xl rounded-full pointer-events-none" />

          <span className="block text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-sm relative z-10">
            {heroData.eyebrow || "ABOUT CODEX CLUB"}
          </span>

          <h1 className="relative z-10 font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-tight md:leading-[0.95] text-text uppercase flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-5">
            <span className="tracking-widest text-text drop-shadow-sm">
              {heroData.titlePart1 || "CODING THE"}
            </span>
            <span className="relative inline-flex items-center justify-center px-4 sm:px-6 lg:px-7 py-1 sm:py-2 rounded-2xl bg-accent/10 border-2 border-accent text-accent shadow-[0_0_35px_var(--color-accent-glow)] transform -skew-x-6 hover:skew-x-0 hover:scale-105 transition-all duration-300 group cursor-default">
              <span className="relative z-10 text-accent font-black tracking-normal drop-shadow-md">
                {heroData.titlePart2 || "FUTURE,"}
              </span>
              <span className="absolute inset-0 rounded-2xl bg-accent/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </span>
            <span className="tracking-widest text-text drop-shadow-sm">
              {heroData.titlePart3 || "TODAY."}
            </span>
          </h1>
        </div>

        {/* Description */}
        <p className="text-text-muted font-sans text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl px-2">
          {heroData.description}
        </p>
      </div>
    </section>
  );
};

AboutHero.displayName = "AboutHero";

export default memo(AboutHero);
