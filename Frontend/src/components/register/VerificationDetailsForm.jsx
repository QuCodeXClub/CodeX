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
      <h3 className="font-oswald text-2xl font-bold uppercase tracking-widest text-[#0a0a0a] border-b-2 border-gray-200 pb-2 mb-6">
        3. Verification Details
      </h3>
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-white border-2 border-gray-300 flex items-center justify-center shrink-0">
          <QrCode className="w-12 h-12 text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-2">
            1. Transfer the required membership fee to the official CodeX UPI
            handler.
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-[#b76e79] mb-4">
            UPI ID: CODEX@YBL
          </p>
          <label className="block text-xs font-bold text-[#2ec5d4] mb-2 uppercase tracking-wider">
            2. Enter Unique Transaction ID (UTR)
          </label>
          <input
            type="text"
            {...register("transactionId", { required: "Transaction ID is required" })}
            className={`w-full max-w-sm bg-white border-2 ${errors.transactionId ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-[#2ec5d4]'} text-[#0a0a0a] p-3 focus:outline-none transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300`}
          />
          {errors.transactionId && <p className="mt-1 text-xs text-red-500 font-bold uppercase">{errors.transactionId.message}</p>}
        </div>
      </div>
      <div className="mb-8 flex flex-col items-center border-2 border-gray-100 p-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
          <ShieldCheck className="w-4 h-4 text-[#2ec5d4]" /> Verification
          Required
        </div>
        <Turnstile
          siteKey={
            import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"
          }
          onSuccess={(token) => setTurnstileToken(token)}
          options={{ theme: "light" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !turnstileToken}
        className="w-full bg-[#0a0a0a] text-white py-5 font-bold uppercase tracking-widest hover:bg-[#2ec5d4] hover:text-[#0a0a0a] transition-colors border-2 border-transparent hover:border-[#0a0a0a] disabled:opacity-50 flex justify-center items-center gap-3"
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
