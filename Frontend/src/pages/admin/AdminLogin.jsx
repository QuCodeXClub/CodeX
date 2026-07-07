import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { adminService } from "../../services/adminService";
import { setLogin } from "../../context/authSlice";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthResolved = useSelector((state) => state.auth.isAuthResolved);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    setError: setLoginError,
  } = useForm();

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
    setError: setOtpError,
  } = useForm();

  useEffect(() => {
    if (isAuthResolved && user) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthResolved, user, navigate]);

  const onLoginSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      await adminService.loginAdmin(data.email, data.password);
      setUserEmail(data.email);
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || "Authentication failed. Verify credentials.";
      setError(msg);
      // Map specific field errors if backend provides them
      if (err.response?.data?.errors?.length > 0) {
        err.response.data.errors.forEach((e) => {
          if (e.field) setLoginError(e.field, { type: "server", message: e.message });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const response = await adminService.verifyAdminOtp(userEmail, data.otp);
      dispatch(setLogin(response.data || response));
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired OTP sequence.";
      setError(msg);
      if (err.response?.data?.errors?.length > 0) {
        err.response.data.errors.forEach((e) => {
          if (e.field) setOtpError(e.field, { type: "server", message: e.message });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#2ec5d4 1px, transparent 1px), linear-gradient(90deg, #2ec5d4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            CodeX
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {step === 1
              ? "Authorized personnel access only"
              : "Multi-factor verification required"}
          </p>
        </div>
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-xl text-red-700 text-sm font-medium flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}
        {step === 1 ? (
          <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-2.5 w-5 h-5 ${loginErrors.email ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="email"
                  {...registerLogin("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                  })}
                  className={`w-full bg-white border ${loginErrors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 pl-10 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm placeholder:text-slate-400`}
                  placeholder="Enter your Mail"
                />
              </div>
              {loginErrors.email && <p className="mt-1 text-xs text-red-500">{loginErrors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-2.5 w-5 h-5 ${loginErrors.password ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="password"
                  {...registerLogin("password", { required: "Password is required" })}
                  className={`w-full bg-white border ${loginErrors.password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 pl-10 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm placeholder:text-slate-400`}
                  placeholder="••••••••"
                />
              </div>
              {loginErrors.password && <p className="mt-1 text-xs text-red-500">{loginErrors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-teal-700 disabled:opacity-70 shadow-sm mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Secure Login <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-600">
                A 6-digit code has been sent to <br />
                <span className="font-semibold text-teal-600">
                  {userEmail}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 text-center">
                Authentication Code
              </label>
              <div className="relative">
                <KeyRound className={`absolute left-4 top-3.5 w-5 h-5 ${otpErrors.otp ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  maxLength={6}
                  {...registerOtp("otp", { 
                    required: "OTP is required",
                    pattern: { value: /^[0-9]{6}$/, message: "OTP must be exactly 6 digits" }
                  })}
                  className={`w-full bg-slate-50 border ${otpErrors.otp ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-xl p-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 transition-colors font-mono shadow-inner placeholder:text-slate-300`}
                  placeholder="000000"
                />
              </div>
              {otpErrors.otp && <p className="mt-1 text-xs text-red-500 text-center">{otpErrors.otp.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-teal-700 disabled:opacity-70 shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Verify & Access"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
