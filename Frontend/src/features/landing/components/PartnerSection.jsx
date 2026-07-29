import React from "react";
import contentData from "../../../data/content.json";
import { ArrowRight } from "lucide-react";
import { ASSETS } from "../../../config/assets";

const logoMap = {
  "HackIndia": ASSETS.IMAGES.PARTNER_HACKINDIA,
  "Unstop": ASSETS.IMAGES.PARTNER_UNSTOP,
  "Hostinger": ASSETS.IMAGES.PARTNER_HOSTINGER,
  ".xyz": ASSETS.IMAGES.PARTNER_XYZ
};
const PartnerSection = () => {
  const { partners } = contentData.landing;

  return (
    <section className="relative overflow-hidden py-16 lg:py-24" id="partners">
      {/* Background glow blobs */}
      <div className="absolute top-0 right-0 w-[50%] md:w-[40%] h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/15 via-bg to-transparent pointer-events-none z-0 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[400px] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 to-transparent pointer-events-none z-0 blur-3xl"></div>

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
            <h2 className="font-sans text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-br from-text to-text/70 mb-6">
              ORGANIZATIONS<br/>WE'VE WORKED WITH
            </h2>
            <div className="flex items-center gap-1 mb-8 text-accent font-bold tracking-widest text-lg italic">
              <div className="w-12 h-[2px] bg-accent mr-3 shadow-[0_0_8px_rgba(46,197,212,0.6)]"></div>
              ////
            </div>
            <p className="font-mono text-text-muted transition-colors duration-300 text-[1rem] leading-[1.8] max-w-[36rem]">
              {partners.description}
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3 mb-4">
            <div className="w-4 h-4 bg-accent rounded-sm shadow-[0_0_10px_rgba(46,197,212,0.4)] animate-pulse"></div>
            <div className="w-4 h-4 bg-border-soft rounded-sm"></div>
            <div className="w-4 h-4 border-2 border-border-soft rounded-sm"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {partners.list.map((org, index) => (
            <article key={index} className="group flex flex-col p-6 lg:p-8 bg-card/40 backdrop-blur-xl transition-all duration-500 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-border-soft hover:border-accent/50 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(46,197,212,0.15)] relative overflow-hidden">
              {/* Internal glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>
              
              <div className="flex items-start justify-between mb-10 relative z-10">
               <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 bg-accent/10 border border-accent/20 shadow-[0_0_15px_rgba(46,197,212,0.1)] group-hover:shadow-[0_0_25px_rgba(46,197,212,0.4)] transition-all duration-500 group-hover:rotate-90" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                  <div className="absolute inset-[2px] bg-card/80 backdrop-blur-md transition-colors duration-300" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                  <div className="absolute inset-[4px] bg-transparent flex items-center justify-center z-10">
                    <img 
                      src={logoMap[org.name]} 
                      alt={`${org.name} logo`} 
                      className="w-8 h-8 object-contain transition-transform duration-500 group-hover:scale-125 drop-shadow-md"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <svg className="w-12 h-12 text-accent/10 transition-all duration-500 group-hover:text-accent/30 group-hover:scale-110 group-hover:rotate-12" viewBox="0 0 40 40" fill="currentColor">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <circle key={i} cx={(i % 4) * 8 + 8} cy={Math.floor(i / 4) * 8 + 8} r="1.5" />
                  ))}
                </svg>
              </div>
              <div className="flex-1 flex flex-col relative z-10">
                <h3 className="font-sans text-[1.4rem] font-bold tracking-widest text-text transition-colors duration-300 uppercase mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-text group-hover:to-accent">
                  {org.name}
                </h3>
                <div className="w-10 h-[2px] bg-accent mb-4 shadow-[0_0_5px_rgba(46,197,212,0.5)]"></div>
                <p className="font-mono text-text-muted transition-colors duration-300 text-[0.85rem] leading-[1.6] flex-1">
                  {org.description}
                </p>
              </div>
              <div className="mt-8 flex justify-end relative z-10">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg group-hover:shadow-[0_0_15px_rgba(46,197,212,0.6)] transition-all duration-500">
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500" />
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
