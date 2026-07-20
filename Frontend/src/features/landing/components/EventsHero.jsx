import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import content from "../../../data/content.json";
import hackathonImg from "../../../assets/events/hackthon.jpg";
import contestImg from "../../../assets/events/contest.jpg";
import webinarImg from "../../../assets/events/webinar.jpg";

const EventsHero = () => {
  const { eventsHero, layout } = content;
  const images = {
    hackathon: hackathonImg,
    contest: contestImg,
    webinar: webinarImg,
  };

  return (
    <section className="bg-bg transition-colors duration-300 relative overflow-hidden min-h-screen flex flex-col border-b border-border">
      <div className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-1 xl:grid-cols-2 gap-24 xl:gap-8 items-center px-6 lg:px-12 py-16 lg:py-24 relative z-10">
      <div className="relative z-20 xl:pr-12">
      <div className="inline-flex items-center gap-4 border border-accent/40 rounded-sm px-5 py-2 mb-10 bg-accent/5 backdrop-blur-md shadow-[0_0_15px_rgba(46,197,212,0.15)] relative">
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 50%)" }}></div>
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}></div>
            <span className="text-accent text-[0.75rem] uppercase tracking-[0.3em] font-mono font-bold">
              {eventsHero.badge}
            </span>
          </div>
          <h1 className="font-sans text-[clamp(4rem,7vw,7rem)] font-bold leading-[0.85] tracking-tight uppercase mb-8 text-text transition-colors duration-300">
            {eventsHero.title.line1.split('.').map((part, i) => part.trim() ? <React.Fragment key={i}>{part}.<br/></React.Fragment> : null)}
            <span className="text-accent drop-shadow-[0_0_20px_rgba(46,197,212,0.5)]">
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
            <div className="absolute inset-0 border border-accent shadow-[0_0_15px_rgba(46,197,212,0.2)] group-hover:shadow-[0_0_25px_rgba(46,197,212,0.6)] transition-all duration-300 pointer-events-none" style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}></div>
            <div className="absolute top-0 left-0 w-2 h-[2px] bg-accent"></div>
            <div className="absolute bottom-0 right-0 w-2 h-[2px] bg-accent"></div>
            <span className="relative z-10 transition-colors duration-300">Explore Events</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
        <div className="relative h-[550px] w-full flex justify-center items-center mt-12 xl:mt-0">
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] text-accent/30 pointer-events-none -z-10" viewBox="0 0 800 800" fill="none">             <ellipse cx="400" cy="650" rx="280" ry="60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.4" />
             <ellipse cx="400" cy="650" rx="220" ry="45" stroke="currentColor" strokeWidth="1" opacity="0.2" />
             <ellipse cx="400" cy="650" rx="340" ry="75" stroke="currentColor" strokeWidth="1" opacity="0.1" />
             <path d="M 50 400 L 200 400 L 320 520" stroke="currentColor" strokeWidth="1.5" />
             <path d="M 750 350 L 600 350 L 480 470" stroke="currentColor" strokeWidth="1.5" />
             <path d="M 150 600 L 280 600 L 350 530" stroke="currentColor" strokeWidth="1" />
             <path d="M 650 600 L 520 600 L 450 530" stroke="currentColor" strokeWidth="1" />
             <circle cx="50" cy="400" r="4" fill="#2EC5D4" style={{filter: 'drop-shadow(0 0 10px #2EC5D4)'}} />
             <circle cx="750" cy="350" r="4" fill="#2EC5D4" style={{filter: 'drop-shadow(0 0 10px #2EC5D4)'}} />
             <circle cx="150" cy="600" r="2" fill="currentColor" />
             <circle cx="650" cy="600" r="2" fill="currentColor" />
          </svg>
          <div className="absolute inset-0 flex justify-center items-center perspective-[1200px]">
             {eventsHero.cards.map((card) => {
               let posClasses = "";
               let zIndex = "";
               if (card.id === 1) {
                 posClasses = "rotate-0 scale-100 -translate-y-4 shadow-[0_0_50px_rgba(46,197,212,0.4)]";
                 zIndex = "z-30";
               } else if (card.id === 2) {
                 posClasses = "-translate-x-[55%] translate-y-8 -rotate-[12deg] scale-[0.85] opacity-80 shadow-[0_0_30px_rgba(46,197,212,0.2)]";
                 zIndex = "z-10";
               } else if (card.id === 3) {
                 posClasses = "translate-x-[55%] translate-y-8 rotate-[12deg] scale-[0.85] opacity-80 shadow-[0_0_30px_rgba(46,197,212,0.2)]";
                 zIndex = "z-20";
               }
               return (
                 <div key={card.id}className={`absolute w-[260px] h-[380px] lg:w-[300px] lg:h-[440px] transition-all duration-500 rounded-xl overflow-hidden border-[2px] border-accent/60 bg-card ${posClasses} ${zIndex}`}style={{ 
                      clipPath: card.id === 1 
                        ? "polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%)" 
                        : "polygon(0 0, 100% 0, 100% 100%, 0 100%)" 
                   }}>
                    {card.id === 1 && (
                      <div className="absolute top-0 right-4 w-12 h-16 bg-accent z-40 flex items-start justify-center pt-3" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }}>
                        <Star size={20} className="text-bg fill-bg drop-shadow-md" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20"></div>
                    <img
                      src={images[card.image]}
                      alt={card.title}
                      className="w-full h-full object-cover relative z-10"
                    />
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                      <h3 className="text-white font-sans text-2xl lg:text-[1.8rem] uppercase leading-tight mb-2 font-bold tracking-wide drop-shadow-lg">{card.title}</h3>
                      <p className="text-accent text-[0.75rem] font-mono tracking-widest leading-relaxed font-bold">{card.subtitle}</p>
                    </div>{card.id === 1 && (
                      <div className="absolute bottom-0 right-0 w-10 h-10 bg-accent z-40" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}>
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
