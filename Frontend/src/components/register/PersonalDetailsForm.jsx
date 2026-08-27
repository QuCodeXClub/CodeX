import React from "react";

export default function PersonalDetailsForm({ register, errors, clearErrors }) {
  const inputBaseStyle = "w-full bg-card border border-border text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all font-sans text-sm tracking-wide shadow-sm placeholder:text-text-muted/40";
  const errorInputStyle = "w-full bg-card border border-danger text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger transition-all font-sans text-sm tracking-wide shadow-sm";

  return (
    <>
      <h3 className="font-sans text-xl font-bold uppercase tracking-wider text-text border-b border-border pb-3 mb-6">
        1. Personal Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            {...register("name", { 
              required: "Name is required",
              onChange: () => {
                if (clearErrors) clearErrors("name");
              }
            })}
            className={errors.name ? errorInputStyle : inputBaseStyle}
            placeholder="Enter Your Full Name"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-danger font-semibold">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
            Father's Name
          </label>
          <input
            type="text"
            {...register("fatherName", {
              required: "Father's name is required",
              onChange: () => {
                if (clearErrors) clearErrors("fatherName");
              }
            })}
            className={errors.fatherName ? errorInputStyle : inputBaseStyle}
            placeholder="Enter Father's Name"
          />
          {errors.fatherName && (
            <p className="mt-1.5 text-xs text-danger font-semibold">
              {errors.fatherName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
            Email Address
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
            <p className="mt-1.5 text-xs text-danger font-semibold">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
            Phone Number
          </label>
          <input
            type="text"
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
            <p className="mt-1.5 text-xs text-danger font-semibold">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
