import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { X, Link as LinkIcon, Image as ImageIcon, Loader2, Sparkles, MapPin, Globe, Tag } from "lucide-react";
import {
  createAdminEvent,
  updateAdminEvent,
  fetchAdminEvents,
} from "../../../context/adminEventsSlice";
import RichTextEditor from "../../common/RichTextEditor";
import { normalizeEvent, optimizeCloudinaryUrl } from "../../../utils/helpers";

const formatLocalDatetime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function EventModal({ setIsModalOpen, editingEvent, onSuccess }) {
  const dispatch = useDispatch();
  const normalized = editingEvent ? normalizeEvent(editingEvent) : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(normalized?.coverImage || null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [description, setDescription] = useState(normalized?.description || "");
  const [descError, setDescError] = useState("");

  // Tags state
  const [tags, setTags] = useState(normalized?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const tagInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      eventName: normalized?.eventName || "",
      date: normalized ? formatLocalDatetime(normalized.date) : "",
      registrationCloseDate: normalized?.registrationCloseDate
        ? formatLocalDatetime(normalized.registrationCloseDate)
        : "",
      registrationLink: normalized?.registrationLink || "",
      locationType: normalized?.locationType || "Offline",
      location: normalized?.location || "",
    },
  });

  const locationType = watch("locationType");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getPlainText = (html) => {
    if (!html) return "";
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    } catch {
      let previous = "";
      let current = html;
      while (current !== previous) {
        previous = current;
        current = current.replace(/<[^>]*>/g, "");
      }
      return current;
    }
  };

  // Tag management
  const addTag = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (tags.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) {
      setTagError("Tag already added.");
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
    setTagError("");
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags.length - 1);
    }
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
      submitData.append("date", new Date(data.date).toISOString());
      if (data.registrationCloseDate) {
        submitData.append(
          "registrationCloseDate",
          new Date(data.registrationCloseDate).toISOString()
        );
      } else {
        submitData.append("registrationCloseDate", "");
      }
      submitData.append("description", description);
      if (data.registrationLink)
        submitData.append("registrationLink", data.registrationLink);
      if (coverImageFile) submitData.append("coverImage", coverImageFile);

      // New fields
      submitData.append("locationType", data.locationType);
      submitData.append("location", data.location || "");
      // Serialize tags as JSON string — backend parseTags handles this format
      submitData.append("tags", JSON.stringify(tags));

      if (editingEvent) {
        await dispatch(
          updateAdminEvent({ id: editingEvent._id, formData: submitData })
        ).unwrap();
      } else {
        await dispatch(createAdminEvent(submitData)).unwrap();
      }
      setIsModalOpen(false);
      if (typeof onSuccess === "function") {
        onSuccess();
      } else {
        dispatch(fetchAdminEvents());
      }
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

              {/* Row 1: Event Name + Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                <div className="group/field">
                  <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                    <span>
                      Event Name <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <input
                    type="text"
                    title="Event Name — Type: String (Mandatory)"
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

                <div className="group/field">
                  <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                    <span>
                      Date & Time <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                      Date (YYYY-MM-DDTHH:mm)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      title="Event Date & Time — Format: Date (YYYY-MM-DDTHH:mm, Mandatory)"
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

              {/* Description */}
              <div className="flex-1 flex flex-col min-h-[220px] group/field">
                <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                  <span>
                    Description <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                    String (HTML)
                  </span>
                </label>
                <RichTextEditor value={description} onChange={setDescription} />
                {descError && (
                  <p className="mt-1 text-xs text-danger font-medium">
                    {descError}
                  </p>
                )}
              </div>

              {/* Row 3: Location Type + Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                <div className="group/field">
                  <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                    <span>
                      Location Type <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String (Enum: Online / Offline)
                    </span>
                  </label>
                  <div className="relative">
                    {locationType === "Online" ? (
                      <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-accent pointer-events-none" />
                    ) : (
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-accent pointer-events-none" />
                    )}
                    <select
                      {...register("locationType", {
                        required: "Location type is required",
                        validate: (v) =>
                          ["Online", "Offline"].includes(v) ||
                          "Must be Online or Offline",
                      })}
                      title="Location Type — Type: String (Enum: Online/Offline, Mandatory)"
                      className={`w-full bg-card-hover/60 border ${errors.locationType ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border/80 focus:ring-accent/20 focus:border-accent"} text-text rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm font-sans appearance-none cursor-pointer`}
                    >
                      <option value="Offline">Offline</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  {errors.locationType && (
                    <p className="mt-1 text-xs text-danger font-medium">
                      {errors.locationType.message}
                    </p>
                  )}
                </div>

                <div className="group/field">
                  <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                    <span>
                      Location{" "}
                      <span className="text-text-muted font-normal text-[11px]">(Optional)</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <input
                    type="text"
                    title="Location — Type: String (Optional)"
                    {...register("location")}
                    className="w-full bg-card-hover/60 border border-border/80 focus:ring-accent/20 focus:border-accent text-text rounded-xl p-3 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm font-sans placeholder:text-text-muted/50"
                    placeholder={
                      locationType === "Online"
                        ? "e.g. Google Meet, Zoom link, etc."
                        : "e.g. Quantum University, Roorkee"
                    }
                  />
                </div>
              </div>

              {/* Row 4: Tags */}
              <div className="shrink-0 group/field">
                <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                  <span>
                    Tags{" "}
                    <span className="text-text-muted font-normal text-[11px]">(Optional — press Enter to add)</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                    Array [String]
                  </span>
                </label>

                {/* Tag chip display + input */}
                <div
                  onClick={() => tagInputRef.current?.focus()}
                  title="Tags — Type: Array of Strings (Optional)"
                  className="min-h-[46px] w-full bg-card-hover/60 border border-border/80 focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent text-text rounded-xl px-3 py-2 flex flex-wrap gap-2 items-center transition-all cursor-text"
                >
                  <Tag className="w-4 h-4 text-accent shrink-0" />
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-mono font-semibold"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(idx);
                        }}
                        className="hover:text-danger transition-colors ml-0.5 cursor-pointer"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setTagError("");
                    }}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => {
                      if (tagInput.trim()) addTag(tagInput);
                    }}
                    placeholder={tags.length === 0 ? "e.g. Hackathon, AI/ML, Coding..." : ""}
                    className="flex-1 min-w-[120px] bg-transparent text-sm font-sans text-text focus:outline-none placeholder:text-text-muted/50"
                  />
                </div>
                {tagError && (
                  <p className="mt-1 text-xs text-danger font-medium">{tagError}</p>
                )}
                <p className="mt-1.5 text-[10px] text-text-muted font-mono">
                  Press <kbd className="px-1 py-0.5 border border-border/80 rounded text-[9px]">Enter</kbd> to add a tag. Click × to remove.
                </p>
              </div>

              {/* Row 5: Registration Settings (URL + Close Date) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0 pt-2">
                <div className="group/field">
                  <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                    <span>
                      Registration URL{" "}
                      <span className="text-text-muted font-normal text-[11px]">(Optional)</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String (URL)
                    </span>
                  </label>
                  <div className="relative">
                    <LinkIcon className={`absolute left-3.5 top-3.5 w-4 h-4 ${errors.registrationLink ? 'text-danger' : 'text-accent'}`} />
                    <input
                      type="url"
                      title="Registration URL — Type: String (URL, Optional)"
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

                <div className="group/field">
                  <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                    <span>
                      Registration Closes At{" "}
                      <span className="text-text-muted font-normal text-[11px]">(Optional)</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                      Date (YYYY-MM-DDTHH:mm)
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    title="Registration Closes At — Format: Date (YYYY-MM-DDTHH:mm, Optional)"
                    {...register("registrationCloseDate")}
                    className="w-full bg-card-hover/60 border border-border/80 focus:ring-accent/20 focus:border-accent text-text rounded-xl p-3 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm font-mono"
                  />
                  <p className="mt-1.5 text-[10px] text-text-muted font-mono">
                    After this deadline, registration will show closed while event remains in Upcoming list.
                  </p>
                </div>
              </div>

              {/* Row 6: Cover Image */}
              <div className="shrink-0 pt-2 group/field">
                <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                  <span>
                    Cover Banner Image {!editingEvent && <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                    Image File (JPG, PNG, WebP)
                  </span>
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label
                    title="Cover Banner Image — Format: Image File (JPG, PNG, WebP, Mandatory on create)"
                    className="w-full sm:flex-1 border-2 border-dashed border-border/80 bg-card-hover/50 hover:bg-accent/10 hover:border-accent/50 rounded-xl p-4 text-center cursor-pointer transition-all group"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <ImageIcon className="w-6 h-6 text-text-muted mx-auto mb-1 group-hover:text-accent transition-colors" />
                    <span className="text-xs font-mono font-semibold text-text-muted group-hover:text-accent block uppercase">
                      Browse Cover Banner (JPG, PNG, WebP)
                    </span>
                  </label>
                  {imagePreview && (
                    <div className="w-full sm:w-28 sm:h-24 border border-border/80 rounded-xl overflow-hidden shrink-0 bg-card shadow-sm aspect-video sm:aspect-square relative">
                      <img
                        src={optimizeCloudinaryUrl(imagePreview, 800)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
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