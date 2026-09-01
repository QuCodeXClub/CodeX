import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "../../context/ConfirmContext";
import {
  fetchAdminEvents,
  deleteAdminEvent,
  setCurrentPage,
  setFilterType,
  setSearchQuery,
  setDebouncedSearch,
  setLimit,
  clearFilters,
} from "../../context/adminEventsSlice";
import {
  normalizeEvent,
  optimizeCloudinaryUrl,
  isRegistrationOpen,
} from "../../utils/helpers";
import { EventCardSkeleton } from "../../components/common/skeletons";

import EventHeader from "../../components/admin/events/EventHeader";
import EmptyState from "../../components/admin/events/EmptyState";
import EventModal from "../../components/admin/events/EventModal";

export default function ManageEvents() {
  const {
    pages,
    currentPage,
    filterType,
    searchQuery,
    debouncedSearch,
    limit,
    total,
    totalPages,
    loading,
    isLoaded,
  } = useSelector((state) => state.adminEvents);

  const events = pages[currentPage] || [];
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const navigate = useNavigate();

  // Local Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const containerRef = useRef(null);

  // Debounce search query (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setDebouncedSearch(searchQuery.trim()));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  // Fetch data on dependency changes (uses cache if available)
  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
    };
    if (filterType === "UPCOMING") params.type = "upcoming";
    if (filterType === "PAST") params.type = "past";
    if (debouncedSearch) params.search = debouncedSearch;

    dispatch(fetchAdminEvents(params));
  }, [dispatch, currentPage, limit, filterType, debouncedSearch]);

  // Scroll to top of section on page change
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Delete Event",
      message:
        "Are you sure you want to delete this event? This will also remove the cover image from Cloudinary.",
    });

    if (!isConfirmed) return;

    try {
      await dispatch(deleteAdminEvent(id)).unwrap();
      // If we deleted the last item on a page > 1, step back
      const remainingOnPage = events.length - 1;
      const targetPage =
        remainingOnPage === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
      dispatch(setCurrentPage(targetPage));
      dispatch(
        fetchAdminEvents({
          page: targetPage,
          limit,
          type: filterType === "UPCOMING" ? "upcoming" : filterType === "PAST" ? "past" : undefined,
          search: debouncedSearch || undefined,
          force: true,
        })
      );
    } catch {
      // Error handled in thunk
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);
  const isFiltered = Boolean(debouncedSearch || filterType !== "ALL");

  return (
    <div
      ref={containerRef}
      className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full relative flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <EventHeader
          openCreateModal={openCreateModal}
          onRefresh={() =>
            dispatch(
              fetchAdminEvents({
                page: currentPage,
                limit,
                type:
                  filterType === "UPCOMING"
                    ? "upcoming"
                    : filterType === "PAST"
                    ? "past"
                    : undefined,
                search: debouncedSearch || undefined,
                force: true,
              })
            )
          }
          loading={loading}
        />

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-card border border-border rounded-xl overflow-x-auto shadow-sm">
            {[
              { id: "ALL", label: "All Events" },
              { id: "UPCOMING", label: "Upcoming" },
              { id: "PAST", label: "Past" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => dispatch(setFilterType(tab.id))}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filterType === tab.id
                    ? "bg-accent text-text-inverse shadow-sm"
                    : "text-text-muted hover:text-text hover:bg-card-hover"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Limit Controls */}
          <div className="flex flex-1 items-center gap-3 sm:gap-4 justify-end">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search event name, location, tags..."
                className="w-full bg-card border border-border rounded-xl pl-9 pr-9 py-2 text-xs font-mono text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(""))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text rounded-md transition-colors cursor-pointer"
                  title="Clear Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Per Page Selector */}
            <div className="flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted hidden sm:block" />
              <select
                value={limit}
                onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
                className="bg-card border border-border rounded-xl px-2.5 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent cursor-pointer transition-colors shadow-sm"
                title="Items per page"
              >
                <option value={6}>6 / page</option>
                <option value={12}>12 / page</option>
                <option value={24}>24 / page</option>
                <option value={48}>48 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading && events.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: limit }).map((_, idx) => (
              <EventCardSkeleton key={idx} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            isFiltered={isFiltered}
            onClearFilters={handleClearFilters}
            openCreateModal={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {events.map((rawEvent) => {
              const event = normalizeEvent(rawEvent);
              const isPast = new Date(event.date) < new Date();
              const regOpen = isRegistrationOpen(event);

              return (
                <div
                  key={event._id}
                  className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl overflow-hidden shadow-lg hover:border-accent/40 hover:shadow-accent/10 transition-all flex flex-col group relative"
                >
                  {/* Cover Image Banner */}
                  <div
                    className="w-full h-44 bg-card-hover relative border-b border-border/60 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    {event.coverImage ? (
                      <img
                        src={optimizeCloudinaryUrl(event.coverImage, 400)}
                        alt={event.eventName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-card">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-40 text-accent" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                          NO COVER BANNER
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* Registration Status Pill */}
                    <div className="absolute top-3 left-3 z-10">
                      {isPast ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/75 text-text-muted border border-white/10 backdrop-blur-md">
                          Completed
                        </span>
                      ) : regOpen ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent text-text-inverse border border-accent/40 shadow-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Reg Open
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-warning/20 text-warning border border-warning/40 backdrop-blur-md">
                          Reg Closed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => navigate(`/events/${event._id}`)}
                        className="text-base font-display font-bold text-text truncate group-hover:text-accent transition-colors cursor-pointer uppercase tracking-tight"
                        title={event.eventName}
                      >
                        {event.eventName}
                      </h3>

                      {/* Event Date & Time */}
                      <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted mt-2">
                        <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="truncate">
                          {new Date(event.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(event.date).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Registration Close Deadline if configured */}
                      {event.registrationCloseDate && !isPast && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-warning/90 mt-1">
                          <Clock className="w-3 h-3 text-warning shrink-0" />
                          <span className="truncate">
                            Reg Closes:{" "}
                            {new Date(event.registrationCloseDate).toLocaleDateString(
                              "en-IN",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}{" "}
                            at{" "}
                            {new Date(event.registrationCloseDate).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      )}

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted mt-1.5">
                        {event.locationType === "Online" ? (
                          <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                        )}
                        <span className="truncate">
                          {event.locationType === "Online"
                            ? event.location
                              ? `Online — ${event.location}`
                              : "Online"
                            : event.location || "Offline"}
                        </span>
                        <span
                          className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                            event.locationType === "Online"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-accent/10 text-accent border border-accent/20"
                          }`}
                        >
                          {event.locationType}
                        </span>
                      </div>

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {event.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-card-hover border border-border/60 rounded-full text-[9px] font-mono font-semibold text-text-muted truncate max-w-[120px]"
                            >
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="px-2 py-0.5 bg-card-hover border border-border/60 rounded-full text-[9px] font-mono text-text-muted">
                              +{event.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 border-t border-border/60 mt-4 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/events/${event._id}`)}
                        className="text-xs font-mono font-bold text-accent hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        View Details &rarr;
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(event);
                          }}
                          className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-xl transition-all border border-transparent hover:border-accent/30 cursor-pointer"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(event._id);
                          }}
                          className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all border border-transparent hover:border-danger/30 cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 pt-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-text-muted flex items-center gap-1.5">
            <span>
              Showing <strong className="text-text">{startItem}–{endItem}</strong> of{" "}
              <strong className="text-text">{total}</strong> events
            </span>
            <span className="text-border">•</span>
            <span>
              Page <strong className="text-accent">{currentPage}</strong> of{" "}
              <strong className="text-text">{totalPages}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* First Page */}
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1 || loading}
              className="p-2 rounded-xl bg-card border border-border/80 text-text hover:bg-card-hover hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="p-2 rounded-xl bg-card border border-border/80 text-text hover:bg-card-hover hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages
              )
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <div key={p} className="flex items-center gap-1">
                    {showEllipsis && (
                      <span className="px-1 text-xs font-mono text-text-muted select-none">
                        ...
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePageChange(p)}
                      disabled={loading}
                      className={`min-w-[36px] h-9 px-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-sm ${
                        currentPage === p
                          ? "bg-accent text-text-inverse shadow-accent/20 border border-accent scale-105"
                          : "bg-card border border-border/80 text-text hover:bg-card-hover hover:border-accent/40"
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                );
              })}

            {/* Next Page */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className="p-2 rounded-xl bg-card border border-border/80 text-text hover:bg-card-hover hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage >= totalPages || loading}
              className="p-2 rounded-xl bg-card border border-border/80 text-text hover:bg-card-hover hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Form Modal for Creating/Editing */}
      {isModalOpen && (
        <EventModal
          setIsModalOpen={setIsModalOpen}
          editingEvent={editingEvent}
          onSuccess={() => loadEvents(currentPage)}
        />
      )}
    </div>
  );
}