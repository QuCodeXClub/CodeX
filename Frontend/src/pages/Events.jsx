import React from "react";
import EventList from "../features/events/components/EventList";
import PageContainer from "../components/common/PageContainer";
import { Sparkles } from "lucide-react";

const Events = () => {
  return (
    <div className="events-page flex flex-col min-h-screen bg-transparent relative font-sans">
      <div className="relative z-10 pt-8 pb-20">
        <PageContainer>
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TIMELINE & SCHEDULE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-black text-text uppercase tracking-tight">
              COMMUNITY <span className="text-accent">EVENTS</span>
            </h1>

            <p className="text-sm sm:text-base text-text-muted mt-2 max-w-2xl">
              Discover our upcoming hackathons, tech workshops, coding bootcamps, and browse past community activities.
            </p>
          </header>

          <div className="w-full">
            <EventList />
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default Events;