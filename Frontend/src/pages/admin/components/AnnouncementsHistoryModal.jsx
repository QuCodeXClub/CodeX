import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Megaphone,
  Loader2,
  Users,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  Sparkles,
  MailCheck,
} from "lucide-react";
import { adminService } from "../../../services/adminService";

export default function AnnouncementsHistoryModal({ onClose, isModal = false }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getAnnouncementsHistory({ page, limit: 12 });
      const data = res.data?.data || res.data;
      setAnnouncements(data.announcements || []);
      setPagination(data.pagination || { totalPages: 1, total: 0 });
    } catch (err) {
      console.error("Failed to fetch announcements history:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const containerContent = (
    <div className="w-full flex flex-col space-y-6 animate-fadeIn">
      {/* Control & Stat Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <MailCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-text-muted uppercase">Total Broadcasts</div>
            <div className="font-mono font-bold text-text text-sm">{pagination.total} Sent</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-text-muted uppercase">History Page</div>
            <div className="font-mono font-bold text-text text-sm">{pagination.page} / {pagination.totalPages || 1}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-text-muted uppercase">Delivery Protocol</div>
            <div className="font-mono font-bold text-emerald-400 text-xs">Rate Limited (12/s)</div>
          </div>
        </div>
      </div>

      {/* Main Content Area (Scrollable Data Grid) */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl border border-border/80 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading && announcements.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted gap-3 py-16">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
              <span className="text-xs font-mono">Querying announcement broadcast archive...</span>
            </div>
          ) : announcements.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted gap-3 py-16">
              <Sparkles className="w-12 h-12 text-indigo-400/60" />
              <span className="text-sm font-semibold text-text">No past announcements found</span>
              <span className="text-xs">Dispatched broadcasts will appear here automatically.</span>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 bg-card-hover/50 text-[11px] font-mono text-text-muted uppercase">
                      <th className="p-4 pl-6">Announcement Subject</th>
                      <th className="p-4">Recipients Count</th>
                      <th className="p-4">Delivery Status</th>
                      <th className="p-4">Dispatched Timestamp</th>
                      <th className="p-4 pr-6 text-right">Message Content</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs font-sans">
                    {announcements.map((item) => {
                      const payload = item.payload || {};
                      const recipientCount = payload.emailList?.length || 0;

                      return (
                        <tr key={item._id} className="hover:bg-card-hover/40 transition-colors">
                          <td className="p-4 pl-6 max-w-sm">
                            <div className="font-bold text-text text-sm truncate" title={payload.subject}>
                              {payload.subject || "Club Announcement"}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border/80 text-text font-mono text-xs">
                              <Users className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{recipientCount} Recipients</span>
                            </div>
                          </td>

                          <td className="p-4">
                            {item.status === "COMPLETED" ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                              </span>
                            ) : item.status === "PROCESSING" ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-xs font-semibold">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Dispatching...
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-xs font-semibold">
                                <Clock className="w-3.5 h-3.5" /> Queued
                              </span>
                            )}
                          </td>

                          <td className="p-4 font-mono text-text-muted text-[11px]">
                            <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                            <div className="text-text-muted/60">{new Date(item.createdAt).toLocaleTimeString()}</div>
                          </td>

                          <td className="p-4 pr-6 text-right">
                            <button
                              onClick={() => setSelectedAnnouncement(item)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all font-mono font-bold text-xs shadow-sm cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View HTML Preview
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-4">
                {announcements.map((item) => {
                  const payload = item.payload || {};
                  const recipientCount = payload.emailList?.length || 0;

                  return (
                    <div key={item._id} className="p-4 rounded-xl bg-card-hover/40 border border-border/60 space-y-3">
                      <div className="font-bold text-text text-sm">{payload.subject || "Club Announcement"}</div>
                      <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                        <span className="flex items-center gap-1 text-indigo-400 font-bold">
                          <Users className="w-3.5 h-3.5" /> {recipientCount} Recipients
                        </span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border/40">
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">● {item.status}</span>
                        <button
                          onClick={() => setSelectedAnnouncement(item)}
                          className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold"
                        >
                          View Message
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs text-text-muted bg-card-hover/50 shrink-0">
            <span className="font-mono">
              Page <span className="text-text font-bold">{pagination.page}</span> of {pagination.totalPages} ({pagination.total} broadcasts)
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

      {/* Message Preview Sub-Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-card border border-indigo-500/30 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-text text-sm">
                  {selectedAnnouncement.payload?.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-card-hover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto text-xs text-text p-4 rounded-xl bg-card-hover border border-border/60 font-sans"
              dangerouslySetInnerHTML={{
                __html: selectedAnnouncement.payload?.messageHtml || selectedAnnouncement.payload?.messageText || "No message content",
              }}
            />

            <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs font-mono text-text-muted">
              <span>{selectedAnnouncement.payload?.emailList?.length || 0} Total Recipients</span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-mono font-bold text-text hover:bg-card-hover"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn">
        <div className="bg-card/95 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border/60">
            <h2 className="text-lg font-bold text-text uppercase flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-400" />
              Announcements Broadcast Archive
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
