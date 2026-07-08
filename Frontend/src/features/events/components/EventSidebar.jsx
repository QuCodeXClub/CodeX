import React from "react";
import { Sparkles, Mail, History, ArrowRight } from "lucide-react";

const EventSidebar = () => {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="font-sans text-sm uppercase tracking-widest font-bold">
            Event Highlights
          </h3>
        </div>

        <div className="bg-panel rounded-2xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] rounded-full pointer-events-none"></div>

          <p className="text-[0.65rem] font-mono text-white/50 tracking-widest uppercase mb-2">
            QHackathon
          </p>
          <h4 className="font-sans text-4xl uppercase leading-[0.9] text-accent mb-6">
            Build The
            <br />
            Future
          </h4>
          <div className="grid grid-cols-3 gap-4 border-b border-white/10 pb-6 mb-6">
            <div>
              <p className="font-sans text-2xl font-bold">400+</p>
              <p className="text-[0.6rem] font-mono text-white/50 uppercase tracking-widest">
                Participants
              </p>
            </div>
            <div>
              <p className="font-sans text-2xl font-bold">80+</p>
              <p className="text-[0.6rem] font-mono text-white/50 uppercase tracking-widest">
                Projects
              </p>
            </div>
            <div>
              <p className="font-sans text-2xl font-bold">2</p>
              <p className="text-[0.6rem] font-mono text-white/50 uppercase tracking-widest">
                Days
              </p>
            </div>
          </div>

          <button type="button" className="w-full py-4 bg-accent text-panel font-sans text-sm uppercase tracking-widest font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 mb-6">
            Register Now <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <div className="grid grid-cols-4 gap-2 text-center bg-black/40 rounded-xl p-4 border border-white/5">
            <div>
              <p className="font-sans text-xl">21</p>
              <p className="text-[0.55rem] font-mono text-white/40 uppercase tracking-widest">
                Days
              </p>
            </div>
            <div>
              <p className="font-sans text-xl">14</p>
              <p className="text-[0.55rem] font-mono text-white/40 uppercase tracking-widest">
                Hrs
              </p>
            </div>
            <div>
              <p className="font-sans text-xl">37</p>
              <p className="text-[0.55rem] font-mono text-white/40 uppercase tracking-widest">
                Mins
              </p>
            </div>
            <div>
              <p className="font-sans text-xl text-accent">59</p>
              <p className="text-[0.55rem] font-mono text-white/40 uppercase tracking-widest text-accent/50">
                Secs
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-line shadow-sm">
        <div className="flex gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="font-sans text-lg uppercase tracking-wide">
              Stay In The Loop
            </h4>
            <p className="text-xs text-ink/60 leading-relaxed mt-1">
              Never miss an event. Get updates, reminders & exclusive invites.
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="events-sidebar-email" className="sr-only">
            Email address
          </label>
          <input
            id="events-sidebar-email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            className="w-full px-4 py-3 bg-white border border-line rounded-lg text-sm font-mono placeholder:text-ink/30 focus:outline-none focus:border-accent transition-colors"
          />
          <button type="submit" className="w-full py-3 bg-panel text-white font-sans text-sm uppercase tracking-widest rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2">
            Subscribe <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-accent" />
          <h3 className="font-sans text-sm uppercase tracking-widest font-bold">
            Past Events
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square bg-panel rounded-lg overflow-hidden relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-accent mix-blend-overlay opacity-20 group-hover:opacity-0 transition-opacity"></div>
              <div className="w-full h-full bg-ink/90 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white/20" />
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink/60 mb-4 leading-relaxed">
          Relive the moments and see what we've built together.
        </p>

        <button type="button" className="text-xs font-mono uppercase tracking-widest text-accent hover:text-ink transition-colors flex items-center gap-1">
          Explore Recaps <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default EventSidebar;
