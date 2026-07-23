import React from "react";
import contentData from "../../../data/content.json";
import {
  Globe,
  BrainCircuit,
  Code,
  Cloud,
  Shield,
  Layout,
  Smartphone,
  GitBranch,
  ArrowRight,
  PaintBucket,
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

const formatTitle = (title) => {
  return title;
};
const Domains = () => {
  const { domains } = contentData?.landing || {};
  if (!domains || !domains.list) return null;
  return (
    <section className="bg-bg transition-colors duration-300 relative overflow-hidden py-10 lg:py-12 flex flex-col justify-center min-h-screen border-b border-border" id="domains">
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-30 dark:opacity-40">
        <svg className="w-full h-full text-accent" viewBox="0 0 1200 800" fill="none">
          <path d="M 0 200 L 300 200 L 400 300 L 1200 300" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M 0 600 L 200 600 L 300 500 L 1200 500" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M 800 0 L 800 150 L 900 250 L 900 800" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <path d="M 200 0 L 200 300 L 100 400 L 100 800" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx="300" cy="200" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="400" cy="300" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="200" cy="600" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="300" cy="500" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="800" cy="150" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="900" cy="250" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="200" cy="300" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="100" cy="400" r="3" fill="currentColor" opacity="0.5" />
          <polygon points="150,100 160,105 160,115 150,120 140,115 140,105" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
          <polygon points="1050,600 1060,605 1060,615 1050,620 1040,615 1040,605" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
        </svg>
      </div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-10 text-center relative">
          <h2 className="font-sans text-[clamp(3.5rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tight text-reflect mb-6">
            <span className="text-text transition-colors duration-300">{domains.titlePart1}</span>
            <span className="text-accent drop-shadow-[0_0_15px_rgba(46,197,212,0.3)] dark:drop-shadow-[0_0_20px_rgba(46,197,212,0.5)]">{domains.titlePart2}</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6 pt-2">
            <div className="w-16 h-[2px] bg-gradient-to-l from-accent/50 to-transparent"></div>
            <span className="text-accent text-sm font-bold tracking-[0.2em] italic">///</span>
            <div className="w-16 h-[2px] bg-gradient-to-r from-accent/50 to-transparent"></div>
          </div>
          <p className="text-text-muted transition-colors duration-300 font-mono text-[0.9rem] leading-[1.6] max-w-2xl mx-auto">{domains.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
          {domains.list.map((domain, index) => {
            const Icon = iconMap[domain.title] || Globe;
            const formattedTitle = formatTitle(domain.title);
            return (
              <article key={domain.title || index} className="group relative flex flex-col justify-between p-5 xl:p-6 bg-card transition-colors duration-300 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-border hover:border-accent/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <svg className="absolute top-5 right-5 w-10 h-10 text-accent/20 transition-colors duration-300 group-hover:text-accent/50" viewBox="0 0 40 40" fill="currentColor">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <circle key={i} cx={(i % 4) * 8 + 4} cy={Math.floor(i / 4) * 8 + 4} r="1.2" />
                  ))}
                </svg>
                <div className="flex-1">
                  <p className="m-0 text-accent text-[0.65rem] tracking-[0.2em] font-bold font-mono mb-4 uppercase">DOMAIN_{String(index + 1).padStart(2, '0')}</p>
                  <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 bg-accent/20 border border-accent shadow-[0_0_15px_rgba(46,197,212,0.3)] group-hover:shadow-[0_0_25px_rgba(46,197,212,0.6)] transition-all duration-300" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                    <div className="absolute inset-[3px] bg-card transition-colors duration-300" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                    <div className="absolute inset-[5px] bg-gradient-to-br from-accent to-[#1a9fb0] shadow-[0_0_10px_rgba(46,197,212,0.5)]" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                    <Icon className="relative z-10 text-bg" size={16} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-sans text-[1.1rem] xl:text-[1.25rem] leading-[1.3] font-bold text-text transition-colors duration-300 mb-2 tracking-tight line-clamp-2">{domain.title}</h3>
                  <p className="text-text-muted transition-colors duration-300 text-[0.75rem] font-mono leading-[1.5]">{domain.description}</p>
                </div>
                <div className="flex items-center justify-between mt-5 pt-2 relative">
                  <div className="w-6 h-[2px] bg-accent shadow-[0_0_5px_rgba(46,197,212,0.5)]"></div>
                  <ArrowRight size={20} className="text-accent opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
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
