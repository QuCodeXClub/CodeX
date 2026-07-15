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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-900">
            Add Student (Cash)
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-50"
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Student Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                className={`w-full border ${errors.name ? "border-red-500" : "border-slate-200"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Father's Name
              </label>
              <input
                {...register("fatherName", {
                  required: "Father's name is required",
                })}
                type="text"
                className={`w-full border ${errors.fatherName ? "border-red-500" : "border-slate-200"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`}
              />
              {errors.fatherName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fatherName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                type="email"
                className={`w-full border ${errors.email ? "border-red-500" : "border-slate-200"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
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
                className={`w-full border ${errors.phone ? "border-red-500" : "border-slate-200"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course
              </label>
              <select
                {...register("course")}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Year
              </label>
              <select
                {...register("year")}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Semester
              </label>
              <select
                {...register("semester")}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Section
              </label>
              <input
                {...register("section", { required: "Section is required" })}
                type="text"
                className={`w-full border ${errors.section ? "border-red-500" : "border-slate-200"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`}
              />
              {errors.section && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.section.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Set
              </label>
              <input
                {...register("set", { required: "Set is required" })}
                type="text"
                className={`w-full border ${errors.set ? "border-red-500" : "border-slate-200"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`}
              />
              {errors.set && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.set.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Q-ID
              </label>
              <input
                {...register("studentId", { required: "Q-ID is required" })}
                type="text"
                className={`w-full border ${errors.studentId ? "border-red-500" : "border-slate-200"} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`}
              />
              {errors.studentId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.studentId.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={() => {
                onClose();
                reset();
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Register & Approve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
