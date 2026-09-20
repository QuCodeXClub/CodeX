import React from "react";
import { useForm } from "react-hook-form";
import { Loader2, X as XIcon } from "lucide-react";

export default function AddRegistrationModal({ onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      course: "B.Tech",
      year: "1st Year",
      semester: "1st",
    },
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-soft flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-xl font-bold text-text">
            Add Student (Cash)
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors p-2 rounded-lg hover:bg-card-hover"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Name */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Student Name <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String
                </span>
              </div>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                title="Student Name — Type: String (Mandatory)"
                placeholder="Full student name"
                className={`w-full bg-card text-text border ${errors.name ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.name && (
                <p className="text-danger text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Father's Name */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Father's Name <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String
                </span>
              </div>
              <input
                {...register("fatherName", {
                  required: "Father's name is required",
                })}
                type="text"
                title="Father's Name — Type: String (Mandatory)"
                placeholder="Father's name"
                className={`w-full bg-card text-text border ${errors.fatherName ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.fatherName && (
                <p className="text-danger text-xs mt-1">
                  {errors.fatherName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Email <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String (Email)
                </span>
              </div>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                type="email"
                title="Email — Type: String (Mandatory)"
                placeholder="student@quantum.edu.in"
                className={`w-full bg-card text-text border ${errors.email ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.email && (
                <p className="text-danger text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Phone <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String (10 Digits)
                </span>
              </div>
              <input
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be 10 digits",
                  },
                })}
                type="tel"
                maxLength={10}
                title="Phone Number — Type: String (10 Digits, Mandatory)"
                placeholder="10-digit mobile number"
                className={`w-full bg-card text-text border ${errors.phone ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.phone && (
                <p className="text-danger text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Course */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Course <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String (Enum)
                </span>
              </div>
              <select
                {...register("course")}
                title="Course Program — Type: String (Enum, Mandatory)"
                className="w-full bg-card text-text border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              >
                {[
                  "B.Tech",
                  "M.Tech",
                  "BCA",
                  "MCA",
                  "BBA",
                  "MBA",
                  "B.Sc",
                  "M.Sc",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Year <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String (Enum)
                </span>
              </div>
              <select
                {...register("year")}
                title="Academic Year — Type: String (Enum, Mandatory)"
                className="w-full bg-card text-text border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              >
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Semester <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String (Enum)
                </span>
              </div>
              <select
                {...register("semester")}
                title="Semester — Type: String (Enum, Mandatory)"
                className="w-full bg-card text-text border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              >
                {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Section */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Section <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String
                </span>
              </div>
              <input
                {...register("section", { required: "Section is required" })}
                type="text"
                title="Section — Type: String (Mandatory)"
                placeholder="e.g. A, B, CS-1"
                className={`w-full bg-card text-text border ${errors.section ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.section && (
                <p className="text-danger text-xs mt-1">
                  {errors.section.message}
                </p>
              )}
            </div>

            {/* Set */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Set <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String
                </span>
              </div>
              <input
                {...register("set", { required: "Set is required" })}
                type="text"
                title="Set/Group — Type: String (Mandatory)"
                placeholder="e.g. Set 1, Group A"
                className={`w-full bg-card text-text border ${errors.set ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.set && (
                <p className="text-danger text-xs mt-1">
                  {errors.set.message}
                </p>
              )}
            </div>

            {/* Q-ID */}
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text">
                  Q-ID <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String (Q-ID)
                </span>
              </div>
              <input
                {...register("studentId", { required: "Q-ID is required" })}
                type="text"
                title="Student ID / Q-ID — Type: String (Mandatory)"
                placeholder="e.g. 220101001"
                className={`w-full bg-card text-text border ${errors.studentId ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.studentId && (
                <p className="text-danger text-xs mt-1">
                  {errors.studentId.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border-soft mt-6">
            <button
              type="button"
              onClick={() => {
                onClose();
                reset();
              }}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-accent text-[#111111] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />}
              Register & Approve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}