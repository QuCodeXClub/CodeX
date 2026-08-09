import React from "react";
import { QrCode, ShieldCheck, Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function VerificationDetailsForm({
  register,
  errors,
  setTurnstileToken,
  loading,
  turnstileToken,
}) {
  const inputBaseStyle = "w-full max-w-lg bg-card border border-border text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all font-sans text-sm tracking-wide shadow-sm placeholder:text-text-muted/40";
  const errorInputStyle = "w-full max-w-lg bg-card border border-danger text-text rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger transition-all font-sans text-sm tracking-wide shadow-sm";

  return (
    <>
      <h3 className="font-sans text-xl font-bold uppercase tracking-wider text-text border-b border-border pb-3 mb-6">
        3. Verification Details
      </h3>
      <div className="bg-card-hover border border-dashed border-border/80 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="w-24 h-24 bg-card rounded-2xl border border-border flex items-center justify-center shrink-0 shadow-sm">
          <QrCode className="w-12 h-12 text-accent" />
        </div>
        <div className="flex-1 w-full">
          <p className="text-sm font-semibold text-text-muted mb-2">
            1. Transfer the required membership fee to the official CodeX UPI handler.
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-accent mb-4 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 w-fit">
            UPI ID: CODEX@YBL
          </p>
          <label className="block text-xs font-semibold text-accent mb-2 uppercase tracking-wider">
            2. Enter Unique Transaction ID (UTR)
          </label>
          <input
            type="text"
            placeholder="e.g. UTR123456789"
            {...register("transactionId", {
              required: "Transaction ID is required",
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

      <div className="mb-8 flex flex-col items-center border border-border/80 rounded-2xl p-6 bg-card-hover shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
          <ShieldCheck className="w-4 h-4 text-accent" /> Security Verification Required
        </div>
        <Turnstile
          siteKey={
            import.meta.env.VITE_TURNSTILE_SITE_KEY ||
            "0x4AAAAAAD5G7REKwUjI5h-H"
          }
          onSuccess={(token) => setTurnstileToken(token)}
          onError={(err) => {
            console.warn("Turnstile verification widget warning:", err);
          }}
          onExpire={() => setTurnstileToken(null)}
          options={{ theme: "auto", action: "turnstile-spin-v2" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !turnstileToken}
        className="w-full bg-accent text-white py-4 px-8 rounded-xl font-semibold text-sm uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50 flex justify-center items-center gap-3 cursor-pointer border-0"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Complete Registration"
        )}
      </button>
    </>
  );
}