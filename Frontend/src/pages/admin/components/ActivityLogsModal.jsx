import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Activity, User, Monitor } from "lucide-react";
import { adminService } from "../../../services/adminService";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function ActivityLogsModal({ isModal = false }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getActivityLogs({ page, limit: 12 });
      const data = res.data?.data || res.data;
      setLogs(data.logs || []);
      setPagination({ totalPages: data.totalPages || 1, total: data.totalLogs || 0, page: data.currentPage || 1 });
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleClearLogs = async () => {
    setShowConfirmModal(true);
  };

  const confirmClearLogs = async () => {
    try {
      setLoading(true);
      await adminService.clearActivityLogs();
      setPage(1);
      fetchLogs();
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Failed to clear activity logs:", err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border/80 shadow-sm shrink-0">
        <div className="text-xs font-mono text-text-muted flex items-center gap-2">
          <Activity className="w-4 h-4 text-fuchsia-400 shrink-0" />
          <span>Note: All logs auto delete after 3 months.</span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchLogs}
            className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl border border-border bg-card text-text font-mono text-xs font-bold hover:bg-card-hover transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleClearLogs}
            className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs font-bold hover:bg-red-500/20 transition-colors"
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl border border-border/80 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading && logs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted gap-3 py-16">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
              <span className="text-xs font-mono">Loading activity logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted gap-3 py-16">
              <Activity className="w-12 h-12 text-indigo-400/60" />
              <span className="text-sm font-semibold text-text">No activity logs found</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border/60 bg-card-hover/50 text-[11px] font-mono text-text-muted uppercase">
                    <th className="p-4 pl-6">Admin</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 pr-6">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs font-sans">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-card-hover/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-2 font-bold text-text text-sm">
                          <User className="w-4 h-4 text-accent" /> {log.adminName}
                        </div>
                      </td>
                      <td className="p-4 text-text">{log.action}</td>
                      <td className="p-4 font-mono text-text-muted text-[11px]">
                        <div>{new Date(log.createdAt).toLocaleDateString("en-IN")}</div>
                        <div className="text-text-muted/60">{new Date(log.createdAt).toLocaleTimeString("en-IN")}</div>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border/80 text-text font-mono text-[10px]">
                          <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{log.details?.ip || "Unknown"}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted bg-card-hover/50 shrink-0">
            <span className="font-mono text-center sm:text-left">
              Page <span className="text-text font-bold">{pagination.page}</span> of {pagination.totalPages} ({pagination.total} records)
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl border border-border bg-card text-text disabled:opacity-50 font-mono text-xs font-bold hover:bg-card-hover transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl border border-border bg-card text-text disabled:opacity-50 font-mono text-xs font-bold hover:bg-card-hover transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Clear Activity Logs"
        message="Are you sure you want to clear all admin activity logs? This cannot be undone."
        onConfirm={confirmClearLogs}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={loading}
      />
    </div>
  );
}
