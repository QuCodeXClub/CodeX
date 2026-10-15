import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { adminService } from "../../services/adminService";
import { setLogin } from "../../context/authSlice";
import { setSuccess } from "../../context/messageSlice";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Home,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  const otpInputRef = useRef(null);

  // If already authenticated, redirect straight to intended destination or dashboard
  useEffect(() => {
    if (currentUser) {
      const destination = location.state?.from?.pathname || "/admin/dashboard";
      navigate(destination, { replace: true });
    }
  }, [currentUser, navigate, location.state]);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    setValue: setValueLogin,
    formState: { errors: loginErrors },
    setError: setLoginError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    setValue: setValueOtp,
    watch: watchOtp,
    formState: { errors: otpErrors },
    setError: setOtpError,
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const currentOtpValue = watchOtp("otp") || "";

  // Pre-fill remembered email if saved
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("codex_remembered_email");
      if (savedEmail) {
        setValueLogin("email", savedEmail);
        setUserEmail(savedEmail);
        setRememberEmail(true);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, [setValueLogin]);

  // Resend countdown timer when in Step 2
  useEffect(() => {
    let timer;
    if (step === 2 && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  // Auto-focus OTP input on Step 2 entry
  useEffect(() => {
    if (step === 2) {
      const focusTimeout = setTimeout(() => {
        otpInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(focusTimeout);
    }
  }, [step]);

  const onLoginSubmit = async (data) => {
    setLoading(true);
    setError("");

    const cleanEmail = data.email.trim().toLowerCase();

    try {
      await adminService.loginAdmin(cleanEmail, data.password);

      try {
        if (rememberEmail) {
          localStorage.setItem("codex_remembered_email", cleanEmail);
        } else {
          localStorage.removeItem("codex_remembered_email");
        }
      } catch {
        // Ignore if storage restricted
      }

      setUserEmail(cleanEmail);
      setUserPassword(data.password);
      setResendCountdown(60);
      setStep(2);
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        (typeof err === "string" ? err : "Authentication failed. Verify credentials.");
      setError(msg);

      const errors = err?.errors || err?.response?.data?.errors || [];
      if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach((e) => {
          if (e.field) {
            setLoginError(e.field, { type: "server", message: e.message });
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || resendLoading || !userEmail || !userPassword) return;

    setResendLoading(true);
    setError("");

    try {
      const res = await adminService.loginAdmin(userEmail, userPassword);
      setResendCountdown(60);
      setValueOtp("otp", "");
      dispatch(
        setSuccess(
          res.message || "A fresh 6-digit verification code has been dispatched."
        )
      );
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        (typeof err === "string" ? err : "Failed to resend code. Please try again.");
      setError(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setError("");
    setUserPassword("");
    setValueOtp("otp", "");
  };

  const onOtpSubmit = async (data) => {
    setLoading(true);
    setError("");

    const cleanOtp = data.otp.toString().trim().replace(/\D/g, "");

    try {
      const response = await adminService.verifyAdminOtp(userEmail, cleanOtp);

      // Normalize auth payload: works for both { admin, token } and raw admin objects
      dispatch(setLogin(response.data || response));

      // Intelligently redirect back to the originally intended protected route or dashboard
      const destination = location.state?.from?.pathname || "/admin/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        (typeof err === "string" ? err : "Invalid or expired OTP sequence.");
      setError(msg);

      const errors = err?.errors || err?.response?.data?.errors || [];
      if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach((e) => {
          if (e.field) {
            setOtpError(e.field, { type: "server", message: e.message });
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const { ref: otpFormRef, ...otpInputProps } = registerOtp("otp", {
    required: "OTP is required",
    pattern: {
      value: /^[0-9]{6}$/,
      message: "OTP must be exactly 6 digits",
    },
    onChange: (e) => {
      const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6);
      setValueOtp("otp", cleaned, { shouldValidate: true });

      // Automatically trigger verification when all 6 digits are typed
      if (cleaned.length === 6) {
        handleSubmitOtp(onOtpSubmit)();
      }
    },
  });

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid Pattern Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#2ec5d4 1px, transparent 1px), linear-gradient(90deg, #2ec5d4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-card/90 backdrop-blur-2xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all">
        {/* Header Badge & Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 bg-accent/10 border border-accent/25 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-display font-black text-text tracking-tight uppercase">
            CodeX Admin Portal
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider ${
                step === 1
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {step === 1 ? "Step 1 • Identity Credentials" : "Step 2 • Multi-Factor OTP"}
            </span>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 border border-rose-500/30 bg-rose-500/10 p-3.5 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-mono font-medium flex items-start gap-2.5 shadow-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1">
              <span>{error}</span>
              {error.toLowerCase().includes("maximum") && (
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="block mt-1.5 text-accent hover:underline font-bold uppercase text-[10px]"
                >
                  ← Request a new OTP
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 1: Email + Password ================= */}
        {step === 1 ? (
          <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-text uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3.5 top-3 w-4 h-4 ${
                    loginErrors.email ? "text-rose-500" : "text-text-muted"
                  }`}
                />
                <input
                  type="email"
                  autoComplete="email"
                  {...registerLogin("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`w-full bg-card border ${
                    loginErrors.email
                      ? "border-rose-500 focus:ring-rose-500/30 focus:border-rose-500"
                      : "border-border/80 focus:ring-accent/30 focus:border-accent"
                  } text-text rounded-xl p-2.5 pl-10 text-xs font-mono focus:outline-none focus:ring-2 transition-all placeholder:text-text-muted/40 shadow-sm`}
                  placeholder="admin@codex.com"
                />
              </div>
              {loginErrors.email && (
                <p className="mt-1 text-[11px] text-rose-500 font-mono">
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-bold text-text uppercase">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-3 w-4 h-4 ${
                    loginErrors.password ? "text-rose-500" : "text-text-muted"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...registerLogin("password", {
                    required: "Password is required",
                  })}
                  className={`w-full bg-card border ${
                    loginErrors.password
                      ? "border-rose-500 focus:ring-rose-500/30 focus:border-rose-500"
                      : "border-border/80 focus:ring-accent/30 focus:border-accent"
                  } text-text rounded-xl p-2.5 pl-10 pr-10 text-xs font-mono focus:outline-none focus:ring-2 transition-all placeholder:text-text-muted/40 shadow-sm`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-2.5 text-text-muted hover:text-text focus:outline-none transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-accent" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {loginErrors.password && (
                <p className="mt-1 text-[11px] text-rose-500 font-mono">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            {/* Remember Email Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-mono text-text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border border-border text-accent focus:ring-accent/30"
                />
                <span>Remember my email</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent text-[#111111] py-3 px-6 rounded-xl text-xs font-mono font-bold uppercase transition-all hover:opacity-95 disabled:opacity-60 shadow-lg shadow-accent/25 cursor-pointer mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ================= STEP 2: Multi-Factor OTP ================= */
          <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-5" autoComplete="off">
            {/* Hidden honeypot inputs for browser password managers */}
            <input type="text" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />

            {/* Destination Email Info Card */}
            <div className="p-3.5 rounded-2xl bg-card-hover/40 border border-border/70 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="min-w-0">
                <span className="text-[10px] uppercase text-text-muted block">One-Time Code Sent To</span>
                <span className="font-bold text-accent truncate block mt-0.5">{userEmail}</span>
              </div>
              <button
                type="button"
                onClick={handleBackToEmail}
                className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-text font-bold uppercase shrink-0 transition-colors cursor-pointer"
                title="Change email address"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-bold text-text uppercase">
                  6-Digit Security Code
                </label>
                <span className="text-[10px] font-mono text-text-muted">Expires in 10m</span>
              </div>

              {/* Segmented 6-Slot Visual Presentation */}
              <div
                className="grid grid-cols-6 gap-2 sm:gap-2.5 my-3 cursor-text"
                onClick={() => otpInputRef.current?.focus()}
              >
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const digit = currentOtpValue[idx] || "";
                  const isCurrent =
                    currentOtpValue.length === idx ||
                    (idx === 5 && currentOtpValue.length === 6);

                  return (
                    <div
                      key={idx}
                      className={`h-12 sm:h-14 rounded-xl border flex items-center justify-center font-mono font-black text-xl sm:text-2xl transition-all select-none ${
                        digit
                          ? "bg-accent/15 border-accent text-accent shadow-sm shadow-accent/20"
                          : isCurrent
                          ? "bg-card border-accent ring-2 ring-accent/30 text-text"
                          : "bg-card/60 border-border/70 text-text-muted/30"
                      } ${
                        otpErrors.otp
                          ? "border-rose-500 bg-rose-500/10 text-rose-500 ring-rose-500/20"
                          : ""
                      }`}
                    >
                      {digit ? (
                        <span>{digit}</span>
                      ) : isCurrent ? (
                        <span className="w-1.5 h-5 bg-accent animate-pulse rounded-full" />
                      ) : (
                        <span className="text-xs text-text-muted/30">•</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Native Input - Overlaid for accessibility, copy-paste, and keyboard input */}
              <div className="relative">
                <KeyRound
                  className={`absolute left-3.5 top-3.5 w-4 h-4 ${
                    otpErrors.otp ? "text-rose-500" : "text-text-muted"
                  }`}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  ref={(e) => {
                    otpFormRef(e);
                    otpInputRef.current = e;
                  }}
                  {...otpInputProps}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData
                      .getData("text")
                      .replace(/\D/g, "")
                      .slice(0, 6);
                    setValueOtp("otp", pastedData, { shouldValidate: true });
                    if (pastedData.length === 6) {
                      handleSubmitOtp(onOtpSubmit)();
                    }
                  }}
                  className={`w-full bg-card border ${
                    otpErrors.otp
                      ? "border-rose-500 focus:ring-rose-500/30 focus:border-rose-500"
                      : "border-border/80 focus:ring-accent/30 focus:border-accent"
                  } text-text rounded-xl p-3 text-center text-lg tracking-[0.3em] focus:outline-none focus:ring-2 transition-all font-mono font-bold shadow-inner placeholder:text-text-muted/30`}
                  placeholder="Or type here"
                />
              </div>

              {otpErrors.otp && (
                <p className="mt-1.5 text-[11px] text-rose-500 text-center font-mono font-bold">
                  {otpErrors.otp.message}
                </p>
              )}
            </div>

            {/* Resend OTP Section with 60s Countdown */}
            <div className="flex items-center justify-between text-xs font-mono text-text-muted pt-1">
              <span>Didn't receive code?</span>
              {resendCountdown > 0 ? (
                <div className="inline-flex items-center gap-1.5 text-text-muted/80 text-[11px]">
                  <Clock className="w-3 h-3 text-accent" />
                  <span>Resend in {resendCountdown}s</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-1 text-accent hover:underline font-bold text-xs uppercase cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${resendLoading ? "animate-spin" : ""}`} />
                  <span>Resend Code</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-[#111111] py-3 px-6 rounded-xl text-xs font-mono font-bold uppercase transition-all hover:bg-emerald-400 disabled:opacity-60 shadow-lg shadow-emerald-500/25 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code & Generating Session...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Enter Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Home Link */}
        <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-accent font-mono text-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>

          <span className="text-[10px] font-mono text-text-muted/50 uppercase">
            256-Bit SSL Encrypted
          </span>
        </div>
      </div>
    </div>
  );
}
