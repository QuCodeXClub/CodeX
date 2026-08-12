import React from "react";
import contentData from "../../../data/content.json";
import { ASSETS } from "../../../config/assets";
import { ArrowRight } from "lucide-react";

const MissionSection = () => {
  const { mission } = contentData.landing;
  const formatHeadline = (text) => {
    const highlightTarget = "thriving community";
    if (text.includes(highlightTarget)) {
      const parts = text.split(highlightTarget);
      return (
        <>
          {parts[0]}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70 drop-shadow-[0_0_15px_rgba(46,197,212,0.4)]">
            {highlightTarget}
          </span>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <section id="vision" className="relative overflow-hidden py-12 lg:py-20 px-4 lg:px-8 flex items-center justify-center">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10"></div>
      
      <div className="relative w-full max-w-[1300px] mx-auto group">
        
        {/* Glow Layer */}
        <div className="absolute -inset-1 bg-gradient-to-br from-accent/30 via-transparent to-accent/10 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>

        <div className="relative bg-card/60 backdrop-blur-2xl border border-border-soft rounded-[3rem] p-8 py-16 lg:p-20 flex flex-col lg:flex-row gap-16 lg:gap-12 items-center shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] overflow-hidden">
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-bl-[150px] -z-10 transition-transform duration-700 group-hover:scale-125"></div>
          
          {/* Left Content */}
          <div className="flex-1 lg:max-w-[55%] relative z-20 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-accent"></div>
              <p className="m-0 text-accent text-xs md:text-sm font-mono font-bold tracking-[0.25em] uppercase">
                // {mission.eyebrow?.replace(/^\/\/\s*/, '') || "OUR VISION"}
              </p>
            </div>
            
            <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight leading-[1.1] mb-8 text-text transition-colors duration-300">
              {formatHeadline(mission.headline)}
            </h2>
            
            <div className="w-16 h-[2px] bg-accent/80 mb-8 shadow-[0_0_10px_rgba(46,197,212,0.6)]"></div>
            
            <p className="text-text-muted transition-colors duration-300 leading-[1.8] text-sm md:text-base font-mono mb-12 lg:pr-10">
              {mission.description}
            </p>
          </div>
          
          {/* Right SVG Graphic */}
          <div className="flex-1 flex justify-center items-center relative w-full h-[400px] lg:h-[500px]">
             {/* Rotating Background SVG */}
             <div className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite] pointer-events-none">
               <svg className="w-full h-full text-accent/30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="250" cy="250" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 12" opacity="0.4" />
                  <circle cx="250" cy="250" r="140" stroke="currentColor" strokeWidth="1" opacity="0.15" />
                  <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="1" opacity="0.08" />
                  
                  {/* Decorative Elements */}
                  <circle cx="350" cy="220" r="4" fill="var(--color-accent)" opacity="0.8" className="animate-pulse" />
                  <circle cx="160" cy="280" r="2" fill="var(--color-accent)" opacity="0.8" />
                  <circle cx="280" cy="380" r="3" fill="var(--color-accent)" opacity="0.8" className="animate-pulse" />
                  <circle cx="120" cy="200" r="2" fill="currentColor" opacity="0.5" />
                  <circle cx="380" cy="300" r="2" fill="currentColor" opacity="0.5" />
               </svg>
             </div>
             
             {/* Static Tech Paths */}
             <div className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
               <svg className="w-full h-full text-accent/40" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 50 150 L 120 150 L 180 210" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="50" cy="150" r="4" fill="var(--color-accent)" />
                  <circle cx="120" cy="150" r="2" fill="currentColor" />
                  
                  <path d="M 450 120 L 380 120 L 320 180" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="450" cy="120" r="5" fill="var(--color-accent)" />
                  
                  <path d="M 80 400 L 150 400 L 210 340" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="80" cy="400" r="4" fill="var(--color-accent)" />
                  
                  <path d="M 420 380 L 350 380 L 290 320" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="420" cy="380" r="3" fill="var(--color-accent)" />
                  
                  <path d="M 250 50 L 250 120" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M 250 450 L 250 380" stroke="currentColor" strokeWidth="1.5" />
                  
                  <polygon points="400,200 420,210 420,230 400,240 380,230 380,210" stroke="currentColor" strokeWidth="1" fill="transparent" />
                  <polygon points="120,300 135,308 135,322 120,330 105,322 105,308" stroke="currentColor" strokeWidth="1" fill="transparent" />
               </svg>
             </div>

             {/* Central Logo */}
             <div className="relative z-10 w-[220px] h-[260px] lg:w-[280px] lg:h-[320px] flex items-center justify-center [filter:drop-shadow(0_0_30px_rgba(46,197,212,0.4))] animate-[pulse_4s_ease-in-out_infinite]">
                  <img src={ASSETS.IMAGES.CODEX_LOGO_ICON} alt="CX Logo" className="w-full h-full object-contain opacity-90 transition-transform duration-700 hover:scale-105" loading="lazy" decoding="async" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
