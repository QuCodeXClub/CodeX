import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setError } from "../../../context/messageSlice";
import { TurnstileWidget } from "../../../components";
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

const InputField = React.forwardRef(
  ({ id, label, icon: Icon, type = "text", error, rows, required = true, formatBadge = "String (Text)", title, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 group/field relative">
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            title={title}
            className="font-mono text-xs text-text-muted uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            {Icon && <Icon size={14} className="text-accent" />}
            <span>{label}</span>
            {required && (
              <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
            )}
          </label>
          {formatBadge && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
              {formatBadge}
            </span>
          )}
        </div>
        <div className="relative">
          {type === "textarea" ? (
            <textarea
              id={id}
              rows={rows || 3}
              ref={ref}
              className={`w-full bg-card/60 backdrop-blur-md border ${
                error ? "border-danger focus:ring-danger/20" : "border-border-soft hover:border-border focus:border-accent focus:ring-accent/20"
              } focus:ring-1 rounded-xl px-4 py-3 text-text placeholder-text-muted/40 font-mono text-sm outline-none transition-all duration-300 resize-none`}
              {...props}
            />
          ) : (
            <input
              id={id}
              type={type}
              ref={ref}
              className={`w-full bg-card/60 backdrop-blur-md border ${
                error ? "border-danger focus:ring-danger/20" : "border-border-soft hover:border-border focus:border-accent focus:ring-accent/20"
              } focus:ring-1 rounded-xl px-4 py-3 text-text placeholder-text-muted/40 font-mono text-sm outline-none transition-all duration-300`}
              {...props}
            />
          )}
        </div>
        {error && (
          <span className="font-mono text-xs text-danger flex items-center gap-1 mt-1">
            {error.message}
          </span>
        )}
      </div>
    );
  }
);
InputField.displayName = "InputField";

const ContactSection = () => {
  const { contactSection } = contentData.landing;
  const highlightPhrase = "love to hear";
  const titleParts = contactSection?.headline ? contactSection.headline.split(highlightPhrase) : [];

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const turnstileRef = useRef(null);
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
      turnstileRef.current?.reset();
    } catch {
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side: Editorial context */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent font-mono text-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              {contactSection?.eyebrow || "Contact Us"}
            </div>

            <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black text-text tracking-tight uppercase leading-[1.1] mb-6">
              {titleParts.length === 2 ? (
                <>
                  {titleParts[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60 drop-shadow-[0_0_15px_rgba(46,197,212,0.3)]">
                    {highlightPhrase}
                  </span>
                  {titleParts[1]}
                </>
              ) : (
                contactSection?.headline
              )}
            </h2>

            <p className="text-text-muted font-mono text-sm md:text-base leading-[1.8] max-w-md mb-10">
              {contactSection?.description || contactSection?.subheadline}
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
                    className="group flex items-center gap-3 px-8 py-4 rounded-full bg-text text-white dark:text-bg font-sans text-[0.85rem] font-bold tracking-widest uppercase hover:bg-accent hover:text-white hover:shadow-[0_0_25px_rgba(46,197,212,0.4)] transition-all duration-300 border-0 cursor-pointer"
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
                      formatBadge="String (Text)"
                      title="Full Name — Format: String (Text) (Mandatory)"
                      icon={User}
                      placeholder="John Doe"
                      error={errors.name}
                      {...register("name", { required: "Name is required" })}
                    />
                    <InputField
                      id="email"
                      type="email"
                      label="Email Address"
                      formatBadge="String (Email)"
                      title="Email Address — Format: String (user@domain.com) (Mandatory)"
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
                    formatBadge="String (Text)"
                    title="Subject — Format: String (Text) (Mandatory)"
                    icon={FileText}
                    placeholder="What is this regarding?"
                    error={errors.subject}
                    {...register("subject", { required: "Subject is required" })}
                  />

                  <InputField
                    id="message"
                    type="textarea"
                    label="Message"
                    formatBadge="String (Text)"
                    title="Message — Format: String (Text) (Mandatory)"
                    rows={4}
                    placeholder="How can we help you?"
                    error={errors.message}
                    {...register("message", { required: "Message is required" })}
                  />

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border-soft">
                    <div className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-[11px] font-mono text-text-muted/60">
                      <TurnstileWidget
                        ref={turnstileRef}
                        id="turnstile-contact"
                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                        action="contact"
                        size="invisible"
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={(err) => {
                          console.warn("[Turnstile] Contact widget error:", err);
                          setTurnstileToken(null);
                        }}
                        onExpire={() => setTurnstileToken(null)}
                      />
                      <span>Protected by Cloudflare Turnstile</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !turnstileToken}
                      className="w-full sm:w-auto relative group flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-accent text-white font-sans text-[0.85rem] font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(46,197,212,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all duration-300 overflow-hidden shrink-0 border-0 cursor-pointer shadow-md"
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
