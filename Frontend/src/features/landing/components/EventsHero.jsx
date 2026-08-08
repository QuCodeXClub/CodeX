import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import content from "../../../data/content.json";
import { ASSETS } from "../../../config/assets";

const EventsHero = () => {
  const { eventsHero, layout } = content;
  const images = {
    hackathon: ASSETS.IMAGES.EVENT_HACKATHON,
    contest: ASSETS.IMAGES.EVENT_CONTEST,
    webinar: ASSETS.IMAGES.EVENT_WEBINAR,
  };

  return (
    <section id="programs" className="relative overflow-hidden min-h-[80vh] flex flex-col">
      <div className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-1 xl:grid-cols-2 gap-24 xl:gap-8 items-center px-6 lg:px-12 py-12 lg:py-20 relative z-10">
        
        {/* Left Content */}
        <div className="relative z-20 xl:pr-12">
          <div className="inline-flex items-center gap-4 border border-accent/40 rounded-sm px-5 py-2 mb-10 bg-accent/5 backdrop-blur-md shadow-[0_0_15px_rgba(46,197,212,0.15)] relative group">
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent shadow-[0_0_8px_rgba(46,197,212,0.8)] group-hover:scale-125 transition-transform" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 50%)" }}></div>
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent shadow-[0_0_8px_rgba(46,197,212,0.8)] group-hover:scale-125 transition-transform" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}></div>
            <span className="text-accent text-[0.75rem] uppercase tracking-[0.3em] font-mono font-bold">
              {eventsHero.badge}
            </span>
          </div>
          <h1 className="font-sans text-[clamp(4rem,7vw,7rem)] font-bold leading-[0.85] tracking-tight uppercase mb-8 text-transparent bg-clip-text bg-gradient-to-br from-text to-text/70 transition-colors duration-300">
            {eventsHero.title.line1.split('.').map((part, i) => part.trim() ? <React.Fragment key={i}>{part}.<br/></React.Fragment> : null)}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70 drop-shadow-[0_0_20px_rgba(46,197,212,0.5)]">
              {eventsHero.title.highlight}
            </span>
          </h1>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-24 h-[2px] bg-accent shadow-[0_0_10px_rgba(46,197,212,0.8)]"></div>
            <div className="w-8 h-[2px] bg-accent/50"></div>
            <div className="w-4 h-[2px] bg-accent/20"></div>
          </div>
          <p className="text-text-muted font-mono text-[1.05rem] leading-[1.8] max-w-[90%] mb-12 transition-colors duration-300">
            {eventsHero.description}
          </p>
          <Link 
            to="/events" 
            className="inline-flex items-center gap-4 px-[2rem] py-[1rem] bg-accent/5 hover:bg-accent hover:text-bg text-text font-sans text-[1.05rem] font-bold tracking-[0.2em] uppercase transition-all duration-300 group relative"
          >
            <div className="absolute inset-0 border border-accent shadow-[0_0_15px_rgba(46,197,212,0.2)] group-hover:shadow-[0_0_30px_rgba(46,197,212,0.6)] transition-all duration-300 pointer-events-none" style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}></div>
            <div className="absolute top-0 left-0 w-2 h-[2px] bg-accent shadow-[0_0_5px_rgba(46,197,212,0.8)]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-[2px] bg-accent shadow-[0_0_5px_rgba(46,197,212,0.8)]"></div>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-bg">Explore Events</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 group-hover:text-bg transition-transform duration-300" />
          </Link>
        </div>
        
        {/* Right Cards Section */}
        <div className="relative h-[550px] w-full flex justify-center items-center mt-12 xl:mt-0">
          {/* Animated Radar SVG */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] pointer-events-none -z-10 animate-[spin_40s_linear_infinite]">
            <svg className="w-full h-full text-accent/30" viewBox="0 0 800 800" fill="none">
               <ellipse cx="400" cy="400" rx="280" ry="280" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.4" />
               <ellipse cx="400" cy="400" rx="220" ry="220" stroke="currentColor" strokeWidth="1" opacity="0.2" />
               <ellipse cx="400" cy="400" rx="340" ry="340" stroke="currentColor" strokeWidth="1" opacity="0.1" />
               <path d="M 120 400 L 250 400" stroke="currentColor" strokeWidth="1.5" />
               <path d="M 680 400 L 550 400" stroke="currentColor" strokeWidth="1.5" />
               <path d="M 400 120 L 400 250" stroke="currentColor" strokeWidth="1.5" />
               <path d="M 400 680 L 400 550" stroke="currentColor" strokeWidth="1.5" />
               <circle cx="120" cy="400" r="4" fill="var(--color-accent)" opacity="0.8" />
               <circle cx="680" cy="400" r="4" fill="var(--color-accent)" opacity="0.8" />
               <circle cx="400" cy="120" r="4" fill="var(--color-accent)" opacity="0.8" />
               <circle cx="400" cy="680" r="4" fill="var(--color-accent)" opacity="0.8" />
            </svg>
          </div>
          
          {/* Ambient Glow behind cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/20 via-accent/5 to-transparent blur-3xl rounded-full -z-10 pointer-events-none"></div>

          <div className="absolute inset-0 flex justify-center items-center perspective-[1200px]">
            {eventsHero.cards.map((card) => {
               let posClasses = "";
               let zIndex = "";
               
               if (card.id === 1) {
                 // Center card: Pops up and scales on hover
                 posClasses = "rotate-0 scale-100 -translate-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:-translate-y-8 hover:scale-[1.05]";
                 zIndex = "z-30";
               } else if (card.id === 2) {
                 // Left card: Shifts left, straightens out, and scales up to 100% on hover
                 posClasses = "-translate-x-[55%] translate-y-8 -rotate-[12deg] scale-[0.85] opacity-80 shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:-translate-x-[80%] hover:-translate-y-2 hover:rotate-0 hover:scale-100 hover:opacity-100";
                 zIndex = "z-10";
               } else if (card.id === 3) {
                 // Right card: Shifts right, straightens out, and scales up to 100% on hover
                 posClasses = "translate-x-[55%] translate-y-8 rotate-[12deg] scale-[0.85] opacity-80 shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:translate-x-[80%] hover:-translate-y-2 hover:rotate-0 hover:scale-100 hover:opacity-100";
                 zIndex = "z-20";
               }
               
               return (
                 <div 
                    key={card.id}
                    // Added hover:z-50 and ease-out for a smooth pop-to-top effect
                    className={`absolute w-[260px] h-[380px] lg:w-[300px] lg:h-[440px] transition-all duration-500 ease-out rounded-[1.5rem] overflow-hidden border-[2px] border-border-soft hover:border-accent/80 hover:shadow-[0_0_30px_rgba(46,197,212,0.3)] bg-card/40 backdrop-blur-md group hover:z-50 cursor-pointer ${posClasses} ${zIndex}`}
                    style={{ 
                       clipPath: card.id === 1 
                         ? "polygon(0 0, 100% 0, 100% calc(100% - 35px), calc(100% - 35px) 100%, 0 100%)" 
                         : "none" 
                    }}
                  >
                    {card.id === 1 && (
                      <div className="absolute top-0 right-6 w-12 h-16 bg-accent z-40 flex items-start justify-center pt-3 drop-shadow-[0_0_15px_rgba(46,197,212,0.5)]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }}>
                        <Star size={20} className="text-bg fill-bg" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20 opacity-80 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <img
                      src={images[card.image]}
                      alt={card.title}
                      className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-30 transform group-hover:-translate-y-2 transition-transform duration-300">
                      <h3 className="text-white font-sans text-2xl lg:text-[1.8rem] uppercase leading-tight mb-2 font-bold tracking-wide drop-shadow-lg">{card.title}</h3>
                      <p className="text-accent text-[0.75rem] font-mono tracking-widest leading-relaxed font-bold drop-shadow-md">{card.subtitle}</p>
                    </div>
                    {card.id === 1 && (
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-accent/80 backdrop-blur-md z-40 group-hover:bg-accent transition-colors duration-300" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}>
                      </div>
                    )}
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsHero;