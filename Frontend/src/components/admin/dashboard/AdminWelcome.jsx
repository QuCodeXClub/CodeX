import React from "react";

export default function AdminWelcome() {
  return (
    <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 sm:p-7 text-text border border-border/80 relative overflow-hidden shadow-lg group hover:border-accent/40 transition-all">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="relative z-10">
        <p className="text-text-muted text-xs font-mono font-semibold uppercase tracking-wider mb-1">Welcome back,</p>
        <h2 className="text-2xl font-display font-black text-text mb-2 uppercase tracking-wide">
          ADMIN <span className="text-accent">COMMAND</span>
        </h2>
        <p className="text-text-muted text-xs leading-relaxed">
          Platform telemetry and administrative console status for CodeX Developer Club.
        </p>
      </div>
    </div>
  );
}