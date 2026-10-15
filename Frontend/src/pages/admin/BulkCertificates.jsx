import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Award,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Send,
  Users,
  User,
  Mail,
  Calendar,
  UserCheck,
  Upload,
  Download,
  History,
  ShieldCheck,
  Clock,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setError, setSuccess } from "../../context/messageSlice";
import { certificateService } from "../../services/certificateService";
import IssuedCertificatesModal from "./components/IssuedCertificatesModal";
import CertificateBatchesSection from "./components/CertificateBatchesSection";

export default function BulkCertificates() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentUser = useSelector((state) => state.auth.user);
  const currentRole = currentUser?.admin?.role || currentUser?.role;
  const isSuperAdmin = currentRole === "SuperAdmin";

  const initialTab = searchParams.get("tab") === "batches" ? "batches" : "create";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [pendingCount, setPendingCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [previousSignatureUrl, setPreviousSignatureUrl] = useState(null);
  const [isImportingCsv, setIsImportingCsv] = useState(false);
  const [importStatus, setImportStatus] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const csvInputRef = useRef(null);

  // Sync tab with search params
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Poll / fetch pending batches count
  const fetchPendingCount = async () => {
    try {
      const response = await certificateService.getCertificateBatches({ limit: 1 });
      if (response.data && typeof response.data.pendingCount === "number") {
        setPendingCount(response.data.pendingCount);
      }
    } catch {
      // silent fallback
    }
  };

  useEffect(() => {
    fetchPendingCount();
  }, [activeTab]);

  useEffect(() => {
    const fetchLatestSignature = async () => {
      try {
        const response = await certificateService.getLatestSignature();
        if (response.data?.signatureUrl) {
          setPreviousSignatureUrl(response.data.signatureUrl);
          setSignaturePreview(response.data.signatureUrl);
        }
      } catch (error) {
        console.error("Failed to fetch latest signature:", error);
      }
    };
    fetchLatestSignature();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventName: "",
      eventDate: "",
      template: "standard",
      coordinatorName: "",
      students: [{ name: "", email: "", position: "Participant" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "students",
  });

  const signatureImageRegister = register("signatureImage", {
    required: previousSignatureUrl ? false : "Signature image is required",
  });

  //-----------------------------------------------------
  // CSV Upload (Native JS, No Dependencies)
  //-----------------------------------------------------
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImportingCsv(true);
    setImportStatus(`Reading ${file.name}...`);

    const reader = new FileReader();

    reader.onload = (event) => {
      setImportStatus("Parsing and validating records...");

      setTimeout(() => {
        try {
          const text = event.target.result;
          const rows = text.split(/\r?\n/).filter((row) => row.trim() !== "");

          if (rows.length === 0) {
            setIsImportingCsv(false);
            setImportStatus("");
            dispatch(setError("CSV file is empty."));
            return;
          }

          let startIndex = 0;
          if (
            rows[0].toLowerCase().includes("name") ||
            rows[0].toLowerCase().includes("email")
          ) {
            startIndex = 1;
          }

          const parsedStudents = [];

          for (let i = startIndex; i < rows.length; i++) {
            const cols = rows[i]
              .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
              .map((col) => col.replace(/^"|"$/g, "").trim());

            if (cols.length >= 2) {
              parsedStudents.push({
                name: cols[0] || "",
                email: cols[1] || "",
                position: cols[2] || "Participant",
              });
            }
          }

          if (parsedStudents.length > 0) {
            if (fields.length === 1 && !fields[0].name && !fields[0].email) {
              replace(parsedStudents);
            } else {
              append(parsedStudents);
            }
            dispatch(
              setSuccess(`Successfully imported ${parsedStudents.length} student(s) from CSV.`)
            );
          } else {
            dispatch(setError("Could not parse valid students from the CSV."));
          }
        } catch (err) {
          console.error("CSV import error:", err);
          dispatch(setError("Failed to parse CSV file."));
        } finally {
          setIsImportingCsv(false);
          setImportStatus("");
        }
      }, 300);
    };

    reader.onerror = () => {
      setIsImportingCsv(false);
      setImportStatus("");
      dispatch(setError("Failed to read the CSV file."));
    };

    reader.readAsText(file);
    e.target.value = null;
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,Position\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "certificate_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  //-----------------------------------------------------
  // Submit
  //-----------------------------------------------------
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const validStudents = data.students.filter(
        (student) =>
          student.name.trim() && student.email.trim() && student.position.trim()
      );

      if (validStudents.length === 0) {
        dispatch(setError("Please provide at least one valid student."));
        setLoading(false);
        return;
      }

      const file = data.signatureImage?.[0];
      if (!file && !previousSignatureUrl) {
        dispatch(setError("Coordinator signature image is required."));
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("eventName", data.eventName);
      submitData.append("eventDate", data.eventDate);
      submitData.append("coordinatorName", data.coordinatorName);
      submitData.append("studentsStr", JSON.stringify(validStudents));
      if (file) {
        submitData.append("signatureImage", file);
      } else if (previousSignatureUrl) {
        submitData.append("signatureImageUrl", previousSignatureUrl);
      }

      const response =
        await certificateService.generateBulkCertificates(submitData);

      dispatch(
        setSuccess(
          response.message ||
            (isSuperAdmin
              ? "Certificates authorized and queued successfully."
              : "Certificate batch submitted for Super Admin review.")
        )
      );
      reset();
      setSignaturePreview(null);
      // Auto-switch to batches tab so user can see the created batch
      handleTabChange("batches");
      fetchPendingCount();
    } catch (error) {
      dispatch(
        setError(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to process certificates."
        )
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full">
      <header className="flex items-start justify-between mb-8 gap-4 border-b border-border/60 pb-6">
        <div>
          {isSuperAdmin ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/40 text-fuchsia-700 dark:text-fuchsia-300 font-mono text-xs font-extrabold uppercase tracking-wider mb-2 shadow-sm shadow-fuchsia-500/20">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 dark:bg-fuchsia-400 animate-pulse" />
              <span>ROOT CONTROL • SUPER ADMIN</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              <span>CERTIFICATE PORTAL</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-display font-black text-text uppercase tracking-tight">
            BULK <span className="text-accent">CERTIFICATES</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Bulk submit, verify, approve, and email cryptographic completion certificates.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate("/admin/history?tab=certificates")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-teal-500/15 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/30 text-xs font-mono font-bold hover:bg-teal-500/25 dark:hover:bg-teal-500/20 transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            <History className="w-4 h-4" />
            <span>Issued Certificates History</span>
          </button>
          <div className="hidden sm:block p-3 rounded-2xl bg-accent/10 border border-accent/30 shadow-md shrink-0">
            <Award className="w-7 h-7 text-accent" />
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 mb-8 border-b border-border/60 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange("create")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "create"
              ? "bg-accent text-[#111111] shadow-lg shadow-accent/20"
              : "text-text-muted hover:text-text hover:bg-card-hover border border-transparent"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{isSuperAdmin ? "Direct Certificate Issuance" : "Submit Certificates Batch"}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("batches")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase transition-all cursor-pointer whitespace-nowrap relative ${
            activeTab === "batches"
              ? "bg-accent text-[#111111] shadow-lg shadow-accent/20"
              : "text-text-muted hover:text-text hover:bg-card-hover border border-transparent"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Approval Requests & Batches</span>
          {pendingCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === "batches"
                  ? "bg-[#111111] text-accent"
                  : "bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 animate-pulse"
              }`}
            >
              {pendingCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* View 1: Approval Requests & Batches */}
      {activeTab === "batches" && (
        <CertificateBatchesSection
          isSuperAdmin={isSuperAdmin}
          onSwitchToCreate={() => handleTabChange("create")}
        />
      )}

      {/* View 2: Form */}
      {activeTab === "create" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Approval Notice Banner */}
          {!isSuperAdmin ? (
            <div className="lg:col-span-12 flex items-start sm:items-center gap-3.5 p-4 rounded-2xl bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/30 shadow-sm">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
                  Super Admin Review & Approval Required
                </p>
                <p className="text-[11px] sm:text-xs text-amber-900/90 dark:text-amber-300/80">
                  As an Administrator, your submitted batch will be held in <span className="font-mono font-bold text-amber-950 dark:text-amber-200">PENDING_APPROVAL</span>.
                  The cryptographic certificate generation process and automated email dispatch will strictly begin once a Super Admin approves your batch.
                </p>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-12 flex items-start sm:items-center gap-3.5 p-4 rounded-2xl bg-teal-500/15 dark:bg-teal-500/10 border border-teal-500/40 dark:border-teal-500/30 shadow-sm">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-700 dark:text-teal-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-bold text-teal-950 dark:text-teal-200">
                  Super Admin Direct Issuance (Auto-Authorized)
                </p>
                <p className="text-[11px] sm:text-xs text-teal-900/90 dark:text-teal-300/80">
                  Direct issuance by Super Admin is automatically approved and dispatched to the background queue immediately for generation and delivery.
                </p>
              </div>
            </div>
          )}
        {/* Left Panel : Event Details */}
        <div className="lg:col-span-4 bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 h-fit space-y-6">
          <h2 className="flex items-center gap-2 text-base sm:text-lg font-display font-bold uppercase text-text border-b border-border/60 pb-4">
            <Calendar className="w-5 h-5 text-accent" />
            Event Details
          </h2>

          {/* Event Name */}
          {/* Event Name */}
          <div className="group/field">
            <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
              <span>
                Event Name <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                String
              </span>
            </label>
            <input
              type="text"
              title="Event Name — Type: String (Mandatory)"
              {...register("eventName", { required: "Event name is required" })}
              placeholder="CodeX Workshop 2026"
              className="w-full bg-card-hover/60 border border-border/80 text-text rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm font-sans placeholder:text-text-muted/50"
            />
            {errors.eventName && (
              <p className="mt-1 text-xs text-danger font-medium">
                {errors.eventName.message}
              </p>
            )}
          </div>

          {/* Event Date */}
          <div className="group/field">
            <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
              <span>
                Event Date <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                Date (YYYY-MM-DD)
              </span>
            </label>
            <input
              type="date"
              title="Event Date — Format: Date (YYYY-MM-DD, Mandatory)"
              {...register("eventDate", { required: "Event date is required" })}
              className="w-full bg-card-hover/60 border border-border/80 text-text rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm font-mono"
            />
            {errors.eventDate && (
              <p className="mt-1 text-xs text-danger font-medium">
                {errors.eventDate.message}
              </p>
            )}
          </div>

          {/* Coordinator */}
          <div className="group/field">
            <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
              <span>
                Coordinator Name <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                String (Text)
              </span>
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
              <input
                type="text"
                title="Coordinator Name — Format: String (Mandatory)"
                {...register("coordinatorName", {
                  required: "Coordinator name is required",
                })}
                placeholder="Dr. Smith"
                className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            {errors.coordinatorName && (
              <p className="mt-1 text-xs text-danger">
                {errors.coordinatorName.message}
              </p>
            )}
          </div>

          {/* Signature Upload */}
          <div className="group/field">
            <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
              <span>
                Signature Image <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                Image File (PNG, JPG)
              </span>
            </label>
            <label
              title="Signature Image — Format: Image File (PNG, JPG, Mandatory)"
              className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-accent hover:bg-accent/10 transition"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...signatureImageRegister}
                onChange={(e) => {
                  signatureImageRegister.onChange(e);
                  const file = e.target.files[0];
                  if (file) {
                    setSignaturePreview(URL.createObjectURL(file));
                  }
                }}
              />
              {signaturePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="max-h-24 object-contain mb-2"
                  />
                  <span className="text-xs text-accent font-medium">
                    Click to change signature
                  </span>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-text-muted mb-2" />
                  <span className="text-sm text-text-muted">
                    Upload Signature
                  </span>
                </>
              )}
            </label>
            {errors.signatureImage && (
              <p className="mt-1 text-xs text-danger">
                {errors.signatureImage.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Panel : Student Details */}
        <div className="lg:col-span-8 bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 mb-6 gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-display font-bold uppercase text-text">
                <Users className="w-5 h-5 text-accent" />
                Student Details
              </h2>
              <span className="text-xs font-semibold bg-accent/10 text-accent px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap">
                {fields.length} Student(s)
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              {/* CSV Download Template */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-border bg-card hover:bg-card-hover text-text font-medium transition-colors shadow-sm whitespace-nowrap"
                title="Download CSV Template (Name, Email, Position)"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Template
              </button>

              {/* CSV Upload Button */}
              <input
                type="file"
                accept=".csv"
                ref={csvInputRef}
                onChange={handleCsvUpload}
                disabled={isImportingCsv}
                className="hidden"
              />
              <button
                type="button"
                disabled={isImportingCsv}
                onClick={() => csvInputRef.current.click()}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-border bg-card hover:bg-card-hover text-text font-medium transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isImportingCsv ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-accent" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Import CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CSV Import In-Progress Feedback Banner */}
          {isImportingCsv && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold animate-pulse mb-6 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{importStatus || "Importing student records from CSV..."}</span>
            </div>
          )}

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-card-hover border border-border rounded-xl p-4"
              >
                {/* Name */}
                <div className="md:col-span-4 group/field">
                  <label className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-text mb-1">
                    <span>
                      Student Name <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="text"
                      title="Student Name — Type: String (Mandatory)"
                      placeholder="Student Name *"
                      {...register(`students.${index}.name`, {
                        required: "Name is required",
                      })}
                      className="w-full bg-card text-text rounded-lg border border-border pl-9 p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  {errors.students?.[index]?.name && (
                    <p className="mt-1 text-[11px] text-danger">
                      {errors.students[index].name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-4 group/field">
                  <label className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-text mb-1">
                    <span>
                      Email Address <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="email"
                      title="Student Email — Type: String (Mandatory)"
                      placeholder="student@email.com *"
                      {...register(`students.${index}.email`, {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full bg-card text-text rounded-lg border border-border pl-9 p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  {errors.students?.[index]?.email && (
                    <p className="mt-1 text-[11px] text-danger">
                      {errors.students[index].email.message}
                    </p>
                  )}
                </div>

                {/* Position */}
                <div className="md:col-span-3 group/field">
                  <label className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase text-text-muted mb-1">
                    <span>Position</span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <select
                    title="Student Award / Position — Type: String (Option Selection)"
                    {...register(`students.${index}.position`, {
                      required: "Position is required",
                    })}
                    className="w-full bg-card text-text rounded-lg border border-border p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Participant">Participant</option>
                    <option value="Winner">Winner</option>
                    <option value="Runner Up">Runner Up</option>
                    <option value="1st Runner-up">1st Runner-up</option>
                    <option value="2nd Runner-up">2nd Runner-up</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Organizer">Organizer</option>
                  </select>
                  {errors.students?.[index]?.position && (
                    <p className="mt-1 text-[11px] text-danger">
                      {errors.students[index].position.message}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <div className="md:col-span-1 flex items-end justify-center pb-1">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    title="Remove Student"
                    className="text-text-muted hover:text-danger disabled:opacity-40 p-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-border mt-6 pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() =>
                append({ name: "", email: "", position: "Participant" })
              }
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-text hover:bg-card-hover transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-[#111111] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed font-bold cursor-pointer shadow-lg shadow-accent/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isSuperAdmin ? "Authorizing & Dispatching..." : "Submitting for Approval..."}
                </>
              ) : isSuperAdmin ? (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Authorize & Generate Immediately
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit for Super Admin Approval
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      )}

      {/* History Modal Popup */}
      {showHistoryModal && (
        <IssuedCertificatesModal isModal={true} onClose={() => setShowHistoryModal(false)} />
      )}
    </div>
  );
}