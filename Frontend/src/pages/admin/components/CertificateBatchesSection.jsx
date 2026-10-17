import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  RefreshCw,
  Loader2,
  AlertTriangle,
  User,
  Calendar,
  Mail,
  ShieldCheck,
  ChevronRight,
  Filter,
  Edit3,
  Plus,
  Trash2,
  Lock,
  Upload,
  Download,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { certificateService } from "../../../services/certificateService";
import { useConfirm } from "../../../context/ConfirmContext";
import { parseCertificateCsv, downloadCertificateCsvTemplate } from "../../../utils/csvParser";

export default function CertificateBatchesSection({ isSuperAdmin, onSwitchToCreate }) {
  const confirm = useConfirm();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectModalBatch, setRejectModalBatch] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // Batch Editing State
  const [editingBatch, setEditingBatch] = useState(null);
  const [editForm, setEditForm] = useState({
    eventName: "",
    eventDate: "",
    coordinatorName: "",
    signatureImageUrl: "",
    signatureFile: null,
    students: [],
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editFilePreview, setEditFilePreview] = useState(null);
  const editCsvInputRef = useRef(null);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const response = await certificateService.getCertificateBatches({
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      if (response.data) {
        setBatches(response.data.batches || []);
      }
    } catch (err) {
      console.error("Failed to load certificate batches:", err);
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to load certificate batches.",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  // View full details of a batch (including full students list)
  const handleViewDetails = async (batchSummary) => {
    try {
      const response = await certificateService.getCertificateBatchById(batchSummary._id);
      setSelectedBatch(response.data || batchSummary);
      setStudentSearch("");
    } catch {
      setSelectedBatch(batchSummary);
    }
  };

  // Approve Batch (Super Admin only)
  const handleApprove = async (batch) => {
    const isConfirmed = await confirm({
      title: "Approve Certificate Batch",
      message: `Authorize and immediately trigger cryptographic generation for "${batch.eventName}" (${batch.studentCount} certificates)? Emails will be dispatched to students automatically.`,
    });

    if (!isConfirmed) return;

    setActionLoadingId(batch._id);
    try {
      const response = await certificateService.approveCertificateBatch(batch._id);
      setFeedback({
        type: "success",
        text: response.message || `Batch #${batch.batchId} approved successfully! Queue processing started.`,
      });
      if (selectedBatch && selectedBatch._id === batch._id) {
        setSelectedBatch(null);
      }
      fetchBatches();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to approve certificate batch.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Submit Rejection (Super Admin only)
  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalBatch) return;

    setActionLoadingId(rejectModalBatch._id);
    try {
      const response = await certificateService.rejectCertificateBatch(
        rejectModalBatch._id,
        rejectReason
      );
      setFeedback({
        type: "success",
        text: response.message || `Batch #${rejectModalBatch.batchId} rejected.`,
      });
      setRejectModalBatch(null);
      setRejectReason("");
      if (selectedBatch && selectedBatch._id === rejectModalBatch._id) {
        setSelectedBatch(null);
      }
      fetchBatches();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to reject certificate batch.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Edit Modal for a batch (fetch full batch to get student list if not present)
  const handleStartEdit = async (batchSummary) => {
    if (batchSummary.status !== "PENDING_APPROVAL" && !isSuperAdmin) {
      setFeedback({
        type: "error",
        text: `Batch #${batchSummary.batchId} is ${batchSummary.status} and cannot be modified. Only PENDING_APPROVAL batches can be edited by standard Admins.`,
      });
      return;
    }

    try {
      setActionLoadingId(batchSummary._id);
      const res = await certificateService.getCertificateBatchById(batchSummary._id);
      const fullBatch = res.data || batchSummary;
      setEditingBatch(fullBatch);
      setEditForm({
        eventName: fullBatch.eventName || "",
        eventDate: fullBatch.eventDate ? fullBatch.eventDate.split("T")[0] : "",
        coordinatorName: fullBatch.coordinatorName || "",
        signatureImageUrl: fullBatch.signatureImage || "",
        signatureFile: null,
        students: (fullBatch.students || []).map((s) => ({
          name: s.name || "",
          email: s.email || "",
          position: s.position || "Participant",
        })),
      });
      setEditFilePreview(fullBatch.signatureImage || null);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to load batch details for editing.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddEditStudent = () => {
    setEditForm((prev) => ({
      ...prev,
      students: [...prev.students, { name: "", email: "", position: "Participant" }],
    }));
  };

  const handleRemoveEditStudent = (index) => {
    if (editForm.students.length <= 1) {
      setFeedback({ type: "error", text: "A batch must have at least one student." });
      return;
    }
    setEditForm((prev) => ({
      ...prev,
      students: prev.students.filter((_, idx) => idx !== index),
    }));
  };

  const handleEditStudentChange = (index, field, value) => {
    setEditForm((prev) => {
      const updated = [...prev.students];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, students: updated };
    });
  };

  const handleEditCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const { success, students, skippedCount, error } = parseCertificateCsv(text);

        if (!success) {
          setFeedback({ type: "error", text: error || "Could not parse valid student records from CSV." });
          return;
        }

        setEditForm((prev) => ({
          ...prev,
          students: [...prev.students, ...students],
        }));

        let msg = `Successfully imported ${students.length} student(s) from CSV.`;
        if (skippedCount > 0) {
          msg += ` (${skippedCount} blank or invalid row(s) were skipped).`;
        }
        setFeedback({ type: "success", text: msg });
      } catch (err) {
        setFeedback({ type: "error", text: "Failed to parse CSV file." });
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingBatch) return;

    if (!editForm.eventName.trim()) {
      setFeedback({ type: "error", text: "Event name is required." });
      return;
    }
    if (!editForm.eventDate) {
      setFeedback({ type: "error", text: "Event date is required." });
      return;
    }
    if (!editForm.coordinatorName.trim()) {
      setFeedback({ type: "error", text: "Coordinator name is required." });
      return;
    }

    const validStudents = editForm.students.filter(
      (s) => s.name?.trim() && s.email?.trim()
    );

    if (validStudents.length === 0) {
      setFeedback({ type: "error", text: "At least one valid student record is required." });
      return;
    }

    setEditLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("eventName", editForm.eventName.trim());
      submitData.append("eventDate", editForm.eventDate);
      submitData.append("coordinatorName", editForm.coordinatorName.trim());
      submitData.append("studentsStr", JSON.stringify(validStudents));

      if (editForm.signatureFile) {
        submitData.append("signatureImage", editForm.signatureFile);
      } else if (editForm.signatureImageUrl) {
        submitData.append("signatureImageUrl", editForm.signatureImageUrl);
      }

      const res = await certificateService.updateCertificateBatch(editingBatch._id, submitData);
      setFeedback({
        type: "success",
        text: res.message || `Batch #${editingBatch.batchId} updated successfully.`,
      });

      if (selectedBatch && selectedBatch._id === editingBatch._id) {
        setSelectedBatch(res.data || null);
      }
      setEditingBatch(null);
      fetchBatches();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to update batch.",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Export Batch to CSV
  const handleExportCsv = async (batch) => {
    try {
      setActionLoadingId(batch._id);
      const res = await certificateService.exportBatchCertificates(batch._id);
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const sanitizedName = (batch.eventName || "batch").replace(/[^a-zA-Z0-9_-]/g, "_");
      link.setAttribute("download", `Certificates_${sanitizedName}_${batch.batchId || batch._id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setFeedback({
        type: "success",
        text: `Exported certificates for "${batch.eventName}" successfully!`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to export certificates CSV.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (b.batchId && b.batchId.toLowerCase().includes(q)) ||
        (b.eventName && b.eventName.toLowerCase().includes(q)) ||
        (b.coordinatorName && b.coordinatorName.toLowerCase().includes(q)) ||
        (b.submittedByName && b.submittedByName.toLowerCase().includes(q)) ||
        (b.submittedByEmail && b.submittedByEmail.toLowerCase().includes(q))
      );
    });
  }, [batches, statusFilter, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const total = batches.length;
    const pending = batches.filter((b) => b.status === "PENDING_APPROVAL").length;
    const processing = batches.filter((b) => b.status === "PROCESSING" || b.status === "APPROVED").length;
    const completed = batches.filter((b) => b.status === "COMPLETED").length;
    const rejected = batches.filter((b) => b.status === "REJECTED").length;
    return { total, pending, processing, completed, rejected };
  }, [batches]);

  const renderStatusBadge = (status, batch) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-ping" />
            Pending Review
          </span>
        );
      case "APPROVED":
      case "PROCESSING": {
        const total = batch?.studentCount || 1;
        const gen = batch?.generatedCount || 0;
        const pct = Math.min(100, Math.round((gen / total) * 100));
        return (
          <div className="space-y-1 min-w-[120px]">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Generating
              </span>
              <span className="text-text-muted font-bold">{gen}/{total}</span>
            </div>
            <div className="w-full h-1.5 bg-card border border-border/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(6, pct)}%` }}
              />
            </div>
          </div>
        );
      }
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-card border border-border text-text-muted">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {feedback.text && (
        <div
          className={`flex items-center justify-between gap-3 p-4 rounded-xl text-xs font-mono font-bold border transition-all ${
            feedback.type === "success"
              ? "bg-accent/15 text-accent border-accent/40"
              : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/40"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: "", text: "" })}
            className="text-text-muted hover:text-text cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono font-bold text-text-muted uppercase">Total Requests</div>
            <div className="text-xl sm:text-2xl font-display font-black text-text mt-0.5">{metrics.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">Pending Review</div>
            <div className="text-xl sm:text-2xl font-display font-black text-amber-700 dark:text-amber-400 mt-0.5">{metrics.pending}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">Generating</div>
            <div className="text-xl sm:text-2xl font-display font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{metrics.processing}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono font-bold text-accent uppercase">Completed</div>
            <div className="text-xl sm:text-2xl font-display font-black text-accent mt-0.5">{metrics.completed}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase">Rejected</div>
            <div className="text-xl sm:text-2xl font-display font-black text-rose-700 dark:text-rose-400 mt-0.5">{metrics.rejected}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 dark:bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-700 dark:text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl border border-border/80 shadow-xl overflow-hidden flex flex-col">
        {/* Controls Bar */}
        <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card-hover/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event, batch ID, admin name..."
              className="w-full bg-card border border-border/80 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-text-muted/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-text-muted shrink-0" />
            {["ALL", "PENDING_APPROVAL", "PROCESSING", "COMPLETED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? "bg-accent text-[#111111] shadow-sm shadow-accent/20"
                    : "bg-card hover:bg-card-hover border border-border/80 text-text-muted hover:text-text"
                }`}
              >
                {st === "ALL"
                  ? "All Batches"
                  : st === "PENDING_APPROVAL"
                    ? "Pending Review"
                    : st === "PROCESSING"
                      ? "Generating"
                      : st === "COMPLETED"
                        ? "Completed"
                        : "Rejected"}
              </button>
            ))}

            <button
              onClick={fetchBatches}
              className="p-2 rounded-xl bg-card border border-border/80 text-text-muted hover:text-accent hover:bg-card-hover transition-all cursor-pointer ml-1"
              title="Refresh Batches"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Batches Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                Loading certificate batches...
              </span>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Award className="w-12 h-12 text-text-muted/40 mx-auto" />
              <div className="text-sm font-display font-bold text-text">No certificate batches found</div>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                {statusFilter === "PENDING_APPROVAL"
                  ? "No batches currently awaiting Super Admin review."
                  : "No certificate generation batches have been submitted yet."}
              </p>
              {onSwitchToCreate && (
                <button
                  onClick={onSwitchToCreate}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/15 text-accent border border-accent/30 text-xs font-mono font-bold hover:bg-accent/25 transition-all cursor-pointer"
                >
                  Create New Batch Request
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-card/60 text-[11px] font-mono uppercase text-text-muted tracking-wider">
                  <th className="p-4 pl-6 font-bold">Batch ID / Event</th>
                  <th className="p-4 font-bold">Submitted By</th>
                  <th className="p-4 font-bold">Students</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 pr-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {filteredBatches.map((batch) => {
                  const isPending = batch.status === "PENDING_APPROVAL";
                  const isActionLoading = actionLoadingId === batch._id;

                  return (
                    <tr
                      key={batch._id}
                      className="hover:bg-card-hover/40 transition-colors group"
                    >
                      {/* Batch ID & Event */}
                      <td className="p-4 pl-6">
                        <div className="font-mono text-xs font-bold text-accent">
                          #{batch.batchId}
                        </div>
                        <div className="font-display font-bold text-sm text-text mt-0.5">
                          {batch.eventName}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono mt-1">
                          <Calendar className="w-3 h-3 text-text-muted shrink-0" />
                          <span>
                            {batch.eventDate
                              ? new Date(batch.eventDate).toLocaleDateString("en-IN")
                              : "—"}
                          </span>
                          <span>•</span>
                          <span>Coord: {batch.coordinatorName}</span>
                        </div>
                      </td>

                      {/* Submitted By */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-bold text-text">
                          <User className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span>{batch.submittedByName || "Admin"}</span>
                        </div>
                        {batch.submittedByEmail && (
                          <div className="text-[11px] text-text-muted font-mono mt-0.5">
                            {batch.submittedByEmail}
                          </div>
                        )}
                        <div className="text-[10px] text-text-muted/60 font-mono mt-1">
                          {new Date(batch.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          on {new Date(batch.createdAt).toLocaleDateString("en-IN")}
                        </div>
                      </td>

                      {/* Students Count */}
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border/80 font-mono text-xs">
                          <Award className="w-3.5 h-3.5 text-accent" />
                          <span className="font-bold text-text">{batch.studentCount || 0}</span>
                          <span className="text-[10px] text-text-muted">records</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {renderStatusBadge(batch.status, batch)}
                        {batch.rejectionReason && (
                          <div className="text-[10px] font-mono text-rose-700 dark:text-rose-400/80 mt-1 max-w-xs truncate">
                            Reason: {batch.rejectionReason}
                          </div>
                        )}
                        {batch.approvedByName && (
                          <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400/80 mt-1">
                            Approved by: {batch.approvedByName}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(batch)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-text-muted hover:text-text hover:bg-card-hover text-xs font-mono transition-all cursor-pointer"
                            title="Inspect Batch Details & Student Roster"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          {/* Export CSV button */}
                          {(batch.status === "COMPLETED" || batch.status === "PROCESSING" || (batch.generatedCount && batch.generatedCount > 0)) && (
                            <button
                              onClick={() => handleExportCsv(batch)}
                              disabled={isActionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-text-muted hover:text-accent hover:bg-card-hover text-xs font-mono transition-all cursor-pointer"
                              title="Export issued certificates to CSV"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>CSV</span>
                            </button>
                          )}

                          {/* Edit button: allowed when PENDING_APPROVAL, or for Super Admin on any non-processing batch */}
                          {(isPending || (isSuperAdmin && batch.status !== "PROCESSING")) ? (
                            <button
                              onClick={() => handleStartEdit(batch)}
                              disabled={isActionLoading}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                              title="Edit batch event details or student roster (resets previous certificates)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-text-muted/40 px-2 py-1 rounded bg-card/40 border border-border/30 cursor-not-allowed select-none"
                              title={`Batch #${batch.batchId} is ${batch.status} and cannot be edited.`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>Locked</span>
                            </span>
                          )}

                          {/* Super Admin Approval & Revocation Controls */}
                          {isSuperAdmin && (
                            <>
                              {isPending && (
                                <button
                                  onClick={() => handleApprove(batch)}
                                  disabled={isActionLoading}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                                  title="Authorize and start background generation"
                                >
                                  {isActionLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  )}
                                  <span>Approve</span>
                                </button>
                              )}

                              {batch.status !== "REJECTED" && (
                                <button
                                  onClick={() => {
                                    setRejectModalBatch(batch);
                                    setRejectReason("");
                                  }}
                                  disabled={isActionLoading}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer"
                                  title="Reject batch and delete all generated certificates"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>{batch.status === "COMPLETED" ? "Revoke & Delete" : "Reject"}</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

              {/* Mobile Cards View */}
              <div className="block md:hidden divide-y divide-border/40">
                {filteredBatches.map((batch) => {
                  const isPending = batch.status === "PENDING_APPROVAL";
                  const isActionLoading = actionLoadingId === batch._id;

                  return (
                    <div key={batch._id} className="p-4 space-y-3">
                      {/* Top: Batch ID, Event, Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-accent">
                            #{batch.batchId}
                          </span>
                          <h4 className="font-display font-bold text-sm text-text mt-0.5">
                            {batch.eventName}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono mt-1">
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span>
                              {batch.eventDate
                                ? new Date(batch.eventDate).toLocaleDateString("en-IN")
                                : "—"}
                            </span>
                            <span>•</span>
                            <span className="truncate">Coord: {batch.coordinatorName}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {renderStatusBadge(batch.status, batch)}
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-card p-2 rounded-xl border border-border/60">
                          <span className="text-[10px] text-text-muted uppercase font-mono block">Submitted By</span>
                          <span className="font-bold text-text truncate block mt-0.5">{batch.submittedByName || "Admin"}</span>
                        </div>
                        <div className="bg-card p-2 rounded-xl border border-border/60">
                          <span className="text-[10px] text-text-muted uppercase font-mono block">Students</span>
                          <span className="font-bold text-text block mt-0.5">{batch.studentCount || 0} records</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border/40">
                        <button
                          onClick={() => handleViewDetails(batch)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-text-muted hover:text-text text-xs font-mono transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        {(batch.status === "COMPLETED" || batch.status === "PROCESSING" || (batch.generatedCount && batch.generatedCount > 0)) && (
                          <button
                            onClick={() => handleExportCsv(batch)}
                            disabled={isActionLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-text-muted hover:text-accent text-xs font-mono transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>CSV</span>
                          </button>
                        )}

                        {(isPending || (isSuperAdmin && batch.status !== "PROCESSING")) && (
                          <button
                            onClick={() => handleStartEdit(batch)}
                            disabled={isActionLoading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}

                        {isSuperAdmin && (
                          <>
                            {isPending && (
                              <button
                                onClick={() => handleApprove(batch)}
                                disabled={isActionLoading}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer"
                              >
                                {isActionLoading ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                <span>Approve</span>
                              </button>
                            )}

                            {batch.status !== "REJECTED" && (
                              <button
                                onClick={() => {
                                  setRejectModalBatch(batch);
                                  setRejectReason("");
                                }}
                                disabled={isActionLoading}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-xs font-mono font-bold transition-all disabled:opacity-50 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{batch.status === "COMPLETED" ? "Revoke" : "Reject"}</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= DETAILS MODAL ================= */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-3xl bg-card border border-border/90 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <div className="text-xs font-mono text-accent font-bold">
                  Batch #{selectedBatch.batchId}
                </div>
                <h3 className="text-lg font-display font-bold text-text uppercase mt-0.5">
                  {selectedBatch.eventName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCsv(selectedBatch)}
                  disabled={actionLoadingId === selectedBatch._id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-mono font-bold text-text hover:text-accent hover:bg-card-hover transition-colors cursor-pointer"
                  title="Export issued certificates to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Batch Info Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl bg-card-hover/40 border border-border/60 text-xs font-mono">
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Status</span>
                <div className="mt-1">{renderStatusBadge(selectedBatch.status, selectedBatch)}</div>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Coordinator</span>
                <span className="font-bold text-text mt-1 block truncate">{selectedBatch.coordinatorName}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Total Students</span>
                <span className="font-bold text-text mt-1 block">{selectedBatch.studentCount}</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Generated</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
                  {selectedBatch.generatedCount ?? (selectedBatch.status === "COMPLETED" ? selectedBatch.studentCount : 0)} / {selectedBatch.studentCount}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Failed</span>
                <span className={`font-bold mt-1 block ${selectedBatch.failedCount > 0 ? "text-rose-500" : "text-text-muted"}`}>
                  {selectedBatch.failedCount || 0}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px] uppercase">Submitted By</span>
                <span className="font-bold text-text mt-1 block truncate">{selectedBatch.submittedByName || "Admin"}</span>
              </div>
            </div>

            {/* Signature Preview */}
            {selectedBatch.signatureImage && (
              <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between gap-4">
                <span className="text-xs font-mono font-bold text-text uppercase">
                  Coordinator Signature:
                </span>
                <img
                  src={selectedBatch.signatureImage}
                  alt="Signature"
                  className="h-10 max-w-[160px] object-contain rounded bg-white/10 p-1 border border-border/50"
                />
              </div>
            )}

            {/* Student Search & List */}
            <div className="flex-1 overflow-hidden flex flex-col space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold text-text uppercase">
                  Student Roster ({selectedBatch.students?.length || selectedBatch.studentCount || 0})
                </span>
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Filter students in batch..."
                  className="px-3 py-1.5 bg-card border border-border/80 rounded-lg text-xs font-mono text-text focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="overflow-y-auto flex-1 rounded-xl border border-border/60 bg-card/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-card-hover/60 border-b border-border/60 text-[10px] font-mono uppercase text-text-muted sticky top-0">
                    <tr>
                      <th className="p-3 pl-4">#</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3 pr-4">Award / Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 font-mono">
                    {(selectedBatch.students || [])
                      .filter((s) => {
                        if (!studentSearch.trim()) return true;
                        const sq = studentSearch.toLowerCase();
                        return (
                          s.name.toLowerCase().includes(sq) ||
                          s.email.toLowerCase().includes(sq) ||
                          (s.position && s.position.toLowerCase().includes(sq))
                        );
                      })
                      .map((student, idx) => (
                        <tr key={idx} className="hover:bg-card-hover/40">
                          <td className="p-3 pl-4 text-text-muted">{idx + 1}</td>
                          <td className="p-3 font-sans font-bold text-text">
                            <div className="flex items-center gap-2">
                              <span>{student.name}</span>
                              {student.certificateId && (
                                <a
                                  href={`/verify-certificate/${student.certificateId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-accent hover:underline inline-flex items-center gap-0.5 font-mono font-normal"
                                  title="Verify certificate"
                                >
                                  Verify ↗
                                </a>
                              )}
                            </div>
                            {student.certificateId && (
                              <span className="block font-mono text-[10px] text-accent font-normal mt-0.5">
                                #{student.certificateId}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-text-muted">{student.email}</td>
                          <td className="p-3 pr-4">
                            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold">
                              {student.position || "Participant"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="border-t border-border/60 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-mono font-bold text-text hover:bg-card-hover transition-colors cursor-pointer"
                >
                  Close
                </button>

                {/* Edit Batch & Roster button in details modal */}
                {(selectedBatch.status === "PENDING_APPROVAL" || isSuperAdmin) && (
                  <button
                    onClick={() => handleStartEdit(selectedBatch)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                    title="Edit batch event metadata or modify student recipients"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Batch & Student Roster</span>
                  </button>
                )}
              </div>

              {isSuperAdmin && (
                <div className="flex items-center gap-2">
                  {selectedBatch.status !== "REJECTED" && (
                    <button
                      onClick={() => {
                        setRejectModalBatch(selectedBatch);
                        setRejectReason("");
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      {selectedBatch.status === "COMPLETED" ? "Revoke & Delete Certificates" : "Reject"}
                    </button>
                  )}
                  {selectedBatch.status === "PENDING_APPROVAL" && (
                    <button
                      onClick={() => handleApprove(selectedBatch)}
                      disabled={actionLoadingId === selectedBatch._id}
                      className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-mono font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      Authorize & Generate Batch
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT BATCH MODAL ================= */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-bg/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-4xl bg-card border border-border/90 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold uppercase mb-1">
                  <Clock className="w-3 h-3" />
                  <span>PENDING APPROVAL • EDIT MODE</span>
                </div>
                <h3 className="text-lg font-display font-bold text-text uppercase">
                  Edit Batch #{editingBatch.batchId}
                </h3>
              </div>
              <button
                onClick={() => setEditingBatch(null)}
                className="text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 overflow-hidden flex flex-col space-y-5">
              {/* Event Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono font-bold text-text uppercase block mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.eventName}
                    onChange={(e) => setEditForm({ ...editForm, eventName: e.target.value })}
                    required
                    className="w-full bg-card-hover border border-border rounded-xl p-2.5 text-xs font-sans text-text focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-text uppercase block mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={editForm.eventDate}
                    onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                    required
                    className="w-full bg-card-hover border border-border rounded-xl p-2.5 text-xs font-mono text-text focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-text uppercase block mb-1">
                    Coordinator Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.coordinatorName}
                    onChange={(e) => setEditForm({ ...editForm, coordinatorName: e.target.value })}
                    required
                    className="w-full bg-card-hover border border-border rounded-xl p-2.5 text-xs font-sans text-text focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Signature Image Edit */}
              <div className="p-3.5 rounded-xl bg-card-hover/40 border border-border/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {editFilePreview ? (
                    <img
                      src={editFilePreview}
                      alt="Signature"
                      className="h-10 max-w-[140px] object-contain rounded bg-white/10 p-1 border border-border"
                    />
                  ) : (
                    <div className="h-10 w-24 rounded bg-card border border-border flex items-center justify-center text-[10px] text-text-muted">
                      No Signature
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-mono font-bold text-text block">
                      Coordinator Signature
                    </span>
                    <span className="text-[10px] text-text-muted">
                      Leave unchanged or upload a replacement signature image
                    </span>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-card-hover text-xs font-mono font-bold text-text cursor-pointer transition-colors">
                  <ImageIcon className="w-3.5 h-3.5 text-accent" />
                  <span>Replace Signature</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditForm({ ...editForm, signatureFile: file });
                        setEditFilePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>

              {/* Student Roster Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-text uppercase">
                    Student Roster
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent font-mono text-[11px] font-bold">
                    {editForm.students.length} Student(s)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".csv"
                    ref={editCsvInputRef}
                    onChange={handleEditCsvUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editCsvInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-text hover:bg-card-hover text-xs font-mono transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={downloadCertificateCsvTemplate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-text-muted hover:text-text hover:bg-card-hover text-xs font-mono transition-colors cursor-pointer"
                    title="Download Sample CSV Template"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Template</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddEditStudent}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-[#111111] font-mono text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Student</span>
                  </button>
                </div>
              </div>

              {/* Student Rows Table */}
              <div className="flex-1 overflow-x-auto overflow-y-auto rounded-xl border border-border/60 bg-card/40 max-h-[320px]">
                <table className="w-full text-left text-xs border-collapse min-w-[560px]">
                  <thead className="bg-card-hover/80 border-b border-border/60 text-[10px] font-mono uppercase text-text-muted sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="p-2.5 pl-3 w-10">#</th>
                      <th className="p-2.5">Student Name *</th>
                      <th className="p-2.5">Email Address *</th>
                      <th className="p-2.5 w-44">Award / Position</th>
                      <th className="p-2.5 pr-3 text-right w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {editForm.students.map((student, idx) => (
                      <tr key={idx} className="hover:bg-card-hover/30">
                        <td className="p-2.5 pl-3 font-mono text-text-muted text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={student.name}
                            onChange={(e) => handleEditStudentChange(idx, "name", e.target.value)}
                            placeholder="Student Name"
                            required
                            className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="email"
                            value={student.email}
                            onChange={(e) => handleEditStudentChange(idx, "email", e.target.value)}
                            placeholder="student@example.com"
                            required
                            className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-text focus:outline-none focus:ring-1 focus:ring-accent"
                          />
                        </td>
                        <td className="p-2.5">
                          <select
                            value={student.position || "Participant"}
                            onChange={(e) => handleEditStudentChange(idx, "position", e.target.value)}
                            className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:ring-1 focus:ring-accent"
                          >
                            <option value="Participant">Participant</option>
                            <option value="Winner">Winner</option>
                            <option value="Runner Up">Runner Up</option>
                            <option value="1st Runner-up">1st Runner-up</option>
                            <option value="2nd Runner-up">2nd Runner-up</option>
                            <option value="Volunteer">Volunteer</option>
                            <option value="Organizer">Organizer</option>
                          </select>
                        </td>
                        <td className="p-2.5 pr-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveEditStudent(idx)}
                            disabled={editForm.students.length <= 1}
                            className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Remove student row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-border/60 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="px-5 py-2.5 rounded-xl bg-card border border-border text-xs font-mono font-bold text-text hover:bg-card-hover transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-[#111111] font-mono font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-accent/20"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= REJECT REASON MODAL ================= */}
      {rejectModalBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-card border border-border/90 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-display font-bold uppercase">
                <XCircle className="w-5 h-5" />
                <span>Reject Certificate Batch</span>
              </div>
              <button
                onClick={() => setRejectModalBatch(null)}
                className="text-text-muted hover:text-text cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-text-muted">
              Rejecting batch <span className="font-mono font-bold text-text">#{rejectModalBatch.batchId}</span> for{" "}
              <span className="font-bold text-text">{rejectModalBatch.eventName}</span> will suppress background queue processing and permanently delete all generated certificates for this batch from the database.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block mb-1.5">
                  Rejection Reason (Optional)
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., Signature image resolution is too low, or event date is incorrect..."
                  className="w-full bg-card-hover border border-border rounded-xl p-3 text-xs font-mono text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalBatch(null)}
                  className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-mono font-bold text-text hover:bg-card-hover transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId === rejectModalBatch._id}
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-mono font-bold text-xs hover:bg-rose-600 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-rose-500/20"
                >
                  {actionLoadingId === rejectModalBatch._id ? "Rejecting..." : "Confirm Reject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
