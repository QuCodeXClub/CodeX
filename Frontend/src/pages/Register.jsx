import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { registrationService } from "../services/registrationService";
import { useDispatch } from "react-redux";
import { setError } from "../context/messageSlice";
import RegistrationSuccess from "../components/register/RegistrationSuccess";
import PersonalDetailsForm from "../components/register/PersonalDetailsForm";
import AcademicDetailsForm from "../components/register/AcademicDetailsForm";
import VerificationDetailsForm from "../components/register/VerificationDetailsForm";
import contentData from "../data/content.json";
import PageContainer from "../components/common/PageContainer";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const [turnstileToken, setTurnstileToken] = useState(null);
  const turnstileRef = useRef(null);

  const resetSecurityCheck = () => {
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  };

  const registerContent = contentData?.register || {
    eyebrow: "REGISTRATION",
    titlePart1: "Join The",
    titlePart2: "Club",
    description:
      "Initialize your profile and secure your position in the CodeX network.",
  };

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      fatherName: "",
      email: "",
      phone: "",
      course: "",
      year: "",
      semester: "",
      section: "",
      set: "",
      studentId: "",
      transactionId: "",
      acceptedTerms: false,
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

      await registrationService.registerStudent(payload);
      setIsSuccess(true);
    } catch (err) {
      // 1. Extract error response structure (axiosInstance unwraps error.response.data on rejection)
      const errorData = err?.response?.data || err;
      const message =
        errorData?.message ||
        (typeof err === "string" ? err : "Registration submission failed.");
      const errorsArray = errorData?.errors || [];

      let mappedField = false;

      // 2. Map structured errors array if returned by backend
      if (Array.isArray(errorsArray) && errorsArray.length > 0) {
        errorsArray.forEach((e) => {
          if (e.field) {
            setFormError(e.field, { type: "server", message: e.message });
            mappedField = true;
          }
        });
      }

      // 3. Fallback: Map single backend error message to specific form input field
      if (!mappedField && message) {
        const lowerMsg = message.toLowerCase();
        if (
          lowerMsg.includes("student id") ||
          lowerMsg.includes("qid") ||
          lowerMsg.includes("studentid")
        ) {
          setFormError("studentId", { type: "server", message });
        } else if (
          lowerMsg.includes("transaction id") ||
          lowerMsg.includes("transactionid") ||
          lowerMsg.includes("utr") ||
          lowerMsg.includes("uri")
        ) {
          setFormError("transactionId", { type: "server", message });
        } else if (lowerMsg.includes("email")) {
          setFormError("email", { type: "server", message });
        } else if (lowerMsg.includes("phone")) {
          setFormError("phone", { type: "server", message });
        } else if (
          lowerMsg.includes("terms") ||
          lowerMsg.includes("condition")
        ) {
          setFormError("acceptedTerms", { type: "server", message });
        }
      }

      // 4. Always notify user via global message toast banner
      dispatch(setError(message));

      // 5. Cleanly reset turnstile widget key so user can re-verify without page refresh or form reset
      resetSecurityCheck();
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return <RegistrationSuccess />;
  }

  return (
    <div className="min-h-screen bg-transparent relative font-sans flex flex-col">
      <div className="relative z-10 w-full pt-6 sm:pt-8 md:pt-12 pb-16 sm:pb-20">
        <PageContainer>
          {/* ─── Hero Header ─── */}
          <header className="mb-6 sm:mb-8 md:mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-border/80">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2.5 sm:mb-3">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{registerContent.eyebrow}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-text mb-2.5 sm:mb-3 tracking-tight">
                  {registerContent.titlePart1}{" "}
                  <span className="text-accent">{registerContent.titlePart2}</span>
                </h1>

                <p className="text-text-muted text-xs sm:text-sm md:text-base font-normal leading-relaxed">
                  {registerContent.description}
                </p>
              </div>

              {/* Header Quick Highlights on Desktop */}
              <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 sm:gap-2.5 shrink-0">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-card border border-border text-text font-mono text-[11px] sm:text-xs shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span>500+ Active Members</span>
                </div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-card border border-border text-text font-mono text-[11px] sm:text-xs shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>One-Time ₹50 Fund</span>
                </div>
              </div>
            </div>
          </header>

          {/* ─── Form Grid (2-Column Desktop Layout) ─── */}
          <form onSubmit={handleSubmit(onFormSubmit)} className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 xl:gap-10 items-start">
              {/* Left Column: Personal & Academic Forms (7 Cols on Desktop) */}
              <div className="lg:col-span-7 xl:col-span-7 space-y-5 sm:space-y-6 md:space-y-8">
                {/* 1. Personal Details Card */}
                <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-border/80 shadow-xl">
                  <PersonalDetailsForm
                    register={formRegister}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                </div>

                {/* 2. Academic Details Card */}
                <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-border/80 shadow-xl">
                  <AcademicDetailsForm
                    register={formRegister}
                    errors={errors}
                    clearErrors={clearErrors}
                  />
                </div>
              </div>

              {/* Right Column: Payment & Verification (5 Cols, Sticky on Desktop) */}
              <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 space-y-5 sm:space-y-6">
                <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-border/80 shadow-2xl relative overflow-hidden">
                  {/* Subtle decorative background glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

                  <VerificationDetailsForm
                    register={formRegister}
                    errors={errors}
                    clearErrors={clearErrors}
                    setTurnstileToken={setTurnstileToken}
                    loading={loading}
                    turnstileToken={turnstileToken}
                    turnstileRef={turnstileRef}
                  />
                </div>
              </div>
            </div>
          </form>
        </PageContainer>
      </div>
    </div>
  );
};

export default Register;
