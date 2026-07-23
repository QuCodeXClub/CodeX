import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // <-- Added for portal
import { useForm } from "react-hook-form";
import {
  Plus,
  X,
  Image as ImageIcon,
  Loader2,
  Filter,
  Users,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useConfirm } from "../../context/ConfirmContext";
import {
  fetchAdminTeam,
  addAdminTeamMember,
  updateAdminTeamMember,
  deleteAdminTeamMember,
} from "../../context/adminTeamSlice";
import { generateAcademicYears } from "../../utils/helpers";
import { AdminTeamCardSkeleton } from "../../components/common/skeletons";
import { TeamMemberCard } from "../../components/common/TeamMemberCard";

export default function ManageTeam() {
  const { members, loading, isLoaded, currentYear } = useSelector(
    (state) => state.adminTeam
  );
  const dispatch = useDispatch();

  const formAcademicYears = generateAcademicYears();

  // Filter state
  const [filterYear, setFilterYear] = useState(formAcademicYears[0]);

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
    clearErrors,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      post: "",
      subTeam: "",
      academicYear: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!isLoaded || currentYear !== filterYear) {
      dispatch(fetchAdminTeam(filterYear));
    }
  }, [dispatch, filterYear, isLoaded, currentYear]);

  const teamOrder = {
    "Admin Team": 1,
    "Core Team": 2,
    "Tech Team": 3,
    "Graphic Team": 4,
  };

  const displayedMembers = [...members].sort((a, b) => {
    const teamDiff =
      (teamOrder[a.subTeam] || 99) - (teamOrder[b.subTeam] || 99);
    if (teamDiff !== 0) return teamDiff;
    return (a.sequenceNumber || 0) - (b.sequenceNumber || 0);
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setImagePreview(URL.createObjectURL(file));
      clearErrors("photo");
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      name: "",
      post: "",
      subTeam: "",
      academicYear: "",
      email: "",
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
      email: member.email || "",
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
      if (data.email) {
        submitData.append("email", data.email);
      }

      if (!editingId) {
        const teamMembers = members.filter(
          (m) =>
            m.subTeam === data.subTeam && m.academicYear === data.academicYear
        );
        const maxSeq = teamMembers.reduce(
          (max, m) => Math.max(max, m.sequenceNumber || 0),
          0
        );
        submitData.append("sequenceNumber", maxSeq + 1);
      }

      if (photoFile) {
        submitData.append("photo", photoFile);
      }

      if (editingId) {
        await dispatch(
          updateAdminTeamMember({ id: editingId, formData: submitData })
        ).unwrap();
      } else {
        await dispatch(addAdminTeamMember(submitData)).unwrap();
      }

      setIsModalOpen(false);
    } catch (err) {
      if (err.response?.data?.errors?.length > 0) {
        err.response.data.errors.forEach((e) => {
          if (e.field)
            setError(e.field, { type: "server", message: e.message });
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
      message:
        "Are you sure you want to revoke this user's access? This action is permanent.",
    });

    if (!isConfirmed) return;

    try {
      await dispatch(deleteAdminTeamMember(id)).unwrap();
    } catch {
      // Handled in thunk
    }
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-text min-h-full relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Team Roster</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage personnel and organizational structure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() =>
              dispatch(fetchAdminTeam({ year: filterYear, force: true }))
            }
            disabled={loading}
            className="p-2 bg-card border border-border rounded-lg text-text-muted hover:text-accent hover:border-accent transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center shrink-0"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-5 h-5 ${loading ? "animate-spin text-accent" : ""}`}
            />
          </button>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer w-full"
            >
              {formAcademicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-accent text-[#111111] px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </header>

      {/* Roster Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <AdminTeamCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedMembers.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-sm">
          <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text mb-1">
            No Personnel Records
          </h3>
          <p className="text-text-muted text-sm">
            Click "Add Member" to assign new personnel.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {Object.keys(teamOrder).map((teamName) => {
            const teamMembers = displayedMembers.filter(
              (m) => m.subTeam === teamName
            );
            if (teamMembers.length === 0) return null;

            return (
              <div key={teamName}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-text tracking-tight">
                    {teamName}
                  </h2>
                  <div className="flex-1 h-px bg-card-hover"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {teamMembers.map((member) => (
                    <TeamMemberCard
                      key={member._id}
                      member={member}
                      isAdmin={true}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation/Edit Modal via Portal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-panel/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-2xl relative my-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text p-2 hover:bg-card-hover rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-text border-b border-border-soft pb-4 mb-6">
                {editingId ? "Edit Team Member" : "Add Team Member"}
              </h2>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className={`w-full bg-card border ${errors.name ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border focus:ring-accent/20 focus:border-accent"} text-text rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                      placeholder="Full Name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Role / Post
                    </label>
                    <input
                      type="text"
                      {...register("post", {
                        required: "Post/Role is required",
                      })}
                      placeholder="Position"
                      className={`w-full bg-card border ${errors.post ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border focus:ring-accent/20 focus:border-accent"} text-text rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                    />
                    {errors.post && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.post.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Sub-Team / Department
                    </label>
                    <select
                      {...register("subTeam", {
                        required: "Sub-Team is required",
                      })}
                      className={`w-full bg-card border ${errors.subTeam ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border focus:ring-accent/20 focus:border-accent"} text-text rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                    >
                      <option value="">Select Sub-Team</option>
                      <option value="Admin Team">Admin Team</option>
                      <option value="Core Team">Core Team</option>
                      <option value="Tech Team">Tech Team</option>
                      <option value="Graphic Team">Graphic Team</option>
                    </select>
                    {errors.subTeam && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.subTeam.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Academic Year
                    </label>
                    <select
                      {...register("academicYear", {
                        required: "Academic Year is required",
                      })}
                      className={`w-full bg-card border ${errors.academicYear ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border focus:ring-accent/20 focus:border-accent"} text-text rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                    >
                      <option value="">Select Academic Year</option>
                      {formAcademicYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.academicYear && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.academicYear.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5">
                      Email (Private)
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className={`w-full bg-card border ${errors.email ? "border-danger focus:ring-danger/20 focus:border-danger" : "border-border focus:ring-accent/20 focus:border-accent"} text-text rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                      placeholder="Optional private email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <label
                      className={`flex-1 border-2 border-dashed ${errors.photo ? "border-danger bg-danger/10" : "border-border bg-card-hover hover:bg-accent/10 hover:border-accent"} rounded-xl p-6 text-center cursor-pointer transition-colors group`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register("photo", {
                          required: !editingId
                            ? "Profile photo is required"
                            : false,
                          onChange: handleFileChange,
                        })}
                      />
                      <ImageIcon
                        className={`w-8 h-8 mx-auto mb-2 transition-colors ${errors.photo ? "text-danger" : "text-text-muted group-hover:text-accent"}`}
                      />
                      <span
                        className={`text-sm font-medium ${errors.photo ? "text-danger" : "text-text-muted group-hover:text-accent"}`}
                      >
                        Click to browse or drag image here
                      </span>
                    </label>
                    {imagePreview && (
                      <div className="w-28 h-28 border border-border rounded-xl overflow-hidden shrink-0 bg-card-hover shadow-sm">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {errors.photo && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.photo.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-[#111111] py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50 mt-4 shadow-sm"
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
        </div>,
        document.body
      )}
    </div>
  );
}