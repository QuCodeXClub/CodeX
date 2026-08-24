import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Image as ImageIcon, Search, MapPin } from "lucide-react";
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
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-72 bg-card-hover animate-pulse rounded-2xl" />
          ))}
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

      {/* Events Grid Layout */}
      <div>
        {displayEvents.length === 0 ? (
          <div className="text-text-muted font-mono text-xs uppercase tracking-widest text-center py-16 border border-dashed border-border/80 rounded-2xl bg-card/40">
            {searchQuery
              ? `No events matching "${searchQuery}".`
              : activeTab === "UPCOMING"
              ? "No upcoming events scheduled at the moment."
              : "No past events found."}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayEvents.map((event) => (
              <div
                key={event._id}
                onClick={() => navigate(`/events/${event._id}`)}
                className="bg-card border border-border/80 rounded-2xl flex flex-col cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
              >
                
                {/* 1920x557 Banner Image Section */}
                <div className="w-full aspect-[1920/557] shrink-0 bg-card-hover border-b border-border/60 relative overflow-hidden">
                  {event.coverImage ? (
                    <img 
                      src={event.coverImage} 
                      alt={event.eventName} 
                      className="w-full h-full object-contain bg-black/5 group-hover:scale-[1.02] transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                      <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">No Cover</span>
                    </div>
                  )}
                </div>

                {/* Event Content Section */}
                <div className="p-5 flex flex-col flex-1">
                  
                  {/* Top row: Status Badge & View Arrow */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      activeTab === "UPCOMING"
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "bg-card-hover text-text-muted border border-border"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${activeTab === "UPCOMING" ? 'bg-accent animate-pulse' : 'bg-text-muted'}`}></span>
                      {activeTab === "UPCOMING" ? "REGISTRATION OPEN" : "COMPLETED"}
                    </span>
                    
                    <div className="w-8 h-8 rounded-full bg-card-hover border border-border/80 flex items-center justify-center text-text group-hover:bg-accent group-hover:text-text-inverse group-hover:border-accent transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                  
                  {/* Event Title */}
                  <h2 className="font-display font-bold text-2xl uppercase text-text group-hover:text-accent transition-colors leading-tight mb-4 line-clamp-2">
                    {event.eventName}
                  </h2>
                  
                  {/* Spacer to push metadata to the bottom if titles vary in length */}
                  <div className="flex-1"></div>

                  {/* Event Metadata (Date, Time, Location) */}
                  <div className="pt-4 border-t border-border/60 mt-auto flex flex-wrap items-center gap-4 text-xs font-mono font-semibold text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-accent" />
                      <span>
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span>Offline</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;