import React from 'react';
import Button from '../../../components/common/Button';
import { Play } from 'lucide-react';

const EventsHero = () => {
  return (
    <section className="relative overflow-hidden border-b border-line bg-[#f8f5f0] pt-16 pb-24 lg:pt-24 lg:pb-32 px-[1.15rem] lg:px-12">
      
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
          <span className="inline-block px-4 py-1.5 border border-line rounded-full text-xs font-mono tracking-widest uppercase mb-8 bg-white/50 backdrop-blur-sm">
            // All Events
          </span>
          <h1 className="font-sans text-[clamp(4rem,7vw,6.5rem)] leading-[0.85] tracking-tight uppercase mb-6">
            Build. Learn.<br />
            <span className="text-accent">Connect.</span>
          </h1>
          <p className="text-ink/60 max-w-md text-lg mb-10 leading-relaxed">
            From hackathons to hands-on workshops, join experiences that push boundaries and build the future.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Button to="#upcoming" variant="solid">
              Explore Events →
            </Button>
            <button className="flex items-center gap-3 text-sm font-sans tracking-widest uppercase hover:text-accent transition-colors">
              <span className="flex items-center justify-center w-10 h-10 rounded-full border border-accent text-accent bg-accent/10">
                <Play fill="currentColor" className="w-4 h-4 ml-1" />
              </span>
              Watch Recap
            </button>
          </div>
        </div>
        <div className="relative h-[400px] hidden lg:block">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
             <span className="text-[30rem] font-sans font-bold text-accent leading-none">X</span>
          </div>
          <div className="absolute top-1/2 left-[10%] -translate-y-1/2 -rotate-12 w-56 h-72 bg-panel rounded-xl shadow-2xl border border-white/10 z-10 overflow-hidden opacity-80 scale-90 transition-all duration-500 ease-out hover:rotate-0 hover:scale-105 hover:opacity-100 hover:z-50 cursor-pointer">
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                <p className="text-white font-sans text-lg uppercase tracking-wide">Crazy UI/UX</p>
                <p className="text-accent text-xs font-mono mt-1">March 10, 2026</p>
             </div>
          </div>
          <div className="absolute top-1/2 right-[10%] -translate-y-1/2 rotate-12 w-56 h-72 bg-panel rounded-xl shadow-2xl border border-white/10 z-20 overflow-hidden opacity-80 scale-90 transition-all duration-500 ease-out hover:rotate-0 hover:scale-105 hover:opacity-100 hover:z-50 cursor-pointer">
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                <p className="text-white font-sans text-lg uppercase tracking-wide">Automation N8B</p>
                <p className="text-accent text-xs font-mono mt-1">Jul 05, 2026</p>
             </div>
          </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-[22rem] bg-panel rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 z-30 overflow-hidden transition-all duration-500 ease-out hover:scale-105 hover:z-50 cursor-pointer">
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-sans text-2xl uppercase mb-1 leading-tight">QHackathon 2026</h3>
                <p className="text-accent text-xs font-mono mb-4 tracking-widest">Build · Break · Innovate</p>
                <p className="text-white/60 text-xs font-mono flex items-center gap-2">
                   Jun 21 - 23, 2026
                </p>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EventsHero;