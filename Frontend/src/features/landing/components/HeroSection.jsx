import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users, Globe, ChevronRight, Sparkles, Terminal, Code2, Cpu } from "lucide-react";
import contentData from "../../../data/content.json";
import { ASSETS } from "../../../config/assets";

const HeroSection = () => {
  const { hero } = contentData.landing;

  const CustomButton = ({ to, variant, children, icon: Icon }) => {
    const baseStyle = "group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 font-sans text-sm font-semibold tracking-wide transition-all duration-300 rounded-xl cursor-pointer shadow-md hover:-translate-y-0.5";
    const variantStyle = variant === "solid"
      ? "bg-accent text-white hover:bg-accent/90 border border-accent shadow-accent/25 hover:shadow-accent/40"
      : "bg-card/90 backdrop-blur-xl text-text border border-border hover:bg-card-hover hover:border-accent/40";

    return (
      <Link to={to} className={`${baseStyle} ${variantStyle} whitespace-nowrap`}>
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={18} className={variant === "solid" ? "text-white" : "text-accent"} />}
          <span>{children}</span>
          <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
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
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row items-center justify-between overflow-hidden py-12 lg:py-16 px-6 lg:px-16" id="home">
      {/* Fancy Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Left Content Area */}
      <div className="flex-1 relative z-10 lg:w-[55%] flex flex-col justify-center max-w-3xl">
        
        {/* Eyebrow Tech Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-widest w-fit mb-6 shadow-sm hover:scale-105 transition-all">
          <img src={ASSETS.IMAGES.UNIVERSITY_LOGO_ICON} alt="Quantum University" className="w-4 h-4 object-contain drop-shadow-sm" />
          <span>QUANTUM Best technical DEVELOPER CLUB</span>
        </div>

        {/* Ultra-Stylish Hero Title: CODE X */}
        <div className="relative mb-6">
          {/* Subtle Ambient Backing Glow behind title */}
          <div className="absolute -left-6 -top-6 w-72 h-32 bg-accent/15 blur-3xl rounded-full pointer-events-none" />

          <h1 className="relative z-10 font-display font-black text-6xl sm:text-8xl lg:text-9xl tracking-tight leading-[0.92] text-text uppercase flex flex-wrap items-center gap-3 sm:gap-5">
            <span className="tracking-widest text-text drop-shadow-sm">
              {hero.titlePart1}
            </span>
            <span className="relative inline-flex items-center justify-center px-4 sm:px-7 py-1 sm:py-2.5 rounded-2xl bg-accent/10 border-2 border-accent text-accent shadow-[0_0_35px_var(--color-accent-glow)] transform -skew-x-6 hover:skew-x-0 hover:scale-105 transition-all duration-300 group cursor-default">
              <span className="relative z-10 text-accent font-black tracking-normal drop-shadow-md">
                {hero.titlePart2}
              </span>
              <span className="absolute inset-0 rounded-2xl bg-accent/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </span>
          </h1>
        </div>

        {/* Fancy Quote Pill */}
        <div className="mb-6 px-4 py-3 rounded-2xl bg-accent/5 border border-accent/20 w-fit">
          <p className="font-serif text-lg sm:text-xl italic text-accent font-medium m-0">
            "{hero.quote}"
          </p>
        </div>

        <p className="text-text-muted font-sans text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
          {hero.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4" id="join">
          <CustomButton to="/events" variant="solid" icon={CalendarDays}>
            {hero.ctaPrimary}
          </CustomButton>
          <CustomButton to="/register" variant="outline" icon={Users}>
            {hero.ctaSecondary}
          </CustomButton>
        </div>
      </div>

      {/* Right Fancy Terminal & Stats Widget */}
      <div className="lg:w-[42%] mt-12 lg:mt-0 relative z-10 w-full max-w-lg mx-auto lg:max-w-none">
        <div className="flex flex-col gap-6">
          
          {/* Fancy Code Terminal Widget */}
          <div className="bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-accent/40 transition-all">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-xs font-bold text-text-muted ml-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-accent" /> codex.config.ts
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-accent/10 text-accent border border-accent/20">
                <Terminal className="w-3 h-3" /> RUNNING
              </span>
            </div>

            <div className="font-mono text-xs space-y-1.5 text-text-muted leading-relaxed">
              <p><span className="text-accent font-bold">import</span> &#123; DeveloperClub &#125; <span className="text-accent font-bold">from</span> <span className="text-accent/90">'@codex/core'</span>;</p>
              <p className="pt-1"><span className="text-accent font-bold">const</span> <span className="text-text font-bold">club</span> = <span className="text-accent font-bold">new</span> DeveloperClub(&#123;</p>
              <p className="pl-4 flex items-center gap-1.5">
                <span>university: <span className="text-accent/90">'Quantum University'</span>,</span>
                <img src={ASSETS.IMAGES.UNIVERSITY_LOGO_ICON} alt="Quantum University" className="w-3.5 h-3.5 object-contain inline-block opacity-90" />
              </p>
              <p className="pl-4">tracks: [<span className="text-accent/90">'WebDev'</span>, <span className="text-accent/90">'AI/ML'</span>, <span className="text-accent/90">'CyberSec'</span>, <span className="text-accent/90">'Cloud'</span>],</p>
              <p className="pl-4">status: <span className="text-accent font-bold">'ACTIVE_COMMUNITY'</span></p>
              <p>&#125;);</p>
              <p className="text-accent font-bold pt-1 flex items-center gap-1">
                <span>&gt;</span> club.launch(); <Cpu className="w-3.5 h-3.5 text-accent inline animate-pulse" />
              </p>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {hero.stats.map((stat) => {
              const Icon = icons[stat.label] || CalendarDays;
              return (
                <article
                  key={stat.label}
                  className="bg-card rounded-2xl p-4 text-text border border-border shadow-sm hover:shadow-md hover:border-accent/40 transition-all flex flex-col justify-between relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-accent text-[10px] font-mono font-semibold uppercase">
                      {stat.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-text leading-tight block">
                      {stat.value}
                    </span>
                    <span className="text-text-muted text-[11px] font-sans mt-0.5 line-clamp-1 block">
                      {stat.text}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
