import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Loader2,
  ZoomIn,
  X,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  HelpCircle,
  Copy,
  Check,
  Download,
  Smartphone,
} from "lucide-react";
import { TurnstileWidget } from "..";
import { ASSETS } from "../../config/assets";
import contentData from "../../data/content.json";

const TREASURER_UPI_ID = contentData.register.treasurerUpiId || null;

export default function VerificationDetailsForm({
  register,
  errors,
  clearErrors,
  setTurnstileToken,
  loading,
  turnstileToken,
  turnstileRef,
}) {
  const [isQrZoomed, setIsQrZoomed] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiAppError, setUpiAppError] = useState(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Close modal on Escape key and prevent background scroll
  useEffect(() => {
    if (isQrZoomed) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setIsQrZoomed(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isQrZoomed]);

  const handleCopyUpi = (e) => {
    e?.stopPropagation();
    if (TREASURER_UPI_ID) {
      navigator.clipboard.writeText(TREASURER_UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleDownloadQr = async (e) => {
    e?.stopPropagation();
    try {
      const response = await fetch(ASSETS.IMAGES.PAYMENT_QR);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const ext = ASSETS.IMAGES.PAYMENT_QR.split('.').pop().split('?')[0] || "webp";
      const a = document.createElement("a");
      a.href = url;
      a.download = `codex-membership-payment-qr.${ext}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(ASSETS.IMAGES.PAYMENT_QR, "_blank");
    }
  };

  const isMobile =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent || navigator.vendor || window.opera
    );

  const upiDeepLink = TREASURER_UPI_ID
    ? `upi://pay?pa=${encodeURIComponent(TREASURER_UPI_ID)}&pn=CodeX%20Club&am=50&cu=INR&tn=CodeX%20Membership%20Fee`
    : null;

  const handlePayViaUpiApp = (e) => {
    e?.preventDefault();
    setUpiAppError(null);

    if (!upiDeepLink) {
      setUpiAppError("Official UPI ID is not configured. Please contact the CodeX team.");
      return;
    }

    if (!isMobile) {
      setUpiAppError(
        "UPI apps are not supported on desktop devices. Please scan the QR code with your phone or copy the UPI ID below."
      );
      return;
    }

    // On mobile devices, trigger the UPI intent and notify the user
    setPaymentInitiated(true);
    const startTime = Date.now();
    window.location.href = upiDeepLink;

    setTimeout(() => {
      // If the user remains on the page after timeout, app may not be installed
      if (document.visibilityState === "visible" && Date.now() - startTime < 2500) {
        setPaymentInitiated(false);
        setUpiAppError(
          "Could not open UPI app. If you don't have a supported UPI app installed, please scan the QR code or copy the UPI ID."
        );
      }
    }, 1500);
  };

  const inputBaseStyle =
    "w-full bg-card border border-border text-text rounded-xl p-3 sm:p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all font-sans text-xs sm:text-sm tracking-wide shadow-sm placeholder:text-text-muted/40";
  const errorInputStyle =
    "w-full bg-card border border-danger text-text rounded-xl p-3 sm:p-3.5 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger transition-all font-sans text-xs sm:text-sm tracking-wide shadow-sm";

  return (
    <div className="flex flex-col h-full justify-between">
      {/* ─── Section Header ─── */}
      <div className="flex items-center justify-between pb-3 sm:pb-3.5 mb-4 sm:mb-5 border-b border-border">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-accent/10 border border-accent/25 text-accent font-mono text-[11px] sm:text-xs font-bold shrink-0">
            03
          </span>
          <div>
            <h3 className="font-sans text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider text-text">
              Payment &amp; Verification
            </h3>
            <p className="text-[11px] sm:text-xs text-text-muted">Pay fee &amp; enter UTR reference</p>
          </div>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono font-medium px-2 sm:px-2.5 py-1 rounded-md bg-card-hover border border-border text-text-muted uppercase tracking-wider">
          Step 3 of 3
        </span>
      </div>

      <div className="space-y-3.5 sm:space-y-4 flex-1 flex flex-col justify-between">
        {/* ─── Step 1: Pay the Membership Fee ─── */}
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
            <span className="flex items-center justify-center w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-accent text-text-inverse text-[10px] sm:text-[11px] font-bold font-mono shrink-0">
              A
            </span>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text">
              Pay Membership Fee
            </h4>
          </div>

          <div className="bg-card-hover/80 border border-dashed border-border/90 rounded-2xl p-3 sm:p-3.5 md:p-4 flex flex-col items-center gap-2.5 sm:gap-3 text-center shadow-sm">
            {/* QR Code Thumbnail with high-contrast presentation */}
            <div
              onClick={() => setIsQrZoomed(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsQrZoomed(true);
                }
              }}
              className="group relative bg-white p-2 rounded-xl border border-border/80 shrink-0 shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:border-accent/50 transition-all duration-300 w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent"
              title="Click to enlarge & scan QR code"
            >
              <img
                src={ASSETS.IMAGES.PAYMENT_QR}
                alt="Payment QR Code"
                className="w-full h-full object-contain select-none"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white gap-1 backdrop-blur-[1.5px]">
                <div className="p-1.5 rounded-full bg-accent text-text-inverse shadow-md">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                  Click to Zoom
                </span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="w-full space-y-2 sm:space-y-2.5">
              {/* Fee Badge & QR Zoom Action */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent font-bold font-mono text-[11px] sm:text-xs shadow-sm">
                  <CreditCard className="w-3.5 h-3.5" />
                  ₹50 Membership Fee
                </div>
                <button
                  type="button"
                  onClick={() => setIsQrZoomed(true)}
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-semibold text-accent hover:text-accent/80 bg-accent/5 hover:bg-accent/10 px-2 sm:px-2.5 py-1 rounded-lg border border-accent/20 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3 h-3" />
                  Enlarge QR
                </button>
              </div>

              {/* Pay via UPI App Action Button */}
              {upiDeepLink && (
                <div className="w-full max-w-xs mx-auto pt-0.5">
                  <button
                    type="button"
                    onClick={handlePayViaUpiApp}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl bg-accent text-text-inverse hover:bg-accent/90 font-bold font-mono text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 text-center cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    Pay via UPI App
                  </button>
                  <p className="text-[10px] sm:text-[11px] text-text-muted mt-1 leading-tight">
                    Opens your UPI app (GPay, PhonePe, Paytm, etc.) to complete payment
                  </p>

                  {/* Message when user initiates UPI app payment */}
                  {paymentInitiated && !upiAppError && (
                    <div className="mt-2 p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-left flex items-start gap-2 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-[11px] text-accent leading-relaxed font-medium">
                        Opening UPI app... Once payment of ₹50 is completed, copy the <strong className="text-text font-bold">12-digit UTR</strong> from your transaction receipt and paste it below.
                      </p>
                    </div>
                  )}

                  {/* Message when UPI app is not installed or device is desktop */}
                  {upiAppError && (
                    <div className="mt-2 p-2.5 rounded-xl bg-warning/10 border border-warning/30 text-left flex items-start gap-2 animate-in fade-in duration-200">
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-warning leading-relaxed font-medium">
                          {upiAppError}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setIsQrZoomed(true)}
                            className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode className="w-3 h-3" /> Enlarge QR
                          </button>
                          {TREASURER_UPI_ID && (
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" /> Copy UPI ID
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* UPI ID with quick copy */}
              {TREASURER_UPI_ID && (
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    Or pay to UPI ID:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="font-mono text-xs sm:text-sm font-bold text-accent bg-card hover:bg-accent/10 border border-accent/30 px-2.5 sm:px-3 py-1 rounded-lg select-all inline-flex items-center gap-1.5 transition-all group cursor-pointer max-w-full truncate"
                    title="Click to copy UPI ID"
                  >
                    <span className="truncate">{TREASURER_UPI_ID}</span>
                    {copiedUpi ? (
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-accent/70 group-hover:text-accent shrink-0" />
                    )}
                  </button>
                  {copiedUpi && (
                    <span className="text-[10px] font-mono text-success font-semibold">
                      ✓ UPI ID Copied!
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Step 2: Enter Your UTR ─── */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="flex items-center justify-center w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-accent text-text-inverse text-[10px] sm:text-[11px] font-bold font-mono shrink-0">
              B
            </span>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text">
              Enter UTR / Transaction Reference
            </h4>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {/* Single UTR Field */}
            <div>
              <label
                htmlFor="utr-field"
                className="block text-[11px] sm:text-xs font-semibold text-text mb-1.5 sm:mb-2 uppercase tracking-wider"
              >
                UTR / Transaction Reference Number
                <span className="text-danger ml-1">*</span>
              </label>
              <input
                id="utr-field"
                type="text"
                placeholder="Enter your 12-digit UTR / Transaction ID"
                autoComplete="off"
                {...register("transactionId", {
                  required: "UTR / Transaction Reference Number is required",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "UTR cannot be empty or whitespace only",
                  onChange: () => {
                    if (clearErrors) clearErrors("transactionId");
                  },
                })}
                className={errors.transactionId ? errorInputStyle : inputBaseStyle}
              />
              {errors.transactionId && (
                <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-danger font-semibold flex items-center gap-1">
                  <span>•</span> {errors.transactionId.message}
                </p>
              )}
            </div>

            {/* What is a UTR? link */}
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-accent shrink-0" />
              <Link
                to="/payment-registration-guide"
                className="text-[11px] sm:text-xs text-accent hover:text-accent/80 underline underline-offset-2 transition-colors font-medium"
              >
                What is a UTR and where can I find it?
              </Link>
            </div>

            {/* UTR Warning Box */}
            <div className="flex items-start gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl bg-warning/8 border border-warning/25">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning shrink-0 mt-0.5" />
              <p className="text-[10px] sm:text-xs text-warning/90 leading-relaxed font-medium">
                <span className="font-bold">Important:</span> Enter the exact UTR
                generated for your payment. Fake or mismatched UTRs will lead to immediate rejection.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Terms & Conditions Checkbox ─── */}
        <div className="mb-4 sm:mb-6">
          <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer group">
            <input
              type="checkbox"
              id="accepted-terms"
              {...register("acceptedTerms", {
                required:
                  "You must accept the Terms & Conditions and Privacy Policy to proceed",
                onChange: () => {
                  if (clearErrors) clearErrors("acceptedTerms");
                },
              })}
              className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border-border text-accent focus:ring-accent/30 focus:ring-2 bg-card accent-accent cursor-pointer transition-all shrink-0"
            />
            <span className="text-[11px] sm:text-xs text-text-muted leading-relaxed select-none">
              I agree to the{" "}
              <Link
                to="/terms-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-accent/80 font-medium transition-colors"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-accent/80 font-medium transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.acceptedTerms && (
            <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-danger font-semibold flex items-center gap-1">
              <span>•</span> {errors.acceptedTerms.message}
            </p>
          )}
        </div>

        {/* ─── Security Protection (Invisible Turnstile) ─── */}
        <TurnstileWidget
          ref={turnstileRef}
          id="turnstile-register"
          siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          action="register"
          size="invisible"
          onSuccess={(token) => setTurnstileToken(token)}
          onError={(err) => {
            console.warn("[Turnstile] Register widget error:", err);
            setTurnstileToken(null);
          }}
          onExpire={() => setTurnstileToken(null)}
        />
        <div className="mb-4 sm:mb-5 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-text-muted/60">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Protected by
          Cloudflare Turnstile
        </div>

        {/* ─── Submit Button ─── */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-text-inverse py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl font-bold font-mono text-xs sm:text-sm uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 sm:gap-2.5 border-0 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Submit Registration</span>
            </>
          )}
        </button>
      </div>

      {/* ─── Full-Screen Enlarged QR Modal (Portaled to document.body) ─── */}
      {isQrZoomed &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setIsQrZoomed(false)}
          >
            <div
              className="relative bg-card/95 backdrop-blur-2xl border border-border/80 p-4 sm:p-6 md:p-7 rounded-3xl max-w-xs sm:max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient Glow behind modal */}
              <div className="absolute -inset-1 bg-gradient-to-br from-accent/25 via-accent/10 to-transparent rounded-3xl blur-xl pointer-events-none -z-10" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsQrZoomed(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-text-muted hover:text-text bg-card hover:bg-card-hover rounded-full transition-all border border-border/60 hover:border-accent/40 shadow-sm z-10 cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Header Badge & Title */}
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1.5 sm:mb-2">
                <QrCode className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Official Payment QR
              </div>

              <h4 className="text-text font-display font-black text-lg sm:text-2xl uppercase tracking-tight">
                Scan to Pay
              </h4>

              <p className="text-[11px] sm:text-xs text-text-muted mt-1 mb-2.5 sm:mb-3.5 max-w-xs leading-relaxed">
                Scan with <strong className="text-text font-semibold">Google Pay, PhonePe, Paytm, BHIM</strong>, or any UPI app.
              </p>

              {/* Amount Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold font-mono text-xs sm:text-sm mb-2.5 sm:mb-3.5 shadow-sm">
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Amount: ₹50 Membership Fee
              </div>

              {/* QR Code Presentation Frame with crisp white contrast & scanner accents */}
              <div className="relative bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-border/30 w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 flex items-center justify-center overflow-hidden mb-2.5 sm:mb-3.5 group shrink-0">
                {/* Corner scanner accents */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-t-2 border-l-2 border-accent/70 rounded-tl-sm pointer-events-none" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-t-2 border-r-2 border-accent/70 rounded-tr-sm pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-b-2 border-l-2 border-accent/70 rounded-bl-sm pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-b-2 border-r-2 border-accent/70 rounded-br-sm pointer-events-none" />

                <img
                  src={ASSETS.IMAGES.PAYMENT_QR}
                  alt="Payment QR Code"
                  className="w-full h-full object-contain select-none"
                />
              </div>

              {/* UPI ID Copy Card */}
              {TREASURER_UPI_ID && (
                <div className="w-full bg-card-hover border border-border rounded-xl p-2 sm:p-2.5 flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                  <div className="flex flex-col text-left min-w-0 pl-1">
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-text-muted">
                      UPI ID
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-text truncate select-all">
                      {TREASURER_UPI_ID}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-accent text-text-inverse hover:bg-accent/90 text-[11px] sm:text-xs font-semibold font-sans flex items-center gap-1.5 transition-all shrink-0 shadow-sm cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-text-inverse" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Action Buttons: UPI App & Download */}
              <div className="w-full flex flex-col xs:flex-row items-center gap-2 mb-2 sm:mb-3">
                {upiDeepLink && (
                  <button
                    type="button"
                    onClick={handlePayViaUpiApp}
                    className="w-full xs:flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 rounded-xl bg-accent text-text-inverse hover:bg-accent/90 font-semibold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-md shadow-accent/20 text-center cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Pay via UPI App
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="w-full xs:flex-1 inline-flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-xl bg-card-hover hover:bg-border/60 text-text border border-border text-[11px] sm:text-xs font-semibold tracking-wider transition-all cursor-pointer"
                  title="Download QR image to scan from gallery"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Save QR Code
                </button>
              </div>

              {paymentInitiated && !upiAppError && (
                <div className="w-full mb-2.5 p-2 sm:p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-left flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <p className="text-[10px] sm:text-[11px] text-accent leading-snug font-medium">
                    Opening UPI app... After payment of ₹50, copy the <strong>12-digit UTR</strong> from your receipt and enter it in Step 2.
                  </p>
                </div>
              )}

              {upiAppError && (
                <div className="w-full mb-2.5 p-2 sm:p-2.5 rounded-xl bg-warning/10 border border-warning/30 text-left flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                  <p className="text-[10px] sm:text-[11px] text-warning leading-snug font-medium">
                    {upiAppError}
                  </p>
                </div>
              )}

              {/* Step Helper Note */}
              <div className="w-full text-left p-2.5 sm:p-3 rounded-xl bg-accent/5 border border-accent/15 mb-2.5 sm:mb-3">
                <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed">
                  <span className="font-bold text-text">Next Step:</span> After paying ₹50, find the <strong className="text-text">12-digit UTR / Reference ID</strong> in your payment receipt and enter it in Step 2 of the form.
                </p>
              </div>

              <p className="text-[10px] sm:text-[11px] font-mono text-text-muted/60">
                Press <kbd className="px-1.5 py-0.5 rounded bg-card-hover border border-border text-[9px] sm:text-[10px]">Esc</kbd> or click outside to close
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
