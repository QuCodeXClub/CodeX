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
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/5">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4 gap-2">
          <h3 className="font-display font-bold text-text uppercase tracking-wide text-xs sm:text-sm flex items-center gap-1.5 truncate">
            ROOT <span className="text-fuchsia-400">ACTIONS</span>
          </h3>
          <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 shrink-0">
            SUPER ADMIN
          </span>
        </div>
        <div className="space-y-2 sm:space-y-2.5">
          <Link
            to="/admin/admins"
            className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/10 transition-all group gap-2"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono font-medium text-text group-hover:text-fuchsia-300 min-w-0">
              <ShieldAlert className="w-4 h-4 text-fuchsia-400 shrink-0" />
              <span className="truncate">Admin Accounts</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-fuchsia-400/80 shrink-0">
              {metrics.totalAdmins ?? 0} Active
            </span>
          </Link>

          <Link
            to="/admin/certificates"
            className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/10 transition-all group gap-2"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono font-medium text-text group-hover:text-fuchsia-300 min-w-0">
              <Award className="w-4 h-4 text-fuchsia-400 shrink-0" />
              <span className="truncate">Certificate Batches</span>
            </div>
            {metrics.pendingBatches > 0 ? (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse shrink-0">
                {metrics.pendingBatches} Pending
              </span>
            ) : (
              <span className="text-[10px] font-mono text-text-muted shrink-0">
                Direct / Review
              </span>
            )}
          </Link>

          <Link
            to="/admin/logs"
            className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/10 transition-all group gap-2"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono font-medium text-text group-hover:text-fuchsia-300 min-w-0">
              <ScrollText className="w-4 h-4 text-fuchsia-400 shrink-0" />
              <span className="truncate">Security & Audit Logs</span>
            </div>
            <span className="text-[10px] font-mono text-text-muted shrink-0">
              Telemetry
            </span>
          </Link>

          <Link
            to="/admin/sessions"
            className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/10 transition-all group gap-2"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono font-medium text-text group-hover:text-fuchsia-300 min-w-0">
              <Activity className="w-4 h-4 text-fuchsia-400 shrink-0" />
              <span className="truncate">Active Admin Sessions</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">
              {metrics.liveSessions ?? 1} Nodes
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-border/80 shadow-lg">
      <h3 className="font-display font-bold text-text uppercase tracking-wide mb-3.5 sm:mb-4 text-xs sm:text-sm">
        QUICK <span className="text-accent">ACTIONS</span>
      </h3>
      <div className="space-y-2 sm:space-y-2.5">
        <Link
          to="/admin/qr-generator"
          className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group gap-2"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono font-medium text-text group-hover:text-accent min-w-0">
            <Scan className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">Generate Event QR</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted shrink-0">&rarr;</span>
        </Link>
        <Link
          to="/admin/events"
          className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group gap-2"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono font-medium text-text group-hover:text-accent min-w-0">
            <Calendar className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">Publish Event</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted shrink-0">&rarr;</span>
        </Link>
        <Link
          to="/admin/registrations"
          className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group gap-2"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono font-medium text-text group-hover:text-accent min-w-0">
            <Users2 className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">Review Registrations</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted shrink-0">&rarr;</span>
        </Link>
        <Link
          to="/admin/certificates"
          className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group gap-2"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono font-medium text-text group-hover:text-accent min-w-0">
            <FileText className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">Issue Certificates</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted shrink-0">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
