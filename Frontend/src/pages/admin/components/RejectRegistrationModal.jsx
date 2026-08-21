import React, { useState } from "react";
import { X, AlertTriangle, Send, Loader2, Info } from "lucide-react";

export default function RejectRegistrationModal({ registration, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const presetReasons = [
    "Invalid Transaction ID / UTR Number",
    "Payment Verification Failed",
    "Duplicate Registration Entry",
    "Incomplete / Invalid Student Information",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm(reason);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-card/90 backdrop-blur-2xl border border-rose-500/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border/60 flex items-center justify-between bg-card-hover/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-text uppercase">
                Reject Application
              </h2>
              <p className="text-xs text-text-muted">
                Specify rejection reason to notify student
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Info Pill */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {registration && (
            <div className="p-4 rounded-xl bg-card border border-border/80 text-xs space-y-1">
              <div className="font-semibold text-text text-sm">
                {registration.name}
              </div>
              <div className="text-text-muted font-mono">
                {registration.email} | QID: {registration.studentId || "N/A"}
              </div>
              <div className="text-[11px] text-text-muted/80">
                Course: {registration.course} ({registration.year}) | UTR: {registration.transactionId}
              </div>
            </div>
          )}

          {/* Preset Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text">
              Quick Select Reason
            </label>
            <div className="flex flex-wrap gap-2">
              {presetReasons.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setReason(preset)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-sans transition-all text-left ${
                    reason === preset
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/40 font-semibold"
                      : "bg-card border-border text-text-muted hover:text-text hover:bg-card-hover"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text">
              Rejection Details / Custom Message
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this application is being rejected..."
              className="w-full bg-card border border-border/80 text-text rounded-xl p-3 text-xs focus:outline-none focus:border-rose-500 transition-colors shadow-sm font-sans placeholder:text-text-muted/60"
            />
          </div>

          {/* Email Info Alert */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              This rejection reason will be included directly in the automated status update email sent to <strong>{registration?.email}</strong>.
            </span>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-mono font-bold text-text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors disabled:opacity-50 shadow-lg shadow-rose-500/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Reject & Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
