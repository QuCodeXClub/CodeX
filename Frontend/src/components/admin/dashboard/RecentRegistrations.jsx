import React from "react";
import { Link } from "react-router-dom";

export default function RecentRegistrations({ metrics, recentLogs }) {
  return (
    <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-6 border border-border/80 shadow-lg flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h3 className="font-display font-bold text-text uppercase tracking-wide text-sm">
          RECENT <span className="text-accent">REGISTRATIONS</span>
        </h3>
        <Link
          to="/admin/registrations"
          className="text-xs font-mono font-semibold text-accent hover:underline uppercase tracking-wider"
        >
          View All &rarr;
        </Link>
      </div>
      <div className="space-y-3.5 overflow-y-auto pr-2">
        {metrics.loading ? (
          <p className="text-xs font-mono text-text-muted">Loading activity...</p>
        ) : recentLogs.length === 0 ? (
          <p className="text-xs font-mono text-text-muted">
            No recent registrations found.
          </p>
        ) : (
          recentLogs.map((log) => (
            <div key={log._id} className="flex gap-3 items-start p-2.5 rounded-xl bg-card-hover/40 border border-border/40 hover:border-accent/30 transition-all">
              <div
                className={`mt-1.5 w-2 h-2 rounded-full shrink-0 shadow-sm ${
                  log.status === "APPROVED"
                    ? "bg-emerald-500 shadow-emerald-500/50"
                    : log.status === "REJECTED"
                      ? "bg-danger shadow-danger/50"
                      : "bg-warning shadow-warning/50 animate-pulse"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text truncate leading-snug">
                  <span className="font-semibold text-text">{log.name}</span>{" "}
                  applied for <span className="font-mono text-accent">{log.course || "CodeX"}</span>
                </p>
                <p className="text-[10px] font-mono text-text-muted mt-0.5">
                  {new Date(log.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}