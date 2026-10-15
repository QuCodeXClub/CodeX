import React from "react";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  LayoutDashboard,
} from "lucide-react";

export default function DashboardHeader({
  onRefresh,
  loading,
  isSuperView = false,
  onToggleView,
}) {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = (user?.admin?.role || user?.role) === "SuperAdmin";

  const currentDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-col items-start lg:flex-row lg:items-center justify-between mb-8 gap-4 border-b border-border/60 pb-6">
      <div>
        {isSuperAdmin ? (
          isSuperView ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/40 text-fuchsia-300 font-mono text-xs font-extrabold uppercase tracking-wider mb-2 shadow-sm shadow-fuchsia-500/20">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
              <span>ROOT CONTROL • SUPER ADMIN</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>ADMIN OPERATIONS • STANDARD VIEW</span>
            </div>
          )
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LIVE TELEMETRY</span>
          </div>
        )}

        <h1 className="text-3xl font-display font-black text-text uppercase tracking-tight">
          {isSuperAdmin && isSuperView ? (
            <>
              SUPER ADMIN <span className="text-fuchsia-400">COMMAND</span>
            </>
          ) : (
            <>
              SYSTEM <span className="text-accent">OVERVIEW</span>
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          {isSuperAdmin && isSuperView
            ? "Platform governance, administrator provisioning, and live security telemetry."
            : "Real-time metrics, node performance, and platform telemetry."}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 w-full lg:w-auto">
        {/* Super Admin / Admin Dashboard Switcher */}
        {isSuperAdmin && onToggleView && (
          <div className="flex items-center p-1 rounded-xl bg-card/90 border border-border/80 shadow-inner">
            <button
              onClick={() => onToggleView("super")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                isSuperView
                  ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm"
                  : "text-text-muted hover:text-text hover:bg-card-hover"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-fuchsia-400" />
              Super Admin
            </button>
            <button
              onClick={() => onToggleView("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                !isSuperView
                  ? "bg-accent/15 text-accent border border-accent/30 shadow-sm"
                  : "text-text-muted hover:text-text hover:bg-card-hover"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-accent" />
              Admin View
            </button>
          </div>
        )}

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