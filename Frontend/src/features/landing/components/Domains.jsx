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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header matching Admin styling */}
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

        {/* Domains Grid matching Admin cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.list.map((domain, index) => {
            const Icon = iconMap[domain.title] || Globe;
            return (
              <article
                key={domain.title || index}
                className="bg-card rounded-2xl p-6 text-text border border-border shadow-sm hover:shadow-md hover:border-accent/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 text-xs font-semibold text-accent/50 group-hover:text-accent transition-colors">
                  TRACK 0{index + 1}
                </div>

                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-5 group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-xl text-text tracking-wide mb-2 group-hover:text-accent transition-colors">
                    {domain.title}
                  </h3>
                  
                  <p className="text-text-muted font-sans text-xs leading-relaxed line-clamp-3">
                    {domain.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                    EXPLORE
                  </span>
                  <ArrowRight className="w-4 h-4 text-accent transform group-hover:translate-x-1 transition-transform" />
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
