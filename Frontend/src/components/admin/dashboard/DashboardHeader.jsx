import React from "react";
import { CalendarDays, RefreshCw } from "lucide-react";

export default function DashboardHeader({ onRefresh, loading }) {
  const currentDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text">System Overview</h1>
        <p className="text-sm text-text-muted mt-1">
          Real-time metrics and system health
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 bg-card border border-border rounded-lg text-text-muted hover:text-accent hover:border-accent transition-colors shadow-sm disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw
            className={`w-5 h-5 ${loading ? "animate-spin text-accent" : ""}`}
          />
        </button>
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-sm text-sm font-medium text-text">
          <CalendarDays className="w-4 h-4 text-text-muted" />
          {currentDate}
        </div>
      </div>
    </header>
  );
}