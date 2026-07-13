import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Search,
  Filter,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  MoreVertical,
  Check,
  X as XIcon,
  RefreshCw,
  Download,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "../../context/ConfirmContext";
import {
  fetchAdminRegistrations,
  updateRegistrationStatus,
  createManualRegistration,
} from "../../context/adminRegistrationsSlice";
import { TableRowSkeleton } from "../../components/common/SkeletonLoaders";
import { generateAcademicYears } from "../../utils/helpers";

export default function Registrations() {
  const { registrationsByYear, loading } = useSelector(
    (state) => state.adminRegistrations
  );
  const dispatch = useDispatch();

  // --- Filter States ---
  const formAcademicYears = generateAcademicYears();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [academicYearFilter, setAcademicYearFilter] = useState(formAcademicYears[0] || "ALL");
  const [paymentModeFilter, setPaymentModeFilter] = useState("ALL");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      course: "B.Tech",
      year: "1st Year",
      semester: "1st"
    }
  });
  
  const [updatingId, setUpdatingId] = useState(null);
  const confirm = useConfirm();

  const currentRegistrations = registrationsByYear[academicYearFilter] || [];

  useEffect(() => {
    if (!registrationsByYear[academicYearFilter]) {
      dispatch(fetchAdminRegistrations(academicYearFilter));
    }
  }, [dispatch, academicYearFilter, registrationsByYear]);

  const handleStatusChange = async (id, newStatus) => {
    const isConfirmed = await confirm({
      title: "Update Status",
      message: `Are you sure you want to mark this registration as ${newStatus}? The system will dispatch an automated email to the candidate.`,
    });

    if (!isConfirmed) return;

    setUpdatingId(id);
    try {
      await dispatch(
        updateRegistrationStatus({
          id,
          status: newStatus,
        })
      ).unwrap();
    } catch {
      // Error handled in thunk
    } finally {
      setUpdatingId(null);
    }
  };

  // --- Filtering Logic ---
  const filteredRegistrations = currentRegistrations.filter((reg) => {
    const matchesSearch =
      reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

    const currentStatus = reg.status || "PENDING";
    
    const matchesStatus = statusFilter === "ALL" || currentStatus === statusFilter;
    const matchesCourse = courseFilter === "ALL" || reg.course === courseFilter;
    const matchesYear = yearFilter === "ALL" || reg.year === yearFilter;
    const regPaymentMode = reg.paymentMode || "ONLINE";
    const matchesPaymentMode = paymentModeFilter === "ALL" || regPaymentMode === paymentModeFilter;
    
    return matchesSearch && matchesStatus && matchesCourse && matchesYear && matchesPaymentMode;
  });

  const onAddSubmit = async (data) => {
    try {
      await dispatch(createManualRegistration(data)).unwrap();
      setShowAddModal(false);
      reset();
    } catch (error) {
      alert(error || "Failed to add registration");
    }
  };

  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert("No data to export for this selection.");
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
      "Status",
      "Registration Date"
    ];

    const csvRows = [headers.join(",")];

    filteredRegistrations.forEach(reg => {
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
        `"${reg.status || ""}"`,
        `"${new Date(reg.createdAt).toLocaleDateString()}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Registrations_${academicYearFilter}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const isNewEntry = (reg) => {
    const createdAt = new Date(reg.createdAt);
    const now = new Date();
    // highlight if created within the last 24 hours
    const within24Hours = (now - createdAt) < 24 * 60 * 60 * 1000;
    
    // Only highlight if it is still PENDING
    return within24Hours && reg.status === 'PENDING';
  };

  const StatusBadge = ({ status }) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Registration Information
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and verify new applicant submissions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={loading || filteredRegistrations.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm disabled:opacity-50"
            title="Export to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
          >
            <span>+ Add Student (Cash)</span>
          </button>
          <button
            onClick={() => dispatch(fetchAdminRegistrations(academicYearFilter))}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-5 h-5 ${
                loading ? "animate-spin text-teal-500" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Q-ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
          />
        </div>

        {/* Filter Dropdowns Container */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Course Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-teal-600 pointer-events-none" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-300 transition-colors shadow-sm cursor-pointer"
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
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-400 pointer-events-none"></div>
          </div>

          {/* Year Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-teal-600 pointer-events-none" />
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-300 transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-400 pointer-events-none"></div>
          </div>

          {/* Academic Year Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-teal-600 pointer-events-none" />
            <select
              value={academicYearFilter}
              onChange={(e) => setAcademicYearFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-300 transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Academic Years</option>
              {formAcademicYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-400 pointer-events-none"></div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-teal-600 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-300 transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-400 pointer-events-none"></div>
          </div>

          {/* Payment Mode Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-teal-600 pointer-events-none" />
            <select
              value={paymentModeFilter}
              onChange={(e) => setPaymentModeFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-300 transition-colors shadow-sm cursor-pointer"
            >
              <option value="ALL">All Payments</option>
              <option value="ONLINE">Online</option>
              <option value="CASH">Cash</option>
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-400 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Academic Data
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-12 text-center text-slate-500 font-medium"
                  >
                    No records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => {
                  const isNew = isNewEntry(reg);
                  return (
                  <tr
                    key={reg._id}
                    className={`transition-colors ${isNew ? 'bg-teal-50/40 hover:bg-teal-50/60' : 'hover:bg-slate-50/50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 flex items-center gap-2">
                        {reg.name}
                        {isNew && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700 tracking-wider">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        D/O, S/O: {reg.fatherName}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-slate-700">{reg.email}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {reg.phone}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {reg.course}{" "}
                        <span className="text-slate-400 font-normal ml-1">
                          ({reg.year})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Q-ID:{" "}
                        <span className="font-medium text-slate-600">
                          {reg.studentId}
                        </span>{" "}
                        | Sec: {reg.section} | Set: {reg.set}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="inline-flex items-center px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs w-max">
                          UTR: {reg.transactionId}
                        </div>
                        {(!reg.paymentMode || reg.paymentMode === 'ONLINE') ? (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-max border border-blue-100">ONLINE</span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-max border border-emerald-100">CASH</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={reg.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      {updatingId === reg._id ? (
                        <div className="flex justify-end pr-2 text-slate-400">
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {reg.status !== "APPROVED" && (
                            <button
                              onClick={() =>
                                handleStatusChange(reg._id, "APPROVED")
                              }
                              className="p-1.5 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors border border-teal-100"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {reg.status !== "REJECTED" && (
                            <button
                              onClick={() =>
                                handleStatusChange(reg._id, "REJECTED")
                              }
                              className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-100"
                              title="Reject"
                            >
                              <XIcon className="w-4 h-4" />
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
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Add Student (Cash)</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-50"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onAddSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                  <input {...register("name", { required: "Name is required" })} type="text" className={`w-full border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Father's Name</label>
                  <input {...register("fatherName", { required: "Father's name is required" })} type="text" className={`w-full border ${errors.fatherName ? 'border-red-500' : 'border-slate-200'} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`} />
                  {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} type="email" className={`w-full border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input {...register("phone", { required: "Phone is required", pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" } })} type="text" className={`w-full border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                  <select {...register("course")} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                    {['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BBA', 'MBA', 'B.Sc', 'M.Sc'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                  <select {...register("year")} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                    {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                  <select {...register("semester")} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                    {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                  <input {...register("section", { required: "Section is required" })} type="text" className={`w-full border ${errors.section ? 'border-red-500' : 'border-slate-200'} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`} />
                  {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Set</label>
                  <input {...register("set", { required: "Set is required" })} type="text" className={`w-full border ${errors.set ? 'border-red-500' : 'border-slate-200'} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`} />
                  {errors.set && <p className="text-red-500 text-xs mt-1">{errors.set.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Q-ID</label>
                  <input {...register("studentId", { required: "Q-ID is required" })} type="text" className={`w-full border ${errors.studentId ? 'border-red-500' : 'border-slate-200'} rounded-lg p-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500`} />
                  {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId.message}</p>}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); reset(); }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Register & Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}