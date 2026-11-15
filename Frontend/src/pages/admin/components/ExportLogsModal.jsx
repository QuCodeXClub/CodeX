import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { adminService } from "../../../services/adminService";

export default function ExportLogsModal({
  isOpen,
  onClose,
  statusFilter,
  typeFilter,
  search,
  totalJobsCount = 0,
}) {
  const [scope, setScope] = useState(
    statusFilter || typeFilter || search ? "filtered" : "all"
  );
  const [format, setFormat] = useState("csv"); // 'csv' | 'json'
  const [partSize, setPartSize] = useState(500); // 250 | 500 | 1000

  const [isLoadingParts, setIsLoadingParts] = useState(false);
  const [partsInfo, setPartsInfo] = useState({
    totalRecords: totalJobsCount,
    totalParts: 1,
    parts: [],
  });
  const [downloadingPart, setDownloadingPart] = useState(null); // number | 'all'
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [downloadedParts, setDownloadedParts] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const hasActiveFilters = Boolean(statusFilter || typeFilter || search);

  // Fetch partitioned breakdown whenever scope, filters, or partSize change
  const fetchPartsBreakdown = async () => {
    setIsLoadingParts(true);
    setErrorMsg("");
    try {
      const params = {
        scope,
        limit: partSize,
      };
      if (scope === "filtered") {
        if (statusFilter) params.status = statusFilter;
        if (typeFilter) params.type = typeFilter;
        if (search) params.search = search;
      }

      const res = await adminService.getJobExportParts(params);
      const data = res?.data?.data || res?.data || res;
      if (data && typeof data.totalParts === "number") {
        setPartsInfo(data);
      }
    } catch (err) {
      console.error("Error fetching export parts:", err);
      setErrorMsg("Failed to calculate export partitions. Please try again.");
    } finally {
      setIsLoadingParts(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPartsBreakdown();
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, scope, partSize, statusFilter, typeFilter, search]);

  if (!isOpen) return null;

  // Trigger individual file download in browser
  const saveBlobAsFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  };

  // Export a single part
  const handleExportSinglePart = async (partNumber) => {
    setDownloadingPart(partNumber);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const params = {
        format,
        scope,
        part: partNumber,
        limit: partSize,
      };
      if (scope === "filtered") {
        if (statusFilter) params.status = statusFilter;
        if (typeFilter) params.type = typeFilter;
        if (search) params.search = search;
      }

      const res = await adminService.exportJobLogs(params);
      const rawData =
        res instanceof Blob
          ? res
          : res?.data instanceof Blob
          ? res.data
          : res?.data !== undefined
          ? res.data
          : res;

      const mimeType =
        format === "json"
          ? "application/json;charset=utf-8;"
          : "text/csv;charset=utf-8;";

      const blob = rawData instanceof Blob ? rawData : new Blob([rawData], { type: mimeType });

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const scopeLabel = scope === "filtered" ? "Filtered" : "All";
      const filename = `CodeX_Task_Logs_${scopeLabel}_Part_${partNumber}_of_${partsInfo.totalParts}_${timestamp}.${format}`;

      saveBlobAsFile(blob, filename);

      setDownloadedParts((prev) => ({ ...prev, [partNumber]: true }));
      setSuccessMsg(`Part ${partNumber} exported successfully (${format.toUpperCase()}).`);
    } catch (err) {
      console.error("Error exporting part:", err);
      setErrorMsg(`Failed to export Part ${partNumber}. Please try again.`);
    } finally {
      setDownloadingPart(null);
    }
  };

  // Export all parts sequentially
  const handleExportAllPartsSequentially = async () => {
    if (!partsInfo.parts || partsInfo.parts.length === 0) return;

    setDownloadingPart("all");
    setErrorMsg("");
    setSuccessMsg("");
    setDownloadProgress({ current: 0, total: partsInfo.parts.length });

    try {
      const total = partsInfo.parts.length;
      for (let i = 0; i < total; i++) {
        const partNumber = partsInfo.parts[i].part;
        setDownloadProgress({ current: i + 1, total });

        const params = {
          format,
          scope,
          part: partNumber,
          limit: partSize,
        };
        if (scope === "filtered") {
          if (statusFilter) params.status = statusFilter;
          if (typeFilter) params.type = typeFilter;
          if (search) params.search = search;
        }

        const res = await adminService.exportJobLogs(params);
        const rawData =
          res instanceof Blob
            ? res
            : res?.data instanceof Blob
            ? res.data
            : res?.data !== undefined
            ? res.data
            : res;

        const mimeType =
          format === "json"
            ? "application/json;charset=utf-8;"
            : "text/csv;charset=utf-8;";

        const blob = rawData instanceof Blob ? rawData : new Blob([rawData], { type: mimeType });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
        const scopeLabel = scope === "filtered" ? "Filtered" : "All";
        const filename = `CodeX_Task_Logs_${scopeLabel}_Part_${partNumber}_of_${total}_${timestamp}.${format}`;

        saveBlobAsFile(blob, filename);
        setDownloadedParts((prev) => ({ ...prev, [partNumber]: true }));

        // Small delay between downloads so the browser can dispatch file writes cleanly
        if (i < total - 1) {
          await new Promise((resolve) => setTimeout(resolve, 450));
        }
      }

      setSuccessMsg(
        `All ${total} parts exported successfully as individual ${format.toUpperCase()} files!`
      );
    } catch (err) {
      console.error("Error exporting all parts:", err);
      setErrorMsg("Export sequence interrupted. You can download remaining parts individually below.");
    } finally {
      setDownloadingPart(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between bg-card-hover/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent shadow-sm">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-mono font-bold text-text uppercase tracking-tight">
                  Export Task Queue Logs
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-fuchsia-500/15 text-fuchsia-400 font-mono font-bold border border-fuchsia-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Divided into partitioned files for 100% instant, reliable exports without timeouts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={downloadingPart !== null}
            className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-card border border-transparent hover:border-border transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Status Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Controls Bar: Scope, Format, Part Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Scope Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block font-bold">
                Export Scope
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-background border border-border">
                <button
                  type="button"
                  onClick={() => setScope("all")}
                  disabled={downloadingPart !== null}
                  className={`py-1.5 text-xs font-mono rounded-lg transition-all ${
                    scope === "all"
                      ? "bg-card text-accent font-bold shadow-sm border border-border/80"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  All Logs
                </button>
                <button
                  type="button"
                  onClick={() => setScope("filtered")}
                  disabled={!hasActiveFilters || downloadingPart !== null}
                  title={!hasActiveFilters ? "Apply search or filters on the table first" : ""}
                  className={`py-1.5 text-xs font-mono rounded-lg transition-all ${
                    scope === "filtered"
                      ? "bg-card text-accent font-bold shadow-sm border border-border/80"
                      : "text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
                  }`}
                >
                  Filtered
                </button>
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block font-bold">
                Format
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-background border border-border">
                <button
                  type="button"
                  onClick={() => setFormat("csv")}
                  disabled={downloadingPart !== null}
                  className={`py-1.5 text-xs font-mono rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    format === "csv"
                      ? "bg-card text-emerald-400 font-bold shadow-sm border border-border/80"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>CSV (Excel)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("json")}
                  disabled={downloadingPart !== null}
                  className={`py-1.5 text-xs font-mono rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    format === "json"
                      ? "bg-card text-cyan-400 font-bold shadow-sm border border-border/80"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>JSON (Raw)</span>
                </button>
              </div>
            </div>

            {/* Part Size Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-text-muted uppercase tracking-wider block font-bold">
                Records Per File
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-background border border-border">
                {[250, 500, 1000].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPartSize(size)}
                    disabled={downloadingPart !== null}
                    className={`py-1.5 text-xs font-mono rounded-lg transition-all ${
                      partSize === size
                        ? "bg-card text-text font-bold shadow-sm border border-border/80"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Partition Overview Banner */}
          <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Matching Records:</span>
                <span className="text-text font-bold text-sm">
                  {isLoadingParts ? (
                    <span className="inline-flex items-center gap-1 text-text-muted">
                      <Loader2 className="w-3 h-3 animate-spin" /> Counting...
                    </span>
                  ) : (
                    `${partsInfo.totalRecords.toLocaleString()} Logs (${partsInfo.totalParts} Part${
                      partsInfo.totalParts > 1 ? "s" : ""
                    })`
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchPartsBreakdown}
                disabled={isLoadingParts || downloadingPart !== null}
                className="p-2 rounded-lg bg-card-hover hover:bg-border/60 text-text-muted hover:text-text transition-colors border border-border"
                title="Recalculate parts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingParts ? "animate-spin" : ""}`} />
              </button>

              <button
                type="button"
                onClick={handleExportAllPartsSequentially}
                disabled={isLoadingParts || downloadingPart !== null || partsInfo.totalRecords === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-[#111111] font-mono font-bold text-xs hover:opacity-90 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadingPart === "all" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>
                      Exporting {downloadProgress.current}/{downloadProgress.total}...
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All {partsInfo.totalParts} Parts</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Partitioned Files List */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider block font-bold">
              Individual Partition Files (Instant 1-Click Export)
            </span>

            {isLoadingParts ? (
              <div className="p-8 text-center text-text-muted font-mono text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span>Dividing logs into parts...</span>
              </div>
            ) : partsInfo.parts?.length === 0 ? (
              <div className="p-6 text-center text-text-muted font-mono text-xs rounded-xl bg-background border border-border/80">
                No logs match the selected scope.
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {partsInfo.parts.map((p) => {
                  const isDone = Boolean(downloadedParts[p.part]);
                  const isCurrent = downloadingPart === p.part;

                  return (
                    <div
                      key={p.part}
                      className="p-3.5 rounded-xl bg-background border border-border/80 hover:border-border flex items-center justify-between gap-3 transition-colors font-mono text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isDone
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-card border border-border text-text-muted"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : p.part}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text truncate">
                              Part {p.part} of {partsInfo.totalParts}
                            </span>
                            <span className="text-[10px] px-2 py-0.2 rounded bg-card border border-border/80 text-text-muted shrink-0">
                              {p.count} records
                            </span>
                          </div>
                          <span className="text-[11px] text-text-muted">
                            Records #{p.from.toLocaleString()} – #{p.to.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleExportSinglePart(p.part)}
                        disabled={downloadingPart !== null}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50 ${
                          isDone
                            ? "bg-card border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                            : "bg-card border border-border hover:border-accent/40 text-text hover:text-accent"
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Exporting...</span>
                          </>
                        ) : isDone ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Re-download</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Export Part {p.part}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border/80 flex items-center justify-between bg-card-hover/40 font-mono text-xs">
          <span className="text-text-muted text-[11px]">
            Format: <strong className="text-text">{format.toUpperCase()}</strong> • Part Size:{" "}
            <strong className="text-text">{partSize} logs/file</strong>
          </span>

          <button
            onClick={onClose}
            disabled={downloadingPart !== null}
            className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-mono font-bold text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
