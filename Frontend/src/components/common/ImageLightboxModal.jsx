import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut } from "lucide-react";

export default function ImageLightboxModal({ isOpen, image, onClose }) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset zoom on image change or modal close
  useEffect(() => {
    setIsZoomed(false);
  }, [image, isOpen]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image?.src) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar Header & Controls */}
      <div
        className="w-full flex items-center justify-between gap-4 z-20 max-w-7xl mx-auto py-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Caption / Alt text */}
        <div className="min-w-0 flex items-center gap-2">
          {image.alt && (
            <span className="font-mono text-xs sm:text-sm text-text-inverse/90 font-medium truncate max-w-xs sm:max-w-md md:max-w-xl bg-card/40 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              {image.alt}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom In/Out Toggle */}
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="p-2 sm:px-3 sm:py-1.5 text-text-inverse/90 hover:text-white bg-card/60 hover:bg-card border border-white/15 hover:border-accent/50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-mono backdrop-blur-md cursor-pointer shadow-lg"
            title={isZoomed ? "Zoom Out (1x)" : "Zoom In (1.5x)"}
          >
            {isZoomed ? (
              <>
                <ZoomOut className="w-4 h-4 text-accent" />
                <span className="hidden sm:inline">1x</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-4 h-4 text-accent" />
                <span className="hidden sm:inline">Zoom</span>
              </>
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 text-text-inverse hover:text-white bg-accent/20 hover:bg-accent/40 border border-accent/40 rounded-xl transition-all shadow-lg cursor-pointer ml-1"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </button>
        </div>
      </div>

      {/* Center Image Container */}
      <div
        className={`flex-1 w-full flex items-center justify-center overflow-auto p-1 sm:p-4 my-auto relative ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onClick={() => setIsZoomed((prev) => !prev)}
      >
        {/* Glow behind image */}
        <div className="absolute inset-0 max-w-4xl max-h-[80vh] m-auto bg-accent/15 rounded-3xl blur-3xl pointer-events-none -z-10" />

        <img
          src={image.src}
          alt={image.alt || "Enlarged preview"}
          className={`max-w-[95vw] max-h-[80vh] md:max-h-[84vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 select-none border border-white/10 ${
            isZoomed ? "scale-125 sm:scale-150 max-h-none my-8" : "scale-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed((prev) => !prev);
          }}
        />
      </div>

      {/* Footer Info */}
      <div
        className="w-full flex items-center justify-center gap-4 z-20 py-1"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[11px] font-mono text-white/60 bg-black/40 px-3 py-1 rounded-full border border-white/5">
          Click image to toggle zoom • Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Esc</kbd> or click outside to close
        </span>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
