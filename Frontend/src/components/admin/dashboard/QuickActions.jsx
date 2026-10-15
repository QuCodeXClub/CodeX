import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Users2,
  FileText,
  Scan,
  ShieldAlert,
  ScrollText,
  Activity,
  Award,
} from "lucide-react";

export default function QuickActions({ isSuperView }) {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = (user?.admin?.role || user?.role) === "SuperAdmin";
  const shouldShowSuper = isSuperView !== undefined ? isSuperView : isSuperAdmin;
  const { metrics } = useSelector((state) => state.adminDashboard);

  if (shouldShowSuper) {
    return (
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-6 border border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-text uppercase tracking-wide text-sm flex items-center gap-1.5">
            ROOT <span className="text-fuchsia-400">ACTIONS</span>
          </h3>
          <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
            SUPER ADMIN
          </span>
        </div>
        <div className="space-y-2.5">
          <Link
            to="/admin/admins"
            className="flex items-center justify-between p-3 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/10 transition-all group"
          >
            <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-fuchsia-300">
              <ShieldAlert className="w-4 h-4 text-fuchsia-400" /> Admin Accounts
            </div>
            <span className="text-[10px] font-mono font-bold text-fuchsia-400/80">
              {metrics.totalAdmins ?? 0} Active
            </span>
          </Link>

          <Link
            to="/admin/certificates"
            className="flex items-center justify-between p-3 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/10 transition-all group"
          >
            <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-fuchsia-300">
              <Award className="w-4 h-4 text-fuchsia-400" /> Certificate Batches
            </div>
            {metrics.pendingBatches > 0 ? (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                {metrics.pendingBatches} Pending
              </span>
            ) : (
              <span className="text-[10px] font-mono text-text-muted">
                Direct / Review
              </span>
            )}
          </Link>

          <Link
            to="/admin/logs"
            className="flex items-center justify-between p-3 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/10 transition-all group"
          >
            <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-fuchsia-300">
              <ScrollText className="w-4 h-4 text-fuchsia-400" /> Security & Audit Logs
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              Telemetry
            </span>
          </Link>

          <Link
            to="/admin/sessions"
            className="flex items-center justify-between p-3 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/10 transition-all group"
          >
            <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-fuchsia-300">
              <Activity className="w-4 h-4 text-fuchsia-400" /> Active Admin Sessions
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              {metrics.liveSessions ?? 1} Nodes
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-6 border border-border/80 shadow-lg">
      <h3 className="font-display font-bold text-text uppercase tracking-wide mb-4 text-sm">
        QUICK <span className="text-accent">ACTIONS</span>
      </h3>
      <div className="space-y-2.5">
        <Link
          to="/admin/qr-generator"
          className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group"
        >
          <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-accent">
            <Scan className="w-4 h-4 text-accent" /> QR Generator
          </div>
        </Link>

        <Link
          to="/admin/events"
          className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group"
        >
          <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-accent">
            <Calendar className="w-4 h-4 text-accent" /> Event Management
          </div>
        </Link>
        <Link
          to="/admin/team"
          className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group"
        >
          <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-accent">
            <Users2 className="w-4 h-4 text-accent" /> Team Management
          </div>
        </Link>
        <Link
          to="/admin/certificates"
          className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group"
        >
          <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-accent">
            <FileText className="w-4 h-4 text-accent" /> Certificate Portal
          </div>
        </Link>
      </div>
    </div>
  );
}