import React, { useState } from "react";
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
} from "lucide-react";
import { TurnstileWidget } from "..";
import { ASSETS } from "../../config/assets";

const TREASURER_UPI_ID = import.meta.env.VITE_TREASURER_UPI_ID || null;

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

  const inputBaseStyle =
    "w-full bg-card border border-border text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all font-sans text-sm tracking-wide shadow-sm placeholder:text-text-muted/40";
  const errorInputStyle =
    "w-full bg-card border border-danger text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger transition-all font-sans text-sm tracking-wide shadow-sm";

  return (
    <>
      {/* ─── Section Header ─── */}
      <h3 className="font-sans text-xl font-bold uppercase tracking-wider text-text border-b border-border pb-3 mb-6">
        3. Payment &amp; Verification Details
      </h3>

      {/* ─── Step 1: Pay the Membership Fee ─── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-text-inverse text-xs font-bold font-mono shrink-0">
            1
          </span>
          <h4 className="text-sm font-bold uppercase tracking-wider text-text">
            Pay the Membership Fee
          </h4>
        </div>

        <div className="bg-card-hover border border-dashed border-border/80 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
          {/* QR Code Thumbnail */}
          <div
            onClick={() => setIsQrZoomed(true)}
            className="group relative bg-card p-2 rounded-2xl border border-border shrink-0 shadow-sm cursor-pointer hover:shadow-lg transition-all self-center md:self-start w-32 h-32 md:w-40 md:h-40 flex items-center justify-center overflow-hidden"
            title="Click to enlarge QR code"
          >
            <img 
              src={ASSETS.IMAGES.PAYMENT_QR} 
              alt="Payment QR Code" 
              className="w-full h-full object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 rounded-2xl">
              <ZoomIn className="w-6 h-6" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                Click to Zoom
              </span>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="flex-1 w-full space-y-3">
            {/* Fee Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent font-bold font-mono text-lg">
              <CreditCard className="w-5 h-5" />
              ₹50 Membership Fee
            </div>

            {/* UPI ID */}
            {TREASURER_UPI_ID ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Pay to UPI ID:
                </span>
                <span className="font-mono text-sm font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-lg select-all">
                  {TREASURER_UPI_ID}
                </span>
              </div>
            ) : (
              <div className="text-xs font-bold text-warning/80 bg-warning/10 border border-warning/20 px-3 py-1.5 rounded-lg w-fit">
                UPI ID not configured — contact the CodeX team for payment details.
              </div>
            )}

            <p className="text-xs text-text-muted leading-relaxed">
              Open your UPI app, pay exactly{" "}
              <strong className="text-text">₹50</strong> to the UPI ID above,
              then complete the transaction successfully before submitting this
              form. You will need the{" "}
              <strong className="text-text">
                UTR / Transaction Reference Number
              </strong>{" "}
              from the transaction to proceed.
            </p>

            <p className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
              Need help?{" "}
              <Link
                to="/payment-registration-guide"
                className="text-accent underline hover:text-accent/80 transition-colors"
              >
                View the Payment &amp; Registration Guide
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ─── Step 2: Enter Your UTR ─── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-text-inverse text-xs font-bold font-mono shrink-0">
            2
          </span>
          <h4 className="text-sm font-bold uppercase tracking-wider text-text">
            Enter Your UTR / Transaction Reference Number
          </h4>
        </div>

        <div className="space-y-4">
          {/* Single UTR Field */}
          <div>
            <label
              htmlFor="utr-field"
              className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider"
            >
              UTR / Transaction Reference Number
              <span className="text-danger ml-1">*</span>
            </label>
            <input
              id="utr-field"
              type="text"
              placeholder="Enter your UTR / Transaction ID"
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
              <p className="mt-1.5 text-xs text-danger font-semibold">
                {errors.transactionId.message}
              </p>
            )}
          </div>

          {/* What is a UTR? link */}
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-accent shrink-0" />
            <Link
              to="/payment-registration-guide"
              className="text-xs text-accent hover:text-accent/80 underline underline-offset-2 transition-colors font-medium"
            >
              What is a UTR and where can I find it?
            </Link>
          </div>

          {/* UTR Warning Box */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/8 border border-warning/25">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-warning/90 leading-relaxed font-medium">
              <span className="font-bold">Important:</span> Enter the exact UTR
              generated for your successful ₹50 payment. Incorrect, fake,
              duplicate, unrelated, or unverifiable UTR details may result in
              your registration being{" "}
              <strong>rejected after verification</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Terms & Conditions Checkbox ─── */}
      <div className="mb-8">
        <label className="flex items-start gap-3 cursor-pointer group">
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
            className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent/30 focus:ring-2 bg-card accent-accent cursor-pointer transition-all shrink-0"
          />
          <span className="text-xs sm:text-sm text-text-muted leading-relaxed">
            I have read and agree to the{" "}
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
          <p className="mt-1.5 text-xs text-danger font-semibold">
            {errors.acceptedTerms.message}
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
      <div className="mb-6 flex items-center justify-center gap-1.5 text-[11px] font-mono text-text-muted/60">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Protected by
        Cloudflare Turnstile
      </div>

      {/* ─── Submit Button ─── */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-white py-4 px-8 rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 border-0"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Registration"
        )}
      </button>

      {/* ─── Enlarged QR Modal ─── */}
      {isQrZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsQrZoomed(false)}
        >
          <div
            className="relative bg-card border border-border p-6 md:p-8 rounded-3xl max-w-md md:max-w-lg w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsQrZoomed(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text hover:bg-card-hover rounded-full transition-colors border border-transparent hover:border-border"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-text font-bold text-lg md:text-xl mb-1 uppercase tracking-wider">
              Scan to Pay
            </h4>

            <div className="flex items-center gap-1.5 my-2">
              <span className="text-xs md:text-sm text-text-muted font-semibold uppercase tracking-wider">
                UPI ID:
              </span>
              {TREASURER_UPI_ID ? (
                <span className="font-mono text-sm md:text-base font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-lg select-all">
                  {TREASURER_UPI_ID}
                </span>
              ) : (
                <span className="font-mono text-xs md:text-sm text-warning/80">
                  Contact CodeX team
                </span>
              )}
            </div>

            <div className="text-xs md:text-sm font-bold font-mono text-accent mb-4">
              Amount: ₹50
            </div>

            <div className="p-2 bg-card-hover rounded-2xl border border-border shadow-inner mb-5 w-72 h-72 md:w-96 md:h-96 flex items-center justify-center overflow-hidden">
              <img 
                src={ASSETS.IMAGES.PAYMENT_QR} 
                alt="Payment QR Code" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <p className="text-xs md:text-sm text-text-muted/70">
              Click anywhere outside or the ✕ button to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}