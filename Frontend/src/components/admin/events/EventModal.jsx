import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { X, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { createAdminEvent, updateAdminEvent, fetchAdminEvents } from "../../../context/adminEventsSlice";

export default function EventModal({
  setIsModalOpen,
  editingEvent,
}) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(editingEvent?.coverImage || null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      eventName: editingEvent?.eventName || "",
      date: editingEvent ? new Date(editingEvent.date).toISOString().slice(0, 16) : "",
      description: editingEvent?.description || "",
      registrationLink: editingEvent?.registrationLink || "",
    }
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
      submitData.append("description", data.description);
      if (data.registrationLink) submitData.append("registrationLink", data.registrationLink);
      if (coverImageFile) submitData.append("coverImage", coverImageFile);

      if (editingEvent) {
        await dispatch(updateAdminEvent({ id: editingEvent._id, formData: submitData })).unwrap();
      } else {
        await dispatch(createAdminEvent(submitData)).unwrap();
      }
      setIsModalOpen(false);
      dispatch(fetchAdminEvents());
    } catch (err) {
      if (err.response?.data?.errors?.length > 0) {
        err.response.data.errors.forEach((e) => {
          if (e.field) setError(e.field, { type: "server", message: e.message });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative my-auto">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">
            {editingEvent ? "Edit Event Details" : "Initialize New Event"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Event Name
                </label>
                <input
                  type="text"
                  {...register("eventName", { required: "Event name is required" })}
                  className={`w-full bg-white border ${errors.eventName ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                  placeholder="Event Name"
                />
                {errors.eventName && <p className="mt-1 text-xs text-red-500">{errors.eventName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register("date", { required: "Date is required" })}
                  className={`w-full bg-white border ${errors.date ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                />
                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                rows="4"
                {...register("description", { required: "Description is required" })}
                className={`w-full bg-white border ${errors.description ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm resize-none`}
                placeholder="Event Description"
              ></textarea>
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Registration URL{" "}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <LinkIcon className={`absolute left-3 top-2.5 w-4 h-4 ${errors.registrationLink ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="url"
                  {...register("registrationLink", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Must be a valid URL starting with http:// or https://"
                    }
                  })}
                  className={`w-full bg-white border ${errors.registrationLink ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                  placeholder="https://..."
                />
              </div>
              {errors.registrationLink && <p className="mt-1 text-xs text-red-500">{errors.registrationLink.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Cover Image
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-teal-400 rounded-xl p-6 text-center cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-teal-500 transition-colors" />
                  <span className="text-sm font-medium text-slate-500 group-hover:text-teal-600">
                    Click to browse or drag image here
                  </span>
                </label>
                {imagePreview && (
                  <div className="w-28 h-28 border border-slate-200 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-sm">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-teal-700 disabled:opacity-50 mt-4 shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : editingEvent ? (
                "Save Changes"
              ) : (
                "Create Event"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
