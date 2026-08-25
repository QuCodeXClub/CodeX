import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 m-4">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-text-text-muted hover:text-text-text-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>

          <h2 className="text-xl font-bold text-text mb-2">
            {title || "Confirm Action"}
          </h2>

          <p className="text-text-text-muted mb-6 leading-relaxed text-sm">
            {message || "Are you sure you want to proceed?"}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-text font-medium bg-card-hover hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-white font-medium bg-danger hover:bg-danger/90 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
