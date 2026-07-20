import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import contentData from "../../../data/content.json";

const MissionSection = () => {
  const { mission } = contentData.landing;
  const formatHeadline = (text) => {
    const highlightTarget = "thriving community";
    if (text.includes(highlightTarget)) {
      const parts = text.split(highlightTarget);
      return (
        <>
          {parts[0]}
          <span className="text-accent drop-shadow-[0_0_15px_rgba(46,197,212,0.4)]">{highlightTarget}</span>
          {parts[1]}
        </>
      );
    }
    return text;
  };
  return (
    <section id="vision" className="bg-bg transition-colors duration-300 relative overflow-hidden py-16 lg:py-24 px-4 lg:px-8 min-h-[800px] flex items-center justify-center">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="relative w-full max-w-[1300px] mx-auto p-[2px] rounded-lg">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-accent/70 via-bg to-accent/70 opacity-80 transition-colors duration-300"
          style={{ clipPath: "polygon(60px 0, 100% 0, 100% calc(100% - 60px), calc(100% - 60px) 100%, 0 100%, 0 60px)" }}
        ></div>
        <div 
          className="relative z-10 bg-card transition-colors duration-300 w-full h-full p-8 py-16 lg:p-20 flex flex-col lg:flex-row gap-16 lg:gap-8 items-center"
          style={{ clipPath: "polygon(60px 0, 100% 0, 100% calc(100% - 60px), calc(100% - 60px) 100%, 0 100%, 0 60px) " }}
        >
            <div className="flex-1 lg:max-w-[55%] relative z-20">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-accent text-[0.75rem] tracking-[0.34em] uppercase font-bold">{mission.eyebrow}</span>
              <div className="h-[2px] w-12 bg-accent shadow-[0_0_8px_rgba(46,197,212,0.8)]"></div>
              <div className="w-[4px] h-[4px] border border-accent rounded-full shadow-[0_0_8px_rgba(46,197,212,0.8)]"></div>
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,4vw,3.8rem)] leading-[1.1] mb-8 text-text transition-colors duration-300">{formatHeadline(mission.headline)}
            </h2>
            <div className="w-16 h-[2px] bg-accent mb-8 shadow-[0_0_10px_rgba(46,197,212,0.6)]"></div>
            <p className="text-text-muted transition-colors duration-300 leading-[1.8] text-[0.95rem] font-mono mb-12 max-w-[90%]">{mission.description}
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center justify-center gap-4 px-[1.5rem] py-[0.9rem] rounded-md border border-accent bg-accent/10 hover:bg-accent hover:text-bg text-accent font-sans text-[0.96rem] tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_15px_rgba(46,197,212,0.2)] hover:shadow-[0_0_25px_rgba(46,197,212,0.5)] group"
            >
              <div className="w-8 h-8 rounded border border-current flex items-center justify-center group-hover:bg-bg group-hover:text-accent transition-colors">
                 <ArrowUpRight size={18} strokeWidth={2.5} />
              </div>
              <span>{mission.cta}</span>
            </Link>
          </div>
          <div className="flex-1 flex justify-center items-center relative w-full h-[400px] lg:h-[500px]">
             <svg className="absolute inset-0 w-full h-full text-accent/40 pointer-events-none" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="250" cy="250" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" />
                <circle cx="250" cy="250" r="140" stroke="currentColor" strokeWidth="1" opacity="0.1" />
                <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="1" opacity="0.05" />
                <path d="M 50 150 L 120 150 L 180 210" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="150" r="3" fill="#2EC5D4" style={{filter: 'drop-shadow(0 0 8px #2EC5D4)'}} />
                <circle cx="120" cy="150" r="2" fill="currentColor" />
                <path d="M 450 120 L 380 120 L 320 180" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="450" cy="120" r="4" fill="#2EC5D4" style={{filter: 'drop-shadow(0 0 8px #2EC5D4)'}} />
                <path d="M 80 400 L 150 400 L 210 340" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="80" cy="400" r="4" fill="#2EC5D4" style={{filter: 'drop-shadow(0 0 8px #2EC5D4)'}} />
                <path d="M 420 380 L 350 380 L 290 320" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="420" cy="380" r="3" fill="#2EC5D4" style={{filter: 'drop-shadow(0 0 8px #2EC5D4)'}} />
                <path d="M 250 50 L 250 120" stroke="currentColor" strokeWidth="1.5" />
                <path d="M 250 450 L 250 380" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="350" cy="220" r="4" fill="#2EC5D4" style={{filter: 'drop-shadow(0 0 10px #2EC5D4)'}} />
                <circle cx="160" cy="280" r="2" fill="#2EC5D4" style={{filter: 'drop-shadow(0 0 5px #2EC5D4)'}} />
                <circle cx="280" cy="380" r="3" fill="#2EC5D4" style={{filter: 'drop-shadow(0 0 8px #2EC5D4)'}} />
                <circle cx="120" cy="200" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="380" cy="300" r="2" fill="currentColor" opacity="0.5" />
                <polygon points="400,200 420,210 420,230 400,240 380,230 380,210" stroke="currentColor" strokeWidth="1" fill="transparent" />
                <polygon points="120,300 135,308 135,322 120,330 105,322 105,308" stroke="currentColor" strokeWidth="1" fill="transparent" />
             </svg>
             <div className="relative z-10 w-[240px] h-[276px] lg:w-[320px] lg:h-[368px] flex items-center justify-center filter drop-shadow-[0_0_40px_rgba(46,197,212,0.4)]">
                  <img src="/codex-logo-icon.svg" alt="CX Logo" className="w-full h-full object-contain opacity-100 drop-shadow-[0_0_20px_rgba(46,197,212,0.6)]" />
             </div>
             
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
