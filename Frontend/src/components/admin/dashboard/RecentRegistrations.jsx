import React from "react";
import { Link } from "react-router-dom";

export default function RecentRegistrations({ metrics, recentLogs }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="font-bold text-text">Recent Registrations</h3>
        <Link
          to="/admin/registrations"
          className="text-xs font-medium text-accent hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2">
        {metrics.loading ? (
          <p className="text-sm text-text-muted">Loading activity...</p>
        ) : recentLogs.length === 0 ? (
          <p className="text-sm text-text-muted">
            No recent registrations found.
          </p>
        ) : (
          recentLogs.map((log) => (
            <div key={log._id} className="flex gap-4">
              <div
                className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  log.status === "APPROVED"
                    ? "bg-accent"
                    : log.status === "REJECTED"
                      ? "bg-danger"
                      : "bg-warning"
                }`}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text truncate">
                  <span className="font-medium text-text">{log.name}</span>{" "}
                  applied for CodeX ({log.course}).
                </p>
                <p className="text-xs text-text-muted mt-1">
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