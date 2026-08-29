import React from "react";

export default function AcademicDetailsForm({ register, errors, clearErrors }) {
  const inputBaseStyle =
    "w-full bg-card border border-border text-text rounded-xl p-3 sm:p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all font-sans text-xs sm:text-sm tracking-wide shadow-sm placeholder:text-text-muted/40 hover:border-accent/40";
  const selectBaseStyle =
    "w-full bg-card border border-border text-text rounded-xl p-3 sm:p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all font-sans text-xs sm:text-sm tracking-wide shadow-sm placeholder:text-text-muted/40 hover:border-accent/40 cursor-pointer";
  const errorInputStyle =
    "w-full bg-card border border-danger text-text rounded-xl p-3 sm:p-3.5 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger transition-all font-sans text-xs sm:text-sm tracking-wide shadow-sm";
  const errorSelectStyle =
    "w-full bg-card border border-danger text-text rounded-xl p-3 sm:p-3.5 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger transition-all font-sans text-xs sm:text-sm tracking-wide shadow-sm cursor-pointer";

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between pb-3 sm:pb-3.5 mb-4 sm:mb-5 border-b border-border">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-accent/10 border border-accent/25 text-accent font-mono text-[11px] sm:text-xs font-bold shrink-0">
            02
          </span>
          <div>
            <h3 className="font-sans text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-text">
              Academic Details
            </h3>
            <p className="text-[11px] sm:text-xs text-text-muted">University &amp; course info</p>
          </div>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono font-medium px-2 sm:px-2.5 py-1 rounded-md bg-card-hover border border-border text-text-muted uppercase tracking-wider">
          Step 2 of 3
        </span>
      </div>

      <div className="space-y-3.5 sm:space-y-4 flex-1 flex flex-col justify-around py-0.5 sm:py-1">
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1 sm:mb-1.5 uppercase tracking-wider">
            University ID (QID) <span className="text-danger">*</span>
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
            placeholder="e.g. 230101001"
          />
          {errors.studentId && (
            <p className="mt-1 text-[11px] sm:text-xs text-danger font-semibold">
              {errors.studentId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1 sm:mb-1.5 uppercase tracking-wider">
            Course Program <span className="text-danger">*</span>
          </label>
          <select
            {...register("course", { required: "Course is required" })}
            className={errors.course ? errorSelectStyle : selectBaseStyle}
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
            <p className="mt-1 text-[11px] sm:text-xs text-danger font-semibold">
              {errors.course.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1 sm:mb-1.5 uppercase tracking-wider">
              Year <span className="text-danger">*</span>
            </label>
            <select
              {...register("year", { required: "Year is required" })}
              className={errors.year ? errorSelectStyle : selectBaseStyle}
            >
              <option value="">Year</option>
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {errors.year && (
              <p className="mt-1 text-[11px] sm:text-xs text-danger font-semibold">
                {errors.year.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1 sm:mb-1.5 uppercase tracking-wider">
              Semester <span className="text-danger">*</span>
            </label>
            <select
              {...register("semester", { required: "Semester is required" })}
              className={errors.semester ? errorSelectStyle : selectBaseStyle}
            >
              <option value="">Sem</option>
              {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s} Sem
                  </option>
                )
              )}
            </select>
            {errors.semester && (
              <p className="mt-1 text-[11px] sm:text-xs text-danger font-semibold">
                {errors.semester.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1 sm:mb-1.5 uppercase tracking-wider">
              Section <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              {...register("section", { required: "Section is required" })}
              className={errors.section ? errorInputStyle : inputBaseStyle}
              placeholder="e.g. 1, 2"
            />
            {errors.section && (
              <p className="mt-1 text-[11px] sm:text-xs text-danger font-semibold">
                {errors.section.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1 sm:mb-1.5 uppercase tracking-wider">
              Set / Group <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              {...register("set", { required: "Set/Group is required" })}
              className={errors.set ? errorInputStyle : inputBaseStyle}
              placeholder="e.g. A, B"
            />
            {errors.set && (
              <p className="mt-1 text-[11px] sm:text-xs text-danger font-semibold">
                {errors.set.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

