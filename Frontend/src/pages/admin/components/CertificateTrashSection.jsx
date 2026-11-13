import { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  RotateCcw,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  User,
  Mail,
  Award,
  ShieldAlert,
  RefreshCw,
  Layers,
} from "lucide-react";
import { certificateService } from "../../../services/certificateService";
import { useConfirm } from "../../../context/ConfirmContext";

export default function CertificateTrashSection({ isSuperAdmin }) {
  const confirm = useConfirm();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [feedback, setFeedback] = useState(null);

  // Auto-dismiss feedback after 4s
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const fetchTrash = useCallback(async () => {
    try {
      setLoading(true);
      const res = await certificateService.getTrashCertificates({
        page,
        limit: 15,
        search: search.trim(),
      });
      const payload = res?.data || res;
      if (payload) {
        setCertificates(payload.certificates || []);
        if (payload.pagination) {
          setPagination(payload.pagination);
        }
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to fetch trash certificates.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  // Handle Restore Single Certificate
  const handleRestore = async (cert) => {
    setActionLoadingId(cert._id);
    try {
      const res = await certificateService.restoreCertificate(cert._id);
      setFeedback({
        type: "success",
        text: res?.message || res?.data?.message || `Certificate #${cert.certificateId} restored successfully!`,
      });
      fetchTrash();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to restore certificate.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Permanently Hard Delete Single Certificate
  const handlePermanentDelete = async (cert) => {
    const isConfirmed = await confirm({
      title: "Permanently Delete Certificate",
      message: `Are you sure you want to permanently delete certificate #${cert.certificateId} for ${cert.studentName}? This will bypass the 7-day TTL and CANNOT be undone.`,
      confirmText: "Delete Permanently",
      cancelText: "Keep in Trash",
      type: "danger",
    });
    if (!isConfirmed) return;

    setActionLoadingId(cert._id);
    try {
      const res = await certificateService.permanentlyDeleteCertificate(cert._id);
      setFeedback({
        type: "success",
        text: res?.message || res?.data?.message || `Certificate #${cert.certificateId} permanently deleted.`,
      });
      fetchTrash();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to permanently delete certificate.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Restore All
  const handleRestoreAll = async () => {
    const isConfirmed = await confirm({
      title: "Restore All Certificates",
      message: `Are you sure you want to restore all ${pagination.total} soft-deleted certificates back to active status? They will immediately be publicly verifiable again.`,
      confirmText: "Restore All",
      cancelText: "Cancel",
      type: "success",
    });
    if (!isConfirmed) return;

    setBulkActionLoading(true);
    try {
      const res = await certificateService.restoreAllCertificates();
      setFeedback({
        type: "success",
        text: res?.message || res?.data?.message || "All certificates restored successfully!",
      });
      fetchTrash();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to restore all certificates.",
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Handle Empty Trash
  const handleEmptyTrash = async () => {
    const isConfirmed = await confirm({
      title: "Empty Certificate Trash",
      message: `Are you sure you want to permanently delete all ${pagination.total} certificates in trash? This will immediately purge them from MongoDB and cannot be undone.`,
      confirmText: "Empty Trash Now",
      cancelText: "Cancel",
      type: "danger",
    });
    if (!isConfirmed) return;

    setBulkActionLoading(true);
    try {
      const res = await certificateService.clearCertificateTrash();
      setFeedback({
        type: "success",
        text: res?.message || res?.data?.message || "Certificate trash cleared successfully.",
      });
      fetchTrash();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to empty trash.",
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 rounded-2xl border border-red-500/20 bg-red-500/10 text-center text-red-600 dark:text-red-400 font-mono text-sm">
        <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <p className="font-bold">Access Restricted</p>
        <p className="text-xs text-text-muted mt-1">
          Only Super Admins have permission to view and recover soft-deleted 7-day TTL certificates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informational Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
              7-Day TTL Recovery Vault (Super Admin Only)
            </h3>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              When certificates or batches are deleted or edited, they are safely preserved here for{" "}
              <strong className="text-text font-bold">7 days</strong>. MongoDB automatically hard-deletes
              them when their TTL expires. You can restore them anytime or purge immediately.
            </p>
          </div>
        </div>

        {/* Bulk Action Buttons */}
        {certificates.length > 0 && (
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRestoreAll}
              disabled={bulkActionLoading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {bulkActionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>Restore All</span>
            </button>

            <button
              type="button"
              onClick={handleEmptyTrash}
              disabled={bulkActionLoading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {bulkActionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Empty Trash</span>
            </button>
          </div>
        )}
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0 text-rose-500" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Search & Refresh Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by student, email, event, certificate ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs font-mono text-text placeholder:text-text-muted focus:outline-none focus:border-accent transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-text-muted">
          <span>
            Showing <strong className="text-text">{certificates.length}</strong> of{" "}
            <strong className="text-text">{pagination.total}</strong> in trash
          </span>
          <button
            type="button"
            onClick={fetchTrash}
            disabled={loading}
            className="p-2 rounded-lg bg-card hover:bg-card-hover border border-border text-text-muted hover:text-text transition-all cursor-pointer"
            title="Refresh Trash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="p-16 text-center text-text-muted font-mono text-xs flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <span>Loading soft-deleted certificates...</span>
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border/60">
          <Trash2 className="w-10 h-10 mx-auto text-text-muted/40 mb-3" />
          <h4 className="text-sm font-mono font-bold text-text uppercase">Trash is Empty</h4>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            No soft-deleted certificates found. Any future deleted or batch-edited certificates will appear here for 7 days before permanent MongoDB TTL removal.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-card-hover/40 font-mono text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Event & Position</th>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Deleted At & By</th>
                  <th className="py-3 px-4 text-center">TTL Time Left</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {certificates.map((cert) => {
                  const isActionLoading = actionLoadingId === cert._id;
                  const daysLeft = cert.daysRemaining ?? 7;
                  const hoursLeft = cert.hoursRemaining ?? 0;

                  return (
                    <tr
                      key={cert._id}
                      className="hover:bg-card-hover/50 transition-colors group"
                    >
                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="font-sans font-bold text-text flex items-center gap-1.5">
                          <span>{cert.studentName}</span>
                        </div>
                        <div className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-text-muted" />
                          <span>{cert.studentEmail}</span>
                        </div>
                      </td>

                      {/* Event */}
                      <td className="py-3.5 px-4">
                        <div className="text-text font-bold flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span>{cert.eventName}</span>
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">
                          Role: <span className="text-text font-semibold">{cert.position || "Participant"}</span>
                        </div>
                      </td>

                      {/* Certificate ID */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent font-mono text-[11px] font-bold">
                          #{cert.certificateId}
                        </span>
                      </td>

                      {/* Deleted Metadata */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <div className="text-text-muted">
                          {cert.deletedAt
                            ? new Date(cert.deletedAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5 truncate max-w-[180px]">
                          By: <span className="text-text font-medium">{cert.deletedByName || "Admin"}</span>
                          {cert.deleteReason && (
                            <span className="block italic text-[10px] text-rose-500/80 truncate">
                              "{cert.deleteReason}"
                            </span>
                          )}
                        </div>
                      </td>

                      {/* TTL Counter */}
                      <td className="py-3.5 px-4 text-center">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${
                            daysLeft <= 1
                              ? "bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse"
                              : daysLeft <= 3
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400"
                              : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>
                            {daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h` : `${hoursLeft}h remaining`}
                          </span>
                        </div>
                        <div className="text-[9px] text-text-muted mt-0.5">auto-purged by TTL</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => handleRestore(cert)}
                            disabled={isActionLoading}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
                            title="Restore to Active Certificates"
                          >
                            {isActionLoading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3 h-3" />
                            )}
                            <span className="hidden sm:inline">Restore</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePermanentDelete(cert)}
                            disabled={isActionLoading}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
                            title="Permanently Delete (Hard Delete Now)"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View (below lg screens) */}
          <div className="block lg:hidden divide-y divide-border/60 font-mono">
            {certificates.map((cert) => {
              const isActionLoading = actionLoadingId === cert._id;
              const daysLeft = cert.daysRemaining ?? 7;
              const hoursLeft = cert.hoursRemaining ?? 0;

              return (
                <div key={cert._id} className="p-4 space-y-3.5 hover:bg-card-hover/30 transition-colors">
                  {/* Top Bar: Certificate ID & TTL countdown badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
                      #{cert.certificateId}
                    </span>

                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        daysLeft <= 1
                          ? "bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse"
                          : daysLeft <= 3
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>
                        {daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h left` : `${hoursLeft}h left`}
                      </span>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div>
                    <div className="font-sans font-bold text-sm text-text flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{cert.studentName}</span>
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-1.5 mt-1 break-all">
                      <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span>{cert.studentEmail}</span>
                    </div>
                  </div>

                  {/* Event & Role Details */}
                  <div className="p-2.5 rounded-xl bg-card border border-border/70 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] text-text-muted uppercase block">Event</span>
                      <span className="font-bold text-text text-xs flex items-center gap-1.5 mt-0.5 truncate">
                        <Award className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="truncate">{cert.eventName}</span>
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[10px] text-text-muted uppercase block">Role</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold">
                        {cert.position || "Participant"}
                      </span>
                    </div>
                  </div>

                  {/* Deletion Metadata */}
                  <div className="text-[11px] text-text-muted flex flex-col gap-1 bg-card/50 p-2.5 rounded-xl border border-border/50">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px]">
                      <span>
                        Deleted by: <strong className="text-text font-semibold">{cert.deletedByName || "Admin"}</strong>
                      </span>
                      <span>
                        {cert.deletedAt
                          ? new Date(cert.deletedAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>
                    </div>
                    {cert.deleteReason && (
                      <div className="text-[10px] text-rose-500/90 italic truncate">
                        Reason: "{cert.deleteReason}"
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleRestore(cert)}
                      disabled={isActionLoading}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                      {isActionLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3.5 h-3.5" />
                      )}
                      <span>Restore Certificate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePermanentDelete(cert)}
                      disabled={isActionLoading}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                      title="Permanently Delete (Hard Delete Now)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline sm:inline">Purge</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-3.5 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-text-muted">
              <span>
                Page <strong className="text-text">{pagination.page}</strong> of{" "}
                <strong className="text-text">{pagination.totalPages}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3.5 py-1.5 rounded-lg bg-card-hover border border-border text-text disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3.5 py-1.5 rounded-lg bg-card-hover border border-border text-text disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
