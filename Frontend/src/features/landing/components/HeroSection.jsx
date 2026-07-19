import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users, Globe, ChevronRight } from "lucide-react";
import contentData from "../../../data/content.json";

const HeroSection = () => {
  const { hero } = contentData.landing;
  const CustomButton = ({ to, variant, children, icon: Icon }) => {
    const baseStyle = "inline-flex items-center justify-center gap-3 px-[1.5rem] py-[1rem] font-sans text-[0.96rem] tracking-[0.2em] uppercase transition-all duration-300";
    const variantStyle = variant === "solid" 
      ? "bg-accent text-[#0a0f1a] hover:bg-[#20b2c1] shadow-[0_0_20px_rgba(46,197,212,0.2)] hover:shadow-[0_0_30px_rgba(46,197,212,0.4)]" 
      : "bg-transparent text-white border border-white/20 hover:border-white/50 hover:bg-white/5";
      
    return (
      <Link to={to} className={`${baseStyle} ${variantStyle} rounded-md whitespace-nowrap`}>
        {Icon && <Icon size={18} />}
        <span>{children}</span>
        <ChevronRight size={18} className="opacity-70 ml-[-0.25rem]" />
      </Link>
    );
  };
  const icons = {
    events: CalendarDays,
    members: Users,
    domains: Globe
  };

  return (
    <section className="relative min-h-[calc(100vh-6.75rem)] flex flex-col lg:flex-row overflow-hidden bg-[#070b14]" id="about">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px]"></div>
         <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[40%] bg-gradient-to-tr from-accent/10 to-transparent skew-x-[-30deg] transform origin-bottom-left blur-[50px]"></div>
         <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '40px'
         }}></div>
      </div>
      <div className="flex-1 px-[1.15rem] pt-[3.4rem] pb-[4rem] lg:px-16 lg:pt-0 relative z-10 lg:w-[60%] flex flex-col justify-center min-h-[50vh] lg:min-h-full">
        <p className="m-0 text-accent text-[0.72rem] tracking-[0.34em] uppercase font-bold flex items-center gap-4">
          {hero.eyebrow}
        </p>
        <div className="relative mt-4 lg:mt-6 mb-6 lg:mb-8">
          <div className="absolute top-[45%] left-0 -translate-y-1/2 text-[clamp(8rem,26vw,18rem)] font-sans leading-none tracking-tighter text-white/[0.02] select-none pointer-events-none z-0 whitespace-nowrap">
            CODEX
          </div>
          <h1 className="relative z-10 flex flex-wrap items-end gap-[0.3rem] font-sans text-[clamp(5.5rem,18vw,14rem)] leading-[0.85] tracking-[0.02em] text-reflect">
            <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">{hero.titlePart1}</span>
            <span className="text-accent drop-shadow-[0_0_30px_rgba(46,197,212,0.3)]">{hero.titlePart2}</span>
          </h1>
        </div>

        <p className="m-0 mb-6 font-serif text-[clamp(1.4rem,2vw,2.1rem)] italic text-white/90 drop-shadow-md">
          {hero.quote}
        </p>
        <p className="m-0 text-white/60 text-[0.93rem] leading-[1.75] max-w-[36rem]">
          {hero.description}
        </p>
                <div className="flex flex-wrap items-center gap-4 mt-10" id="join">
          <CustomButton to="/events" variant="solid" icon={CalendarDays}>
            {hero.ctaPrimary}
          </CustomButton>
          <CustomButton to="/register" variant="outline" icon={Users}>
            {hero.ctaSecondary}
          </CustomButton>
        </div>
        <div className="flex items-center gap-4 mt-14 lg:mt-auto lg:pb-8">
          <div className="flex -space-x-3">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="w-[2.2rem] h-[2.2rem] rounded-full border-2 border-[#070b14] relative z-10 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, hsl(${190 + i * 20}, 70%, 50%), hsl(${220 + i * 15}, 60%, 40%))`
                }}
              />
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-accent font-sans text-[1.1rem] leading-none font-bold">{hero.stats.find(s => s.label === 'members')?.value}</span>
            <span className="text-white/50 text-[0.65rem] uppercase tracking-wider mt-1">Active {hero.stats.find(s => s.label === 'members')?.label}</span>
          </div>
        </div>
      </div>
      <div className="lg:w-[42%] flex flex-col justify-center relative z-10 min-h-full">
        <div className="absolute inset-0 bg-[#F5F0E8] hero-right-panel hidden lg:block z-0 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `radial-gradient(#111 1.5px, transparent 1.5px)`,
            backgroundSize: `24px 24px`
          }}></div>
        </div>
                <div className="absolute inset-0 bg-[#F5F0E8] lg:hidden z-0"></div>
        <div className="relative z-10 w-full flex flex-col gap-5 p-[1.15rem] py-16 lg:p-12 lg:pl-28" aria-label="Codex metrics">
          {hero.stats.map((stat, index) => {
            const Icon = icons[stat.label] || CalendarDays;
            return (
              <article 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 lg:p-7 bg-white/60 backdrop-blur-md rounded-xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden" 
                key={stat.label}
              >
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-accent/20 rotate-45 rounded-[12px] group-hover:rotate-90 transition-transform duration-500"></div>
                  <div className="absolute inset-1 bg-gradient-to-br from-accent to-[#1a9fb0] rounded-[10px] p-[1.5px] shadow-[0_0_15px_rgba(46,197,212,0.4)]">
                    <div className="w-full h-full bg-white rounded-[8px] flex items-center justify-center">
                       <Icon className="text-accent" size={24} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="m-0 text-accent text-[0.68rem] tracking-[0.3em] uppercase font-bold">{stat.label}</p>
                  <p className="mt-[0.2rem] mb-[0.3rem] font-sans text-[2.5rem] lg:text-[3rem] text-[#111111] leading-[1] tracking-[0.02em]">{stat.value}</p>
                  <p className="m-0 text-black/60 text-[0.85rem] leading-[1.6] max-w-[18rem]">{stat.text}</p>
                </div>
              </article>
            );
          })}
        </div>
          <div className="absolute bottom-8 right-12 z-10 hidden lg:flex items-center gap-4 text-accent font-sans tracking-[0.25em] text-[0.7rem] opacity-80">
          <span className="w-[10px] h-[10px] border border-accent rotate-45"></span>
          <span>{hero.eyebrow}</span>
          <span className="w-[10px] h-[10px] border border-accent rotate-45"></span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
