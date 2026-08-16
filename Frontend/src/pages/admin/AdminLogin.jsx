import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
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
  Home,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    setError: setLoginError,
  } = useForm();

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    setValue: setValueOtp,
    formState: { errors: otpErrors },
    setError: setOtpError,
  } = useForm();

  const onLoginSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      await adminService.loginAdmin(data.email, data.password);
      setUserEmail(data.email);
      setStep(2);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Authentication failed. Verify credentials.";
      setError(msg);
      if (err.response?.data?.errors?.length > 0) {
        err.response.data.errors.forEach((e) => {
          if (e.field)
            setLoginError(e.field, { type: "server", message: e.message });
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
      const msg =
        err.response?.data?.message || "Invalid or expired OTP sequence.";
      setError(msg);
      if (err.response?.data?.errors?.length > 0) {
        err.response.data.errors.forEach((e) => {
          if (e.field)
            setOtpError(e.field, { type: "server", message: e.message });
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-card-hover flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-accent/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#2ec5d4 1px, transparent 1px), linear-gradient(90deg, #2ec5d4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/30 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            CodeX
          </h1>
          <p className="mt-2 text-sm font-medium text-text-text-muted">
            {step === 1
              ? "Authorized personnel access only"
              : "Multi-factor verification required"}
          </p>
        </div>
        {error && (
          <div className="mb-6 border border-danger/30 bg-danger/10 p-4 rounded-xl text-red-700 text-sm font-medium flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}
        {step === 1 ? (
          <form
            onSubmit={handleSubmitLogin(onLoginSubmit)}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-3 w-5 h-5 ${loginErrors.email ? "text-danger" : "text-text-muted"}`}
                />
                <input
                  type="email"
                  {...registerLogin("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  className={`w-full bg-card border ${loginErrors.email ? "border-danger focus:ring-danger/30 focus:border-danger" : "border-border focus:ring-accent/30 focus:border-accent"} text-text rounded-xl p-3 pl-11 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm placeholder:text-text-muted/40`}
                  placeholder="Enter your Email"
                />
              </div>
              {loginErrors.email && (
                <p className="mt-1 text-xs text-danger font-medium">
                  {loginErrors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-3 w-5 h-5 ${loginErrors.password ? "text-danger" : "text-text-muted"}`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...registerLogin("password", {
                    required: "Password is required",
                  })}
                  className={`w-full bg-card border ${loginErrors.password ? "border-danger focus:ring-danger/30 focus:border-danger" : "border-border focus:ring-accent/30 focus:border-accent"} text-text rounded-xl p-3 pl-11 pr-11 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm placeholder:text-text-muted/40`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-3 text-text-muted hover:text-text focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-accent" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {loginErrors.password && (
                <p className="mt-1 text-xs text-danger font-medium">
                  {loginErrors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3 px-6 rounded-xl text-sm font-semibold transition-all hover:bg-accent/90 disabled:opacity-70 shadow-md shadow-accent/20 cursor-pointer border-0 mt-2"
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
          <form
            onSubmit={handleSubmitOtp(onOtpSubmit)}
            className="space-y-6"
            autoComplete="off"
          >
            {/* Hidden inputs to trick browser password managers from autofilling the OTP field */}
            <input type="text" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />
            <div className="text-center mb-6">
              <p className="text-sm text-text-muted">
                A 6-digit code has been sent to <br />
                <span className="font-semibold text-accent">{userEmail}</span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5 text-center">
                Authentication Code
              </label>
              <div className="relative">
                <KeyRound
                  className={`absolute left-4 top-3.5 w-5 h-5 ${otpErrors.otp ? "text-danger" : "text-text-muted"}`}
                />
                <input
                  type="text"
                  maxLength={6}
                  autoComplete="one-time-code"
                  {...registerOtp("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "OTP must be exactly 6 digits",
                    },
                    onChange: (e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      setValueOtp("otp", cleaned, { shouldValidate: true });
                    },
                  })}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData
                      .getData("text")
                      .replace(/\D/g, "")
                      .slice(0, 6);
                    setValueOtp("otp", pastedData, { shouldValidate: true });
                  }}
                  className={`w-full bg-card-hover border ${otpErrors.otp ? "border-danger focus:ring-danger/30 focus:border-danger" : "border-border focus:ring-accent/30 focus:border-accent"} text-text rounded-xl p-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 transition-all font-mono shadow-inner placeholder:text-text-muted/40`}
                  placeholder="000000"
                />
              </div>
              {otpErrors.otp && (
                <p className="mt-1 text-xs text-danger text-center font-medium">
                  {otpErrors.otp.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3 px-6 rounded-xl text-sm font-semibold transition-all hover:bg-accent/90 disabled:opacity-70 shadow-md shadow-accent/20 cursor-pointer border-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Verify & Access"
              )}
            </button>
          </form>
        )}

        {/* Back to Home Button inside the card */}
        <div className="mt-6 pt-6 border-t border-border-soft flex justify-start">
          <Link
            to="/"
            className="flex items-center gap-2 text-text-text-muted hover:text-accent font-medium text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
