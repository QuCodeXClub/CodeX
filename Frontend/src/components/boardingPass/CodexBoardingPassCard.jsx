import React, { useState, memo, useCallback } from "react";
import { RotateCw, Layers, Eye } from "lucide-react";
import { CodexBoardingPassFrontSVG, CodexBoardingPassBackSVG } from "./CodexBoardingPassSVG";

/**
 * CodexBoardingPassCard
 * Interactive 3D Flip Card Component showcasing Front (Pass 1) & Back (Pass 2)
 * with smooth transitions, side switcher, keyboard accessibility, and cyber aesthetic.
 */
const CodexBoardingPassCard = memo(({
  boardingPass = {},
  className = "",
  initialSide = "front",
  showControls = true,
  onSideChange,
}) => {
  const [isFlipped, setIsFlipped] = useState(initialSide === "back");
  const [isHovered, setIsHovered] = useState(false);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      if (onSideChange) onSideChange(next ? "back" : "front");
      return next;
    });
  }, [onSideChange]);

  const setSide = useCallback((side) => {
    const flipped = side === "back";
    setIsFlipped(flipped);
    if (onSideChange) onSideChange(side);
  }, [onSideChange]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Flip Scene Container */}
      <div
        className="w-full max-w-262.5 relative group cursor-pointer"
        style={{ perspective: "1800px" }}
        onClick={toggleFlip}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`CodeX Boarding Pass. Currently showing ${isFlipped ? "back" : "front"} side. Click or press Enter to flip.`}
      >
        {/* Glow ambient background aura */}
        <div
          className={`absolute -inset-2 sm:-inset-4 bg-linear-to-r from-[#02bed3]/20 via-purple-500/10 to-[#02bed3]/20 rounded-3xl blur-2xl transition-opacity duration-700 pointer-events-none ${
            isHovered ? "opacity-75" : "opacity-25"
          }`}
        />

        {/* 3D Card Wrapper */}
        <div
          className="w-full relative transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            width: "100%",
            aspectRatio: "612 / 198",
          }}
        >
          {/* ================= FRONT FACE (PASS 1) ================= */}
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <CodexBoardingPassFrontSVG
              boardingPass={boardingPass}
              id="codex-boarding-pass-front-svg"
              className="w-full h-full object-contain block drop-shadow-[0_12px_36px_rgba(2,190,211,0.2)]"
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>

          {/* ================= BACK FACE (PASS 2) ================= */}
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <CodexBoardingPassBackSVG
              boardingPass={boardingPass}
              id="codex-boarding-pass-back-svg"
              className="w-full h-full object-contain block drop-shadow-[0_12px_36px_rgba(2,190,211,0.2)]"
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
        </div>

        {/* Hover Hint Overlay */}
        <div
          className={`absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-text-muted text-[11px] font-mono flex items-center gap-1.5 transition-all duration-300 pointer-events-none ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          <RotateCw className="w-3 h-3 text-[#02bed3] animate-spin-slow" />
          <span>Click to Flip Pass</span>
        </div>
      </div>

      {/* Control Buttons & Side Switcher */}
      {showControls && (
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-10">
          {/* Front / Back Toggle Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-card border border-border/80 shadow-md">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSide("front");
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                !isFlipped
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Front Side</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSide("back");
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                isFlipped
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Back Side</span>
            </button>
          </div>

          {/* 3D Flip Quick Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFlip();
            }}
            className="px-4 py-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            title="Flip between front and back"
          >
            <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isFlipped ? "rotate-180 text-purple-400" : "text-cyan-400"}`} />
            <span>Flip Pass (3D)</span>
          </button>
        </div>
      )}
    </div>
  );
});

CodexBoardingPassCard.displayName = "CodexBoardingPassCard";

export default CodexBoardingPassCard;
