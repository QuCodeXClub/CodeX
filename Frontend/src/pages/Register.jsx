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
  const [turnstileToken, setTurnstileToken] = useState(null);
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
  } = useForm({
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
      if (err.response?.data?.errors?.length > 0) {
        err.response.data.errors.forEach((e) => {
          if (e.field)
            setFormError(e.field, { type: "server", message: e.message });
        });
      }
      setTurnstileToken(null);
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
            <PersonalDetailsForm register={formRegister} errors={errors} />
            <AcademicDetailsForm register={formRegister} errors={errors} />
            <VerificationDetailsForm
              register={formRegister}
              errors={errors}
              setTurnstileToken={setTurnstileToken}
              loading={loading}
              turnstileToken={turnstileToken}
            />
          </form>
        </PageContainer>
      </div>
    </div>
  );
};

export default Register;