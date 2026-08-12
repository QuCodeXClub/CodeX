import React, { useState, useEffect, useCallback } from "react";
import {
  KeyRound,
  Plus,
  Search,
  Copy,
  Check,
  Trash2,
  Loader2,
  RefreshCw,
  Ticket,
  CheckCircle2,
  UserCheck,
  Tag,
  Sparkles,
  X,
  AlertCircle,
} from "lucide-react";
import { specialUtrService } from "../../services/specialUtrService";
import { useConfirm } from "../../context/ConfirmContext";

export default function SpecialUtrs() {
  const confirm = useConfirm();

  const [utrs, setUtrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stats, setStats] = useState({ total: 0, unusedCount: 0, usedCount: 0 });
  const [copiedCode, setCopiedCode] = useState(null);

  // Banner message state
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("AUTO"); // "AUTO" or "CUSTOM"
  const [customCode, setCustomCode] = useState("");
  const [count, setCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [genLoading, setGenLoading] = useState(false);

  const showAlert = (type, text) => {
    setAlertMessage({ type, text });
    setTimeout(() => {
      setAlertMessage({ type: "", text: "" });
    }, 4000);
  };

  const fetchSpecialUtrs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await specialUtrService.getSpecialUtrs({
        status: statusFilter,
        search,
      });
      setUtrs(res.data.utrs || []);
      setStats({
        total: res.data.total || 0,
        unusedCount: res.data.unusedCount || 0,
        usedCount: res.data.usedCount || 0,
      });
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to fetch Special UTRs");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSpecialUtrs();
    }, 300);
    return () => clearTimeout(handler);
  }, [fetchSpecialUtrs]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showAlert("success", `Copied UTR "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDelete = async (utr) => {
    if (utr.isUsed) {
      showAlert("error", "Cannot delete a UTR that has already been redeemed by a student.");
      return;
    }

    const isConfirmed = await confirm({
      title: "Delete Special UTR",
      message: `Are you sure you want to delete UTR "${utr.code}"? Students will no longer be able to use this code to register.`,
    });

    if (!isConfirmed) return;

    try {
      await specialUtrService.deleteSpecialUtr(utr._id);
      showAlert("success", `Special UTR "${utr.code}" deleted successfully.`);
      fetchSpecialUtrs();
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to delete Special UTR.");
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenLoading(true);
    try {
      const payload = {
        notes,
        ...(modalMode === "CUSTOM"
          ? { customCode }
          : { count: parseInt(count, 10) || 1 }),
      };

      const res = await specialUtrService.generateSpecialUtr(payload);
      showAlert("success", res.message || "Special UTR(s) generated successfully!");
      setIsModalOpen(false);
      setCustomCode("");
      setCount(1);
      setNotes("");
      fetchSpecialUtrs();
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to generate Special UTR.");
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 font-sans text-text max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-black uppercase tracking-tight text-text">
              Special <span className="text-accent">UTRs</span>
            </h1>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            Generate fixed UTR codes for offline/cash student registrations. Students can enter these codes during registration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSpecialUtrs()}
            className="p-2.5 rounded-xl border border-border/80 bg-card hover:bg-card-hover text-text-muted hover:text-text transition-all"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-accent" : ""}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-all shadow-md shadow-accent/20 cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" />
            Generate Fixed UTR
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertMessage.text && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium border ${
            alertMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-danger/10 text-danger border-danger/30"
          }`}
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card/85 backdrop-blur-xl p-5 rounded-2xl border border-border/80 shadow-md flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-xl text-accent border border-accent/20">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono font-semibold uppercase text-text-muted">Total Generated</p>
            <p className="text-2xl font-display font-black text-text">{stats.total}</p>
          </div>
        </div>

        <div className="bg-card/85 backdrop-blur-xl p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono font-semibold uppercase text-emerald-500">Available (Unused)</p>
            <p className="text-2xl font-display font-black text-emerald-400">{stats.unusedCount}</p>
          </div>
        </div>

        <div className="bg-card/85 backdrop-blur-xl p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5 shadow-md flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono font-semibold uppercase text-purple-400">Special Registrations (Used)</p>
            <p className="text-2xl font-display font-black text-purple-300">{stats.usedCount}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-card/85 backdrop-blur-xl p-4 rounded-2xl border border-border/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search code or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card-hover border border-border text-text text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent font-sans"
          />
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {["ALL", "UNUSED", "USED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                statusFilter === status
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "bg-card-hover text-text-muted hover:text-text border border-border/60"
              }`}
            >
              {status === "ALL" ? "All" : status === "UNUSED" ? "Available" : "Special Reg."}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl border border-border/80 shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-text-muted flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm font-medium">Loading Special UTRs...</p>
          </div>
        ) : utrs.length === 0 ? (
          <div className="p-12 text-center text-text-muted flex flex-col items-center gap-3">
            <Sparkles className="w-10 h-10 text-accent/40" />
            <p className="text-base font-semibold text-text">No Special UTRs Found</p>
            <p className="text-xs max-w-sm">
              Generate a new fixed UTR to hand out for special cash registrations.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-card-hover/50 text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-3.5 px-5">UTR Code</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Remarks / Notes</th>
                  <th className="py-3.5 px-5">Redeemed By Student</th>
                  <th className="py-3.5 px-5">Created On</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {utrs.map((utr) => (
                  <tr key={utr._id} className="hover:bg-card-hover/40 transition-colors">
                    {/* Code & Copy */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-accent bg-accent/10 px-3 py-1 rounded-lg border border-accent/20 tracking-wider">
                          {utr.code}
                        </span>
                        <button
                          onClick={() => handleCopy(utr.code)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-card-hover transition-colors"
                          title="Copy Code"
                        >
                          {copiedCode === utr.code ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      {utr.isUsed ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          REDEEMED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          AVAILABLE
                        </span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="py-4 px-5 text-text-muted max-w-xs truncate">
                      {utr.notes ? (
                        <span className="flex items-center gap-1 text-xs">
                          <Tag className="w-3.5 h-3.5 text-text-muted shrink-0" />
                          {utr.notes}
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted/40 italic">No notes</span>
                      )}
                    </td>

                    {/* Redeemed By */}
                    <td className="py-4 px-5">
                      {utr.usedBy ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-text text-sm">{utr.usedBy.name}</span>
                          <span className="text-xs text-accent font-mono">
                            Q-ID: {utr.usedBy.studentId} &bull; {utr.usedBy.course}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted/40 font-mono">Not redeemed yet</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-5 text-xs text-text-muted font-mono">
                      {new Date(utr.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      {!utr.isUsed && (
                        <button
                          onClick={() => handleDelete(utr)}
                          className="p-2 rounded-xl text-danger/80 hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all"
                          title="Delete UTR"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate UTR Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-accent" />
                <h3 className="font-display font-bold uppercase text-lg text-text">
                  Generate <span className="text-accent">Fixed UTR</span>
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-text-muted hover:text-text rounded-full hover:bg-card-hover"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text-muted mb-2">
                  Code Generation Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModalMode("AUTO")}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                      modalMode === "AUTO"
                        ? "bg-accent/15 border-accent text-accent"
                        : "bg-card-hover border-border text-text-muted"
                    }`}
                  >
                    Auto Random (SP-XXXX)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode("CUSTOM")}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                      modalMode === "CUSTOM"
                        ? "bg-accent/15 border-accent text-accent"
                        : "bg-card-hover border-border text-text-muted"
                    }`}
                  >
                    Custom Code
                  </button>
                </div>
              </div>

              {modalMode === "CUSTOM" ? (
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Custom UTR Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SPECIAL-CASH-001"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="w-full bg-card-hover border border-border text-text rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent uppercase tracking-wider"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Quantity to Generate (1 to 50)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="w-full bg-card-hover border border-border text-text rounded-xl p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  Remarks / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cash ₹50 collected by Rahul"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-card-hover border border-border text-text rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-text-muted text-sm font-medium hover:bg-card-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={genLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 border-0"
                >
                  {genLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate UTR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
