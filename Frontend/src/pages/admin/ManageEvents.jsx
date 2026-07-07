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

export default function ManageEvents() {
  const { events, loading } = useSelector((state) => state.adminEvents);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confirm = useConfirm();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    description: "",
    registrationLink: "",
    coverImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminEvents());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      eventName: "",
      date: "",
      description: "",
      registrationLink: "",
      coverImage: null,
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingId(event._id);
    const formattedDate = new Date(event.date).toISOString().slice(0, 16);
    setFormData({
      eventName: event.eventName,
      date: formattedDate,
      description: event.description,
      registrationLink: event.registrationLink || "",
      coverImage: null,
    });
    setImagePreview(event.coverImage);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("eventName", formData.eventName);
      submitData.append("date", formData.date);
      submitData.append("description", formData.description);
      if (formData.registrationLink)
        submitData.append("registrationLink", formData.registrationLink);
      if (formData.coverImage) {
        submitData.append("coverImage", formData.coverImage);
      }

      if (editingId) {
        await dispatch(updateAdminEvent({ id: editingId, formData: submitData })).unwrap();
      } else {
        await dispatch(createAdminEvent(submitData)).unwrap();
      }
      setIsModalOpen(false);
      dispatch(fetchAdminEvents());
    } catch (err) {
      // Error is handled in the thunk via messageSlice
    } finally {
      setIsSubmitting(false);
    }
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
      <EventHeader openCreateModal={openCreateModal} />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-4" />
          <span className="text-slate-500 font-medium text-sm">
            Syncing Database...
          </span>
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
          editingId={editingId}
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          imagePreview={imagePreview}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
