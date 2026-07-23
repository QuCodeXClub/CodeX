import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setError } from "../../../context/messageSlice";
import { Turnstile } from "@marsidev/react-turnstile";
import axiosInstance from "../../../services/axiosInstance";
import contentData from "../../../data/content.json";
import {User,Mail,FileText,Send,ArrowRight,CheckCircle,Loader2,Users,
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
      const payload = {
        ...data,
        turnstileToken,
      };

      await axiosInstance.post("/contact", payload);
      setIsSuccess(true);
      reset();
    } catch {
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-bg transition-colors duration-300 relative overflow-hidden py-10 lg:py-16 px-4 md:px-6 border-b border-border" id="contact">
      <div className="max-w-[1360px] mx-auto bg-card/90 dark:bg-[#080e15]/95 rounded-[24px] border border-border/40 shadow-2xl p-6 md:p-10 lg:p-12 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-stretch relative z-10">
          <div className="flex flex-col justify-between h-full py-2">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="m-0 text-accent font-mono text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-2">
                    // {contactSection.eyebrow}
                  </p>
                  <div className="w-12 h-[2.5px] bg-accent"></div>
                </div>
                <div className="hidden sm:block opacity-80 w-16 h-16 shrink-0 pointer-events-none">
                  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_20px_rgba(46,197,212,0.2)]">
                    <path d="M85 30C98.807 30 110 41.1929 110 55C110 68.8071 98.807 80 85 80C82.1643 80 79.4385 79.5276 76.9062 78.6659L65 85L70.1989 75.4674C64.6315 70.9238 60 63.454 60 55C60 41.1929 71.1929 30 85 30Z" stroke="currentColor" className="text-accent/40" strokeWidth="1.5" fill="var(--color-bg-soft)"/>
                    <path d="M45 40C61.5685 40 75 51.1929 75 65C75 78.8071 61.5685 90 45 90C41.5283 90 38.2045 89.3791 35.1207 88.244L20 95L26.5401 84.1033C19.2982 79.1306 15 72.4831 15 65C15 51.1929 28.4315 40 45 40Z" stroke="currentColor" className="text-accent/50" strokeWidth="2" fill="var(--color-bg-soft)"/>
                    <circle cx="33" cy="65" r="3" fill="var(--color-accent)"/>
                    <circle cx="45" cy="65" r="3" fill="var(--color-accent)"/>
                    <circle cx="57" cy="65" r="3" fill="var(--color-accent)"/>
                  </svg>
                </div>
              </div>
              <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-text leading-[1.08] mb-8">
                {titleParts.length === 2 ? (
                  <>
                    {titleParts[0]}
                    <span className="text-accent drop-shadow-[0_0_18px_rgba(46,197,212,0.4)]">
                      {highlightPhrase}
                    </span>
                    {titleParts[1]}
                  </>
                ) : (
                  contactSection.headline
                )}
              </h2>
              <p className="text-text-muted font-mono text-base md:text-lg leading-relaxed max-w-xl mb-8">
                {contactSection.description}
              </p>
            </div>
            <div className="pt-6 border-t border-border/20 mt-auto">
              <div className="flex items-center gap-2 text-accent/70 font-mono text-sm md:text-base tracking-widest select-none">
                <span>— — — — — — — — — —</span>
              </div>
            </div>
          </div>
          <div className="bg-bg-soft/90 dark:bg-[#0f1722]/90 border border-border/40 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-xl flex flex-col justify-between">
            {isSuccess ? (
              <div className="py-16 px-4 text-center flex flex-col items-center justify-center min-h-[380px]">
                <CheckCircle className="w-16 h-16 text-accent mb-4 animate-bounce" />
                <h3 className="font-sans text-2xl md:text-3xl font-bold text-text uppercase tracking-wide mb-3">
                  Message Sent
                </h3>
                <p className="text-text-muted font-mono text-sm max-w-md mb-8">
                  Thank you for reaching out! We've received your message and will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="px-7 py-3 rounded-full bg-accent text-white font-sans text-xs md:text-sm font-bold tracking-wider uppercase hover:bg-[#25a8b5] transition-all shadow-md cursor-pointer border-0"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border/30">
                  <Send className="w-5 h-5 text-accent shrink-0" />
                  <h3 className="font-mono text-sm md:text-base font-bold tracking-[0.18em] uppercase text-text">
                    SEND US A MESSAGE
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                    <label className="block font-mono text-xs sm:text-[0.76rem] font-bold uppercase tracking-wider text-text-muted mb-2">
                      FULL NAME
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className={`w-full bg-card dark:bg-[#0a1017] border ${
                          errors.name ? "border-danger" : "border-border/40 focus:border-accent"
                        } text-text rounded-xl px-4 py-3 pr-10 text-sm font-mono placeholder:text-text-muted/40 outline-none transition-all`}
                        placeholder="Enter your name"
                      />
                      <User className="absolute right-3.5 w-4 h-4 text-text-muted/60 pointer-events-none" />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 font-mono text-xs text-danger font-bold uppercase">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-mono text-xs sm:text-[0.76rem] font-bold uppercase tracking-wider text-text-muted mb-2">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                        })}
                        className={`w-full bg-card dark:bg-[#0a1017] border ${
                          errors.email ? "border-danger" : "border-border/40 focus:border-accent"
                        } text-text rounded-xl px-4 py-3 pr-10 text-sm font-mono placeholder:text-text-muted/40 outline-none transition-all`}
                        placeholder="name@example.com"
                      />
                      <Mail className="absolute right-3.5 w-4 h-4 text-text-muted/60 pointer-events-none" />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 font-mono text-xs text-danger font-bold uppercase">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-xs sm:text-[0.76rem] font-bold uppercase tracking-wider text-text-muted mb-2">
                    SUBJECT
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      {...register("subject", { required: "Subject is required" })}
                      className={`w-full bg-card dark:bg-[#0a1017] border ${
                        errors.subject ? "border-danger" : "border-border/40 focus:border-accent"
                      } text-text rounded-xl px-4 py-3 pr-10 text-sm font-mono placeholder:text-text-muted/40 outline-none transition-all`}
                      placeholder="What is this regarding?"
                    />
                    <FileText className="absolute right-3.5 w-4 h-4 text-text-muted/60 pointer-events-none" />
                  </div>
                  {errors.subject && (
                    <p className="mt-1.5 font-mono text-xs text-danger font-bold uppercase">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-mono text-xs sm:text-[0.76rem] font-bold uppercase tracking-wider text-text-muted mb-2">
                    MESSAGE
                  </label>
                  <textarea
                    {...register("message", { required: "Message is required" })}
                    rows={4}
                    className={`w-full bg-card dark:bg-[#0a1017] border ${
                      errors.message ? "border-danger" : "border-border/40 focus:border-accent"
                    } text-text rounded-xl p-4 text-sm font-mono placeholder:text-text-muted/40 outline-none transition-all resize-none`}
                    placeholder="How can we help you?"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1.5 font-mono text-xs text-danger font-bold uppercase">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/30">
                  <div className="w-full sm:w-auto flex justify-center scale-95 origin-left">
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
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#2EC5D4] text-white font-sans text-xs md:text-sm font-bold tracking-wider uppercase hover:bg-[#25a8b5] transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2.5 border-0 cursor-pointer shrink-0"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>SEND MESSAGE</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 mt-10 border-t border-border/30">
          {contactSection.directLines.map((line, index) => {
            const Icon = index === 0 ? Users : Mail;
            return (
              <article
                key={index}
                className="flex items-center gap-5 p-6 rounded-2xl bg-card/60 dark:bg-[#0a1017]/60 border border-border/30 hover:border-accent/40 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Icon size={24} strokeWidth={1.75} />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-accent text-xs font-mono tracking-[0.2em] uppercase font-bold m-0 mb-1">
                    {line.label}
                  </p>
                  <h4 className="font-sans text-lg md:text-xl font-bold text-text uppercase tracking-wide m-0 mb-1 truncate">
                    {line.name}
                  </h4>
                  <a
                    href={`mailto:${line.detail}`}
                    className="font-mono text-sm text-text-muted hover:text-accent transition-colors truncate"
                  >
                    {line.detail}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
