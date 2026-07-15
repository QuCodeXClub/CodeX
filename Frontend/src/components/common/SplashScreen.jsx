import React, { useState, useEffect } from "react";

const SplashScreen = ({ show = true }) => {
  // Initialize isEntered to true if show is true, so it doesn't start invisible and fade in on mount.
  const [isEntered, setIsEntered] = useState(show);
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldRender(true);
      const frame = window.requestAnimationFrame(() => {
        setIsEntered(true);
      });
      return () => window.cancelAnimationFrame(frame);
    } else {
      setIsEntered(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // 500ms matches the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-all duration-500 ease-out bg-[radial-gradient(circle_at_top,#f0fdfa_0%,#f8fafc_45%,#f1f5f9_100%)] ${
        isEntered ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Top glowing blob */}
      <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl bg-teal-300/30" />

      <div
        className={`relative flex flex-col items-center gap-6 transition-all duration-700 ease-out ${
          isEntered
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-6 scale-95 opacity-0"
        }`}
      >
        <div className="relative grid place-items-center mb-2">
          {/* Outer Ring */}
          <div className="absolute h-36 w-36 md:h-40 md:w-40 rounded-full border-2 border-slate-300 border-t-transparent animate-spin [animation-duration:1.8s]" />

          {/* Inner Ring */}
          <div className="absolute h-28 w-28 md:h-32 md:w-32 rounded-full border-2 border-teal-400/50 border-b-transparent animate-spin [animation-duration:1.2s] [animation-direction:reverse]" />

          {/* Logo inside */}
          <div className="relative z-10 flex items-center justify-center h-20 w-20 md:h-24 md:w-24 bg-white rounded-[1.2rem] border-2 border-teal-500/60 shadow-[0_0_30px_rgba(20,184,166,0.35)] animate-[pulse_1.8s_ease-in-out_infinite]">
            <img
              src="/codex-logo-icon.svg"
              alt="CodeX Logo Icon"
              className="w-12 md:w-14 h-auto drop-shadow-sm"
            />
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-black tracking-wider text-slate-800 mb-1 font-sans">
            Code
            <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 bg-clip-text text-transparent">
              X
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SplashScreen);
