import React from "react";
import { useNavigate } from "react-router-dom";
import contentData from "../../../data/content.json";
import { 
  Users, 
  Code, 
  GraduationCap, 
  Target, 
  Calendar, 
  GitBranch,
  ArrowRight 
} from "lucide-react";
const benefitIcons = [
  Users,
  Code,
  GraduationCap,
  Target,
  Calendar,
  GitBranch
];

const CommitSection = () => {
  const navigate = useNavigate();
  const { commitSection } = contentData.landing;
  if (!commitSection) return null;
  return (
    <section className="bg-bg transition-colors duration-300 relative overflow-hidden py-16 lg:py-24 px-6 border-b border-border" id="team">
            <div className="max-w-[1400px] mx-auto bg-card rounded-[24px] border border-border shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-300 relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-border-soft z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-accent rotate-45 shadow-[0_0_10px_rgba(46,197,212,0.5)]"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 relative z-20">
        <div className="relative p-10 lg:p-16 xl:p-20 flex flex-col justify-center overflow-hidden">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[15%] text-[35rem] font-sans font-bold text-accent/[0.04] dark:text-accent/[0.02] pointer-events-none select-none leading-none z-0">X</div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="inline-flex items-center px-4 py-1.5 border border-accent/40 rounded-sm bg-accent/5">
                  <span className="text-accent text-[0.65rem] tracking-[0.2em] font-mono font-bold uppercase">{commitSection.eyebrow}</span>
                </div>
                <div className="flex-1 max-w-[80px] flex items-center">
                  <div className="h-[1px] flex-1 bg-accent/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                </div>
              </div>
              <h2 className="font-sans text-[clamp(3.5rem,8vw,6rem)] font-bold leading-[0.85] tracking-tight uppercase mb-8">
                <span className="block text-text transition-colors duration-300">WRITE THE<br/>NEXT</span>
                <span className="block text-accent drop-shadow-[0_0_15px_rgba(46,197,212,0.3)]">CHAPTER.</span>
              </h2>
              <div className="flex items-center gap-1 mb-10 text-accent font-bold tracking-widest text-lg italic">
                <div className="w-12 h-[2px] bg-accent mr-3"></div>
                ////
              </div>
              <p className="text-text-muted transition-colors duration-300 font-mono text-[0.95rem] leading-[1.8] max-w-md mb-12">{commitSection.description}</p>
              <button onClick={() => navigate("/register")} className="group relative inline-flex items-center gap-4 px-[2rem] py-[1.2rem] bg-text text-bg font-sans text-[1rem] font-bold tracking-[0.2em] uppercase rounded-sm hover:-translate-y-1 transition-transform duration-300">
                <span className="relative z-10">Join Now</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
            <svg className="absolute bottom-10 right-10 w-20 h-20 text-accent/20 z-0 pointer-events-none hidden md:block" viewBox="0 0 80 80" fill="currentColor">
              {Array.from({ length: 36 }).map((_, i) => (
                <circle key={i} cx={(i % 6) * 14 + 7} cy={Math.floor(i / 6) * 14 + 7} r="1.5" />
              ))}
            </svg>
          </div>
          <div className="relative p-10 lg:p-16 xl:p-20 bg-panel/30 dark:bg-panel/10 border-t lg:border-t-0 border-border-soft flex flex-col justify-center">
            <svg className="absolute top-10 right-10 w-20 h-20 text-accent/20 z-0 pointer-events-none hidden md:block" viewBox="0 0 80 80" fill="currentColor">
              {Array.from({ length: 36 }).map((_, i) => (
                <circle key={i} cx={(i % 6) * 14 + 7} cy={Math.floor(i / 6) * 14 + 7} r="1.5" />
              ))}
            </svg>
              <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-accent font-mono text-[0.8rem] font-bold tracking-[0.2em] uppercase m-0 whitespace-nowrap">{commitSection.kicker}</h3>
                <div className="flex-1 flex items-center">
                  <div className="h-[1px] w-full bg-accent/30"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-accent"></div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {commitSection.benefits.map((benefit, index) => {
                  const Icon = benefitIcons[index % benefitIcons.length];
                  return (
                    <div key={index} className="group flex items-center gap-6 p-5 bg-bg/80 backdrop-blur-sm rounded-xl border border-border-soft hover:border-accent/40 transition-colors duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                      <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                        <Icon size={22} className="text-accent" strokeWidth={2} />
                      </div>
                      <p className="flex-1 m-0 font-mono text-[0.85rem] leading-[1.5] text-text transition-colors duration-300">{benefit}</p>
                      <ArrowRight size={18} className="text-accent/40 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommitSection;
