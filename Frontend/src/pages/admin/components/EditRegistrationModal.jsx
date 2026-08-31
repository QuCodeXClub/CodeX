import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { Loader2, X as XIcon, Edit3, UserCheck, AlertCircle } from "lucide-react";

export default function EditRegistrationModal({ registration, onClose, onSave }) {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: registration?.name || "",
      fatherName: registration?.fatherName || "",
      email: registration?.email || "",
      phone: registration?.phone || "",
      studentId: registration?.studentId || "",
      course: registration?.course || "B.Tech",
      year: registration?.year || "1st Year",
      semester: registration?.semester || "1st",
      section: registration?.section || "",
      set: registration?.set || "",
      transactionId: registration?.transactionId || "",
      paymentMode: registration?.paymentMode || "ONLINE",
      status: registration?.status || "PENDING",
      rejectionReason: registration?.rejectionReason || "",
    },
  });

  const selectedStatus = watch("status");

  const handleFormSubmit = async (data) => {
    setServerError("");
    try {
      await onSave(registration._id, data);
      onClose();
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          (typeof err === "string" ? err : "Failed to update registration details.")
      );
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border/80 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/25 text-accent">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-text uppercase tracking-tight">
                Edit Student Details
              </h2>
              <p className="text-xs text-text-muted font-mono">
                Updating record for {registration?.name || "Student"} (Q-ID: {registration?.studentId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text p-2 rounded-xl hover:bg-card-hover transition-colors cursor-pointer border border-transparent hover:border-border"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                className={`w-full bg-card text-text border ${
                  errors.name ? "border-danger" : "border-border"
                } rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.name && (
                <p className="text-danger text-[11px] mt-1 font-semibold">{errors.name.message}</p>
              )}
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Father's Name <span className="text-danger">*</span>
              </label>
              <input
                {...register("fatherName", { required: "Father's name is required" })}
                type="text"
                className={`w-full bg-card text-text border ${
                  errors.fatherName ? "border-danger" : "border-border"
                } rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.fatherName && (
                <p className="text-danger text-[11px] mt-1 font-semibold">{errors.fatherName.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                type="email"
                className={`w-full bg-card text-text border ${
                  errors.email ? "border-danger" : "border-border"
                } rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.email && (
                <p className="text-danger text-[11px] mt-1 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                {...register("phone", {
                  required: "Phone is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Must be a 10-digit number" },
                })}
                type="tel"
                maxLength={10}
                className={`w-full bg-card text-text border ${
                  errors.phone ? "border-danger" : "border-border"
                } rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.phone && (
                <p className="text-danger text-[11px] mt-1 font-semibold">{errors.phone.message}</p>
              )}
            </div>

            {/* Student ID (Q-ID) */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Student ID (Q-ID) <span className="text-danger">*</span>
              </label>
              <input
                {...register("studentId", { required: "Student ID is required" })}
                type="text"
                className={`w-full bg-card text-text border ${
                  errors.studentId ? "border-danger" : "border-border"
                } rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.studentId && (
                <p className="text-danger text-[11px] mt-1 font-semibold">{errors.studentId.message}</p>
              )}
            </div>

            {/* Course Program */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Course <span className="text-danger">*</span>
              </label>
              <select
                {...register("course", { required: "Course is required" })}
                className="w-full bg-card text-text border border-border rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
              >
                {["B.Tech", "M.Tech", "BCA", "MCA", "BBA", "MBA", "B.Sc", "M.Sc"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Academic Year <span className="text-danger">*</span>
              </label>
              <select
                {...register("year", { required: "Year is required" })}
                className="w-full bg-card text-text border border-border rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
              >
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Semester <span className="text-danger">*</span>
              </label>
              <select
                {...register("semester", { required: "Semester is required" })}
                className="w-full bg-card text-text border border-border rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
              >
                {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((s) => (
                  <option key={s} value={s}>
                    {s} Sem
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Section <span className="text-danger">*</span>
              </label>
              <input
                {...register("section", { required: "Section is required" })}
                type="text"
                className={`w-full bg-card text-text border ${
                  errors.section ? "border-danger" : "border-border"
                } rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.section && (
                <p className="text-danger text-[11px] mt-1 font-semibold">{errors.section.message}</p>
              )}
            </div>

            {/* Set / Group */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Set / Group <span className="text-danger">*</span>
              </label>
              <input
                {...register("set", { required: "Set is required" })}
                type="text"
                className={`w-full bg-card text-text border ${
                  errors.set ? "border-danger" : "border-border"
                } rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.set && (
                <p className="text-danger text-[11px] mt-1 font-semibold">{errors.set.message}</p>
              )}
            </div>

            {/* Transaction ID / UTR */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Transaction ID / UTR <span className="text-danger">*</span>
              </label>
              <input
                {...register("transactionId", { required: "Transaction ID is required" })}
                type="text"
                className={`w-full bg-card text-text border ${
                  errors.transactionId ? "border-danger" : "border-border"
                } rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.transactionId && (
                <p className="text-danger text-[11px] mt-1 font-semibold">
                  {errors.transactionId.message}
                </p>
              )}
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                Payment Mode
              </label>
              <select
                {...register("paymentMode")}
                className="w-full bg-card text-text border border-border rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
              >
                <option value="ONLINE">ONLINE</option>
                <option value="CASH">CASH</option>
              </select>
            </div>
          </div>

          {/* Status Selection */}
          <div className="pt-2 border-t border-border/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text mb-1 uppercase tracking-wider">
                  Registration Status
                </label>
                <select
                  {...register("status")}
                  className="w-full bg-card text-text border border-border rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer font-bold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              {selectedStatus === "REJECTED" && (
                <div>
                  <label className="block text-xs font-semibold text-danger mb-1 uppercase tracking-wider">
                    Rejection Reason
                  </label>
                  <input
                    {...register("rejectionReason")}
                    type="text"
                    placeholder="e.g. Invalid UTR or Unverified Payment"
                    className="w-full bg-card text-text border border-danger/60 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-text-muted hover:text-text hover:bg-card-hover text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-accent text-text-inverse hover:bg-accent/90 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md shadow-accent/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
