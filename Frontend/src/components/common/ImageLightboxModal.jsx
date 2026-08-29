import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, ZoomOut, RotateCcw, Loader2, Maximize2 } from "lucide-react";

export default function ImageLightboxModal({ isOpen, image, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = normal, 1.75 = zoomed, 2.5 = deep zoom
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Keep positionRef in sync
  positionRef.current = position;

  // Reset state on modal open or image switch
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      setIsLoading(true);
      setImageError(false);
      setIsDragging(false);
    }
  }, [image?.src, isOpen]);

  // Keyboard navigation (+, -, 0, Esc) & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(4, Math.round(prev * 1.35 * 100) / 100));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const next = Math.max(1, Math.round((prev / 1.35) * 100) / 100);
      if (next <= 1.05) {
        setPosition({ x: 0, y: 0 });
        return 1;
      }
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const toggleZoom = useCallback(() => {
    if (zoomLevel > 1.1) {
      handleResetZoom();
    } else {
      setZoomLevel(2.2);
    }
  }, [zoomLevel, handleResetZoom]);

  // Smooth mouse drag / pan when zoomed
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1 || e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Smooth mouse wheel zoom support
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 1.15 : 0.87;
    setZoomLevel((prev) => {
      const next = Math.min(4, Math.max(1, Math.round(prev * zoomDelta * 100) / 100));
      if (next <= 1.05) {
        setPosition({ x: 0, y: 0 });
        return 1;
      }
      return next;
    });
  };

  if (!isOpen || !image?.src) return null;

  const isZoomed = zoomLevel > 1;

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-3 sm:p-5 select-none animate-in fade-in duration-150 overflow-hidden"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Header & Controls */}
      <div
        className="w-full flex items-center justify-between gap-3 z-30 max-w-7xl mx-auto py-1.5 px-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Caption / Alt text */}
        <div className="min-w-0 flex items-center gap-2">
          {image.alt && (
            <span className="font-mono text-xs sm:text-sm text-white/90 font-medium truncate max-w-[200px] sm:max-w-md md:max-w-xl bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
              {image.alt}
            </span>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-mono backdrop-blur-md ${
              zoomLevel <= 1
                ? "opacity-40 cursor-not-allowed text-white/50 border-white/10 bg-white/5"
                : "text-white hover:bg-white/15 border-white/20 hover:border-accent cursor-pointer bg-white/10 shadow-md"
            }`}
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4 text-accent" />
            <span className="hidden md:inline">Out</span>
          </button>

          {/* Zoom Level Indicator / Reset */}
          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2.5 py-1.5 text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 hover:border-accent/40 rounded-xl transition-all flex items-center gap-1 text-xs font-mono backdrop-blur-md cursor-pointer shadow-md"
            title="Reset Zoom (0)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-accent" />
            <span>{Math.round(zoomLevel * 100)}%</span>
          </button>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-mono backdrop-blur-md ${
              zoomLevel >= 3
                ? "opacity-40 cursor-not-allowed text-white/50 border-white/10 bg-white/5"
                : "text-white hover:bg-white/15 border-white/20 hover:border-accent cursor-pointer bg-white/10 shadow-md"
            }`}
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4 text-accent" />
            <span className="hidden md:inline">In</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:p-2.5 text-white hover:text-white bg-accent/20 hover:bg-accent/40 border border-accent/40 hover:border-accent rounded-xl transition-all shadow-lg cursor-pointer ml-1"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </button>
        </div>
      </div>

      {/* Main Image Stage - Pure GPU Hardware Accelerated Canvas */}
      <div
        ref={containerRef}
        className={`flex-1 w-full flex items-center justify-center relative overflow-hidden my-auto ${
          isZoomed
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-zoom-in"
        }`}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onClick={(e) => {
          if (!isDragging) {
            e.stopPropagation();
            toggleZoom();
          }
        }}
      >
        {/* Loading Spinner */}
        {isLoading && !imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3 pointer-events-none">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest text-white/70">
              Loading original asset...
            </span>
          </div>
        )}

        {/* Error Fallback */}
        {imageError && (
          <div className="flex flex-col items-center justify-center p-6 text-center text-white/80 max-w-md bg-card/60 rounded-2xl border border-white/10">
            <span className="text-sm font-semibold mb-2">Unable to load full preview</span>
            <p className="text-xs text-white/60">The image could not be loaded at full resolution.</p>
          </div>
        )}

        {/* High-Performance Smooth Scaled Image */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transform-gpu will-change-transform transition-transform"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${zoomLevel})`,
            transitionDuration: isDragging ? "0ms" : "320ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transformOrigin: "center center",
          }}
        >
          <img
            src={image.src}
            alt={image.alt || "Full Preview"}
            decoding="async"
            loading="eager"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setImageError(true);
            }}
            draggable={false}
            className={`max-w-[92vw] max-h-[78vh] md:max-h-[82vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl select-none border border-white/15 transition-opacity duration-200 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>

      {/* Footer Instructions Bar */}
      <div
        className="w-full flex items-center justify-center gap-3 z-30 py-1"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[11px] font-mono text-white/70 bg-black/60 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-sm">
          {isZoomed ? (
            <>
              Click or drag to pan • Click image to zoom out • <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-[10px]">Esc</kbd> to close
            </>
          ) : (
            <>
              Click image to zoom • Scroll / <kbd className="px-1 py-0.5 rounded bg-white/15 text-white font-mono text-[10px]">+</kbd> <kbd className="px-1 py-0.5 rounded bg-white/15 text-white font-mono text-[10px]">-</kbd> to scale • <kbd className="px-1.5 py-0.5 rounded bg-white/15 text-white font-mono text-[10px]">Esc</kbd> to close
            </>
          )}
        </span>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}

