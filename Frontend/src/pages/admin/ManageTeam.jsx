import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
  ShieldCheck,
  Filter,
  AlertCircle,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "../../context/ConfirmContext";
import { setError, setSuccess } from "../../context/messageSlice";
import {
  fetchAdminTeam,
  addAdminTeamMember,
  updateAdminTeamMember,
  deleteAdminTeamMember,
} from "../../context/adminTeamSlice";
import { AdminTeamCardSkeleton } from "../../components/common/SkeletonLoaders";


export default function ManageTeam() {
  const { members, loading, isLoaded, currentYear } = useSelector((state) => state.adminTeam);
  const dispatch = useDispatch();

  // Filter state
  const [filterYear, setFilterYear] = useState("");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confirm = useConfirm();
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    defaultValues: {
      name: "",
      post: "",
      subTeam: "",
      academicYear: "",
    }
  });

  useEffect(() => {
    if (!isLoaded || currentYear !== filterYear) {
      dispatch(fetchAdminTeam(filterYear));
    }
  }, [dispatch, filterYear, isLoaded, currentYear]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      name: "",
      post: "",
      subTeam: "",
      academicYear: "",
    });
    setPhotoFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member._id);
    reset({
      name: member.name,
      post: member.post,
      subTeam: member.subTeam,
      academicYear: member.academicYear,
    });
    setPhotoFile(null);
    setImagePreview(member.photo);
    setIsModalOpen(true);
  };

  // Submit Handler
  const onFormSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("name", data.name);
      submitData.append("post", data.post);
      submitData.append("subTeam", data.subTeam);
      submitData.append("academicYear", data.academicYear);

      if (photoFile) {
        submitData.append("photo", photoFile);
      }

      if (editingId) {
        await dispatch(updateAdminTeamMember({ id: editingId, formData: submitData })).unwrap();
      } else {
        await dispatch(addAdminTeamMember(submitData)).unwrap();
      }

      setIsModalOpen(false);
      dispatch(fetchAdminTeam(filterYear));
    } catch (err) {
      if (err.response?.data?.errors?.length > 0) {
        err.response.data.errors.forEach((e) => {
          if (e.field) setError(e.field, { type: "server", message: e.message });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Revoke Access",
      message: "Are you sure you want to revoke this user's access? This action is permanent."
    });

    if (!isConfirmed) return;

    try {
      await dispatch(deleteAdminTeamMember(id)).unwrap();
      dispatch(fetchAdminTeam(filterYear));
    } catch (err) {
      // Handled in thunk
    }
  };

  // Extract unique academic years for the filter dropdown
  const uniqueYears = [...new Set(members.map((m) => m.academicYear))];

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Roster</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage personnel and organizational structure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => dispatch(fetchAdminTeam(filterYear))}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center shrink-0"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-teal-500" : ""}`} />
          </button>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-teal-600 pointer-events-none" />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-300 transition-colors shadow-sm cursor-pointer w-full"
            >
              <option value="ALL">All Academic Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-400 pointer-events-none"></div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </header>

      {/* Roster Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <AdminTeamCardSkeleton key={i} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No Personnel Records
          </h3>
          <p className="text-slate-500 text-sm">
            Click "Add Member" to assign new personnel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
            >
              {/* Photo Section */}
              <div className="h-56 w-full bg-slate-100 border-b border-slate-100 relative overflow-hidden flex items-center justify-center">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                )}
                {/* Year Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-slate-100 flex items-center">
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                    {member.academicYear}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                <h3
                  className="text-lg font-bold text-slate-900 mb-1 line-clamp-1"
                  title={member.name}
                >
                  {member.name}
                </h3>

                <div className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" /> {member.post}
                </div>

                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4">
                  {member.subTeam}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(member)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-teal-200"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-red-200"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative my-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                {editingId ? "Edit Team Member" : "Add Team Member"}
              </h2>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className={`w-full bg-white border ${errors.name ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                      placeholder="Full Name"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Role / Post
                    </label>
                    <input
                      type="text"
                      {...register("post", { required: "Post/Role is required" })}
                      placeholder="Position"
                      className={`w-full bg-white border ${errors.post ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                    />
                    {errors.post && <p className="mt-1 text-xs text-red-500">{errors.post.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Sub-Team / Department
                    </label>
                    <select
                      {...register("subTeam", { required: "Sub-Team is required" })}
                      className={`w-full bg-white border ${errors.subTeam ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                    >
                      <option value="">Select Sub-Team</option>
                      <option value="Core Team">Core Team</option>
                      <option value="Tech Team">Tech Team</option>
                      <option value="Design Team">Design Team</option>
                      <option value="PR & Outreach Team">PR & Outreach Team</option>
                      <option value="Event Management Team">Event Management Team</option>
                      <option value="Advisors">Advisors</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                    {errors.subTeam && <p className="mt-1 text-xs text-red-500">{errors.subTeam.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      {...register("academicYear", { required: "Academic Year is required" })}
                      className={`w-full bg-white border ${errors.academicYear ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                      placeholder="e.g., 2023-2024"
                    />
                    {errors.academicYear && <p className="mt-1 text-xs text-red-500">{errors.academicYear.message}</p>}
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-teal-400 rounded-xl p-6 text-center cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-teal-500 transition-colors" />
                      <span className="text-sm font-medium text-slate-500 group-hover:text-teal-600">
                        Click to browse or drag image here
                      </span>
                    </label>
                    {imagePreview && (
                      <div className="w-28 h-28 border border-slate-200 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-sm">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-teal-700 disabled:opacity-50 mt-4 shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Add Member"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
