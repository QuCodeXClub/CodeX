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
    <section className="relative overflow-hidden py-8 lg:py-16 flex flex-col justify-center" id="domains">
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
      
      {/* Background glow blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[30%] h-[50%] bg-[radial-gradient(circle_at_left,var(--tw-gradient-stops))] from-accent/10 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-[20%] right-0 w-[40%] h-[40%] bg-[radial-gradient(circle_at_right,var(--tw-gradient-stops))] from-accent/5 to-transparent blur-3xl pointer-events-none -z-10"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12 text-center relative">
          <h2 className="font-sans text-[clamp(3.5rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-text to-text/70">
            <span className="transition-colors duration-300">{domains.titlePart1}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70 drop-shadow-[0_0_20px_rgba(46,197,212,0.4)] ml-4">{domains.titlePart2}</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6 pt-2">
            <div className="w-16 h-[2px] bg-gradient-to-l from-accent/50 to-transparent"></div>
            <span className="text-accent text-sm font-bold tracking-[0.2em] italic">///</span>
            <div className="w-16 h-[2px] bg-gradient-to-r from-accent/50 to-transparent"></div>
          </div>
          <p className="text-text-muted transition-colors duration-300 font-mono text-[0.95rem] leading-[1.6] max-w-2xl mx-auto">{domains.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
          {domains.list.map((domain, index) => {
            const Icon = iconMap[domain.title] || Globe;
            const formattedTitle = formatTitle(domain.title);
            return (
              <article key={domain.title || index} className="group relative flex flex-col justify-between p-6 xl:p-8 bg-card/40 backdrop-blur-xl transition-all duration-500 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-border-soft hover:border-accent/50 hover:shadow-[0_15px_40px_rgba(46,197,212,0.15)] hover:-translate-y-2 overflow-hidden">
                {/* Glow layer inside card */}
                <div className="absolute -inset-1 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>
                
                <svg className="absolute top-6 right-6 w-12 h-12 text-accent/10 transition-all duration-500 group-hover:text-accent/30 group-hover:scale-110 group-hover:rotate-12" viewBox="0 0 40 40" fill="currentColor">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <circle key={i} cx={(i % 4) * 8 + 4} cy={Math.floor(i / 4) * 8 + 4} r="1.2" />
                  ))}
                </svg>
                <div className="flex-1 relative z-10">
                  <p className="m-0 text-accent text-[0.7rem] tracking-[0.25em] font-bold font-mono mb-5 uppercase">DOMAIN_{String(index + 1).padStart(2, '0')}</p>
                  <div className="relative w-14 h-14 mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-accent/20 border border-accent shadow-[0_0_15px_rgba(46,197,212,0.3)] group-hover:shadow-[0_0_25px_rgba(46,197,212,0.6)] transition-all duration-500 group-hover:rotate-180" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                    <div className="absolute inset-[2px] bg-card/80 backdrop-blur-md transition-colors duration-300" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                    <div className="absolute inset-[4px] bg-gradient-to-br from-accent to-[#1a9fb0] shadow-[0_0_10px_rgba(46,197,212,0.5)] group-hover:shadow-[0_0_20px_rgba(46,197,212,0.8)] transition-all duration-500 group-hover:scale-90" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                    <Icon className="relative z-10 text-bg group-hover:scale-110 transition-transform duration-500" size={18} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-sans text-[1.2rem] xl:text-[1.3rem] leading-[1.3] font-bold text-text transition-colors duration-300 mb-3 tracking-tight">{domain.title}</h3>
                  <p className="text-text-muted transition-colors duration-300 text-[0.85rem] font-mono leading-[1.6] line-clamp-3">{domain.description}</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 relative z-10 border-t border-border-soft group-hover:border-accent/30 transition-colors duration-500">
                  <div className="w-8 h-[2px] bg-accent shadow-[0_0_5px_rgba(46,197,212,0.5)] group-hover:w-12 transition-all duration-500"></div>
                  <ArrowRight size={20} className="text-accent opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
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
