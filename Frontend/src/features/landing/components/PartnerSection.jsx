import React from "react";
import contentData from "../../../data/content.json";
import { ArrowRight } from "lucide-react";
import hackIndiaLogo from "../../../assets/partners/hackindia.svg";
import unstopLogo from "../../../assets/partners/unstop.svg";
import hostingerLogo from "../../../assets/partners/hostinger.svg";
import xyzLogo from "../../../assets/partners/xyz.svg";

const logoMap = {
  "HackIndia": hackIndiaLogo,
  "Unstop": unstopLogo,
  "Hostinger": hostingerLogo,
  ".xyz": xyzLogo
};
const PartnerSection = () => {
  const { partners } = contentData.landing;

  return (
    <section className="bg-bg transition-colors duration-300 relative overflow-hidden py-16 lg:py-24 border-b border-border" id="partners">
      <div className="absolute top-0 right-0 w-3/4 md:w-1/2 h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-bg to-transparent pointer-events-none z-0"></div>
      <svg className="absolute top-20 right-20 w-40 h-40 text-accent/10 z-0 pointer-events-none hidden lg:block" viewBox="0 0 160 160" fill="currentColor">
        {Array.from({ length: 100 }).map((_, i) => (
          <circle key={i} cx={(i % 10) * 16 + 8} cy={Math.floor(i / 10) * 16 + 8} r="1.5" />
        ))}
      </svg>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="max-w-[45rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-[2px] bg-accent"></div>
              <p className="m-0 text-accent text-[0.75rem] font-mono font-bold tracking-[0.2em] uppercase">
                // OUR PARTNERS
              </p>
            </div>
            <h2 className="font-sans text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight uppercase text-text mb-6">
              ORGANIZATIONS<br/>WE'VE WORKED WITH
            </h2>
            <div className="flex items-center gap-1 mb-8 text-accent font-bold tracking-widest text-lg italic">
              <div className="w-12 h-[2px] bg-accent mr-3"></div>
              ////
            </div>
            <p className="font-mono text-text-muted transition-colors duration-300 text-[0.95rem] leading-[1.8] max-w-[36rem]">
              {partners.description}
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3 mb-4">
            <div className="w-4 h-4 bg-accent rounded-sm shadow-[0_0_10px_rgba(46,197,212,0.4)]"></div>
            <div className="w-4 h-4 bg-border-soft rounded-sm"></div>
            <div className="w-4 h-4 border-2 border-border-soft rounded-sm"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">{partners.list.map((org, index) => (
            <article key={index} className="group flex flex-col p-6 bg-card transition-colors duration-300 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-border hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-start justify-between mb-8">
               <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 bg-accent/10 border border-accent/20 shadow-[0_0_15px_rgba(46,197,212,0.1)] group-hover:shadow-[0_0_20px_rgba(46,197,212,0.3)] transition-all duration-300" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                  <div className="absolute inset-[2px] bg-card transition-colors duration-300 flex items-center justify-center"style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                    <img 
                      src={logoMap[org.name]} 
                      alt={`${org.name} logo`} 
                      className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
                <svg className="w-12 h-12 text-accent/20 transition-colors duration-300 group-hover:text-accent/40" viewBox="0 0 40 40" fill="currentColor">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <circle key={i} cx={(i % 4) * 8 + 8} cy={Math.floor(i / 4) * 8 + 8} r="1.5" />
                  ))}
                </svg>
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-sans text-[1.4rem] font-bold tracking-widest text-text transition-colors duration-300 uppercase mb-4">
                  {org.name}
                </h3>
                <div className="w-10 h-[2px] bg-accent mb-4"></div>
                <p className="font-mono text-text-muted transition-colors duration-300 text-[0.8rem] leading-[1.6] flex-1">
                  {org.description}
                </p>
              </div>
                <div className="mt-6 flex justify-end">
                <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg group-hover:shadow-[0_0_15px_rgba(46,197,212,0.4)] transition-all duration-300">
                  <ArrowRight size={18} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
