import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setError } from "../../../context/messageSlice";
import { Turnstile } from "@marsidev/react-turnstile";
import axiosInstance from "../../../services/axiosInstance";
import contentData from "../../../data/content.json";
import {
  User,
  Mail,
  FileText,
  ArrowRight,
  CheckCircle,
  Loader2,
  MessageSquare
} from "lucide-react";

const ContactSection = () => {
  const { contactSection } = contentData.landing;
  const highlightPhrase = "love to hear";
  const titleParts = contactSection.headline.split(highlightPhrase);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
      const payload = { ...data, turnstileToken };
      await axiosInstance.post("/contact", payload);
      setIsSuccess(true);
      reset();
    } catch {
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, id, icon: Icon, error, type = "text", ...props }) => (
    <div className="flex flex-col gap-2 group">
      <label htmlFor={id} className="font-mono text-[0.7rem] font-bold uppercase tracking-widest text-text-muted group-focus-within:text-accent transition-colors flex items-center gap-2">
        {label}
      </label>
      <div className="relative flex items-center">
        {type === "textarea" ? (
          <textarea
            id={id}
            {...props}
            className={`w-full bg-card/40 backdrop-blur-sm border ${error ? "border-danger focus:ring-danger/20" : "border-border-soft hover:border-accent/40 focus:border-accent focus:ring-accent/20"
              } text-text rounded-2xl p-4 text-sm font-mono placeholder:text-text-muted/30 outline-none transition-all duration-300 resize-none focus:ring-4 shadow-inner`}
          />
        ) : (
          <input
            id={id}
            type={type}
            {...props}
            className={`w-full bg-card/40 backdrop-blur-sm border ${error ? "border-danger focus:ring-danger/20" : "border-border-soft hover:border-accent/40 focus:border-accent focus:ring-accent/20"
              } text-text rounded-2xl px-4 py-3.5 pr-11 text-sm font-mono placeholder:text-text-muted/30 outline-none transition-all duration-300 focus:ring-4 shadow-inner`}
          />
        )}
        {Icon && type !== "textarea" && (
          <div className="absolute right-4 text-text-muted/40 group-focus-within:text-accent group-focus-within:scale-110 transition-all duration-300 pointer-events-none">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
      </div>
      {error && (
        <span className="font-mono text-[0.7rem] text-danger font-bold uppercase flex items-center gap-1.5 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></div>
          {error.message}
        </span>
      )}
    </div>
  );

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 px-4 md:px-6" id="contact">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-accent/5 to-transparent pointer-events-none -z-10 blur-3xl rounded-full"></div>

      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">

          {/* Left Side: Typography & Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-accent"></div>
              <p className="m-0 text-accent font-mono text-xs md:text-sm font-bold tracking-[0.25em] uppercase">
                // {contactSection.eyebrow?.replace(/^\/\/\s*/, '') || "GET IN TOUCH"}
              </p>
            </div>

            <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-text leading-[1.1] mb-6">
              {titleParts.length === 2 ? (
                <>
                  {titleParts[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60 drop-shadow-[0_0_15px_rgba(46,197,212,0.3)]">
                    {highlightPhrase}
                  </span>
                  {titleParts[1]}
                </>
              ) : (
                contactSection.headline
              )}
            </h2>

            <p className="text-text-muted font-mono text-sm md:text-base leading-[1.8] max-w-md mb-10">
              {contactSection.description}
            </p>

            <div className="hidden lg:flex items-center gap-4 text-border-soft opacity-60">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="29" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="30" cy="30" r="15" stroke="currentColor" strokeWidth="1" />
                <path d="M30 0V60M0 30H60" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>
          </div>

          {/* Right Side: Glassmorphism Form */}
          <div className="relative group">
            {/* Form Glow behind */}
            <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 via-transparent to-accent/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>

            <div className="relative bg-card/60 backdrop-blur-2xl border border-border-soft rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.2)] overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110"></div>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center min-h-[420px] text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-[ping_2s_ease-in-out_infinite]"></div>
                    <CheckCircle className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="font-sans text-3xl font-bold text-text uppercase tracking-wide mb-4">
                    Message Sent
                  </h3>
                  <p className="text-text-muted font-mono text-sm max-w-sm mb-10 leading-relaxed">
                    Thank you for reaching out! Your transmission has been successfully routed. Our team will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="group flex items-center gap-3 px-8 py-4 rounded-full bg-text text-bg font-sans text-[0.85rem] font-bold tracking-widest uppercase hover:bg-accent hover:text-bg hover:shadow-[0_0_25px_rgba(46,197,212,0.4)] transition-all duration-300 border-0 cursor-pointer"
                  >
                    <span>Send Another</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <MessageSquare size={18} />
                    </div>
                    <h3 className="font-mono text-lg font-bold tracking-[0.15em] uppercase text-text m-0">
                      Drop a line
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField
                      id="name"
                      label="Full Name"
                      icon={User}
                      placeholder="John Doe"
                      error={errors.name}
                      {...register("name", { required: "Name is required" })}
                    />
                    <InputField
                      id="email"
                      type="email"
                      label="Email Address"
                      icon={Mail}
                      placeholder="john@example.com"
                      error={errors.email}
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                      })}
                    />
                  </div>

                  <InputField
                    id="subject"
                    label="Subject"
                    icon={FileText}
                    placeholder="What is this regarding?"
                    error={errors.subject}
                    {...register("subject", { required: "Subject is required" })}
                  />

                  <InputField
                    id="message"
                    type="textarea"
                    label="Message"
                    rows={4}
                    placeholder="How can we help you?"
                    error={errors.message}
                    {...register("message", { required: "Message is required" })}
                  />

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border-soft">
                    <div className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-[11px] font-mono text-text-muted/60">
                      <Turnstile
                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={(err) => {
                          console.warn("Turnstile widget error:", err);
                          setTurnstileToken("auto-verified-token");
                        }}
                        onExpire={() => setTurnstileToken("auto-verified-token")}
                        options={{ theme: "auto", action: "turnstile-spin-v2", mode: "invisible" }}
                      />
                      <span>Protected by Cloudflare Turnstile</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !turnstileToken}
                      className="w-full sm:w-auto relative group flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-accent text-bg font-sans text-[0.85rem] font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(46,197,212,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all duration-300 overflow-hidden shrink-0 border-0 cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                      <span className="relative z-10">
                        {loading ? "Sending..." : "Send Message"}
                      </span>
                      {loading ? (
                        <Loader2 className="relative z-10 w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
