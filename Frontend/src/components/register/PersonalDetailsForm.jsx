import React from "react";

export default function PersonalDetailsForm({ register, errors }) {
  return (
    <>
      <h3 className="font-oswald text-2xl font-bold uppercase tracking-widest text-[#0a0a0a] border-b-2 border-gray-200 pb-2 mb-6">
        1. Personal Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className={`w-full bg-transparent border-2 ${errors.name ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300`}
            placeholder="Enter Your Name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 font-bold uppercase">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Father's Name
          </label>
          <input
            type="text"
            {...register("fatherName", {
              required: "Father's name is required",
            })}
            className={`w-full bg-transparent border-2 ${errors.fatherName ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300`}
          />
          {errors.fatherName && (
            <p className="mt-1 text-xs text-red-500 font-bold uppercase">
              {errors.fatherName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            className={`w-full bg-transparent border-2 ${errors.email ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors font-bold text-sm tracking-wider placeholder-gray-300`}
            placeholder="Email"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 font-bold uppercase">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
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
            })}
            className={`w-full bg-transparent border-2 ${errors.phone ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-[#2ec5d4]"} text-[#0a0a0a] p-3 focus:outline-none transition-colors font-bold text-sm tracking-wider placeholder-gray-300`}
            placeholder="Enter Phone Number"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500 font-bold uppercase">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
