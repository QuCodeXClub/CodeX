import React, { useState } from "react";
import { Loader2, X as XIcon, ShieldAlert, Power, CheckCircle, AlertTriangle, Clock, User } from "lucide-react";

export default function RegistrationStatusModal({
  currentStatus,
  onClose,
  onSave,
}) {
  const [isOpen, setIsOpen] = useState(currentStatus?.isRegistrationOpen ?? true);
  const [message, setMessage] = useState(
    currentStatus?.closedMessage ||
      "Registrations are currently closed. Please check back later or contact the CodeX team."
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        isRegistrationOpen: isOpen,
        closedMessage: message.trim(),
      });
      onClose();
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.response?.data?.message || "Failed to update registration status"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card border border-border/80 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border-soft flex items-center justify-between bg-card-hover/40">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isOpen
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              <Power className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Registration Portal Status</h2>
              <p className="text-xs text-text-muted">
                Control whether students can submit membership registrations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors p-2 rounded-lg hover:bg-card-hover"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-mono">
              {error}
            </div>
          )}

          {/* Toggle Switch Pill */}
          <div className="bg-bg/60 border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-text flex items-center gap-2">
                <span>Current Status:</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${
                    isOpen
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      : "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                    }`}
                  />
                  {isOpen ? "OPEN" : "CLOSED"}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1">
                {isOpen
                  ? "Students can freely fill out and submit registration forms."
                  : "Registration page will show a closed notice and reject submissions."}
              </p>
            </div>

            {/* Switch Buttons */}
            <div className="flex items-center bg-card border border-border p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isOpen
                    ? "bg-emerald-500 text-black shadow-sm"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Open
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  !isOpen
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Close
              </button>
            </div>
          </div>

          {/* Student Facing Message */}
          <div>
            <label className="block text-xs font-mono font-bold text-text uppercase tracking-wider mb-1.5">
              Closed Notice Message for Students
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Enter message shown to applicants when registrations are closed..."
              className="w-full bg-bg text-text border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none placeholder:text-text-muted/60"
            />
            <p className="text-[11px] text-text-muted mt-1">
              This notice is prominently displayed on the <code>/register</code> page whenever the portal is closed.
            </p>
          </div>

          {/* Metadata if available */}
          {(currentStatus?.openedAt || currentStatus?.closedAt || currentStatus?.updatedBy) && (
            <div className="bg-card-hover/40 border border-border/50 rounded-xl p-3 text-[11px] font-mono text-text-muted space-y-1">
              {currentStatus?.closedAt && !isOpen && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>Closed at: {new Date(currentStatus.closedAt).toLocaleString()}</span>
                </div>
              )}
              {currentStatus?.openedAt && isOpen && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Opened at: {new Date(currentStatus.openedAt).toLocaleString()}</span>
                </div>
              )}
              {currentStatus?.updatedBy?.fullName && (
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-text-muted" />
                  <span>Last modified by: {currentStatus.updatedBy.fullName}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors rounded-xl border border-transparent hover:border-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                isOpen
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                  : "bg-rose-500 hover:bg-rose-400 text-white"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save Status: {isOpen ? "OPEN" : "CLOSED"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
