import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users, Globe, ChevronRight } from "lucide-react";
import contentData from "../../../data/content.json";
import { ASSETS } from "../../../config/assets";

const HeroSection = () => {
  const { hero } = contentData.landing;
  const CustomButton = ({ to, variant, children, icon: Icon }) => {
    const baseStyle = "group inline-flex items-center justify-center gap-3 px-8 py-4 font-sans text-[0.85rem] font-bold tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden";
    const variantStyle = variant === "solid" 
      ? "bg-accent text-bg shadow-[0_0_20px_rgba(46,197,212,0.3)] hover:shadow-[0_0_35px_rgba(46,197,212,0.5)] border-0" 
      : "bg-card/40 backdrop-blur-md text-text border border-border-soft hover:border-accent/50 hover:bg-card/60 shadow-sm hover:shadow-[0_0_20px_rgba(46,197,212,0.15)]";
      
    return (
      <Link to={to} className={`${baseStyle} ${variantStyle} rounded-xl whitespace-nowrap`}>
        {variant === "solid" && (
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
        )}
        <div className="relative z-10 flex items-center gap-3">
          {Icon && <Icon size={18} className={variant === "solid" ? "text-bg" : "text-accent group-hover:text-accent"} />}
          <span>{children}</span>
          <ChevronRight size={18} className={`transition-transform duration-300 group-hover:translate-x-1 ${variant === "solid" ? "text-bg/80" : "text-text-muted"}`} />
        </div>
      </Link>
    );
  };
  const icons = {
    events: CalendarDays,
    members: Users,
    domains: Globe
  };

  return (
    <section className="relative min-h-[calc(100vh-6.75rem)] flex flex-col lg:flex-row overflow-hidden" id="about">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/15 via-accent/5 to-transparent blur-3xl opacity-60 pointer-events-none"></div>
         <div className="absolute bottom-[10%] left-[20%] w-[50vw] h-[30vw] max-w-[800px] max-h-[500px] bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent blur-3xl transform skew-x-[-20deg] pointer-events-none"></div>
         <div className="absolute inset-0 opacity-[0.02] transform-gpu" style={{
            backgroundImage: `url("${ASSETS.IMAGES.HERO_PATTERN}")`,
            backgroundSize: '40px'
         }}></div>
      </div>

      <div className="flex-1 px-6 pt-16 pb-20 lg:px-16 lg:pt-0 relative z-10 lg:w-[60%] flex flex-col justify-center min-h-[50vh] lg:min-h-full">
        <div className="relative mt-4 lg:mt-6 mb-6 lg:mb-8">
          {/* Decorative Background Text */}
          <div className="absolute top-[45%] left-0 -translate-y-1/2 text-[clamp(8rem,26vw,18rem)] font-sans leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/5 to-transparent select-none pointer-events-none z-0 whitespace-nowrap">
            CODEX
          </div>
          
          <h1 className="relative z-10 flex flex-wrap items-end gap-[0.3rem] font-sans text-[clamp(4.5rem,14vw,12rem)] leading-[0.85] tracking-[0.02em]">
            <span className="text-text">{hero.titlePart1}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60 drop-shadow-[0_0_25px_rgba(46,197,212,0.4)]">
              {hero.titlePart2}
            </span>
          </h1>
        </div>

        <p className="m-0 mb-8 font-serif text-[clamp(1.4rem,2vw,2.1rem)] italic text-transparent bg-clip-text bg-gradient-to-r from-text to-text-muted drop-shadow-md">
          {hero.quote}
        </p>
        <p className="m-0 text-text-muted font-mono text-[1rem] leading-[1.8] max-w-[38rem]">
          {hero.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-5 mt-10" id="join">
          <CustomButton to="/events" variant="solid" icon={CalendarDays}>
            {hero.ctaPrimary}
          </CustomButton>
          <CustomButton to="/register" variant="outline" icon={Users}>
            {hero.ctaSecondary}
          </CustomButton>
        </div>
      </div>

      <div className="lg:w-[42%] flex flex-col justify-center relative z-10 min-h-full pb-16 lg:pb-0">
        <div className="absolute inset-0 hero-right-panel hidden lg:block z-0 shadow-[-20px_0_40px_rgba(0,0,0,0.05)] bg-gradient-to-l from-card/30 to-transparent">
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `radial-gradient(#111 1.5px, transparent 1.5px)`,
            backgroundSize: `24px 24px`
          }}></div>
        </div>
        
        <div className="relative z-10 w-full flex flex-col gap-6 p-6 lg:p-12 lg:pl-28" aria-label="Codex metrics">
          {hero.stats.map((stat, index) => {
            const Icon = icons[stat.label] || CalendarDays;
            return (
              <article 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 lg:p-8 bg-card/60 backdrop-blur-xl rounded-2xl border border-border-soft shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(46,197,212,0.1)] hover:border-accent/40 hover:-translate-y-1 transition-all duration-500 relative group overflow-hidden" 
                key={stat.label}
              >
                {/* Glow layer inside card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl"></div>
                
                {/* Left accent border */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-accent/20 rotate-45 rounded-xl group-hover:rotate-90 group-hover:scale-110 transition-all duration-500"></div>
                  <div className="absolute inset-1 bg-gradient-to-br from-accent to-[#1a9fb0] rounded-lg p-[1.5px] shadow-[0_0_15px_rgba(46,197,212,0.4)] group-hover:shadow-[0_0_25px_rgba(46,197,212,0.6)] transition-shadow duration-500">
                    <div className="w-full h-full bg-card rounded-[6px] flex items-center justify-center group-hover:bg-card/80 transition-colors duration-500">
                       <Icon className="text-accent group-hover:scale-110 transition-transform duration-500" size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col relative z-10">
                  <p className="m-0 text-accent text-[0.68rem] tracking-[0.3em] uppercase font-bold font-mono">{stat.label}</p>
                  <p className="mt-[0.2rem] mb-[0.3rem] font-sans text-[2.5rem] lg:text-[3rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-text to-text/80 leading-[1] tracking-tight">{stat.value}</p>
                  <p className="m-0 text-text-muted font-mono text-[0.85rem] leading-[1.6] max-w-[18rem]">{stat.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
