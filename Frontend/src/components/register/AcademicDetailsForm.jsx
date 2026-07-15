import React from "react";

export default function AcademicDetailsForm({ register, errors }) {
  return (
    <>
      <h3 className="font-oswald text-2xl font-bold uppercase tracking-widest text-[#0a0a0a] border-b-2 border-gray-200 pb-2 mb-6">
        2. Academic Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            University ID (QID)
          </label>
          <input
            type="text"
            {...register("studentId", {
              required: "University ID is required",
            })}
            className={`w-full bg-transparent border-2 ${errors.studentId ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300`}
            placeholder="QID"
          />
          {errors.studentId && (
            <p className="mt-1 text-xs text-red-500 font-bold uppercase">
              {errors.studentId.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Course
          </label>
          <select
            {...register("course", { required: "Course is required" })}
            className={`w-full bg-transparent border-2 ${errors.course ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider cursor-pointer`}
          >
            <option value="">SELECT COURSE</option>
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
          {errors.course && (
            <p className="mt-1 text-xs text-red-500 font-bold uppercase">
              {errors.course.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Year
            </label>
            <select
              {...register("year", { required: "Year is required" })}
              className={`w-full bg-transparent border-2 ${errors.year ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider cursor-pointer`}
            >
              <option value="">YEAR</option>
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {errors.year && (
              <p className="mt-1 text-xs text-red-500 font-bold uppercase">
                {errors.year.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Semester
            </label>
            <select
              {...register("semester", { required: "Semester is required" })}
              className={`w-full bg-transparent border-2 ${errors.semester ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider cursor-pointer`}
            >
              <option value="">SEM</option>
              {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
            {errors.semester && (
              <p className="mt-1 text-xs text-red-500 font-bold uppercase">
                {errors.semester.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Section
            </label>
            <input
              type="text"
              {...register("section", { required: "Section is required" })}
              className={`w-full bg-transparent border-2 ${errors.section ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300`}
              placeholder="Section"
            />
            {errors.section && (
              <p className="mt-1 text-xs text-red-500 font-bold uppercase">
                {errors.section.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Set / Group
            </label>
            <input
              type="text"
              {...register("set", { required: "Set/Group is required" })}
              className={`w-full bg-transparent border-2 ${errors.set ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300`}
            />
            {errors.set && (
              <p className="mt-1 text-xs text-red-500 font-bold uppercase">
                {errors.set.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
