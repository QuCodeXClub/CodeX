import React, { useState, useEffect } from "react";
import {
  Settings,
  Sun,
  Moon,
  Power,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Clock,
  User,
  Check,
} from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRegistrationSystemStatus,
  updateRegistrationSystemStatus,
} from "../../context/adminRegistrationsSlice";

export default function AdminSettings() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { systemStatus } = useSelector((state) => state.adminRegistrations);

  const [isOpen, setIsOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState(
    "Registrations are currently closed. Please check back later or contact the CodeX team."
  );
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    dispatch(fetchRegistrationSystemStatus());
  }, [dispatch]);

  useEffect(() => {
    if (systemStatus) {
      setIsOpen(systemStatus.isRegistrationOpen ?? true);
      if (systemStatus.closedMessage) {
        setClosedMessage(systemStatus.closedMessage);
      }
    }
  }, [systemStatus]);

  const handleSaveRegistrationSettings = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSuccessToast(false);
    try {
      await dispatch(
        updateRegistrationSystemStatus({
          isRegistrationOpen: isOpen,
          closedMessage: closedMessage.trim(),
        })
      ).unwrap();
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    } catch (err) {
      setSaveError(
        typeof err === "string"
          ? err
          : err?.response?.data?.message || "Failed to update registration settings"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <header className="border-b border-border/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <Settings className="w-3.5 h-3.5" />
            <span>PORTAL CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-text uppercase tracking-tight">
            SYSTEM <span className="text-accent">SETTINGS</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Configure system rules, registration portal state, and display options.
          </p>
        </div>
      </header>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Registration settings updated successfully! Portal is now {isOpen ? "OPEN" : "CLOSED"}.</span>
          </div>
          <button
            onClick={() => setSuccessToast(false)}
            className="text-text-muted hover:text-text cursor-pointer ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Registration Portal Controls Section */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl shadow-lg border border-border/80 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card-hover/50">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border shrink-0 ${
                isOpen
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              <Power className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-text text-base sm:text-lg">
                Student Registration Portal Control
              </h2>
              <p className="text-xs text-text-muted">
                Turn the public membership registration page ON or OFF at any time.
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border shrink-0 self-start sm:self-auto ${
              isOpen
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                : "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
              }`}
            />
            {isOpen ? "PORTAL OPEN" : "PORTAL CLOSED"}
          </span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {saveError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-mono">
              {saveError}
            </div>
          )}

          {/* Toggle Block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-bg/60 border border-border">
            <div>
              <h3 className="text-sm font-bold text-text">Accept New Registrations</h3>
              <p className="text-xs text-text-muted mt-1 max-w-md">
                When closed, students visiting <code>/register</code> will be prevented from registering, and the API will reject new signups with HTTP 403.
              </p>
            </div>

            <div className="flex items-center bg-card border border-border p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isOpen
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Open
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  !isOpen
                    ? "bg-rose-500 text-white shadow-md"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>

          {/* Closed Notice Input */}
          <div>
            <label className="block text-xs font-mono font-bold text-text uppercase tracking-wider mb-2">
              Public Notice When Closed
            </label>
            <textarea
              value={closedMessage}
              onChange={(e) => setClosedMessage(e.target.value)}
              rows={3}
              placeholder="e.g. Registrations for the 2025-26 cycle are closed. Contact the CodeX team for inquiries."
              className="w-full bg-bg text-text border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none placeholder:text-text-muted/60"
            />
            <p className="text-[11px] text-text-muted mt-1.5">
              This message appears front-and-center to anyone who navigates to <code>/register</code> while the portal is disabled.
            </p>
          </div>

          {/* Timestamp Info */}
          {(systemStatus?.openedAt || systemStatus?.closedAt || systemStatus?.updatedBy) && (
            <div className="bg-card-hover/40 border border-border/50 rounded-xl p-3.5 text-xs font-mono text-text-muted flex flex-wrap items-center gap-4">
              {systemStatus?.closedAt && !isOpen && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>Closed: {new Date(systemStatus.closedAt).toLocaleString()}</span>
                </div>
              )}
              {systemStatus?.openedAt && isOpen && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Opened: {new Date(systemStatus.openedAt).toLocaleString()}</span>
                </div>
              )}
              {systemStatus?.updatedBy?.fullName && (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-text-muted" />
                  <span>By: {systemStatus.updatedBy.fullName}</span>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveRegistrationSettings}
              disabled={isSaving}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                isOpen
                  ? "bg-accent hover:opacity-90 text-[#111111]"
                  : "bg-rose-500 hover:bg-rose-400 text-white"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <span>Save Portal Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl shadow-lg border border-border/80 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border-soft flex items-center gap-3 bg-card-hover/50">
          <Settings className="text-accent w-5 h-5" />
          <h2 className="font-semibold text-text">Preferences & Appearance</h2>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <section>
            <h3 className="flex items-center gap-2 text-base font-bold text-text mb-4">
              {theme === "light" ? (
                <Sun className="w-4 h-4 text-accent" />
              ) : (
                <Moon className="w-4 h-4 text-accent" />
              )}
              Theme Customization
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-bg/60 border border-border">
              <div className="pr-0 sm:pr-4">
                <h4 className="text-sm font-semibold text-text">Interface Theme</h4>
                <p className="text-xs text-text-muted mt-1">
                  Switch between dark high-contrast mode and light mode across the administration panel.
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-card-hover text-text transition-all font-medium text-sm shrink-0 shadow-sm cursor-pointer whitespace-nowrap"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-4 h-4" />
                    Switch to Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    Switch to Light Mode
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}