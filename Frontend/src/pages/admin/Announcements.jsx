import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, Loader2, CheckCircle2, AlertCircle, Filter, Users, GraduationCap } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { generateAcademicYears } from "../../utils/helpers";

export default function Announcements() {
  const formAcademicYears = generateAcademicYears();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [recipientCount, setRecipientCount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      targetAudience: "team",
      subject: "",
      message: "",
      teamAcademicYear: "",
      teamSubTeam: "",
      studentAcademicYear: "",
      studentCourse: "",
      studentStatus: "APPROVED",
    },
  });

  const targetAudience = watch("targetAudience");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setRecipientCount(null);

    try {
      const filters = {};
      if (data.targetAudience === "team") {
        if (data.teamAcademicYear) filters.academicYear = data.teamAcademicYear;
        if (data.teamSubTeam) filters.subTeam = data.teamSubTeam;
      } else if (data.targetAudience === "students") {
        if (data.studentAcademicYear) filters.academicYear = data.studentAcademicYear;
        if (data.studentCourse) filters.course = data.studentCourse;
        if (data.studentStatus) filters.status = data.studentStatus;
      }

      const payload = {
        targetAudience: data.targetAudience,
        subject: data.subject,
        message: data.message,
        filters,
      };

      const response = await axiosInstance.post("/admin/announcement", payload);

      setSuccessMessage(response.data.message || "Announcement sent successfully!");
      if (response.data.data?.recipientCount !== undefined) {
        setRecipientCount(response.data.data.recipientCount);
      }
      reset(); // clear form
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to send announcement. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-text min-h-full relative flex flex-col">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text">Announcements</h1>
          <p className="text-sm text-text-muted mt-1">Target audience and send bulk emails.</p>
        </div>
      </header>

      {/* Toasts */}
      {(successMessage || errorMessage) && (
        <div className="mb-4 shrink-0 flex flex-col gap-2">
          {successMessage && (
            <div className="px-4 py-3 bg-success/10 border border-success/20 rounded-xl flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-success text-sm font-bold">{successMessage} ({recipientCount} recipients)</span>
            </div>
          )}

          {errorMessage && (
            <div className="px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-2 shadow-sm">
              <AlertCircle className="w-5 h-5 text-danger" />
              <span className="text-danger text-sm font-bold">{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">

        {/* Control Bar for Filters */}
        <div className="flex flex-col xl:flex-row gap-4 mb-6 shrink-0">
          <div className="flex flex-wrap items-center gap-3">

            {/* Target Audience Dropdown */}
            <div className="relative">
              {targetAudience === "team" ? (
                <Users className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
              ) : (
                <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
              )}
              <select {...register("targetAudience")} className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                <option value="team">Team Members</option>
                <option value="students">Registered Students</option>
              </select>
              <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
            </div>

            {/* Team Filters */}
            {targetAudience === "team" && (
              <>
                <div className="relative">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("teamSubTeam")} className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                    <option value="">All Teams</option>
                    <option value="Admin Team">Admin Team</option>
                    <option value="Core Team">Core Team</option>
                    <option value="Tech Team">Tech Team</option>
                    <option value="Graphic Team">Graphic Team</option>
                  </select>
                  <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("teamAcademicYear")} className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                    <option value="">All Years</option>
                    {formAcademicYears.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
                </div>
              </>
            )}

            {/* Student Filters */}
            {targetAudience === "students" && (
              <>
                <div className="relative">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("studentCourse")} className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                    <option value="">All Courses</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                  <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("studentAcademicYear")} className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                    <option value="">All Years</option>
                    {formAcademicYears.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("studentStatus")} className="appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                    <option value="APPROVED">Approved Only</option>
                    <option value="PENDING">Pending Only</option>
                    <option value="REJECTED">Rejected Only</option>
                    <option value="">All Statuses</option>
                  </select>
                  <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Composer Section */}
        <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-6 border-b border-border-soft flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-text">Compose Message</h2>
            <span className="text-xs bg-bg border border-border-soft px-3 py-1.5 rounded-md text-text-muted font-medium">HTML Supported</span>
          </div>

          <div className="p-6 flex flex-col flex-1 gap-6 min-h-0">
            <div>
              <label className="block text-sm font-semibold text-text mb-1.5">Subject</label>
              <input
                type="text"
                {...register("subject", { required: "Subject is required" })}
                placeholder="Important Announcement"
                className={`w-full bg-card text-text rounded-lg border ${errors.subject ? "border-danger focus:ring-danger" : "border-border focus:ring-accent"} p-2.5 text-sm focus:outline-none focus:ring-2`}
              />
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <label className="block text-sm font-semibold text-text mb-1.5">Message Body</label>
              <textarea
                {...register("message", { required: "Message is required" })}
                placeholder="Write your HTML message here..."
                className={`w-full flex-1 bg-card text-text rounded-lg border ${errors.message ? "border-danger focus:ring-danger" : "border-border focus:ring-accent"} p-2.5 text-sm focus:outline-none focus:ring-2 resize-none font-mono leading-relaxed`}
              ></textarea>
            </div>
          </div>

          <div className="p-6 border-t border-border-soft bg-card-hover/30 shrink-0 flex justify-end rounded-b-2xl">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-accent text-[#111111] px-8 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Dispatch Email
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
