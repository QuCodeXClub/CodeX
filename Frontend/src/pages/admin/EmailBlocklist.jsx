import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Trash2,
  AlertTriangle,
  Mail,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Ban,
  ShieldCheck,
} from "lucide-react";
import { adminService } from "../../services/adminService";

export default function EmailBlocklist() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    bounceCount: 0,
    complaintCount: 0,
    manualCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [message, setMessage] = useState({ type: "", text: "" });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newType, setNewType] = useState("MANUAL");
  const [newReason, setNewReason] = useState("");

  const fetchBlocklistData = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        adminService.getBlocklist({ page, limit: 10, search, type: typeFilter }),
        adminService.getBlocklistStats(),
      ]);

      if (listRes?.success) {
        setItems(listRes.data?.items || []);
        setPagination(listRes.data?.pagination || { totalPages: 1, total: 0 });
      }

      if (statsRes?.success) {
        setStats(statsRes.data || { total: 0, bounceCount: 0, complaintCount: 0, manualCount: 0 });
      }
    } catch (err) {
      console.error("Failed to load blocklist data:", err);
      setMessage({
        type: "error",
        text: err.message || err.response?.data?.message || "Failed to fetch email blocklist.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter]);

  useEffect(() => {
    fetchBlocklistData();
  }, [fetchBlocklistData]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newEmail) return;

    setActionLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await adminService.addBlockedEmail({
        email: newEmail,
        type: newType,
        reason: newReason || "Manually added by administrator",
      });

      if (res?.success) {
        setMessage({ type: "success", text: "Email address added to blocklist successfully!" });
        setIsModalOpen(false);
        setNewEmail("");
        setNewReason("");
        setNewType("MANUAL");
        fetchBlocklistData();
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || err.response?.data?.message || "Failed to add email to blocklist.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblock = async (id, email) => {
    if (!window.confirm(`Are you sure you want to unblock ${email}?`)) return;

    setActionLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await adminService.removeBlockedEmail(id);
      if (res?.success) {
        setMessage({ type: "success", text: `Successfully unblocked ${email}` });
        fetchBlocklistData();
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || err.response?.data?.message || "Failed to unblock email address.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "BOUNCE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-semibold">
            <AlertTriangle className="w-3 h-3" /> BOUNCE
          </span>
        );
      case "COMPLAINT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-semibold">
            <ShieldAlert className="w-3 h-3" /> COMPLAINT
          </span>
        );
      case "MANUAL":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-mono font-semibold">
            <Ban className="w-3 h-3" /> MANUAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-6 border border-border/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>EMAIL REPUTATION PROTECTION</span>
          </div>
          <h2 className="text-xl font-bold text-text">Email Suppression & Blocklist</h2>
          <p className="text-xs text-text-muted mt-1">
            Automatic and manual suppression list to prevent high bounce rates and protect sender reputation.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-medium text-xs tracking-wider uppercase shadow-md hover:bg-accent/90 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Block Email
        </button>
      </div>

      {/* Alert Message */}
      {message.text && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: "", text: "" })} className="opacity-70 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card/85 backdrop-blur-xl p-5 rounded-2xl border border-border/80 shadow-sm flex flex-col">
          <span className="text-xs font-mono text-text-muted uppercase">TOTAL SUPPRESSED</span>
          <span className="text-2xl font-black text-text mt-2">{stats.total}</span>
        </div>

        <div className="bg-card/85 backdrop-blur-xl p-5 rounded-2xl border border-border/80 shadow-sm flex flex-col">
          <span className="text-xs font-mono text-amber-400/90 uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> HARD BOUNCES
          </span>
          <span className="text-2xl font-black text-amber-400 mt-2">{stats.bounceCount}</span>
        </div>

        <div className="bg-card/85 backdrop-blur-xl p-5 rounded-2xl border border-border/80 shadow-sm flex flex-col">
          <span className="text-xs font-mono text-purple-400/90 uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> COMPLAINTS
          </span>
          <span className="text-2xl font-black text-purple-400 mt-2">{stats.complaintCount}</span>
        </div>

        <div className="bg-card/85 backdrop-blur-xl p-5 rounded-2xl border border-border/80 shadow-sm flex flex-col">
          <span className="text-xs font-mono text-accent/90 uppercase flex items-center gap-1.5">
            <Ban className="w-3.5 h-3.5" /> MANUAL BLOCKS
          </span>
          <span className="text-2xl font-black text-accent mt-2">{stats.manualCount}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card/85 backdrop-blur-xl p-4 rounded-2xl border border-border/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search email address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs bg-card border border-border rounded-xl focus:outline-none focus:border-accent text-text"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-text-muted hidden sm:block" />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-card border border-border rounded-xl focus:outline-none focus:border-accent text-text"
          >
            <option value="">All Types</option>
            <option value="BOUNCE">Hard Bounces</option>
            <option value="COMPLAINT">Spam Complaints</option>
            <option value="MANUAL">Manual Blocks</option>
          </select>

          <button
            onClick={fetchBlocklistData}
            title="Refresh List"
            className="p-2 rounded-xl bg-card border border-border text-text-muted hover:text-text hover:bg-card-hover transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Blocklist Table */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl border border-border/80 shadow-lg overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="p-12 text-center text-text-muted flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-xs font-mono">Loading suppression list...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-text-muted flex flex-col items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-emerald-400/80" />
            <span className="text-sm font-semibold text-text">No suppressed emails found</span>
            <span className="text-xs">Your email domain reputation is healthy with no blocked entries matching criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-card-hover/50 text-[11px] font-mono text-text-muted uppercase">
                  <th className="p-4 pl-6">Recipient Email</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Reason / Diagnostic</th>
                  <th className="p-4">Date Added</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-card-hover/30 transition-colors">
                    <td className="p-4 pl-6 font-mono font-medium text-text flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-text-muted" />
                      {item.email}
                    </td>
                    <td className="p-4 whitespace-nowrap">{getTypeBadge(item.type)}</td>
                    <td className="p-4 text-text-muted max-w-xs truncate" title={item.reason}>
                      {item.reason || "No details available"}
                    </td>
                    <td className="p-4 text-text-muted whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleUnblock(item._id, item.email)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" /> Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-text disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-text disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Blocklist Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2 text-text font-semibold">
                <Ban className="w-5 h-5 text-accent" />
                <span>Add Email to Blocklist</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@domain.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-card-hover border border-border rounded-xl focus:outline-none focus:border-accent text-text"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-card-hover border border-border rounded-xl focus:outline-none focus:border-accent text-text"
                >
                  <option value="MANUAL">MANUAL (Admin Block)</option>
                  <option value="BOUNCE">BOUNCE (Invalid Address)</option>
                  <option value="COMPLAINT">COMPLAINT (Spam Report)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Reason / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Optional reason for suppressing this email..."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-card-hover border border-border rounded-xl focus:outline-none focus:border-accent text-text resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text bg-card-hover rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-accent hover:bg-accent/90 rounded-xl shadow-md disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Suppress Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
