import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Image as ImageIcon } from "lucide-react"; // Imported ImageIcon
import { PublicEventCardSkeleton } from "../../../components/common/skeletons";

const EventList = ({ events = [], loading }) => {
  const [activeTab, setActiveTab] = useState("UPCOMING");
  const navigate = useNavigate();

  // Filter and Sort events dynamically based on current date
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = events
      .filter((event) => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date)); 
    const past = events
      .filter((event) => new Date(event.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); 
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const displayEvents = activeTab === "UPCOMING" ? upcomingEvents : pastEvents;

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 border-b-2 border-border pb-2">
          {["UPCOMING", "PAST"].map((tab) => (
            <div key={tab} className="w-32 h-10 bg-card-hover animate-pulse rounded" />
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => <PublicEventCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Dynamic Time-Based Tabs */}
      <div className="flex flex-wrap gap-3 font-bold uppercase tracking-wider text-xs border-b-2 border-border pb-2">
        <button
          onClick={() => setActiveTab("UPCOMING")}
          className={`px-6 py-2.5 border-2 transition-all rounded-lg ${
            activeTab === "UPCOMING"
              ? "border-accent bg-accent text-text"
              : "border-transparent text-text-text-muted hover:border-border hover:text-text"
          }`}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("PAST")}
          className={`px-6 py-2.5 border-2 transition-all rounded-lg ${
            activeTab === "PAST"
              ? "border-text bg-panel text-text-inverse"
              : "border-transparent text-text-text-muted hover:border-border hover:text-text"
          }`}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {displayEvents.length === 0 ? (
          <div className="text-text-text-muted font-bold uppercase tracking-widest text-center py-12 border-2 border-dashed border-border rounded-3xl bg-card/50">
            {activeTab === "UPCOMING"
              ? "No upcoming events scheduled at the moment."
              : "No past events to display."}
          </div>
        ) : (
          displayEvents.map((event) => (
            <div
              key={event._id}
              onClick={() => navigate(`/events/${event._id}`)}
              className="cursor-pointer bg-card rounded-3xl border-2 border-border-soft p-5 sm:p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-[4px_4px_0px_rgba(46,197,212,0.2)] hover:border-accent transition-all duration-300 group"
            >
              
              {/* --- IMAGE AND TITLE WRAPPER --- */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 flex-1 pr-0 lg:pr-4">
                
                {/* SMALL COVER IMAGE */}
                <div className="w-full sm:w-40 h-48 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-card-hover border border-border-soft relative">
                  {event.coverImage ? (
                    <img 
                      src={event.coverImage} 
                      alt={event.eventName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                      <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">No Image</span>
                    </div>
                  )}
                </div>

                {/* Event Title */}
                <div className="flex-1 mt-2 sm:mt-0">
                  <div
                    className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-3 transition-colors ${
                      activeTab === "UPCOMING"
                        ? "bg-card-hover text-accent group-hover:bg-accent group-hover:text-white"
                        : "bg-card-hover text-text-text-muted group-hover:bg-panel group-hover:text-text-inverse"
                    }`}
                  >
                    {activeTab}
                  </div>
                  <h2
                    className={`font-oswald text-2xl sm:text-3xl font-bold uppercase transition-colors leading-tight ${
                      activeTab === "UPCOMING"
                        ? "text-text group-hover:text-accent"
                        : "text-text group-hover:text-text"
                    }`}
                  >
                    {event.eventName}
                  </h2>
                </div>
              </div>

              {/* Event Details (Date/Time) and Action Arrow */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 lg:gap-8 pt-4 lg:pt-0 border-t-2 lg:border-t-0 border-border-soft lg:border-l-2 lg:pl-8">
                <div className="flex flex-col justify-center gap-2 text-text-text-muted text-sm font-bold uppercase tracking-widest min-w-[160px]">
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 ${activeTab === "UPCOMING" ? "text-accent" : "text-text-text-muted"}`} />
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className={`w-4 h-4 ${activeTab === "UPCOMING" ? "text-accent" : "text-text-text-muted"}`} />
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                </div>

                <button
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:-rotate-45 shrink-0 ml-auto sm:ml-0 ${
                    activeTab === "UPCOMING"
                      ? "bg-text text-bg group-hover:bg-accent group-hover:text-text"
                      : "bg-card-hover text-text-text-muted group-hover:bg-panel group-hover:text-text-inverse"
                  }`}
                  aria-label="View event details"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;