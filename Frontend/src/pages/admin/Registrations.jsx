import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Loader2,
  Check,
  X as XIcon,
  RefreshCw,
  Download,
  Upload,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "../../context/ConfirmContext";
import {
  fetchAdminRegistrations,
  updateRegistrationStatus,
  createManualRegistration,
  createBulkRegistration,
  setCurrentPage,
} from "../../context/adminRegistrationsSlice";
import { registrationService } from "../../services/registrationService";
import { TableRowSkeleton } from "../../components/common/skeletons";
import { generateAcademicYears } from "../../utils/helpers";
import StatusBadge from "./components/StatusBadge";
import AddRegistrationModal from "./components/AddRegistrationModal";
import ImportRegistrationModal from "./components/ImportRegistrationModal";
import RejectRegistrationModal from "./components/RejectRegistrationModal";

export default function Registrations() {
  const { pages, currentPage, total, totalPages, loading } = useSelector(
    (state) => state.adminRegistrations
  );
  const currentData = pages[currentPage] || [];
  const dispatch = useDispatch();

  // --- Filter States ---
  const formAcademicYears = generateAcademicYears();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [academicYearFilter, setAcademicYearFilter] = useState(
    formAcademicYears[0] || "ALL"
  );
  const [paymentModeFilter, setPaymentModeFilter] = useState("ALL");

  const itemsPerPage = import.meta.env.MODE === "development" ? 10 : 100;

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch data on filter or page change
  useEffect(() => {
    dispatch(
      fetchAdminRegistrations({
        academicYear: academicYearFilter,
        search: debouncedSearch,
        status: statusFilter,
        course: courseFilter,
        paymentMode: paymentModeFilter,
        page: currentPage,
        limit: itemsPerPage,
      })
    );
  }, [
    dispatch,
    academicYearFilter,
    debouncedSearch,
    statusFilter,
    courseFilter,
    paymentModeFilter,
    currentPage,
    itemsPerPage,
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [rejectingRegistration, setRejectingRegistration] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);
  const confirm = useConfirm();

  const handleStatusChange = async (id, newStatus) => {
    const registration = currentData.find((r) => r._id === id);

    if (newStatus === "REJECTED") {
      setRejectingRegistration(registration || { _id: id });
      return;
    }

    const isConfirmed = await confirm({
      title: "Approve Registration",
      message: `Are you sure you want to approve registration for ${registration?.name || "this student"}? An approval email will be sent automatically.`,
    });

    if (!isConfirmed) return;

    setUpdatingId(id);
    try {
      await dispatch(
        updateRegistrationStatus({
          id,
          status: "APPROVED",
        })
      ).unwrap();
    } catch {
      // Error handled in thunk
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmReject = async (reason) => {
    if (!rejectingRegistration) return;
    const id = rejectingRegistration._id;
    setUpdatingId(id);
    try {
      await dispatch(
        updateRegistrationStatus({
          id,
          status: "REJECTED",
          rejectionReason: reason,
        })
      ).unwrap();
    } catch {
      // Error handled in thunk
    } finally {
      setUpdatingId(null);
      setRejectingRegistration(null);
    }
  };

  const handleAddSubmit = async (data) => {
    try {
      await dispatch(createManualRegistration(data)).unwrap();
      setShowAddModal(false);
    } catch (error) {
      alert(error || "Failed to add registration");
    }
  };

  const handleBulkImport = async (formData) => {
    const result = await dispatch(createBulkRegistration(formData)).unwrap();
    dispatch(
      fetchAdminRegistrations({
        academicYear: academicYearFilter,
        search: debouncedSearch,
        status: statusFilter,
        course: courseFilter,
        paymentMode: paymentModeFilter,
        page: currentPage,
        limit: itemsPerPage,
      })
    );
    return result;
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const queryParams = {
        academicYear: academicYearFilter,
        search: debouncedSearch,
        status: statusFilter,
        course: courseFilter,
        paymentMode: paymentModeFilter,
        limit: 0,
      };

      for (const key in queryParams) {
        if (queryParams[key] === "ALL" || queryParams[key] === "") {
          delete queryParams[key];
        }
      }

      const response = await registrationService.getRegistrations(queryParams);
      const payload = response.data?.data || response.data || response;
      const finalExportData =
        payload.registrations || (Array.isArray(payload) ? payload : []);

      if (finalExportData.length === 0) {
        alert("No data matches your current filters to export.");
        return;
      }

      const headers = [
        "Name",
        "Father's Name",
        "Email",
        "Phone",
        "Course",
        "Study Year",
        "Semester",
        "Section",
        "Set",
        "Student ID",
        "Transaction ID",
        "Payment Mode",
        "Status",
        "Registration Date",
      ];

      const csvRows = [headers.join(",")];

      finalExportData.forEach((reg) => {
        const row = [
          `"${reg.name || ""}"`,
          `"${reg.fatherName || ""}"`,
          `"${reg.email || ""}"`,
          `"${reg.phone || ""}"`,
          `"${reg.course || ""}"`,
          `"${reg.year || ""}"`,
          `"${reg.semester || ""}"`,
          `"${reg.section || ""}"`,
          `"${reg.set || ""}"`,
          `"${reg.studentId || ""}"`,
          `"${reg.transactionId || ""}"`,
          `"${reg.paymentMode || "ONLINE"}"`,
          `"${reg.status || ""}"`,
          `"${new Date(reg.createdAt).toLocaleDateString("en-IN")}"`,
        ];
        csvRows.push(row.join(","));
      });

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Registrations_${academicYearFilter}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to fetch full data for export.");
    } finally {
      setIsExporting(false);
    }
  };

  const isNewEntry = (reg) => {
    const createdAt = new Date(reg.createdAt);
    const now = new Date();
    const within24Hours = now - createdAt < 24 * 60 * 60 * 1000;
    return within24Hours && reg.status === "PENDING";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full">
      {/* Header */}
      <header className="mb-8 flex flex-col items-start md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <FileText className="w-3.5 h-3.5" />
            <span>APPLICANT REGISTRY</span>
          </div>
          <h1 className="text-3xl font-display font-black text-text uppercase tracking-tight">
            REGISTRATION <span className="text-accent">DATABASE</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage, audit, and verify student applicant records in real-time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={isExporting || loading || total === 0}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-text rounded-lg text-sm font-medium hover:bg-card-hover transition-colors shadow-sm disabled:opacity-50"
            title="Export to CSV"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
          </button>
          <button
            onClick={() => {
              setShowImportModal(true);
              setImportResult(null);
              setImportFile(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-text rounded-lg text-sm font-medium hover:bg-card-hover transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Import</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-[#111111] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            <span>+ Add Student (Cash)</span>
          </button>
          <button
            onClick={() =>
              dispatch(
                fetchAdminRegistrations({
                  academicYear: academicYearFilter,
                  search: debouncedSearch,
                  status: statusFilter,
                  course: courseFilter,
                  paymentMode: paymentModeFilter,
                  page: currentPage,
                  limit: itemsPerPage,
                })
              )
            }
            disabled={loading}
            className="p-2 bg-card border border-border rounded-lg text-text-muted hover:text-accent hover:border-accent transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-5 h-5 ${loading ? "animate-spin text-accent" : ""
                }`}
            />
          </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Q-ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border text-text rounded-lg p-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors shadow-sm"
          />
        </div>

        {/* Filter Dropdowns Container */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Course Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Courses</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
              <option value="B.Sc">B.Sc</option>
              <option value="M.Sc">M.Sc</option>
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
          </div>

          {/* Academic Year Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
            <select
              value={academicYearFilter}
              onChange={(e) => setAcademicYearFilter(e.target.value)}
              className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Academic Years</option>
              {formAcademicYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
          </div>

          {/* Payment Mode Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
            <select
              value={paymentModeFilter}
              onChange={(e) => setPaymentModeFilter(e.target.value)}
              className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Payments</option>
              <option value="ONLINE">Online</option>
              <option value="CASH">Cash</option>
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl shadow-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-card-hover/90 border-b border-border/80">
              <tr>
                <th className="px-3 sm:px-4 py-3 font-mono font-semibold text-text-muted text-[11px] uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-3 sm:px-4 py-3 font-mono font-semibold text-text-muted text-[11px] uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-3 sm:px-4 py-3 font-mono font-semibold text-text-muted text-[11px] uppercase tracking-wider">
                  Academic Data
                </th>
                <th className="px-3 sm:px-4 py-3 font-mono font-semibold text-text-muted text-[11px] uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-3 sm:px-4 py-3 font-mono font-semibold text-text-muted text-[11px] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-3 font-mono font-semibold text-text-muted text-[11px] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </>
              ) : currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-12 text-center text-text-muted font-medium"
                  >
                    No records found matching criteria.
                  </td>
                </tr>
              ) : (
                currentData.map((reg) => {
                  const isNew = isNewEntry(reg);
                  return (
                    <tr
                      key={reg._id}
                      className={`transition-colors ${isNew ? "bg-accent/10 hover:bg-accent/15" : "hover:bg-card-hover/60"}`}
                    >
                      <td className="px-3 sm:px-4 py-3 max-w-[170px] align-top">
                        <div className="font-semibold text-text flex items-center gap-1.5 flex-wrap">
                          <span className="break-words">{reg.name}</span>
                          {isNew && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-accent/20 text-accent tracking-wider border border-accent/30 shrink-0">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5 truncate" title={`D/O, S/O: ${reg.fatherName}`}>
                          D/O, S/O: {reg.fatherName}
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3 max-w-[180px] align-top">
                        <div className="text-text font-medium text-xs break-all" title={reg.email}>{reg.email}</div>
                        <div className="text-[11px] font-mono text-text-muted mt-0.5">
                          {reg.phone}
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3 align-top">
                        <div className="font-semibold text-text">
                          {reg.course}{" "}
                          <span className="text-text-muted font-normal text-xs">
                            ({reg.year})
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-text-muted mt-0.5 whitespace-nowrap">
                          Q-ID: <span className="font-semibold text-text">{reg.studentId}</span> | Sec: {reg.section} | Set: {reg.set}
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3 align-top">
                        <div className="flex flex-col gap-1 items-start">
                          <div className="inline-flex items-center px-2 py-0.5 rounded bg-card-hover border border-border/80 text-text-muted font-mono text-[11px] max-w-[140px] truncate" title={`UTR: ${reg.transactionId}`}>
                            UTR: {reg.transactionId}
                          </div>
                          {!reg.paymentMode || reg.paymentMode === "ONLINE" ? (
                            <span className="text-[9px] font-mono font-bold text-text bg-text/10 px-2 py-0.5 rounded border border-text/20 uppercase">
                              ONLINE
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20 uppercase">
                              CASH
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3 align-top">
                        <StatusBadge status={reg.status} />
                      </td>

                      <td className="px-3 sm:px-4 py-3 text-right align-top whitespace-nowrap">
                        {updatingId === reg._id ? (
                          <div className="flex justify-end pr-2 text-text-muted">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {reg.status !== "APPROVED" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(reg._id, "APPROVED")
                                }
                                className="p-1.5 text-accent bg-accent/10 hover:bg-accent/20 rounded-lg transition-all border border-accent/30 cursor-pointer"
                                title="Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {reg.status !== "REJECTED" && (
                              <button
                                onClick={() =>
                                  handleStatusChange(reg._id, "REJECTED")
                                }
                                className="p-1.5 text-danger bg-danger/10 hover:bg-danger/20 rounded-lg transition-all border border-danger/30 cursor-pointer"
                                title="Reject"
                              >
                                <XIcon className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card-hover">
            <div className="text-sm text-text-muted">
              Showing{" "}
              <span className="font-medium text-text">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-text">
                {Math.min(currentPage * itemsPerPage, total)}
              </span>{" "}
              of <span className="font-medium text-text">{total}</span>{" "}
              results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  dispatch(setCurrentPage(Math.max(1, currentPage - 1)))
                }
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-text-muted bg-card border border-border rounded hover:bg-card-hover disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center px-3 text-sm font-medium text-text">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() =>
                  dispatch(
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-text-muted bg-card border border-border rounded hover:bg-card-hover disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddRegistrationModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}
      {/* Import Modal */}
      {showImportModal && (
        <ImportRegistrationModal
          onClose={() => setShowImportModal(false)}
          onImport={handleBulkImport}
        />
      )}
      {/* Reject Modal */}
      {rejectingRegistration && (
        <RejectRegistrationModal
          registration={rejectingRegistration}
          onClose={() => setRejectingRegistration(null)}
          onConfirm={handleConfirmReject}
        />
      )}
    </div>
  );
}