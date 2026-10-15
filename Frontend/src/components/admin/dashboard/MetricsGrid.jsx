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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Admin Accounts */}
        <Link
          to="/admin/admins"
          className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-fuchsia-500/30 shadow-lg hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20 text-fuchsia-300 group-hover:bg-fuchsia-500 group-hover:text-white transition-all">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase text-text-muted">
              Admin Accounts
            </span>
          </div>
          <div>
            <span className="text-3xl font-display font-black text-text">
              {metrics.loading ? "-" : metrics.totalAdmins ?? 0}
            </span>
            <p className="text-[11px] font-mono text-fuchsia-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
              Provisioned Admins
            </p>
          </div>
        </Link>

        {/* Metric 2: Pending Certificate Batches */}
        <Link
          to="/admin/certificates"
          className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-fuchsia-500/30 shadow-lg hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase text-text-muted">
              Pending Batches
            </span>
          </div>
          <div>
            <span className="text-3xl font-display font-black text-text">
              {metrics.loading ? "-" : metrics.pendingBatches ?? 0}
            </span>
            <p className="text-[11px] font-mono text-amber-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {metrics.pendingBatches > 0 ? "Review Required" : `${metrics.totalBatches ?? 0} Total Batches`}
            </p>
          </div>
        </Link>

        {/* Metric 3: Live Active Sessions */}
        <Link
          to="/admin/sessions"
          className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-fuchsia-500/30 shadow-lg hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase text-text-muted">
              Active Sessions
            </span>
          </div>
          <div>
            <span className="text-3xl font-display font-black text-text">
              {metrics.loading ? "-" : metrics.liveSessions ?? 1}
            </span>
            <p className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Device Nodes
            </p>
          </div>
        </Link>

        {/* Metric 4: Audit & Security Logs */}
        <Link
          to="/admin/logs"
          className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-fuchsia-500/30 shadow-lg hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20 text-fuchsia-300 group-hover:bg-fuchsia-500 group-hover:text-white transition-all">
              <ScrollText className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-semibold uppercase text-text-muted">
              Audit Traces
            </span>
          </div>
          <div>
            <span className="text-3xl font-display font-black text-text">
              {metrics.loading ? "-" : metrics.totalActivityLogs ?? 0}
            </span>
            <p className="text-[11px] font-mono text-fuchsia-300 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
              {metrics.totalAccessLogs ?? 0} Public Traffic
            </p>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-text-muted">
            Pending Apps
          </span>
        </div>
        <div>
          <span className="text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.pendingApps}
          </span>
          <p className="text-[11px] font-mono text-accent mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live sync active
          </p>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-text-muted">
            Active Events
          </span>
        </div>
        <div>
          <span className="text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.activeEvents}
          </span>
          <p className="text-[11px] font-mono text-accent mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live sync active
          </p>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-warning/10 rounded-xl border border-warning/20 text-warning group-hover:bg-warning group-hover:text-white transition-all">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-text-muted">
            Live Sessions
          </span>
        </div>
        <div>
          <span className="text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.liveSessions}
          </span>
          <p className="text-[11px] font-mono text-warning mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            Session active
          </p>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-text-muted">
            System Node
          </span>
        </div>
        <div>
          <span className="text-3xl font-display font-black text-text">ONLINE</span>
          <p className="text-[11px] font-mono text-accent mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% operational
          </p>
        </div>
      </div>
    </div>
  );
}