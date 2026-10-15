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
  Loader2,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Home,
  Eye,
  EyeOff,
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

  // Rate Limiting & Attempt Tracking
  const [loginCooldown, setLoginCooldown] = useState(0);
  const [otpAttemptsRemaining, setOtpAttemptsRemaining] = useState(5);
  const [isOtpLocked, setIsOtpLocked] = useState(false);

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
    formState: { errors: otpErrors },
    setError: setOtpError,
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

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

  // Login Cooldown Timer (Rate Limit HTTP 429)
  useEffect(() => {
    let timer;
    if (loginCooldown > 0) {
      timer = setInterval(() => {
        setLoginCooldown((prev) => {
          if (prev <= 1) {
            setError("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loginCooldown]);

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
    if (step === 2 && !isOtpLocked) {
      const focusTimeout = setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(focusTimeout);
    }
  }, [step, isOtpLocked]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const onLoginSubmit = async (data) => {
    if (loginCooldown > 0) return;

    setLoading(true);
    setError("");

    const cleanEmail = data.email.trim().toLowerCase();

    try {
      const res = await adminService.loginAdmin(cleanEmail, data.password);

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
      setResendCountdown(res?.data?.waitTime || res?.data?.retryAfter || 60);
      setOtpAttemptsRemaining(5);
      setIsOtpLocked(false);
      setStep(2);
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        (typeof err === "string" ? err : "Authentication failed. Verify credentials.");
      setError(msg);

      // Handle Rate Limit (HTTP 429)
      const is429 = err?.statusCode === 429 || err?.response?.status === 429;
      const retrySec = err?.retryAfter || err?.rateLimit?.retryAfter || (is429 ? 900 : 0);

      if (is429 && retrySec > 0) {
        setLoginCooldown(retrySec);
      }

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
      const wait = res?.data?.waitTime || res?.data?.retryAfter || 60;
      setResendCountdown(wait);
      setValueOtp("otp", "");
      setOtpAttemptsRemaining(5);
      setIsOtpLocked(false);
      dispatch(
        setSuccess(
          res?.message || "A fresh verification code has been sent."
        )
      );
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        (typeof err === "string" ? err : "Failed to resend code. Please try again.");
      setError(msg);

      if (err?.statusCode === 429 || err?.response?.status === 429) {
        const retrySec = err?.retryAfter || err?.rateLimit?.retryAfter || 60;
        setResendCountdown(retrySec);
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setError("");
    setUserPassword("");
    setValueOtp("otp", "");
    setIsOtpLocked(false);
    setOtpAttemptsRemaining(5);
  };

  const onOtpSubmit = async (data) => {
    if (isOtpLocked || otpAttemptsRemaining <= 0) return;

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

      // Extract accurate attempts remaining from backend payload
      if (err?.attemptsRemaining !== undefined) {
        setOtpAttemptsRemaining(err.attemptsRemaining);
      } else {
        setOtpAttemptsRemaining((prev) => Math.max(0, prev - 1));
      }

      // Check for security lockout (5/5 attempts exhausted or 429 status)
      if (err?.isLocked || err?.attemptsRemaining === 0 || err?.statusCode === 429) {
        setIsOtpLocked(true);
        setOtpAttemptsRemaining(0);
      }

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
      if (isOtpLocked) return;
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
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-accent/10 border border-accent/25 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-display font-black text-text tracking-tight uppercase">
            CodeX Admin
          </h1>
          <p className="mt-1.5 text-xs text-text-muted">
            {step === 1
              ? "Authorized administration portal sign in"
              : "Multi-factor authentication required"}
          </p>
        </div>

        {/* Rate Limit Cooldown Notice */}
        {loginCooldown > 0 && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center gap-2.5 shadow-sm animate-fadeIn">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 animate-pulse" />
            <div className="flex-1 flex items-center justify-between">
              <span>Security Cooldown Active:</span>
              <span className="font-bold">{formatTime(loginCooldown)}</span>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {error && loginCooldown === 0 && (
          <div className="mb-5 border border-rose-500/30 bg-rose-500/10 p-3.5 rounded-xl text-rose-700 dark:text-rose-400 text-xs font-medium flex items-start gap-2.5 shadow-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1">
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ================= STEP 1: Email + Password ================= */}
        {step === 1 ? (
          <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1.5">
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
                  disabled={loginCooldown > 0}
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
                  } text-text rounded-xl p-2.5 pl-10 text-xs focus:outline-none focus:ring-2 transition-all placeholder:text-text-muted/40 shadow-sm disabled:opacity-50`}
                  placeholder="admin@codex.com"
                />
              </div>
              {loginErrors.email && (
                <p className="mt-1 text-xs text-rose-500">
                  {loginErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-3 w-4 h-4 ${
                    loginErrors.password ? "text-rose-500" : "text-text-muted"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={loginCooldown > 0}
                  {...registerLogin("password", {
                    required: "Password is required",
                  })}
                  className={`w-full bg-card border ${
                    loginErrors.password
                      ? "border-rose-500 focus:ring-rose-500/30 focus:border-rose-500"
                      : "border-border/80 focus:ring-accent/30 focus:border-accent"
                  } text-text rounded-xl p-2.5 pl-10 pr-10 text-xs focus:outline-none focus:ring-2 transition-all placeholder:text-text-muted/40 shadow-sm disabled:opacity-50`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  disabled={loginCooldown > 0}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-2.5 text-text-muted hover:text-text focus:outline-none transition-colors cursor-pointer disabled:opacity-50"
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
                <p className="mt-1 text-xs text-rose-500">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            {/* Remember Email Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer select-none">
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
              disabled={loading || loginCooldown > 0}
              className="w-full flex items-center justify-center gap-2 bg-accent text-[#111111] py-3 px-6 rounded-xl text-xs font-bold uppercase transition-all hover:opacity-95 disabled:opacity-60 shadow-md shadow-accent/20 cursor-pointer mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : loginCooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Cooldown ({loginCooldown}s)</span>
                </>
              ) : (
                <>
                  <span>Secure Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ================= STEP 2: Multi-Factor OTP ================= */
          <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-4" autoComplete="off">
            {/* Hidden honeypot inputs for browser password managers */}
            <input type="text" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />

            {/* Destination Email Info */}
            <div className="text-center mb-4">
              <p className="text-sm text-text-muted">
                A 6-digit code has been sent to <br />
                <span className="font-semibold text-accent">{userEmail}</span>
              </p>
              <button
                type="button"
                onClick={handleBackToEmail}
                className="mt-1 text-xs text-text-muted hover:text-accent underline cursor-pointer transition-colors"
              >
                ← Change email
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-text uppercase">
                  Authentication Code
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    otpAttemptsRemaining <= 2
                      ? "text-rose-500 font-bold"
                      : "text-text-muted"
                  }`}
                >
                  {otpAttemptsRemaining} of 5 attempts left
                </span>
              </div>

              {/* Single Clean Centered Code Input */}
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
                  disabled={isOtpLocked}
                  ref={(e) => {
                    otpFormRef(e);
                    otpInputRef.current = e;
                  }}
                  {...otpInputProps}
                  onPaste={(e) => {
                    e.preventDefault();
                    if (isOtpLocked) return;
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
                  } text-text rounded-xl p-3 text-center text-2xl tracking-[0.45em] focus:outline-none focus:ring-2 transition-all font-mono font-bold shadow-inner placeholder:text-text-muted/30 disabled:opacity-50`}
                  placeholder="••••••"
                />
              </div>

              {otpErrors.otp && (
                <p className="mt-1.5 text-xs text-rose-500 text-center">
                  {otpErrors.otp.message}
                </p>
              )}
            </div>

            {/* Resend OTP Section */}
            <div className="flex items-center justify-between text-xs text-text-muted pt-1">
              <span>Didn't receive code?</span>
              {resendCountdown > 0 ? (
                <span className="font-mono text-text-muted/80 text-[11px]">
                  Resend in {resendCountdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading || isOtpLocked}
                  className="text-accent hover:underline font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Resend Code"}
                </button>
              )}
            </div>

            {/* Lockout Notice if attempts exhausted */}
            {isOtpLocked ? (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs text-center font-mono space-y-2 mt-2">
                <p className="font-bold">Code Invalidated</p>
                <p className="text-[11px] text-text-muted">
                  Maximum attempts (5/5) exceeded. Please request a new verification code.
                </p>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="px-4 py-2 bg-accent text-[#111111] font-bold text-xs rounded-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  ← Request New Code
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-accent text-[#111111] py-3 px-6 rounded-xl text-xs font-bold uppercase transition-all hover:opacity-95 disabled:opacity-60 shadow-md shadow-accent/20 cursor-pointer mt-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </form>
        )}

        {/* Back to Home Link */}
        <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
          <Link
            to="/"
            className="hover:text-accent flex items-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <span className="text-[10px] font-mono text-text-muted/50 uppercase">
            256-Bit SSL Encrypted
          </span>
        </div>
      </div>
    </div>
  );
}
