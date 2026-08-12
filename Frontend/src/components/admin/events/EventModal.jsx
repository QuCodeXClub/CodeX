import React, { useState } from "react";
import { createPortal } from "react-dom"; // <-- Added for portal
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { X, Link as LinkIcon, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import {
  createAdminEvent,
  updateAdminEvent,
  fetchAdminEvents,
} from "../../../context/adminEventsSlice";
import RichTextEditor from "../../common/RichTextEditor";

const formatLocalDatetime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

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
  const [descError, setDescError] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      eventName: editingEvent?.eventName || "",
      date: editingEvent ? formatLocalDatetime(editingEvent.date) : "",
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

  const getPlainText = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const onSubmit = async (data) => {
    setDescError("");
    if (!description || !getPlainText(description).trim()) {
      setDescError("Event description is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("eventName", data.eventName);
      submitData.append("date", data.date);
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
    <div className="fixed inset-0 z-[99999] bg-panel/80 backdrop-blur-md overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 md:p-8">
        
        <div className="w-full max-w-5xl bg-card/95 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-2xl relative flex flex-col my-8 overflow-hidden">
          
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 text-text-muted hover:text-text p-2 hover:bg-card-hover rounded-full transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-6 md:p-8 lg:p-10 flex-1 flex flex-col">
            <div className="border-b border-border/60 pb-5 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EVENT CONFIGURATION</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-display font-black uppercase text-text tracking-tight">
                {editingEvent ? "EDIT EVENT DETAILS" : "CREATE NEW EVENT"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                    Event Name
                  </label>
                  <input
                    type="text"
                    {...register("eventName", {
                      required: "Event name is required",
                    })}
                    className={`w-full bg-card-hover/60 border ${errors.eventName ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border/80 focus:ring-accent/20 focus:border-accent"} text-text rounded-xl p-3 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm font-sans placeholder:text-text-muted/50`}
                    placeholder="e.g. CodeX Hackathon 2026"
                  />
                  {errors.eventName && (
                    <p className="mt-1 text-xs text-danger font-medium">
                      {errors.eventName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider flex items-center justify-between">
                    <span>Date & Time</span>
                    <span className="text-[10px] text-accent font-normal">CYAN CALENDAR ENCODED</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      {...register("date", { required: "Date is required" })}
                      className={`w-full bg-card-hover/60 border ${errors.date ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border/80 focus:ring-accent/20 focus:border-accent"} text-text rounded-xl p-3 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm font-mono`}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1 text-xs text-danger font-medium">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col min-h-[220px]">
                <label className="block text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                  Description
                </label>
                <RichTextEditor value={description} onChange={setDescription} />
                {descError && (
                  <p className="mt-1 text-xs text-danger font-medium">
                    {descError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0 pt-2">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                    Registration URL{" "}
                    <span className="text-text-muted font-normal text-[11px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className={`absolute left-3.5 top-3.5 w-4 h-4 ${errors.registrationLink ? 'text-danger' : 'text-accent'}`} />
                    <input
                      type="url"
                      {...register("registrationLink", {
                        pattern: {
                          value: /^https?:\/\/.+/,
                          message: "Must be a valid URL starting with http:// or https://"
                        }
                      })}
                      className={`w-full bg-card-hover/60 border ${errors.registrationLink ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border/80 focus:ring-accent/20 focus:border-accent'} text-text rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm font-mono placeholder:text-text-muted/50`}
                      placeholder="https://qucodex.com/register/..."
                    />
                  </div>
                  {errors.registrationLink && <p className="mt-1 text-xs text-danger font-medium">{errors.registrationLink.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                    Cover Banner Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="w-full sm:flex-1 border-2 border-dashed border-border/80 bg-card-hover/50 hover:bg-accent/10 hover:border-accent/50 rounded-xl p-4 text-center cursor-pointer transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <ImageIcon className="w-6 h-6 text-text-muted mx-auto mb-1 group-hover:text-accent transition-colors" />
                      <span className="text-xs font-mono font-semibold text-text-muted group-hover:text-accent block uppercase">
                        Browse Cover Banner
                      </span>
                    </label>
                    {imagePreview && (
                      <div className="w-full sm:w-24 sm:h-24 border border-border/80 rounded-xl overflow-hidden shrink-0 bg-card shadow-sm aspect-video sm:aspect-square relative">
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

              <div className="pt-5 shrink-0 border-t border-border/60 mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border/80 text-text-muted hover:text-text hover:bg-card-hover text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-accent/90 transition-all disabled:opacity-50 shadow-md shadow-accent/20 cursor-pointer border-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingEvent ? (
                    "Save Event Changes"
                  ) : (
                    "Publish Event"
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