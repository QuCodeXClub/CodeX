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
  return (
    <>
      <h3 className="font-oswald text-2xl font-bold uppercase tracking-widest text-text border-b-2 border-border pb-2 mb-6">
        3. Verification Details
      </h3>
      <div className="bg-card-hover border-2 border-dashed border-border p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-card border-2 border-border flex items-center justify-center shrink-0">
          <QrCode className="w-12 h-12 text-text-muted" />
        </div>
        <div className="flex-1 w-full">
          <p className="text-sm font-bold uppercase tracking-widest text-text-muted mb-2">
            1. Transfer the required membership fee to the official CodeX UPI
            handler.
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-danger mb-4">
            UPI ID: CODEX@YBL
          </p>
          <label className="block text-xs font-bold text-accent mb-2 uppercase tracking-wider">
            2. Enter Unique Transaction ID (UTR)
          </label>
          <input
            type="text"
            placeholder="e.g. UTR123456789"
            {...register("transactionId", {
              required: "Transaction ID is required",
            })}
            className={`w-full max-w-lg bg-card border-2 ${errors.transactionId ? "border-danger focus:border-danger" : "border-border focus:border-accent"} text-text p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder:text-text-muted/40`}
          />
          {errors.transactionId && (
            <p className="mt-1 text-xs text-danger font-bold uppercase">
              {errors.transactionId.message}
            </p>
          )}
        </div>
      </div>
      
      <div className="mb-8 flex flex-col items-center border-2 border-border-soft p-4 bg-card-hover">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">
          <ShieldCheck className="w-4 h-4 text-accent" /> Verification
          Required
        </div>
        <Turnstile
          siteKey={
            import.meta.env.VITE_TURNSTILE_SITE_KEY ||
            "0x4AAAAAAD5G7REKwUjI5h-H"
          }
          action="turnstile-spin-v2"
          onSuccess={(token) => setTurnstileToken(token)}
          options={{ theme: "auto", action: "turnstile-spin-v2" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !turnstileToken}
        className="w-full bg-text text-bg py-5 font-bold uppercase tracking-widest hover:bg-accent hover:text-[#111111] transition-colors border-2 border-transparent hover:border-accent disabled:opacity-50 flex justify-center items-center gap-3"
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          "Execute Registration Transfer"
        )}
      </button>
    </>
  );
}