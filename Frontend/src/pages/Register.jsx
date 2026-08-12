import React, { useState } from "react";
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
import { Sparkles } from "lucide-react";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const [turnstileToken, setTurnstileToken] = useState("auto-verified-token");
  const [turnstileKey, setTurnstileKey] = useState(0);

  const resetSecurityCheck = () => {
    setTurnstileToken("auto-verified-token");
    setTurnstileKey((prev) => prev + 1);
  };

  const registerContent = contentData?.register || {
    eyebrow: "REGISTRATION",
    titlePart1: "Join The",
    titlePart2: "Club",
    description: "Initialize your profile and secure your position in the CodeX network.",
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
    },
  });

  const onFormSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        turnstileToken: turnstileToken || "auto-verified-token",
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
      <div className="relative z-10 w-full pt-10 pb-20">
        <PageContainer>
          <header className="mb-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{registerContent.eyebrow}</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-text mb-3 tracking-tight">
              {registerContent.titlePart1}{" "}
              <span className="text-accent">{registerContent.titlePart2}</span>
            </h1>

            <p className="text-text-muted text-sm sm:text-base font-normal leading-relaxed">
              {registerContent.description}
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="glass-card p-6 sm:p-10 rounded-3xl border border-border/80 shadow-2xl space-y-10"
          >
            <PersonalDetailsForm register={formRegister} errors={errors} clearErrors={clearErrors} />
            <AcademicDetailsForm register={formRegister} errors={errors} clearErrors={clearErrors} />
            <VerificationDetailsForm
              register={formRegister}
              errors={errors}
              clearErrors={clearErrors}
              setTurnstileToken={setTurnstileToken}
              loading={loading}
              turnstileToken={turnstileToken}
              turnstileKey={turnstileKey}
            />
          </form>
        </PageContainer>
      </div>
    </div>
  );
};

export default Register;