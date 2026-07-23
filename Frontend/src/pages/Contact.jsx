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
      <div className="min-h-screen bg-bg-soft flex items-center justify-center font-jetbrains p-4">
        <div className="bg-card border-4 border-text p-8 md:p-12 shadow-[8px_8px_0px_rgba(0,0,0,0.05)] text-center max-w-lg w-full">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="font-oswald text-4xl font-bold uppercase text-text mb-4">
            Message Sent
          </h2>
          <p className="text-text-muted font-medium mb-8">
            Thank you for reaching out! We've received your message and will get
            back to you shortly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-text text-bg py-4 font-bold uppercase tracking-widest hover:bg-accent hover:text-[#111111] transition-colors border-2 border-transparent hover:border-accent"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-soft relative font-jetbrains flex flex-col pt-24 md:pt-32">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10 w-full  mx-auto pb-20 px-4 md:px-12">
        <header className="mb-12">
          <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">
            {contact.eyebrow}
          </p>
          <h1 className="font-oswald text-5xl md:text-6xl font-bold uppercase text-text mb-3">
            {contact.titlePart1}{" "}
            <span className="text-accent">{contact.titlePart2}</span>
          </h1>
          <p className="text-text-muted text-sm font-medium">
            {contact.description}
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="bg-card border-4 border-text p-6 md:p-10 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]"
        >
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full bg-card border-2 ${
                    errors.name
                      ? "border-danger focus:border-danger"
                      : "border-border focus:border-accent"
                  } text-text p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder:text-text-muted/40`}
                  placeholder="Enter Your Name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-danger font-bold uppercase">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  className={`w-full bg-card border-2 ${
                    errors.email
                      ? "border-danger focus:border-danger"
                      : "border-border focus:border-accent"
                  } text-text p-3 focus:outline-none transition-colors font-bold text-sm tracking-wider placeholder:text-text-muted/40`}
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-danger font-bold uppercase">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                {...register("subject", { required: "Subject is required" })}
                className={`w-full bg-card border-2 ${
                  errors.subject
                    ? "border-danger focus:border-danger"
                    : "border-border focus:border-accent"
                } text-text p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder:text-text-muted/40`}
                placeholder="What is this regarding?"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-danger font-bold uppercase">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
                Message
              </label>
              <textarea
                {...register("message", { required: "Message is required" })}
                rows="5"
                className={`w-full bg-card border-2 ${
                  errors.message
                    ? "border-danger focus:border-danger"
                    : "border-border focus:border-accent"
                } text-text p-3 focus:outline-none transition-colors font-medium text-sm placeholder:text-text-muted/40 resize-none`}
                placeholder="How can we help you?"
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-xs text-danger font-bold uppercase">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-8 flex flex-col items-center border-2 border-border-soft p-4 bg-card-hover">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">
              <ShieldCheck className="w-4 h-4 text-accent" /> Verification
              Required
            </div>
            <Turnstile
              siteKey={
                import.meta.env.VITE_TURNSTILE_SITE_KEY ||
                "1x00000000000000000000AA"
              }
              onSuccess={(token) => setTurnstileToken(token)}
              options={{ theme: "auto" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !turnstileToken}
            className="w-full bg-text text-bg py-5 font-bold uppercase tracking-widest hover:bg-accent hover:text-[#111111] transition-colors border-2 border-transparent hover:border-accent disabled:opacity-50 flex justify-center items-center gap-3"
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