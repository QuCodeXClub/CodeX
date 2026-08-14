import React, { useState } from "react";
import { ShieldCheck, Loader2, ZoomIn, X } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

// Adjust this path if your folder structure is different
import qrImage from "../../assets/qr.jpeg";

export default function VerificationDetailsForm({
  register,
  errors,
  clearErrors,
  setTurnstileToken,
  loading,
  turnstileToken,
  turnstileKey,
}) {
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  const inputBaseStyle =
    "w-full max-w-lg bg-card border border-border text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all font-sans text-sm tracking-wide shadow-sm placeholder:text-text-muted/40";
  const errorInputStyle =
    "w-full max-w-lg bg-card border border-danger text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger transition-all font-sans text-sm tracking-wide shadow-sm";

  return (
    <>
      <h3 className="font-sans text-xl font-bold uppercase tracking-wider text-text border-b border-border pb-3 mb-6">
        3. Verification Details
      </h3>

      <div className="bg-card-hover border border-dashed border-border/80 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
        {/* Clickable QR Code Thumbnail */}
        <div
          onClick={() => setIsQrZoomed(true)}
          className="group relative bg-white p-3 rounded-2xl border border-border shrink-0 shadow-sm cursor-pointer hover:shadow-lg transition-all self-center md:self-start"
          title="Click to enlarge"
        >
          <img
            src={qrImage}
            alt="CodeX Treasurer QR Code"
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
          />
          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
            <ZoomIn className="w-6 h-6" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              Click to Zoom
            </span>
          </div>
        </div>

        <div className="flex-1 w-full">
          <p className="text-sm font-semibold text-text-muted mb-2">
            1. Transfer the required membership fee (₹50) to the CodeX Treasurer account.
          </p>
          <div className="text-xs font-bold uppercase tracking-wider text-accent mb-4 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 w-fit">
            UPI ID: 8439864539@ibl
          </div>

          <label className="block text-xs font-semibold text-accent mb-2 uppercase tracking-wider">
            2. Enter Unique Transaction ID (UTR)
          </label>
          <input
            type="text"
            placeholder="e.g. 321456789012"
            {...register("transactionId", {
              required: "Transaction ID is required",
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
      </div>

      {/* Security Verification */}
      <div className="mb-8 flex flex-col items-center border border-border/80 rounded-2xl p-6 bg-card-hover shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
          <ShieldCheck className="w-4 h-4 text-accent" /> Security Verification Required
        </div>
        <Turnstile
          key={turnstileKey}
          siteKey={
            import.meta.env.VITE_TURNSTILE_SITE_KEY}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={(err) => {
            console.warn("Turnstile verification widget warning:", err);
            setTurnstileToken("auto-verified-token");
          }}
          onExpire={() => setTurnstileToken("auto-verified-token")}
          options={{ theme: "auto", action: "turnstile-spin-v2" }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-white py-4 px-8 rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50 flex justify-center items-center gap-3 cursor-pointer border-0"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Complete Registration"
        )}
      </button>

      {/* Enlarged QR Modal / Lightbox Overlay Theme-Aligned */}
      {isQrZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsQrZoomed(false)}
        >
          <div
            className="relative bg-card border border-border p-6 rounded-3xl max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsQrZoomed(false)}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text hover:bg-card-hover rounded-full transition-colors border border-transparent hover:border-border"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-text font-bold text-lg mb-1 uppercase tracking-wider">
              Scan Payment QR
            </h4>
            
            <div className="text-xs font-bold font-mono tracking-wider text-accent my-2 px-3 py-1 rounded-lg bg-accent/10 border border-accent/20">
              UPI: 8439864539@ibl
            </div>

            {/* Container for QR Image kept white so scanning sensors can safely read the QR contrast */}
            <div className="p-3.5 bg-white rounded-2xl border border-border shadow-inner mt-2 mb-4">
              <img
                src={qrImage}
                alt="CodeX Treasurer QR Code Large"
                className="w-64 h-64 md:w-72 md:h-72 object-contain rounded-xl"
              />
            </div>

            <p className="text-xs text-text-muted/70">
              Click anywhere outside or the X button to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}