import React from "react";
import { Link } from "react-router-dom";
import contentData from "../../../data/content.json";
import { ArrowRight } from "lucide-react";
import { ASSETS } from "../../../config/assets";

const logoMap = {
  "HackIndia": ASSETS.IMAGES.PARTNER_HACKINDIA,
  "Unstop": ASSETS.IMAGES.PARTNER_UNSTOP,
  "Hostinger": ASSETS.IMAGES.PARTNER_HOSTINGER,
  ".xyz": ASSETS.IMAGES.PARTNER_XYZ,
  "CodeChef": ASSETS.IMAGES.PARTNER_CODECHEF,
  "Blackbox": ASSETS.IMAGES.PARTNER_BLACKBOX,
  "CollageCart": ASSETS.IMAGES.PARTNER_COLLAGECART,
  "CodeCrafters": ASSETS.IMAGES.PARTNER_CODECRAFTERS,
  "Memcode": ASSETS.IMAGES.PARTNER_MEMCODE
};

const PartnerSection = () => {
  const { partners } = contentData.landing;

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 scroll-mt-20 md:scroll-mt-24" id="partners">
      {/* Background glow blobs */}
      <div className="absolute top-0 right-0 w-[50%] md:w-[40%] h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/15 via-bg to-transparent pointer-events-none z-0 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[400px] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 to-transparent pointer-events-none z-0 blur-3xl"></div>

      <svg className="absolute top-20 right-20 w-40 h-40 text-accent/10 z-0 pointer-events-none hidden lg:block" viewBox="0 0 160 160" fill="currentColor">
        {Array.from({ length: 100 }).map((_, i) => (
          <circle key={i} cx={(i % 10) * 16 + 8} cy={Math.floor(i / 10) * 16 + 8} r="1.5" />
        ))}
      </svg>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="block text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4 drop-shadow-sm">
            OUR PARTNERS
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-text uppercase leading-tight">
            Organizations
            <br />
            <span className="text-accent">We've Worked With</span>
          </h2>
          <p className="mt-4 md:mt-6 text-text-muted font-sans text-base sm:text-lg max-w-2xl">
            {partners.description}
          </p>
        </div>
        
        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {partners.list.map((org, index) => (
            <a 
              key={index} 
              href={org.url || "#"} 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-5 lg:p-6 bg-card/40 backdrop-blur-xl transition-all duration-500 rounded-2xl shadow-sm border border-border-soft hover:border-accent/50 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(46,197,212,0.15)] relative overflow-hidden cursor-pointer"
            >
              {/* Internal glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>
              
              {/* Top Row: Hexagon Logo & Title */}
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  {/* Outer Hexagon - Changed rotation to 180deg for a perfect, seamless spin */}
                  <div 
                    className="absolute inset-0 bg-accent/15 border border-accent/30 shadow-[0_0_10px_rgba(46,197,212,0.1)] group-hover:shadow-[0_0_20px_rgba(46,197,212,0.3)] transition-transform duration-700 ease-in-out group-hover:rotate-180" 
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                  ></div>
                  {/* Inner Hexagon Background */}
                  <div 
                    className="absolute inset-[2px] bg-card/90 backdrop-blur-md transition-colors duration-300" 
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                  ></div>
                  {/* Logo Image */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <img 
                      src={logoMap[org.name]} 
                      alt={`${org.name} logo`} 
                      className="w-6 h-6 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                
                <h3 className="font-sans text-lg lg:text-xl font-bold tracking-widest text-text transition-colors duration-300 uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-text group-hover:to-accent">
                  {org.name}
                </h3>
              </div>
              
              {/* Description */}
              <div className="flex-1 flex flex-col relative z-10">
                <p className="font-mono text-text-muted transition-colors duration-300 text-[0.8rem] leading-[1.6] mb-4">
                  {org.description}
                </p>
              </div>
              
              {/* Footer Link Indicator */}
              <div className="mt-auto pt-4 border-t border-border-soft/50 flex justify-between items-center relative z-10">
                <span className="text-[0.65rem] font-mono tracking-[0.2em] uppercase text-accent/60 group-hover:text-accent transition-colors duration-300">
                  Visit Partner
                </span>
                <div 
                  className="w-8 h-8 bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg group-hover:shadow-[0_0_10px_rgba(46,197,212,0.5)] transition-all duration-500"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-500" />
                </div>
              </div>
            </a>
          ))}
          
          {/* Become a Partner Action Card */}
          <Link 
            to="/#contact"
            className="group flex flex-col p-5 lg:p-6 bg-accent/5 backdrop-blur-xl transition-all duration-500 rounded-2xl shadow-sm border border-accent/30 hover:border-accent hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(46,197,212,0.2)] relative overflow-hidden cursor-pointer"
          >
            {/* Internal glow */}
            <div className="absolute -inset-1 bg-gradient-to-br from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>
            
            {/* Top Row: Icon & Title */}
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <div 
                  className="absolute inset-0 bg-accent/20 border border-accent/50 shadow-[0_0_10px_rgba(46,197,212,0.2)] group-hover:shadow-[0_0_20px_rgba(46,197,212,0.4)] transition-transform duration-700 ease-in-out group-hover:rotate-180" 
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                ></div>
                <div 
                  className="absolute inset-[2px] bg-card/90 backdrop-blur-md transition-colors duration-300"
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="text-xl font-bold text-accent transition-transform duration-500 group-hover:scale-125">+</span>
                </div>
              </div>
              
              <h3 className="font-sans text-lg lg:text-xl font-bold tracking-widest text-accent transition-colors duration-300 uppercase">
                Become a<br />Partner
              </h3>
            </div>
            
            {/* Description */}
            <div className="flex-1 flex flex-col relative z-10">
              <p className="font-mono text-text-muted transition-colors duration-300 text-[0.8rem] leading-[1.6] mb-4">
                Want to collaborate? Join our network of partners and support the next generation of builders and innovators.
              </p>
            </div>
            
            {/* Footer Link Indicator */}
            <div className="mt-auto pt-4 border-t border-accent/20 flex justify-between items-center relative z-10">
              <span className="text-[0.65rem] font-mono tracking-[0.2em] uppercase text-accent group-hover:text-accent transition-colors duration-300 font-bold">
                Contact Us
              </span>
              <div 
                className="w-8 h-8 bg-accent flex items-center justify-center text-bg group-hover:shadow-[0_0_15px_rgba(46,197,212,0.6)] transition-all duration-500"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-500 stroke-[3]" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;