import React, { useState } from "react";
import { createPortal } from "react-dom"; // <-- Added for portal
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { X, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  createAdminEvent,
  updateAdminEvent,
  fetchAdminEvents,
} from "../../../context/adminEventsSlice";
import RichTextEditor from "../../common/RichTextEditor";

export default function EventModal({ setIsModalOpen, editingEvent }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    editingEvent?.coverImage || null
  );
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [description, setDescription] = useState(
    editingEvent?.description || ""
  );
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      eventName: editingEvent?.eventName || "",
      date: editingEvent
        ? new Date(editingEvent.date).toISOString().slice(0, 16)
        : "",
      registrationLink: editingEvent?.registrationLink || "",
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("eventName", data.eventName);
      submitData.append("date", data.date);
      if (!description.trim()) {
        setIsSubmitting(false);
        return;
      }

      submitData.append("description", description);
      if (data.registrationLink)
        submitData.append("registrationLink", data.registrationLink);
      if (coverImageFile) submitData.append("coverImage", coverImageFile);

      if (editingEvent) {
        await dispatch(
          updateAdminEvent({ id: editingEvent._id, formData: submitData })
        ).unwrap();
      } else {
        await dispatch(createAdminEvent(submitData)).unwrap();
      }
      setIsModalOpen(false);
      dispatch(fetchAdminEvents());
    } catch (err) {
      if (err.response?.data?.errors?.length > 0) {
        err.response.data.errors.forEach((e) => {
          if (e.field)
            setError(e.field, { type: "server", message: e.message });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the modal directly into the document body to prevent sidebar overlap
  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-panel/80 backdrop-blur-sm overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 md:p-8">
        
        <div className="w-full max-w-6xl bg-card border border-border rounded-2xl shadow-xl relative flex flex-col my-8">
          
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-text-muted hover:text-text p-2 hover:bg-card-hover rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-6 md:p-8 lg:p-10 flex-1 flex flex-col">
            <h2 className="text-xl lg:text-2xl font-bold text-text border-b border-border-soft pb-4 mb-6">
              {editingEvent ? "Edit Event Details" : "Create New Event"}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">
                    Event Name
                  </label>
                  <input
                    type="text"
                    {...register("eventName", {
                      required: "Event name is required",
                    })}
                    className={`w-full bg-card border ${errors.eventName ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border focus:ring-accent/20 focus:border-accent"} text-text rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                    placeholder="Event Name"
                  />
                  {errors.eventName && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.eventName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    {...register("date", { required: "Date is required" })}
                    className={`w-full bg-card border ${errors.date ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border focus:ring-accent/20 focus:border-accent"} text-text rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-semibold text-text mb-1.5">
                  Description
                </label>
                <RichTextEditor value={description} onChange={setDescription} />
                {errors.description && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">
                    Registration URL{" "}
                    <span className="text-text-muted font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className={`absolute left-3 top-2.5 w-4 h-4 ${errors.registrationLink ? 'text-danger' : 'text-text-muted'}`} />
                    <input
                      type="url"
                      {...register("registrationLink", {
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Must be a valid URL starting with http:// or https://"
                        }
                      })}
                      className={`w-full bg-card border ${errors.registrationLink ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border focus:ring-accent/20 focus:border-accent'} text-text rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                      placeholder="https://..."
                    />
                  </div>
                  {errors.registrationLink && <p className="mt-1 text-xs text-danger">{errors.registrationLink.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">
                    Cover Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="w-full sm:flex-1 border-2 border-dashed border-border bg-card hover:bg-accent/10 hover:border-accent rounded-xl p-6 text-center cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <ImageIcon className="w-8 h-8 text-text-muted mx-auto mb-2 group-hover:text-accent transition-colors" />
                      <span className="text-sm font-medium text-text-muted group-hover:text-accent block">
                        Click to browse or drag image
                      </span>
                    </label>
                    {imagePreview && (
                      <div className="w-full sm:w-28 sm:h-28 border border-border rounded-xl overflow-hidden shrink-0 bg-card shadow-sm aspect-video sm:aspect-square">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 shrink-0 border-t border-border-soft mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto md:min-w-[200px] md:ml-auto flex items-center justify-center gap-2 bg-accent text-[#111111] py-3 px-8 rounded-xl text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : editingEvent ? (
                    "Save Changes"
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body 
  );
}