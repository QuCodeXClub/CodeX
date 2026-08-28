import React from "react";

export default function AcademicDetailsForm({ register, errors, clearErrors }) {
  const inputBaseStyle = "w-full bg-card border border-border text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all font-sans text-sm tracking-wide shadow-sm placeholder:text-text-muted/40 cursor-pointer";
  const errorInputStyle = "w-full bg-card border border-danger text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger transition-all font-sans text-sm tracking-wide shadow-sm";

  return (
    <>
      <h3 className="font-sans text-xl font-bold uppercase tracking-wider text-text border-b border-border pb-3 mb-6">
        2. Academic Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
            University ID (QID)
          </label>
          <input
            type="text"
            {...register("studentId", {
              required: "University ID is required",
              onChange: () => {
                if (clearErrors) clearErrors("studentId");
              },
            })}
            className={errors.studentId ? errorInputStyle : inputBaseStyle}
            placeholder="Enter Student QID"
          />
          {errors.studentId && (
            <p className="mt-1.5 text-xs text-danger font-semibold">
              {errors.studentId.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
            Course Program
          </label>
          <select
            {...register("course", { 
              required: "Course is required",
              onChange: () => {
                if (clearErrors) clearErrors("course");
              },
            })}
            className={errors.course ? errorInputStyle : inputBaseStyle}
          >
            <option value="">Select Course</option>
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
            <p className="mt-1.5 text-xs text-danger font-semibold">
              {errors.course.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
              Year
            </label>
            <select
              {...register("year", { 
                required: "Year is required",
                onChange: () => {
                  if (clearErrors) clearErrors("year");
                },
              })}
              className={errors.year ? errorInputStyle : inputBaseStyle}
            >
              <option value="">Year</option>
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {errors.year && (
              <p className="mt-1.5 text-xs text-danger font-semibold">
                {errors.year.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
              Semester
            </label>
            <select
              {...register("semester", { 
                required: "Semester is required",
                onChange: () => {
                  if (clearErrors) clearErrors("semester");
                },
              })}
              className={errors.semester ? errorInputStyle : inputBaseStyle}
            >
              <option value="">Sem</option>
              {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
            {errors.semester && (
              <p className="mt-1.5 text-xs text-danger font-semibold">
                {errors.semester.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
              Section
            </label>
            <input
              type="text"
              {...register("section", { 
                required: "Section is required",
                onChange: () => {
                  if (clearErrors) clearErrors("section");
                },
              })}
              className={errors.section ? errorInputStyle : inputBaseStyle}
              placeholder="e.g. 1, 2"
            />
            {errors.section && (
              <p className="mt-1.5 text-xs text-danger font-semibold">
                {errors.section.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
              Set / Group
            </label>
            <input
              type="text"
              {...register("set", { 
                required: "Set/Group is required",
                onChange: () => {
                  if (clearErrors) clearErrors("set");
                },
              })}
              className={errors.set ? errorInputStyle : inputBaseStyle}
              placeholder="e.g. A, B"
            />
            {errors.set && (
              <p className="mt-1.5 text-xs text-danger font-semibold">
                {errors.set.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}