import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Activity,
  ShieldCheck,
  ShieldAlert,
  FileText,
  ScrollText,
} from "lucide-react";

export default function MetricsGrid({ metrics, isSuperView }) {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = (user?.admin?.role || user?.role) === "SuperAdmin";
  const shouldShowSuper = isSuperView !== undefined ? isSuperView : isSuperAdmin;

  if (shouldShowSuper) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Admin Accounts */}
        <Link
          to="/admin/admins"
          className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-fuchsia-500/30 shadow-lg hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
            <div className="p-2 sm:p-2.5 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20 text-fuchsia-300 group-hover:bg-fuchsia-500 group-hover:text-white transition-all shrink-0">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase text-text-muted truncate">
              Admin Accounts
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-black text-text">
              {metrics.loading ? "-" : metrics.totalAdmins ?? 0}
            </span>
            <p className="text-[10px] sm:text-[11px] font-mono text-fuchsia-400 mt-1 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse shrink-0" />
              <span>Provisioned Admins</span>
            </p>
          </div>
        </Link>

        {/* Metric 2: Pending Certificate Batches */}
        <Link
          to="/admin/certificates"
          className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-fuchsia-500/30 shadow-lg hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
            <div className="p-2 sm:p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase text-text-muted truncate">
              Pending Batches
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-black text-text">
              {metrics.loading ? "-" : metrics.pendingBatches ?? 0}
            </span>
            <p className="text-[10px] sm:text-[11px] font-mono text-amber-400 mt-1 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="truncate">
                {metrics.pendingBatches > 0 ? "Review Required" : `${metrics.totalBatches ?? 0} Total Batches`}
              </span>
            </p>
          </div>
        </Link>

        {/* Metric 3: Live Active Sessions */}
        <Link
          to="/admin/sessions"
          className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-fuchsia-500/30 shadow-lg hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
            <div className="p-2 sm:p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase text-text-muted truncate">
              Active Sessions
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-black text-text">
              {metrics.loading ? "-" : metrics.liveSessions ?? 1}
            </span>
            <p className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Live Device Nodes</span>
            </p>
          </div>
        </Link>

        {/* Metric 4: Audit & Security Logs */}
        <Link
          to="/admin/logs"
          className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-fuchsia-500/30 shadow-lg hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
            <div className="p-2 sm:p-2.5 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20 text-fuchsia-300 group-hover:bg-fuchsia-500 group-hover:text-white transition-all shrink-0">
              <ScrollText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase text-text-muted truncate">
              Audit Traces
            </span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-black text-text">
              {metrics.loading ? "-" : metrics.totalActivityLogs ?? 0}
            </span>
            <p className="text-[10px] sm:text-[11px] font-mono text-fuchsia-300 mt-1 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse shrink-0" />
              <span>{metrics.totalAccessLogs ?? 0} Public Traffic</span>
            </p>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-4">
      {/* Pending Applications */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
          <div className="p-2 sm:p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase text-text-muted truncate">
            Pending Apps
          </span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.pendingApps}
          </span>
          <p className="text-[10px] sm:text-[11px] font-mono text-accent mt-1 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            <span>Live sync active</span>
          </p>
        </div>
      </div>

      {/* Active Events */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
          <div className="p-2 sm:p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase text-text-muted truncate">
            Active Events
          </span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.activeEvents}
          </span>
          <p className="text-[10px] sm:text-[11px] font-mono text-accent mt-1 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            <span>Active campaigns</span>
          </p>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
          <div className="p-2 sm:p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase text-text-muted truncate">
            Active Sessions
          </span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.liveSessions}
          </span>
          <p className="text-[10px] sm:text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Connected devices</span>
          </p>
        </div>
      </div>

      {/* Team Size */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
          <div className="p-2 sm:p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase text-text-muted truncate">
            Team Size
          </span>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.teamSize}
          </span>
          <p className="text-[10px] sm:text-[11px] font-mono text-accent mt-1 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            <span>Roster registered</span>
          </p>
        </div>
      </div>
    </div>
  );
}
