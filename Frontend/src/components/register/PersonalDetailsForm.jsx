import React from "react";

export default function PersonalDetailsForm({ register, errors, clearErrors }) {
  const inputBaseStyle =
    "w-full bg-card border border-border text-text rounded-xl p-3 sm:p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all font-sans text-xs sm:text-sm tracking-wide shadow-sm placeholder:text-text-muted/40 hover:border-accent/40";
  const errorInputStyle =
    "w-full bg-card border border-danger text-text rounded-xl p-3 sm:p-3.5 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger transition-all font-sans text-xs sm:text-sm tracking-wide shadow-sm";

  return (
    <div>
      <div className="flex items-center justify-between pb-3 sm:pb-3.5 mb-4 sm:mb-6 border-b border-border">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-accent/10 border border-accent/25 text-accent font-mono text-[11px] sm:text-xs font-bold shrink-0">
            01
          </span>
          <div>
            <h3 className="font-sans text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-text">
              Personal Information
            </h3>
            <p className="text-[11px] sm:text-xs text-text-muted">Enter your basic identification details</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-[10px] sm:text-[11px] font-mono font-medium px-2 sm:px-2.5 py-1 rounded-md bg-card-hover border border-border text-text-muted uppercase tracking-wider">
          Step 1 of 3
        </span>
      </div>

      <div className="space-y-3.5 sm:space-y-4 md:space-y-5">
        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1.5 sm:mb-2 uppercase tracking-wider">
            Full Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className={errors.name ? errorInputStyle : inputBaseStyle}
            placeholder="Enter Your Full Name"
          />
          {errors.name && (
            <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-danger font-semibold">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1.5 sm:mb-2 uppercase tracking-wider">
            Father's Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            {...register("fatherName", {
              required: "Father's name is required",
            })}
            className={errors.fatherName ? errorInputStyle : inputBaseStyle}
            placeholder="Enter Father's Name"
          />
          {errors.fatherName && (
            <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-danger font-semibold">
              {errors.fatherName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1.5 sm:mb-2 uppercase tracking-wider">
            Email Address <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
              onChange: () => {
                if (clearErrors) clearErrors("email");
              },
            })}
            className={errors.email ? errorInputStyle : inputBaseStyle}
            placeholder="name@example.com"
          />
          {errors.email && (
            <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-danger font-semibold">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[11px] sm:text-xs font-semibold text-text mb-1.5 sm:mb-2 uppercase tracking-wider">
            Phone Number <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            maxLength={10}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Must be a 10-digit number",
              },
              onChange: () => {
                if (clearErrors) clearErrors("phone");
              },
            })}
            className={errors.phone ? errorInputStyle : inputBaseStyle}
            placeholder="10-digit Phone Number"
          />
          {errors.phone && (
            <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-danger font-semibold">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


