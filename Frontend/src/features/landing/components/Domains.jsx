import React from "react";
import contentData from "../../../data/content.json";
import {
  Globe,
  BrainCircuit,
  Code,
  Cloud,
  Shield,
  Smartphone,
  GitBranch,
  ArrowRight,
  Paintbrush
} from "lucide-react";

const iconMap = {
  "Web Development": Globe,
  "AI & ML": BrainCircuit,
  "Competitive Programming": Code,
  "Cloud Computing": Cloud,
  "Cyber Security": Shield,
  "UI/UX": Paintbrush,
  "App Development": Smartphone,
  "Open Source": GitBranch
};

const Domains = () => {
  const { domains } = contentData?.landing || {};
  if (!domains || !domains.list) return null;

  return (
    <section className="relative overflow-hidden py-16 lg:py-24" id="domains">
      {/* Background glow blobs to match theme */}
      <div className="absolute top-0 right-0 w-[50%] md:w-[40%] h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/15 via-bg to-transparent pointer-events-none z-0 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[400px] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 to-transparent pointer-events-none z-0 blur-3xl"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-[2px] bg-accent"></div>
            <p className="m-0 text-accent text-xs md:text-sm font-mono font-bold tracking-[0.25em] uppercase">
              // SPECIALIZED TECHNICAL TRACKS
            </p>
            <div className="w-6 h-[2px] bg-accent"></div>
          </div>
          <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-text uppercase tracking-tight leading-[1.1] mb-4">
            {domains.titlePart1}{" "}
            <span className="text-accent">
              {domains.titlePart2}
            </span>
          </h2>
          <p className="text-text-muted font-mono text-sm md:text-base leading-[1.8] max-w-2xl mx-auto">
            {domains.description}
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {domains.list.map((domain, index) => {
            const Icon = iconMap[domain.title] || Globe;
            return (
              <article
                key={domain.title || index}
                className="group flex flex-col p-5 lg:p-6 bg-card/40 backdrop-blur-xl transition-all duration-500 rounded-2xl shadow-sm border border-border-soft hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(46,197,212,0.15)] relative overflow-hidden cursor-pointer"
              >
                {/* Internal glow */}
                <div className="absolute -inset-1 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>

                <div className="absolute top-0 right-0 p-4 text-[0.65rem] font-mono tracking-[0.2em] font-semibold text-accent/40 group-hover:text-accent transition-colors z-10">
                  TRACK 0{index + 1}
                </div>

                {/* Top Row: Hexagon Icon & Title */}
                <div className="flex items-center gap-4 mb-4 mt-2 relative z-10">
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    {/* Outer Hexagon */}
                    <div 
                      className="absolute inset-0 bg-accent/15 border border-accent/30 shadow-[0_0_10px_rgba(46,197,212,0.1)] group-hover:shadow-[0_0_20px_rgba(46,197,212,0.3)] transition-transform duration-700 ease-in-out group-hover:rotate-180" 
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    ></div>
                    {/* Inner Hexagon Background */}
                    <div 
                      className="absolute inset-[2px] bg-card/90 backdrop-blur-md transition-colors duration-300" 
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    ></div>
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 text-accent transition-transform duration-500 group-hover:scale-110 drop-shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <h3 className="font-sans text-lg lg:text-xl font-bold tracking-widest text-text transition-colors duration-300 uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-text group-hover:to-accent">
                    {domain.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="flex-1 flex flex-col relative z-10">
                  <p className="font-mono text-text-muted transition-colors duration-300 text-[0.8rem] leading-[1.6] mb-4">
                    {domain.description}
                  </p>
                </div>

                
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Domains;