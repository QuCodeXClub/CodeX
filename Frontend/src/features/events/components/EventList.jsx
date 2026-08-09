import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Image as ImageIcon, Search } from "lucide-react";
import { PublicEventCardSkeleton } from "../../../components/common/skeletons";

const EventList = ({ events = [], loading }) => {
  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Filter and Sort events dynamically based on current date and search query
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const filtered = events.filter((e) =>
      e.eventName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const upcoming = filtered
      .filter((event) => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const past = filtered
      .filter((event) => new Date(event.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events, searchQuery]);

  const displayEvents = activeTab === "UPCOMING" ? upcomingEvents : pastEvents;

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex gap-3">
          {[1, 2].map((tab) => (
            <div key={tab} className="w-36 h-10 bg-card-hover animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => <PublicEventCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Search Bar & Time Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-card-hover/80 p-1 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("UPCOMING")}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "UPCOMING"
                ? "bg-accent text-text-inverse shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            Upcoming ({upcomingEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PAST")}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "PAST"
                ? "bg-accent text-text-inverse shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            Past ({pastEvents.length})
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border/80 rounded-xl py-2 pl-10 pr-4 text-xs font-mono text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/60"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="flex flex-col gap-5">
        {displayEvents.length === 0 ? (
          <div className="text-text-muted font-mono text-xs uppercase tracking-widest text-center py-16 border border-dashed border-border/80 rounded-2xl bg-card/40">
            {searchQuery
              ? `No events matching "${searchQuery}".`
              : activeTab === "UPCOMING"
              ? "No upcoming events scheduled at the moment."
              : "No past events found."}
          </div>
        ) : (
          displayEvents.map((event) => (
            <div
              key={event._id}
              onClick={() => navigate(`/events/${event._id}`)}
              className="glass-card glass-card-hover p-5 sm:p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer group relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 flex-1">
                
                {/* Cover Image Thumbnail */}
                <div className="w-full sm:w-44 h-44 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-card-hover border border-border/60 relative">
                  {event.coverImage ? (
                    <img 
                      src={event.coverImage} 
                      alt={event.eventName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                      <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">No Image</span>
                    </div>
                  )}
                </div>

                {/* Event Information */}
                <div className="flex-1">
                  <span className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2 ${
                    activeTab === "UPCOMING"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "bg-card-hover text-text-muted border border-border"
                  }`}>
                    {activeTab === "UPCOMING" ? "SCHEDULED" : "COMPLETED"}
                  </span>
                  
                  <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase text-text group-hover:text-accent transition-colors leading-tight mb-2">
                    {event.eventName}
                  </h2>
                </div>
              </div>

              {/* Event Details (Date & Time) */}
              <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/60 lg:border-l lg:pl-6">
                <div className="flex flex-col gap-1.5 text-xs font-mono font-semibold text-text-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>
                      {new Date(event.date).toLocaleTimeString([], {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-card-hover border border-border/80 flex items-center justify-center text-text group-hover:bg-accent group-hover:text-text-inverse group-hover:border-accent transition-all duration-300">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;