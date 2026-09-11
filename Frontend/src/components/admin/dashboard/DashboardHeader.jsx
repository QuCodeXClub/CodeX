import React from "react";
import { CalendarDays, RefreshCw, Sparkles } from "lucide-react";

export default function DashboardHeader({ onRefresh, loading }) {
  const currentDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col items-start md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-border/60 pb-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LIVE TELEMETRY</span>
        </div>
        <h1 className="text-3xl font-display font-black text-text uppercase tracking-tight">
          SYSTEM <span className="text-accent">OVERVIEW</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Real-time metrics, node performance, and platform telemetry.
        </p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 sm:p-2.5 bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl text-text-muted hover:text-accent hover:border-accent/40 transition-all shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
          title="Refresh Data"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin text-accent" : ""}`}
          />
        </button>
        <div className="flex items-center gap-2 bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm text-[11px] sm:text-xs font-mono font-medium text-text truncate">
          <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
          <span className="truncate">{currentDate}</span>
        </div>
      </div>
    </header>

  );
}