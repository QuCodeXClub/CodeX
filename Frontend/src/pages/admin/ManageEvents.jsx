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
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <ul className="divide-y divide-border-soft">
            {events.map((event) => (
              <li
                key={event._id}
                onClick={() => navigate(`/events/${event._id}`)}
                className="p-4 sm:p-5 hover:bg-card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer group"
              >
                {/* Event Info (Left Side) */}
                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                  <div className="w-16 h-16 rounded-lg bg-card-hover border border-border overflow-hidden shrink-0 flex items-center justify-center">
                    {event.coverImage ? (
                      <img
                        src={event.coverImage}
                        alt={event.eventName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-text truncate group-hover:text-accent transition-colors">
                      {event.eventName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-text-muted mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {" • "}
                      {new Date(event.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {/* Actions (Right Side) */}
                <div
                  className="flex items-center gap-2 sm:ml-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEditModal(event)}
                    className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                    title="Edit Event"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
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