import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
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
              className="flex-1 px-4 py-2.5 text-text font-medium bg-card-hover hover:bg-card-hover rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-white font-medium bg-danger hover:bg-danger rounded-lg transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
