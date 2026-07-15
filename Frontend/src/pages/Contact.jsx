import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setError } from "../context/messageSlice";
import { Loader2, ShieldCheck, CheckCircle } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import axiosInstance from "../services/axiosInstance";
import contentData from "../data/content.json";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const dispatch = useDispatch();
  const { contact } = contentData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onFormSubmit = async (data) => {
    setLoading(true);

    if (!turnstileToken) {
      dispatch(setError("Please complete the security check."));
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...data,
        turnstileToken,
      };

      await axiosInstance.post("/contact", payload);
      setIsSuccess(true);
    } catch {
      setTurnstileToken(null);
      // Let global interceptor handle the error message display
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#Faf9f6] flex items-center justify-center font-jetbrains p-4">
        <div className="bg-white border-4 border-gray-800 p-8 md:p-12 shadow-[8px_8px_0px_rgba(0,0,0,0.05)] text-center max-w-lg w-full">
          <CheckCircle className="w-16 h-16 text-[#2ec5d4] mx-auto mb-6" />
          <h2 className="font-oswald text-4xl font-bold uppercase text-[#0a0a0a] mb-4">
            Message Sent
          </h2>
          <p className="text-gray-500 font-medium mb-8">
            Thank you for reaching out! We've received your message and will get
            back to you shortly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#0a0a0a] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#2ec5d4] hover:text-[#0a0a0a] transition-colors border-2 border-transparent hover:border-[#0a0a0a]"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#Faf9f6] relative font-jetbrains flex flex-col pt-24 md:pt-32">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-[800px] mx-auto pb-20 px-4 md:px-12">
        <header className="mb-12">
          <p className="text-[#2ec5d4] text-xs font-bold uppercase tracking-widest mb-3">
            {contact.eyebrow}
          </p>
          <h1 className="font-oswald text-5xl md:text-6xl font-bold uppercase text-[#0a0a0a] mb-3">
            {contact.titlePart1}{" "}
            <span className="text-[#27EBF5]">{contact.titlePart2}</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {contact.description}
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="bg-white border-4 border-gray-800 p-6 md:p-10 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]"
        >
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full bg-transparent border-2 ${
                    errors.name
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-[#2ec5d4]"
                  } text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300`}
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
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  className={`w-full bg-transparent border-2 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-[#2ec5d4]"
                  } text-[#0a0a0a] p-3 focus:outline-none transition-colors font-bold text-sm tracking-wider placeholder-gray-300`}
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-bold uppercase">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                {...register("subject", { required: "Subject is required" })}
                className={`w-full bg-transparent border-2 ${
                  errors.subject
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-[#2ec5d4]"
                } text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300`}
                placeholder="What is this regarding?"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-500 font-bold uppercase">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Message
              </label>
              <textarea
                {...register("message", { required: "Message is required" })}
                rows="5"
                className={`w-full bg-transparent border-2 ${
                  errors.message
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-[#2ec5d4]"
                } text-[#0a0a0a] p-3 focus:outline-none transition-colors font-medium text-sm placeholder-gray-300 resize-none`}
                placeholder="How can we help you?"
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-xs text-red-500 font-bold uppercase">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-8 flex flex-col items-center border-2 border-gray-100 p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#2ec5d4]" /> Verification
              Required
            </div>
            <Turnstile
              siteKey={
                import.meta.env.VITE_TURNSTILE_SITE_KEY ||
                "1x00000000000000000000AA"
              }
              onSuccess={(token) => setTurnstileToken(token)}
              options={{ theme: "light" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !turnstileToken}
            className="w-full bg-[#0a0a0a] text-white py-5 font-bold uppercase tracking-widest hover:bg-[#2ec5d4] hover:text-[#0a0a0a] transition-colors border-2 border-transparent hover:border-[#0a0a0a] disabled:opacity-50 flex justify-center items-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Transmit Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
