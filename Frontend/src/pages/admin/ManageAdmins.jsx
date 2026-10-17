import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  UserCheck,
  UserPlus,
  Shield,
  ShieldAlert,
  Edit2,
  Trash2,
  Loader2,
  Search,
  Key,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Radio,
  Lock,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function ManageAdmins() {
  const currentUser = useSelector((state) => state.auth.user);
  const currentRole = currentUser?.admin?.role || currentUser?.role;
  const isSuperAdmin = currentRole === "SuperAdmin";

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // Add Admin Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [showAddPassword, setShowAddPassword] = useState(false);

  // Edit Admin Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Delete Admin State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all admins
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getAdmins();
      const list = res.data?.data || res.data || [];
      setAdmins(list);
    } catch (err) {
      console.error("Failed to fetch admin accounts:", err);
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to load admin accounts.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdmins();
    }
  }, [fetchAdmins, isSuperAdmin]);

  // Handle Add Form Change
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  // Submit Add Admin
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setFeedback({ type: "", text: "" });

    try {
      const res = await adminService.createAdmin(addForm);
      if (res.data?.success || res.status === 201 || res.status === 200) {
        setFeedback({
          type: "success",
          text: `Admin account "${addForm.name}" created successfully.`,
        });
        setShowAddModal(false);
        setAddForm({ name: "", email: "", password: "", mobileNumber: "" });
        fetchAdmins();
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to create admin account.",
      });
    } finally {
      setAddLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      name: admin.name || "",
      email: admin.email || "",
      password: "",
      mobileNumber: admin.mobileNumber || "",
    });
    setShowEditModal(true);
  };

  // Submit Edit Admin
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    setEditLoading(true);
    setFeedback({ type: "", text: "" });

    try {
      const updatePayload = {
        name: editForm.name,
        email: editForm.email,
        mobileNumber: editForm.mobileNumber,
      };
      if (editForm.password && editForm.password.trim()) {
        updatePayload.password = editForm.password.trim();
      }

      await adminService.updateAdmin(selectedAdmin._id, updatePayload);
      setFeedback({
        type: "success",
        text: `Admin account "${editForm.name}" updated successfully.`,
      });
      setShowEditModal(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to update admin account.",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  // Confirm Delete Admin
  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    setDeleteLoading(true);
    try {
      await adminService.deleteAdmin(adminToDelete._id);
      setFeedback({
        type: "success",
        text: `Admin "${adminToDelete.name}" (${adminToDelete.email}) was removed successfully.`,
      });
      setShowDeleteModal(false);
      setAdminToDelete(null);
      fetchAdmins();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to remove admin account.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter out any Super Admin account from the provisioned administrators list
  const standardAdmins = admins.filter(
    (a) => !a.isSuperAdmin && a.role !== "SuperAdmin"
  );

  const filteredAdmins = standardAdmins.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.role?.toLowerCase().includes(q) ||
      a.mobileNumber?.includes(q)
    );
  });

  const totalAdminsCount = standardAdmins.length;
  const activeSessionsTotal = standardAdmins.reduce(
    (acc, curr) => acc + (curr.activeSessionsCount || 0),
    0
  );

  // If regular admin accesses this route
  if (!isSuperAdmin) {
    return (
      <div className="p-6 md:p-12 flex flex-col items-center justify-center min-h-[60vh] text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-center text-danger mb-4 shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-black text-text uppercase tracking-tight">
          Restricted to Super Admin
        </h2>
        <p className="text-sm text-text-muted mt-2 max-w-md">
          Only the root Super Administrator has authorization to add, update, or revoke administrator credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full flex flex-col space-y-6">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ROOT CONTROL • SUPER ADMIN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-text uppercase tracking-tight">
            ADMIN <span className="text-accent">CREDENTIALS</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Super Administrator console to provision, modify, and terminate secondary administrator accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdmins}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-card-hover text-text-muted hover:text-text transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-[#111111] font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/20 hover:opacity-90 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Admin</span>
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-text-muted uppercase">Total Administrators</div>
            <div className="text-2xl font-display font-black text-text mt-0.5">{totalAdminsCount}</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-text-muted uppercase">Active Sessions</div>
            <div className="text-2xl font-display font-black text-emerald-400 mt-0.5">{activeSessionsTotal}</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-text-muted uppercase">Root Security Mode</div>
            <div className="mt-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm shadow-fuchsia-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
                ROOT CONTROL • SUPER ADMIN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback.text && (
        <div
          className={`flex items-center justify-between gap-3 p-4 rounded-xl text-xs font-mono font-bold border transition-all ${
            feedback.type === "success"
              ? "bg-accent/15 text-accent border-accent/40"
              : "bg-danger/15 text-danger border-danger/40"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
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

      {/* Main Content Area */}
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl border border-border/80 shadow-xl overflow-hidden flex flex-col flex-1">
        {/* Controls Bar */}
        <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card-hover/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full bg-card border border-border/80 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-text-muted/50"
            />
          </div>

          <div className="text-xs font-mono text-text-muted flex items-center gap-1.5 self-end sm:self-center">
            <span>Showing:</span>
            <span className="text-text font-bold">{filteredAdmins.length}</span>
            <span>of {standardAdmins.length}</span>
          </div>
        </div>

        {/* Admins Table */}
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted gap-3 py-16">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="text-xs font-mono">Loading administrators...</span>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-text-muted gap-3 py-16">
              <User className="w-10 h-10 text-text-muted/40" />
              <span className="text-sm font-semibold text-text">No matching admins found</span>
              <p className="text-xs text-text-muted max-w-xs text-center">
                Try refining your search term or add a new admin account.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-border/60 bg-card-hover/50 text-[11px] font-mono text-text-muted uppercase tracking-wider">
                      <th className="p-4 pl-6">Admin Member</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">System Role</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">Active Sessions</th>
                      <th className="p-4">Created Date</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs font-sans">
                    {filteredAdmins.map((admin) => (
                      <tr
                        key={admin._id}
                        className="hover:bg-card-hover/40 transition-colors group"
                      >
                        {/* Name & Avatar */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs uppercase overflow-hidden shrink-0 border bg-accent/15 text-accent border-accent/30">
                              {admin.profilePhoto ? (
                                <img
                                  src={admin.profilePhoto}
                                  alt={admin.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                admin.name?.charAt(0) || "A"
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-text text-sm flex items-center gap-2">
                                <span>{admin.name}</span>
                              </div>
                              <div className="text-[11px] text-text-muted font-mono">
                                ID: {admin._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-text font-mono text-xs">
                            <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                            <span>{admin.email}</span>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                            <Shield className="w-3.5 h-3.5" />
                            Admin
                          </span>
                        </td>

                        {/* Mobile */}
                        <td className="p-4 font-mono text-text-muted text-xs">
                          {admin.mobileNumber ? (
                            <div className="flex items-center gap-1.5 text-text">
                              <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
                              <span>{admin.mobileNumber}</span>
                            </div>
                          ) : (
                            <span className="text-text-muted/50">—</span>
                          )}
                        </td>

                        {/* Active Sessions */}
                        <td className="p-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-card border border-border/80 font-mono text-xs">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                admin.activeSessionsCount > 0
                                  ? "bg-emerald-400 animate-pulse"
                                  : "bg-text-muted/40"
                              }`}
                            />
                            <span className="font-bold text-text">
                              {admin.activeSessionsCount || 0}
                            </span>
                            <span className="text-[10px] text-text-muted">
                              {admin.activeSessionsCount === 1 ? "live" : "live"}
                            </span>
                          </div>
                        </td>

                        {/* Created At */}
                        <td className="p-4 font-mono text-text-muted text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-text-muted/60" />
                            <span>
                              {admin.createdAt
                                ? new Date(admin.createdAt).toLocaleDateString("en-IN")
                                : "—"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(admin)}
                              className="p-2 rounded-xl text-text-muted hover:text-accent hover:bg-card-hover border border-transparent hover:border-border/80 transition-all cursor-pointer"
                              title="Edit Credentials"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(admin)}
                              className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/30 transition-all cursor-pointer"
                              title="Remove Admin Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden divide-y divide-border/60">
                {filteredAdmins.map((admin) => (
                  <div key={admin._id} className="p-4 space-y-3 bg-card-hover/20">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs uppercase overflow-hidden shrink-0 border bg-accent/15 text-accent border-accent/30">
                          {admin.profilePhoto ? (
                            <img
                              src={admin.profilePhoto}
                              alt={admin.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            admin.name?.charAt(0) || "A"
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-text text-sm truncate">{admin.name}</h4>
                          <span className="text-[10px] text-text-muted font-mono block">
                            ID: {admin._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-accent/10 text-accent border border-accent/20 shrink-0">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex items-center gap-2 text-text break-all">
                        <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <span>{admin.email}</span>
                      </div>
                      {admin.mobileNumber && (
                        <div className="flex items-center gap-2 text-text">
                          <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
                          <span>{admin.mobileNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-text-muted border-t border-border/40 pt-2.5">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            admin.activeSessionsCount > 0
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-text-muted/40"
                          }`}
                        />
                        <span>{admin.activeSessionsCount || 0} active session(s)</span>
                      </div>
                      <div>
                        {admin.createdAt
                          ? new Date(admin.createdAt).toLocaleDateString("en-IN")
                          : "—"}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/30">
                      <button
                        onClick={() => openEditModal(admin)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-text-muted hover:text-accent transition-all text-xs font-mono"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(admin)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20 transition-all text-xs font-mono"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= ADD ADMIN MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-card border border-border/90 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-text uppercase">
                    Provision New Admin
                  </h3>
                  <p className="text-xs text-text-muted">
                    Create authorized admin credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={addForm.name}
                    onChange={handleAddChange}
                    required
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-card-hover border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={addForm.email}
                    onChange={handleAddChange}
                    required
                    placeholder="admin@qucodex.com"
                    className="w-full bg-card-hover border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all font-mono"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block mb-1.5">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    name="mobileNumber"
                    value={addForm.mobileNumber}
                    onChange={handleAddChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-card-hover border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block mb-1.5">
                  Temporary / Initial Password *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
                  <input
                    type={showAddPassword ? "text" : "password"}
                    name="password"
                    value={addForm.password}
                    onChange={handleAddChange}
                    required
                    placeholder="Min 8 chars with uppercase, number & symbol"
                    className="w-full bg-card-hover border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3 text-text-muted hover:text-text cursor-pointer"
                  >
                    {showAddPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  Must contain 8+ characters, 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border bg-card text-text-muted hover:text-text font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-[#111111] font-mono text-xs font-bold uppercase tracking-wider shadow-md shadow-accent/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Provisioning...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT ADMIN MODAL ================= */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-card border border-border/90 rounded-2xl p-5 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-text uppercase">
                    Update Admin Credentials
                  </h3>
                  <p className="text-xs text-text-muted">
                    Modifying {selectedAdmin.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAdmin(null);
                }}
                className="text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                    className="w-full bg-card-hover border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    required
                    className="w-full bg-card-hover border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all font-mono"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={editForm.mobileNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, mobileNumber: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full bg-card-hover border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all font-mono"
                  />
                </div>
              </div>

              {/* New Password (Optional) */}
              <div>
                <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block mb-1.5">
                  Reset Password (Leave blank to keep current)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3 text-text-muted pointer-events-none" />
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editForm.password}
                    onChange={(e) =>
                      setEditForm({ ...editForm, password: e.target.value })
                    }
                    placeholder="••••••••••••"
                    className="w-full bg-card-hover border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3 text-text-muted hover:text-text cursor-pointer"
                  >
                    {showEditPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  Note: Updating the password will immediately revoke all active sessions for this administrator.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAdmin(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-border bg-card text-text-muted hover:text-text font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-[#111111] font-mono text-xs font-bold uppercase tracking-wider shadow-md shadow-accent/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {adminToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Remove Administrator Account"
          message={`Are you sure you want to remove administrator "${adminToDelete.name}" (${adminToDelete.email})? All active sessions and login tokens for this admin will be terminated immediately.`}
          onConfirm={confirmDeleteAdmin}
          onCancel={() => {
            setShowDeleteModal(false);
            setAdminToDelete(null);
          }}
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
}
