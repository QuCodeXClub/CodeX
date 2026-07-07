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

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const [turnstileToken, setTurnstileToken] = useState(null);
  const { register } = contentData;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError: setFormError
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
    }
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
          if (e.field) setFormError(e.field, { type: "server", message: e.message });
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
    <div className="min-h-screen bg-[#Faf9f6] relative font-jetbrains flex flex-col">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-[1000px] mx-auto pb-20 pt-16 px-4 md:px-12">
        <header className="mb-12">
          <p className="text-[#2ec5d4] text-xs font-bold uppercase tracking-widest mb-3">
            {register.eyebrow}
          </p>
          <h1 className="font-oswald text-5xl md:text-6xl font-bold uppercase text-[#0a0a0a] mb-3">
            {register.titlePart1} <span className="text-[#27EBF5]">{register.titlePart2}</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {register.description}
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="bg-white border-4 border-gray-800 p-6 md:p-10 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]"
        >
          <PersonalDetailsForm
            register={formRegister}
            errors={errors}
          />
          <AcademicDetailsForm
            register={formRegister}
            errors={errors}
          />
          <VerificationDetailsForm
            register={formRegister}
            errors={errors}
            setTurnstileToken={setTurnstileToken}
            loading={loading}
            turnstileToken={turnstileToken}
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
