import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Edit,
  Trash2,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "../../context/ConfirmContext";
import {
  fetchAdminEvents,
  deleteAdminEvent,
} from "../../context/adminEventsSlice";

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
    <div className="p-8 lg:p-10 font-sans text-text min-h-full relative">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {events.map((event) => (
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
                    src={event.coverImage}
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
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(event.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
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
          ))}
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