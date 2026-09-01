import React from "react";
import {
  X,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Ban,
  Mail,
  Award,
  Ticket,
  Megaphone,
  Loader2,
} from "lucide-react";

export default function JobDetailsModal({ job, onClose, onRetry }) {
  if (!job) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> PROCESSING
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> FAILED
          </span>
        );
      case "SUPPRESSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-semibold">
            <Ban className="w-3.5 h-3.5" /> SUPPRESSED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-semibold">
            <Clock className="w-3.5 h-3.5" /> PENDING
          </span>
        );
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "CERTIFICATE_BULK":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-medium">
            <Award className="w-3.5 h-3.5" /> Certificate Bulk
          </span>
        );
      case "BOARDING_PASS_BULK":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-medium">
            <Ticket className="w-3.5 h-3.5" /> Boarding Pass Bulk
          </span>
        );
      case "ANNOUNCEMENT_BULK":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-medium">
            <Megaphone className="w-3.5 h-3.5" /> Announcement Bulk
          </span>
        );
      case "EMAIL_SEND":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20 text-xs font-mono font-medium">
            <Mail className="w-3.5 h-3.5" /> Email Send
          </span>
        );
    }
  };

  const payload = job.payload || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-card/90 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-border/60 flex items-center justify-between bg-card-hover/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-text uppercase">
                Task Inspection
              </h2>
              <p className="text-xs text-text-muted font-mono">
                ID: {job._id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Status & Type Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border/80">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-text-muted uppercase block">Task Category</span>
              {getTypeBadge(job.type)}
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-mono text-text-muted uppercase block">Execution Status</span>
              {getStatusBadge(job.status)}
            </div>
          </div>

          {/* Last Error Banner if failed */}
          {job.lastError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 space-y-1.5">
              <div className="flex items-center gap-2 font-mono font-bold uppercase text-[11px]">
                <AlertTriangle className="w-4 h-4" />
                <span>Error Traceback</span>
              </div>
              <p className="font-mono text-xs break-all leading-relaxed bg-card/60 p-3 rounded-lg border border-rose-500/10">
                {job.lastError}
              </p>
            </div>
          )}

          {/* Execution Timestamps & Attempts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <span className="text-[10px] font-mono text-text-muted uppercase block">Attempts</span>
              <span className="font-mono font-bold text-text text-sm">{job.attempts} / {job.maxAttempts}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
              <span className="text-[10px] font-mono text-text-muted uppercase block">Scheduled At</span>
              <span className="font-mono text-text">{new Date(job.scheduledAt).toLocaleString()}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-text-muted uppercase block">Processed At</span>
              <span className="font-mono text-text">{job.processedAt ? new Date(job.processedAt).toLocaleString() : "Pending"}</span>
            </div>
          </div>

          {/* Payload Data Details */}
          <div className="space-y-2">
            <span className="block text-xs font-mono font-bold uppercase tracking-wider text-text">
              Payload Specifications
            </span>
            <div className="p-4 rounded-xl bg-card border border-border/80 font-mono text-xs space-y-2">
              {payload.email && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">Recipient Email:</span>
                  <span className="text-accent font-semibold">{payload.email}</span>
                </div>
              )}
              {payload.subject && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">Subject:</span>
                  <span className="text-text">{payload.subject}</span>
                </div>
              )}
              {payload.eventName && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">Event Name:</span>
                  <span className="text-text font-bold">{payload.eventName}</span>
                </div>
              )}
              {payload.student?.name && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">Student Name:</span>
                  <span className="text-text">{payload.student.name}</span>
                </div>
              )}
              {payload.student?.qid && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">Student QID:</span>
                  <span className="text-accent font-bold">{payload.student.qid}</span>
                </div>
              )}
              {payload.student?.deskNumber && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">Desk Number:</span>
                  <span className="text-text">{payload.student.deskNumber}</span>
                </div>
              )}
              {payload.emailList && (
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">Broadcast Recipients:</span>
                  <span className="text-text font-bold">{payload.emailList.length} Recipients</span>
                </div>
              )}

              <details className="mt-3 pt-2 text-[11px] text-text-muted cursor-pointer">
                <summary className="font-semibold text-accent hover:underline">View Raw JSON Payload</summary>
                <pre className="mt-2 p-3 rounded-lg bg-card-hover border border-border/60 overflow-x-auto text-[11px] text-text">
                  {JSON.stringify(payload, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-border/60 flex items-center justify-end gap-3 bg-card-hover/40">
          {(job.status === "FAILED" || job.status === "SUPPRESSED") && (
            <button
              onClick={() => {
                onRetry(job._id);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-[#111111] font-mono font-bold text-xs hover:opacity-90 transition-all shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry Job Now
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-mono font-bold text-text-muted hover:text-text transition-colors"
          >
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
}
