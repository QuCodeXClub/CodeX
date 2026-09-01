import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  ArrowRight,
  Image as ImageIcon,
  Search,
  MapPin,
  Globe,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
} from "lucide-react";
import {
  fetchAllEvents,
  fetchUpcomingEvents,
  fetchPastEvents,
} from "../../../context/eventsSlice";
import {
  normalizeEvent,
  optimizeCloudinaryUrl,
  isRegistrationOpen,
} from "../../../utils/helpers";

const EventList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { all, upcoming, past } = useSelector((state) => state.events);

  const [activeTab, setActiveTab] = useState("ALL"); // "ALL" | "UPCOMING" | "PAST"
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allPage, setAllPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const limit = 6;

  // Debounce search query input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch events on mount and when debouncedSearch changes
  useEffect(() => {
    // Reset pagination to page 1 on search change
    setAllPage(1);
    setUpcomingPage(1);
    setPastPage(1);

    // Fetch active tab first, then remaining tabs in background
    dispatch(fetchAllEvents({ page: 1, limit, search: debouncedSearch }));
    dispatch(fetchUpcomingEvents({ page: 1, limit, search: debouncedSearch }));
    dispatch(fetchPastEvents({ page: 1, limit, search: debouncedSearch }));
  }, [dispatch, debouncedSearch, limit]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "ALL" && !all.isLoaded) {
      dispatch(fetchAllEvents({ page: allPage, limit, search: debouncedSearch }));
    } else if (tab === "UPCOMING" && !upcoming.isLoaded) {
      dispatch(fetchUpcomingEvents({ page: upcomingPage, limit, search: debouncedSearch }));
    } else if (tab === "PAST" && !past.isLoaded) {
      dispatch(fetchPastEvents({ page: pastPage, limit, search: debouncedSearch }));
    }
  };

  const handlePageChange = (newPage) => {
    if (activeTab === "ALL") {
      setAllPage(newPage);
      dispatch(
        fetchAllEvents({
          page: newPage,
          limit,
          search: debouncedSearch,
        })
      );
    } else if (activeTab === "UPCOMING") {
      setUpcomingPage(newPage);
      dispatch(
        fetchUpcomingEvents({
          page: newPage,
          limit,
          search: debouncedSearch,
        })
      );
    } else {
      setPastPage(newPage);
      dispatch(
        fetchPastEvents({
          page: newPage,
          limit,
          search: debouncedSearch,
        })
      );
    }

    // Smooth scroll back to events container top
    const eventHeader = document.querySelector(".events-page");
    if (eventHeader) {
      eventHeader.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getCurrentFeed = () => {
    if (activeTab === "ALL") {
      if (all.events.length === 0 && upcoming.events.length > 0 && !debouncedSearch) {
        return upcoming;
      }
      return all;
    }
    if (activeTab === "UPCOMING") return upcoming;
    return past;
  };

  const getCurrentPage = () => {
    if (activeTab === "ALL") return allPage;
    if (activeTab === "UPCOMING") return upcomingPage;
    return pastPage;
  };

  const currentFeed = getCurrentFeed();
  const currentPage = getCurrentPage();
  const rawEvents = currentFeed?.events || [];
  const events = rawEvents.map(normalizeEvent);
  const pagination = currentFeed?.pagination || {
    page: 1,
    limit,
    total: events.length,
    totalPages: 1,
  };
  const totalPages = pagination.totalPages || 1;
  const totalCount = pagination.total || events.length;

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Search Bar & Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        {/* Tabs: All Events / Upcoming / Past */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-card-hover/80 p-1 rounded-xl border border-border/60 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange("ALL")}
            className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "ALL"
                ? "bg-accent text-text-inverse shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            All Events ({all.pagination?.total ?? all.events.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("UPCOMING")}
            className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "UPCOMING"
                ? "bg-accent text-text-inverse shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            Upcoming ({upcoming.pagination?.total ?? upcoming.events.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("PAST")}
            className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "PAST"
                ? "bg-accent text-text-inverse shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            Past ({past.pagination?.total ?? past.events.length})
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, venue, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border/80 rounded-xl py-2 pl-10 pr-9 text-xs font-mono text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted/60 shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text rounded-md transition-colors cursor-pointer"
              title="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Events Grid or Skeleton Loader */}
      <div>
        {currentFeed.loading && events.length === 0 ? (
          /* Skeleton Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full h-80 bg-card border border-border/60 animate-pulse rounded-2xl flex flex-col overflow-hidden"
              >
                <div className="w-full aspect-[1920/557] bg-card-hover" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="w-1/3 h-5 bg-card-hover rounded-full mb-3" />
                  <div className="w-3/4 h-7 bg-card-hover rounded-lg mb-4" />
                  <div className="w-1/2 h-4 bg-card-hover rounded-md mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-text-muted font-mono text-xs uppercase tracking-widest text-center py-16 border border-dashed border-border/80 rounded-2xl bg-card/40 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-8 h-8 opacity-40 text-accent mb-1" />
            <span>
              {debouncedSearch
                ? `No events matching "${debouncedSearch}".`
                : activeTab === "UPCOMING"
                ? "No upcoming events scheduled at the moment."
                : activeTab === "PAST"
                ? "No past events found."
                : "No events available at the moment."}
            </span>
            {debouncedSearch ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card-hover hover:bg-card border border-border text-accent font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Clear Search Filter
              </button>
            ) : activeTab === "UPCOMING" && past.events.length > 0 ? (
              <button
                type="button"
                onClick={() => handleTabChange("PAST")}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card-hover hover:bg-card border border-border text-accent font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Browse Past Events &rarr;
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => {
              const isPastEvent = new Date(event.date) < new Date();
              const regOpen = isRegistrationOpen(event);

              return (
                <div
                  key={event._id}
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="bg-card border border-border/80 rounded-2xl flex flex-col cursor-pointer group hover:shadow-xl hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative"
                >
                  {/* 1920x557 Banner Image Section */}
                  <div className="w-full aspect-[1920/557] shrink-0 bg-card-hover border-b border-border/60 relative overflow-hidden">
                    {event.coverImage ? (
                      <img
                        src={optimizeCloudinaryUrl(event.coverImage, 800)}
                        alt={event.eventName}
                        className="w-full h-full object-contain bg-black/5 group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                        <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                        <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">
                          No Cover
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Content Section */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* Top row: Status Badge & View Arrow */}
                    <div className="flex items-center justify-between mb-3">
                      {isPastEvent ? (
                        <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-card-hover text-text-muted border border-border">
                          <span className="w-1.5 h-1.5 rounded-full mr-2 bg-text-muted" />
                          COMPLETED
                        </span>
                      ) : regOpen ? (
                        <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/30 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full mr-2 bg-accent animate-pulse" />
                          REGISTRATION OPEN
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-warning/10 text-warning border border-warning/30">
                          <span className="w-1.5 h-1.5 rounded-full mr-2 bg-warning" />
                          REGISTRATION CLOSED
                        </span>
                      )}

                      <div className="w-8 h-8 rounded-full bg-card-hover border border-border/80 flex items-center justify-center text-text group-hover:bg-accent group-hover:text-text-inverse group-hover:border-accent transition-all duration-300 shadow-sm">
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    {/* Event Title */}
                    <h2 className="font-display font-bold text-2xl uppercase text-text group-hover:text-accent transition-colors leading-tight mb-3 line-clamp-2">
                      {event.eventName}
                    </h2>

                    {/* Registration Deadline Notification (for upcoming events with configured close date) */}
                    {!isPastEvent && event.registrationCloseDate && (
                      <p className="text-[11px] font-mono text-text-muted mb-3 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-accent shrink-0" />
                        <span>
                          {regOpen ? "Closes on: " : "Closed on: "}
                          <strong className="text-text">
                            {new Date(event.registrationCloseDate).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            at{" "}
                            {new Date(event.registrationCloseDate).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </strong>
                        </span>
                      </p>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {event.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full bg-card-hover border border-border/60 text-[10px] font-mono font-semibold text-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                        {event.tags.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full bg-card-hover border border-border/60 text-[10px] font-mono text-text-muted">
                            +{event.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Event Metadata (Date, Time, Location) */}
                    <div className="pt-4 border-t border-border/60 mt-auto flex flex-wrap items-center gap-4 text-xs font-mono font-semibold text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-accent shrink-0" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-accent shrink-0" />
                        <span>
                          {new Date(event.date).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Dynamic location */}
                      <div className="flex items-center gap-1.5">
                        {event.locationType === "Online" ? (
                          <Globe className="w-4 h-4 text-accent shrink-0" />
                        ) : (
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                        )}
                        <span className="truncate max-w-[160px]">
                          {event.locationType === "Online"
                            ? event.location
                              ? `Online — ${event.location}`
                              : "Online"
                            : event.location || "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-text-muted">
            Showing <strong className="text-text">{events.length}</strong> of{" "}
            <strong className="text-text">{totalCount}</strong>{" "}
            {activeTab === "ALL" ? "total" : activeTab.toLowerCase()} events (Page {currentPage} of {totalPages})
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || currentFeed.loading}
              className="p-2 rounded-xl bg-card border border-border/80 text-text hover:bg-card-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <div key={p} className="flex items-center gap-1">
                    {showEllipsis && (
                      <span className="px-1 text-xs font-mono text-text-muted select-none">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePageChange(p)}
                      disabled={currentFeed.loading}
                      className={`min-w-[36px] h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-sm ${
                        currentPage === p
                          ? "bg-accent text-text-inverse shadow-accent/20 border border-accent scale-105"
                          : "bg-card border border-border/80 text-text hover:bg-card-hover"
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                );
              })}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || currentFeed.loading}
              className="p-2 rounded-xl bg-card border border-border/80 text-text hover:bg-card-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;