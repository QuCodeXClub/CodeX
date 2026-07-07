import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "../../context/ConfirmContext";
import { setError, setSuccess } from "../../context/messageSlice";
import {
  fetchAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
} from "../../context/adminEventsSlice";

import EventHeader from "../../components/admin/events/EventHeader";
import EmptyState from "../../components/admin/events/EmptyState";
import EventCard from "../../components/admin/events/EventCard";
import EventModal from "../../components/admin/events/EventModal";
import { EventCardSkeleton } from "../../components/common/SkeletonLoaders";

export default function ManageEvents() {
  const { events, loading, isLoaded } = useSelector((state) => state.adminEvents);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const confirm = useConfirm();
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
      message: "Are you sure you want to delete this event? This will also remove the image from Cloudinary.",
    });

    if (!isConfirmed) return;

    try {
      await dispatch(deleteAdminEvent(id)).unwrap();
      dispatch(fetchAdminEvents());
    } catch (err) {
      // Error handled in thunk
    }
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full relative">
      <EventHeader 
        openCreateModal={openCreateModal} 
        onRefresh={() => dispatch(fetchAdminEvents())}
        loading={loading}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              openEditModal={openEditModal}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <EventModal
          setIsModalOpen={setIsModalOpen}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}
