import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Send, Loader2, CheckCircle2, AlertCircle, Filter, Users, GraduationCap, History, Mail, X, Trash2, Eye, Megaphone } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { generateAcademicYears } from "../../utils/helpers";
import AnnouncementsHistoryModal from "./components/AnnouncementsHistoryModal";

export default function Announcements() {
  const navigate = useNavigate();
  const formAcademicYears = generateAcademicYears();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [recipientCount, setRecipientCount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [emailChips, setEmailChips] = useState([]);
  const [emailInputValue, setEmailInputValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    setValue,
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
      customEmails: "",
    },
  });

  const targetAudience = watch("targetAudience");

  const addEmailChip = (value) => {
    const newEmails = value.split(/[\s,]+/).filter(e => e.trim());
    if (newEmails.length > 0) {
      const updatedChips = [...new Set([...emailChips, ...newEmails])];
      setEmailChips(updatedChips);
      setValue("customEmails", updatedChips.join(", "), { shouldValidate: true });
    }
    setEmailInputValue("");
  };

  const removeEmailChip = (indexToRemove) => {
    const updatedChips = emailChips.filter((_, index) => index !== indexToRemove);
    setEmailChips(updatedChips);
    setValue("customEmails", updatedChips.join(", "), { shouldValidate: true });
  };

  const handleEmailInputKeyDown = (e) => {
    if (e.key === "," || e.key === " ") {
      e.preventDefault();
      addEmailChip(emailInputValue);
    } else if (e.key === "Enter") {
      if (emailInputValue.trim()) {
        e.preventDefault();
        addEmailChip(emailInputValue);
      }
    } else if (e.key === "Backspace" && !emailInputValue && emailChips.length > 0) {
      const newChips = [...emailChips];
      newChips.pop();
      setEmailChips(newChips);
      setValue("customEmails", newChips.join(", "), { shouldValidate: true });
    }
  };

  const handleEmailInputChange = (e) => {
    const val = e.target.value;
    if (val.includes(",") || val.includes(" ")) {
      addEmailChip(val);
    } else {
      setEmailInputValue(val);
    }
  };

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
      } else if (data.targetAudience === "custom") {
        if (data.customEmails) filters.customEmails = data.customEmails;
      }

      const payload = {
        targetAudience: data.targetAudience,
        subject: data.subject,
        message: data.message,
        filters,
      };

      const response = await axiosInstance.post("/admin/announcement", payload);
      const resData = response?.data || response;

      setSuccessMessage(resData?.message || "Announcement sent successfully!");
      if (resData?.data?.recipientCount !== undefined || resData?.recipientCount !== undefined) {
        setRecipientCount(resData?.data?.recipientCount ?? resData?.recipientCount);
      }
      reset(); // clear form
      setEmailChips([]);
      setEmailInputValue("");
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
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full relative flex flex-col">

      {/* Header */}
      <header className="flex flex-col items-start md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-border/60 pb-6 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <Send className="w-3.5 h-3.5" />
            <span>BULK MESSAGING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-text uppercase tracking-tight">
            ANNOUNCEMENT <span className="text-accent">CENTER</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">Target specific demographics and dispatch bulk email announcements.</p>
        </div>
        <button
          onClick={() => navigate("/admin/history?tab=announcements")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold hover:bg-indigo-500/20 transition-all shadow-md cursor-pointer whitespace-normal sm:whitespace-nowrap text-center leading-tight"
        >
          <History className="w-4 h-4 shrink-0" />
          <span>Sent Announcements History</span>
        </button>
      </header>

      {/* Toasts */}
      {(successMessage || errorMessage) && (
        <div className="mb-4 shrink-0 flex flex-col gap-2">
          {successMessage && (
            <div className="px-4 py-3 bg-success/10 border border-success/20 rounded-xl flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              <span className="text-success text-sm font-bold">
                {successMessage}
                {recipientCount !== null && ` (${recipientCount} recipients)`}
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-2 shadow-sm">
              <AlertCircle className="w-5 h-5 text-danger shrink-0" />
              <span className="text-danger text-sm font-bold">{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">

        {/* Control Bar for Filters */}
        <div className="flex flex-col xl:flex-row gap-4 mb-6 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-3 w-full">

            {/* Target Audience Dropdown */}
            <div className="relative w-full lg:w-auto">
              {targetAudience === "team" ? (
                <Users className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
              ) : targetAudience === "students" ? (
                <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
              ) : (
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
              )}
              <select {...register("targetAudience")} className="w-full lg:w-auto appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                <option value="team">Team Members</option>
                <option value="students">Registered Students</option>
                <option value="custom">Custom Emails</option>
              </select>
              <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
            </div>

            {/* Team Filters */}
            {targetAudience === "team" && (
              <>
                <div className="relative w-full lg:w-auto">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("teamSubTeam")} className="w-full lg:w-auto appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                    <option value="">All Teams</option>
                    <option value="Admin Team">Admin Team</option>
                    <option value="Core Team">Core Team</option>
                    <option value="Tech Team">Tech Team</option>
                    <option value="Graphic Team">Graphic Team</option>
                  </select>
                  <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
                </div>
                <div className="relative w-full lg:w-auto">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("teamAcademicYear")} className="w-full lg:w-auto appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
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
                <div className="relative w-full lg:w-auto">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("studentCourse")} className="w-full lg:w-auto appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                    <option value="">All Courses</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                  <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
                </div>
                <div className="relative w-full lg:w-auto">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("studentAcademicYear")} className="w-full lg:w-auto appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                    <option value="">All Years</option>
                    {formAcademicYears.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
                </div>
                <div className="relative w-full lg:w-auto">
                  <Filter className="absolute left-3 top-2.5 w-4 h-4 text-accent pointer-events-none" />
                  <select {...register("studentStatus")} className="w-full lg:w-auto appearance-none bg-card border border-border text-text rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border transition-colors shadow-sm cursor-pointer">
                    <option value="APPROVED">Approved Only</option>
                    <option value="PENDING">Pending Only</option>
                    <option value="REJECTED">Rejected Only</option>
                    <option value="">All Statuses</option>
                  </select>
                  <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-text-muted pointer-events-none"></div>
                </div>
              </>
            )}

            {/* Custom Emails */}
            {targetAudience === "custom" && (
              <div className="relative w-full sm:col-span-2 lg:col-span-1 lg:flex-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-accent pointer-events-none z-10" />
                <div 
                  className={`w-full bg-card border ${errors.customEmails ? "border-danger focus-within:ring-danger" : "border-border focus-within:ring-accent"} text-text rounded-lg py-1.5 pl-9 pr-10 text-sm font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-accent/20 hover:border-border transition-colors shadow-sm min-h-[42px] flex flex-wrap gap-1.5 items-center cursor-text relative`}
                  onClick={() => document.getElementById('email-chip-input')?.focus()}
                >
                  {emailChips.map((email, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent text-xs">
                      {email}
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeEmailChip(index); }} className="hover:bg-accent/20 rounded-full p-0.5 transition-colors cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    id="email-chip-input"
                    type="text"
                    value={emailInputValue}
                    onChange={handleEmailInputChange}
                    onKeyDown={handleEmailInputKeyDown}
                    onBlur={(e) => addEmailChip(e.target.value)}
                    placeholder={emailChips.length === 0 ? "admin@example.com, user@domain.com..." : ""}
                    className="flex-1 min-w-[150px] bg-transparent outline-none text-sm text-text placeholder:text-text-muted/50 p-1 m-0 border-none ring-0 focus:ring-0"
                  />
                  {/* Hidden input for react-hook-form validation */}
                  <input
                    type="hidden"
                    {...register("customEmails", { required: targetAudience === "custom" ? "Emails are required" : false })}
                  />

                  {emailChips.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmailChips([]);
                        setEmailInputValue("");
                        setValue("customEmails", "", { shouldValidate: true });
                        document.getElementById('email-chip-input')?.focus();
                      }}
                      className="absolute right-1.5 top-1.5 p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors z-10 cursor-pointer"
                      title="Clear all emails"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {errors.customEmails && <span className="text-danger text-xs mt-1 block">{errors.customEmails.message}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Composer Section */}
        <div className="flex-1 flex flex-col min-h-0 bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl shadow-lg">
          <div className="p-4 sm:p-6 border-b border-border-soft flex items-center justify-between shrink-0 gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-text">Compose Message</h2>
            <span className="text-xs bg-bg border border-border-soft px-3 py-1.5 rounded-md text-text-muted font-medium shrink-0">HTML Supported</span>
          </div>

          <div className="p-4 sm:p-6 flex flex-col flex-1 gap-4 sm:gap-6 min-h-0">
            <div className="group/field relative">
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <label className="block text-sm font-semibold text-text">
                  Subject <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity shrink-0">
                  String
                </span>
              </div>
              <input
                type="text"
                title="Subject — Type: String (Mandatory)"
                {...register("subject", { required: "Subject is required" })}
                placeholder="Important Announcement"
                className={`w-full bg-card text-text rounded-lg border ${errors.subject ? "border-danger focus:ring-danger" : "border-border focus:ring-accent"} p-2.5 text-sm focus:outline-none focus:ring-2`}
              />
            </div>

            <div className="flex-1 flex flex-col min-h-0 group/field relative">
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <label className="block text-sm font-semibold text-text">
                  Message Body <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity shrink-0">
                  String (HTML)
                </span>
              </div>
              <textarea
                {...register("message", { required: "Message is required" })}
                title="Message Body — Type: String (HTML Content, Mandatory)"
                placeholder="Write your HTML message here..."
                className={`w-full flex-1 min-h-[200px] sm:min-h-[260px] bg-card text-text rounded-lg border ${errors.message ? "border-danger focus:ring-danger" : "border-border focus:ring-accent"} p-3 text-sm focus:outline-none focus:ring-2 resize-none font-mono leading-relaxed`}
              ></textarea>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-border-soft bg-card-hover/30 shrink-0 flex flex-col sm:flex-row justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:bg-indigo-500/20 active:scale-95 shadow-sm cursor-pointer"
            >
              <Eye className="w-4 h-4 shrink-0" />
              Preview Email
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent text-[#111111] px-8 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-sm cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 shrink-0" />
                  Dispatch Email
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* History Modal Popup */}
      {showHistoryModal && (
        <AnnouncementsHistoryModal onClose={() => setShowHistoryModal(false)} />
      )}

      {/* Message Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-card border border-indigo-500/30 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-indigo-400 shrink-0" />
                <h3 className="font-bold text-text text-sm truncate">
                  {getValues("subject") || "No Subject"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-card-hover cursor-pointer"
              >
                <X className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto text-xs text-text p-4 rounded-xl bg-card-hover border border-border/60 font-sans break-words"
              dangerouslySetInnerHTML={{
                __html: getValues("message") || "No message content yet...",
              }}
            />

            <div className="flex items-center justify-end border-t border-border/60 pt-3 text-xs font-mono text-text-muted">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-mono font-bold text-text hover:bg-card-hover cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
