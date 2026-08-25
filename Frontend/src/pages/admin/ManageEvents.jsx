import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Edit,
  Trash2,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Globe,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "../../context/ConfirmContext";
import {
  fetchAdminEvents,
  deleteAdminEvent,
} from "../../context/adminEventsSlice";
import { normalizeEvent, optimizeCloudinaryUrl } from "../../utils/helpers";

import EventHeader from "../../components/admin/events/EventHeader";
import EmptyState from "../../components/admin/events/EmptyState";
import EventModal from "../../components/admin/events/EventModal";

export default function ManageEvents() {
  const { events, loading, isLoaded } = useSelector(
    (state) => state.adminEvents
  );
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const navigate = useNavigate(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchAdminEvents());
    }
  }, [dispatch, isLoaded]);

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
        "Are you sure you want to delete this event? This will also remove the image from Cloudinary.",
    });

    if (!isConfirmed) return;

    try {
      await dispatch(deleteAdminEvent(id)).unwrap();
      dispatch(fetchAdminEvents());
    } catch {
      // Error handled in thunk
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full relative">
      <EventHeader
        openCreateModal={openCreateModal}
        onRefresh={() => dispatch(fetchAdminEvents())}
        loading={loading}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {events.map((rawEvent) => {
            const event = normalizeEvent(rawEvent);
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
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="text-base font-display font-bold text-text truncate group-hover:text-accent transition-colors cursor-pointer uppercase tracking-tight"
                  >
                    {event.eventName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted mt-2">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>
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

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted mt-1.5">
                    {event.locationType === "Online" ? (
                      <Globe className="w-3.5 h-3.5 text-accent" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                    )}
                    <span className="truncate">
                      {event.locationType === "Online"
                        ? event.location ? `Online — ${event.location}` : "Online"
                        : event.location || "Offline"}
                    </span>
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      event.locationType === "Online"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-accent/10 text-accent border border-accent/20"
                    }`}>
                      {event.locationType}
                    </span>
                  </div>

                  {/* Tags */}
                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {event.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-card-hover border border-border/60 rounded-full text-[9px] font-mono font-semibold text-text-muted"
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

      {/* Form Modal for Creating/Editing */}
      {isModalOpen && (
        <EventModal
          setIsModalOpen={setIsModalOpen}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}