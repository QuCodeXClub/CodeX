import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X, CheckCircle2, AlertCircle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  onConfirm,
  onCancel,
  isLoading,
}) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-card-hover transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
              type === "success"
                ? "bg-emerald-500/15 text-emerald-500"
                : type === "warning"
                ? "bg-amber-500/15 text-amber-500"
                : "bg-rose-500/15 text-rose-500"
            }`}
          >
            {type === "success" ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : type === "warning" ? (
              <AlertCircle className="w-6 h-6 text-amber-500" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            )}
          </div>

          <h2 className="text-lg font-mono font-bold text-text mb-2">
            {title || "Confirm Action"}
          </h2>

          <p className="text-text-muted mb-6 leading-relaxed text-xs font-mono">
            {message || "Are you sure you want to proceed?"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full font-mono text-xs font-bold">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-text bg-card hover:bg-card-hover border border-border rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer ${
                type === "success"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                  : type === "warning"
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                  : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
              }`}
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}
