import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Search,
  Award,
  ExternalLink,
  Loader2,
  Calendar,
  Mail,
  User,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  Layers,
  FileCheck,
} from "lucide-react";
import { certificateService } from "../../../services/certificateService";

export default function IssuedCertificatesModal({ onClose, isModal = false }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await certificateService.getAllCertificates({
        page,
        limit: 12,
        search: debouncedSearch,
      });
      const data = res.data?.data || res.data;
      setCertificates(data.certificates || []);
      setPagination(data.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      console.error("Failed to fetch issued certificates:", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const containerContent = (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      {/* Control & Stat Summary Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0">
        {/* Search Input */}
        <div className="lg:col-span-6 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by student name, email, event, or certificate ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border text-text rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-teal-500 transition-all shadow-sm"
          />
        </div>

        {/* Quick Stat Cards */}
        <div className="lg:col-span-6 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase">Total Certificates</div>
              <div className="font-mono font-bold text-text text-sm">{pagination.total}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase">Current Page</div>
              <div className="font-mono font-bold text-text text-sm">{pagination.page} / {pagination.totalPages || 1}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase">Audit Protocol</div>
              <div className="font-mono font-bold text-emerald-400 text-xs">100% Validated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area (Scrollable Data Grid) */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl border border-border/80 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading && certificates.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted gap-3 py-16">
              <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
              <span className="text-xs font-mono">Querying certificate database...</span>
            </div>
          ) : certificates.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted gap-3 py-16">
              <Sparkles className="w-12 h-12 text-teal-400/60" />
              <span className="text-sm font-semibold text-text">No certificates found</span>
              <span className="text-xs">No records match your search criteria.</span>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-card-hover/50 text-[11px] font-mono text-text-muted uppercase">
                      <th className="p-4 pl-6">Student Information</th>
                      <th className="p-4">Event Details & Role</th>
                      <th className="p-4">Certificate ID</th>
                      <th className="p-4">Issued Timestamp</th>
                      <th className="p-4 pr-6 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs font-sans">
                    {certificates.map((cert) => (
                      <tr key={cert._id} className="hover:bg-card-hover/40 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-text flex items-center gap-2">
                            <User className="w-4 h-4 text-teal-400 shrink-0" />
                            <span>{cert.studentName}</span>
                          </div>
                          <div className="text-[11px] text-text-muted font-mono flex items-center gap-1.5 mt-1">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span>{cert.studentEmail}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-text text-sm">{cert.eventName}</div>
                          <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[11px] font-mono font-medium">
                            {cert.position || "Participant"}
                          </div>
                        </td>

                        <td className="p-4 font-mono">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-accent font-bold text-xs">
                            <span>{cert.certificateId}</span>
                            <button
                              onClick={() => copyToClipboard(cert.certificateId, cert._id)}
                              className="text-text-muted hover:text-text transition-colors"
                              title="Copy Certificate ID"
                            >
                              {copiedId === cert._id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-text-muted text-[11px]">
                          <div>{new Date(cert.createdAt).toLocaleDateString()}</div>
                          <div className="text-text-muted/60">{new Date(cert.createdAt).toLocaleTimeString()}</div>
                        </td>

                        <td className="p-4 pr-6 text-right">
                          <a
                            href={`/verify-certificate/${cert.certificateId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-all font-mono font-bold text-xs shadow-sm"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verify Portal</span>
                            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-4">
                {certificates.map((cert) => (
                  <div key={cert._id} className="p-4 rounded-xl bg-card-hover/40 border border-border/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-text text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-teal-400" />
                        <span>{cert.studentName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-mono">
                        {cert.position || "Participant"}
                      </span>
                    </div>

                    <div className="text-xs text-text-muted font-mono break-all flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span>{cert.studentEmail}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-card border border-border/80 space-y-1">
                      <div className="text-[10px] font-mono text-text-muted uppercase">Event & ID</div>
                      <div className="font-semibold text-text">{cert.eventName}</div>
                      <div className="text-xs font-mono font-bold text-accent">{cert.certificateId}</div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] font-mono">
                      <span className="text-text-muted">{new Date(cert.createdAt).toLocaleDateString()}</span>
                      <a
                        href={`/verify-certificate/${cert.certificateId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Verify
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs text-text-muted bg-card-hover/50 shrink-0">
            <span className="font-mono">
              Page <span className="text-text font-bold">{pagination.page}</span> of {pagination.totalPages} ({pagination.total} records)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-border bg-card text-text disabled:opacity-50 font-mono text-xs font-bold hover:bg-card-hover transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl border border-border bg-card text-text disabled:opacity-50 font-mono text-xs font-bold hover:bg-card-hover transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
        <div className="bg-card/95 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border/60">
            <h2 className="text-lg font-bold text-text uppercase flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400" />
              Issued Certificates Archive
            </h2>
            <button onClick={onClose} className="p-2 rounded-xl text-text-muted hover:text-text">
              <X className="w-5 h-5" />
            </button>
          </div>
          {containerContent}
        </div>
      </div>
    );
  }

  return containerContent;
}
