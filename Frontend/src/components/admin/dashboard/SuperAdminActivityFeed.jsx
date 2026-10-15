import React from "react";
import { Link } from "react-router-dom";
import { ScrollText, ShieldAlert, Clock, UserCheck } from "lucide-react";

export default function SuperAdminActivityFeed({ recentActivityLogs, loading }) {
  return (
    <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-6 border border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/5 flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
            <ScrollText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-text uppercase tracking-wide text-sm flex items-center gap-1.5">
              AUDIT <span className="text-fuchsia-400">TELEMETRY</span>
            </h3>
            <p className="text-[10px] font-mono text-fuchsia-300/80">
              Live administrator activity feed
            </p>
          </div>
        </div>
        <Link
          to="/admin/logs"
          className="text-xs font-mono font-semibold text-fuchsia-400 hover:text-fuchsia-300 hover:underline uppercase tracking-wider"
        >
          All Logs &rarr;
        </Link>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2">
        {loading ? (
          <p className="text-xs font-mono text-text-muted">Loading audit telemetry...</p>
        ) : !recentActivityLogs || recentActivityLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <ShieldAlert className="w-8 h-8 text-fuchsia-400/40 mb-2" />
            <p className="text-xs font-mono text-text-muted">
              No recent administrative activities logged.
            </p>
          </div>
        ) : (
          recentActivityLogs.map((log) => (
            <div
              key={log._id}
              className="flex gap-3 items-start p-2.5 rounded-xl bg-card-hover/40 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all"
            >
              <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-fuchsia-400 shadow-sm shadow-fuchsia-400/60 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text truncate font-medium leading-snug">
                  {log.action}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted mt-1">
                  <span className="text-fuchsia-300 font-semibold truncate flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-fuchsia-400 shrink-0" />
                    {log.adminName || log.adminId?.name || "Root Admin"}
                  </span>
                  <span>•</span>
                  <span className="truncate flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-text-muted shrink-0" />
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
