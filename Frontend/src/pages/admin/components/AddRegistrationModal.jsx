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
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Student Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                className={`w-full bg-card text-text border ${errors.name ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.name && (
                <p className="text-danger text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Father's Name
              </label>
              <input
                {...register("fatherName", {
                  required: "Father's name is required",
                })}
                type="text"
                className={`w-full bg-card text-text border ${errors.fatherName ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.fatherName && (
                <p className="text-danger text-xs mt-1">
                  {errors.fatherName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                type="email"
                className={`w-full bg-card text-text border ${errors.email ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.email && (
                <p className="text-danger text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Phone
              </label>
              <input
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be 10 digits",
                  },
                })}
                type="text"
                className={`w-full bg-card text-text border ${errors.phone ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.phone && (
                <p className="text-danger text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Course
              </label>
              <select
                {...register("course")}
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
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Year
              </label>
              <select
                {...register("year")}
                className="w-full bg-card text-text border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              >
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Semester
              </label>
              <select
                {...register("semester")}
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
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Section
              </label>
              <input
                {...register("section", { required: "Section is required" })}
                type="text"
                className={`w-full bg-card text-text border ${errors.section ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.section && (
                <p className="text-danger text-xs mt-1">
                  {errors.section.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Set
              </label>
              <input
                {...register("set", { required: "Set is required" })}
                type="text"
                className={`w-full bg-card text-text border ${errors.set ? "border-danger" : "border-border"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
              />
              {errors.set && (
                <p className="text-danger text-xs mt-1">
                  {errors.set.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Q-ID
              </label>
              <input
                {...register("studentId", { required: "Q-ID is required" })}
                type="text"
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