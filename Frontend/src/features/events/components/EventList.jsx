import React, { useState, useMemo } from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { PublicEventCardSkeleton } from "../../../components/common/skeletons";
import EventCard from "../../../components/common/EventCard";

const EventList = ({ events = [], loading }) => {
  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter and Sort events dynamically based on current date
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();

    const upcoming = events
      .filter((event) => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Closest dates first

    const past = events
      .filter((event) => new Date(event.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent past dates first

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const displayEvents = activeTab === "UPCOMING" ? upcomingEvents : pastEvents;

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="flex gap-4 border-b-2 border-gray-200 pb-2">
          {["UPCOMING", "PAST"].map((tab) => (
            <div
              key={tab}
              className="w-32 h-10 bg-gray-200 animate-pulse rounded"
            ></div>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <PublicEventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Dynamic Time-Based Tabs */}
      <div className="flex flex-wrap gap-3 font-bold uppercase tracking-wider text-xs border-b-2 border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("UPCOMING")}
          className={`px-6 py-2.5 border-2 transition-all rounded-lg ${
            activeTab === "UPCOMING"
              ? "border-[#2ec5d4] bg-[#2ec5d4] text-[#0a0a0a]"
              : "border-transparent text-gray-400 hover:border-gray-400 hover:text-gray-800"
          }`}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("PAST")}
          className={`px-6 py-2.5 border-2 transition-all rounded-lg ${
            activeTab === "PAST"
              ? "border-gray-800 bg-gray-800 text-white"
              : "border-transparent text-gray-400 hover:border-gray-400 hover:text-gray-800"
          }`}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      {/* Event List Section */}
      <div className="flex flex-col gap-5">
        {displayEvents.length === 0 ? (
          <div className="text-gray-500 font-bold uppercase tracking-widest text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
            {activeTab === "UPCOMING"
              ? "No upcoming events scheduled at the moment."
              : "No past events to display."}
          </div>
        ) : (
          displayEvents.map((event) => (
            <div
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer bg-white rounded-3xl border-2 border-gray-100 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-[4px_4px_0px_rgba(46,197,212,0.2)] hover:border-[#2ec5d4] transition-all duration-300 group"
            >
              {/* Event Title */}
              <div className="flex-1 pr-4">
                <div
                  className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-3 transition-colors ${
                    activeTab === "UPCOMING"
                      ? "bg-[#e6f8fa] text-[#2ec5d4] group-hover:bg-[#2ec5d4] group-hover:text-white"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-800 group-hover:text-white"
                  }`}
                >
                  {activeTab}
                </div>
                <h2
                  className={`font-oswald text-2xl sm:text-3xl font-bold uppercase transition-colors leading-tight ${
                    activeTab === "UPCOMING"
                      ? "text-[#0a0a0a] group-hover:text-[#2ec5d4]"
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {event.eventName}
                </h2>
              </div>

              {/* Event Details (Date/Time) and Action Arrow */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 lg:gap-8 pt-4 lg:pt-0 border-t-2 lg:border-t-0 border-gray-100 lg:border-l-2 lg:pl-8">
                <div className="flex flex-col justify-center gap-2 text-gray-500 text-sm font-bold uppercase tracking-widest min-w-[160px]">
                  <div className="flex items-center gap-3">
                    <Calendar
                      className={`w-4 h-4 ${activeTab === "UPCOMING" ? "text-[#2ec5d4]" : "text-gray-400"}`}
                    />
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock
                      className={`w-4 h-4 ${activeTab === "UPCOMING" ? "text-[#2ec5d4]" : "text-gray-400"}`}
                    />
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Arrow Button */}
                <button
                  className={`w-12 h-12 text-white rounded-xl flex items-center justify-center transition-all group-hover:-rotate-45 shrink-0 ml-auto sm:ml-0 ${
                    activeTab === "UPCOMING"
                      ? "bg-[#0a0a0a] group-hover:bg-[#2ec5d4] group-hover:text-[#0a0a0a]"
                      : "bg-gray-300 group-hover:bg-gray-800"
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

      {/* Shared Detailed Modal */}
      {selectedEvent && (
        <EventCard
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventList;
