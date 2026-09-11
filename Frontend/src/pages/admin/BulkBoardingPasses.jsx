import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Ticket,
  Plus,
  Trash2,
  Loader2,
  Send,
  Users,
  User,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Info,
  Hash,
  Wifi,
  KeyRound,
  Upload,
  Download,
  History,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../context/messageSlice";
import { boardingPassService } from "../../services/boardingPassService";
import IssuedBoardingPassesModal from "./components/IssuedBoardingPassesModal";

export default function BulkBoardingPasses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isImportingCsv, setIsImportingCsv] = useState(false);
  const [importStatus, setImportStatus] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const csvInputRef = useRef(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventName: "",
      eventDescription: "",
      venue: "",
      time: "",
      students: [{ name: "", email: "", qid: "", teamName: "", time: "", venue: "", loginUser: "", loginPass: "", wifiUser: "", wifiPass: "", deskNumber: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "students",
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
          let headerMap = {
            name: -1,
            email: -1,
            qid: -1,
            teamName: -1,
            time: -1,
            venue: -1,
            loginUser: -1,
            loginPass: -1,
            wifiUser: -1,
            wifiPass: -1,
            deskNumber: -1,
          };

          const firstRowCols = rows[0]
            .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            .map((col) => col.replace(/^"|"$/g, "").trim().toLowerCase());

          if (
            firstRowCols.some(c => c.includes("name") || c.includes("email") || c.includes("qid") || c.includes("team") || c.includes("desk") || c.includes("venue"))
          ) {
            startIndex = 1;
            firstRowCols.forEach((col, idx) => {
              if (col === "name" || col.includes("student name")) headerMap.name = idx;
              else if (col === "email" || col.includes("student email")) headerMap.email = idx;
              else if (col === "qid" || col.includes("q_id") || col.includes("q id") || col === "id") headerMap.qid = idx;
              else if (col === "team" || col.includes("team name") || col.includes("teamname") || col.includes("team_name") || col === "group" || col.includes("group name")) headerMap.teamName = idx;
              else if (col.includes("time") || col.includes("slot")) headerMap.time = idx;
              else if (col.includes("venue") || col.includes("location") || col.includes("place") || col.includes("hall") || col.includes("auditorium") || col.includes("lab")) headerMap.venue = idx;
              else if (col.includes("loginid") || col.includes("login_id") || col.includes("loginuser")) headerMap.loginUser = idx;
              else if (col.includes("loginpass") || col.includes("login_pass")) headerMap.loginPass = idx;
              else if (col.includes("wifiid") || col.includes("wifi_id") || col.includes("wifiuser")) headerMap.wifiUser = idx;
              else if (col.includes("wifipass") || col.includes("wifi_pass")) headerMap.wifiPass = idx;
              else if (col.includes("desknumber") || col.includes("desk") || col.includes("seat")) headerMap.deskNumber = idx;
            });
          }

          const parsedStudents = [];

          for (let i = startIndex; i < rows.length; i++) {
            const cols = rows[i]
              .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
              .map((col) => col.replace(/^"|"$/g, "").trim());

            if (cols.length >= 2) {
              const name = headerMap.name !== -1 ? cols[headerMap.name] : cols[0];
              const email = headerMap.email !== -1 ? cols[headerMap.email] : cols[1];
              const qid = headerMap.qid !== -1 ? cols[headerMap.qid] : (headerMap.name === -1 && cols.length > 2 ? cols[2] : "");
              const teamName = headerMap.teamName !== -1 ? cols[headerMap.teamName] : "";
              const time = headerMap.time !== -1 ? cols[headerMap.time] : "";
              const venue = headerMap.venue !== -1 ? cols[headerMap.venue] : "";

              let loginUser = headerMap.loginUser !== -1 ? cols[headerMap.loginUser] : (headerMap.name === -1 ? cols[3] : "");
              let loginPass = headerMap.loginPass !== -1 ? cols[headerMap.loginPass] : (headerMap.name === -1 ? cols[4] : "");
              let wifiUser = headerMap.wifiUser !== -1 ? cols[headerMap.wifiUser] : (headerMap.name === -1 ? cols[5] : "");
              let wifiPass = headerMap.wifiPass !== -1 ? cols[headerMap.wifiPass] : (headerMap.name === -1 ? cols[6] : "");
              let deskNumber = headerMap.deskNumber !== -1 ? cols[headerMap.deskNumber] : (headerMap.name === -1 ? cols[7] : "");

              if (name || email) {
                parsedStudents.push({
                  name: name || "",
                  email: email || "",
                  qid: qid || "",
                  teamName: teamName || "",
                  time: time || "",
                  venue: venue || "",
                  loginUser: loginUser || "",
                  loginPass: loginPass || "",
                  wifiUser: wifiUser || "",
                  wifiPass: wifiPass || "",
                  deskNumber: deskNumber || "",
                });
              }
            }
          }

          if (parsedStudents.length > 0) {
            if (fields.length === 1 && !fields[0].name && !fields[0].email) {
              replace(parsedStudents);
            } else {
              append(parsedStudents);
            }
            dispatch(
              setSuccess(`Successfully imported ${parsedStudents.length} attendee(s) from CSV.`)
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
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,QID,TeamName,Time,Venue,LoginID,LoginPassword,WiFiID,WiFiPassword,DeskNumber\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "boarding_pass_template.csv");
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
          student.name?.trim() && student.email?.trim() && student.qid?.trim()
      );

      if (validStudents.length === 0) {
        dispatch(setError("Please provide at least one valid student with Name, Email, and QID."));
        setLoading(false);
        return;
      }

      const submitData = {
        eventName: data.eventName,
        eventDescription: data.eventDescription,
        venue: data.venue,
        time: data.time,
        studentsStr: JSON.stringify(validStudents)
      };

      const response = await boardingPassService.generateBulkBoardingPasses(submitData);

      dispatch(
        setSuccess(response.message || "Boarding Passes generated successfully.")
      );
      reset();
    } catch (error) {
      dispatch(
        setError(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to generate boarding passes."
        )
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <Ticket className="w-3.5 h-3.5" />
            <span>ACCESS CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-text uppercase tracking-tight">
            BOARDING PASS <span className="text-accent">FORGE</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Bulk generate, verify, and email event access boarding passes.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate("/admin/history?tab=boarding-passes")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold hover:bg-cyan-500/20 transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            <History className="w-4 h-4" />
            <span>Issued Boarding Passes History</span>
          </button>
          <div className="hidden sm:block p-3 rounded-2xl bg-accent/10 border border-accent/30 shadow-md shrink-0">
            <Ticket className="w-7 h-7 text-accent" />
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Top Section : Event Details */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="flex items-center gap-2 text-base sm:text-lg font-display font-bold uppercase text-text border-b border-border/60 pb-4 mb-6">
            <Calendar className="w-5 h-5 text-accent" />
            Event Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
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
                placeholder="CodeX 2026"
                className="w-full bg-card text-text rounded-lg border border-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {errors.eventName && (
                <p className="mt-1 text-xs text-danger">
                  {errors.eventName.message}
                </p>
              )}
            </div>

            {/* Event Venue */}
            <div className="group/field">
              <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                <span>Event Venue</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-text-muted font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String
                </span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  title="Event Venue — Type: String (Optional)"
                  {...register("venue")}
                  placeholder="e.g. Audi 2 / Lab 4 / Online"
                  className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Event Time */}
            <div className="group/field">
              <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                <span>Event Time</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-border text-text-muted font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String (HH:MM)
                </span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  title="Event Time — Format: String (e.g. 10:00 AM - 01:00 PM, Optional)"
                  {...register("time")}
                  placeholder="e.g. 10:00 AM - 01:00 PM"
                  className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Event Description */}
            <div className="group/field">
              <label className="flex items-center justify-between text-xs font-mono font-bold uppercase text-text mb-2 tracking-wider">
                <span>
                  Event Description <span className="text-red-500 font-bold ml-0.5" title="Mandatory Field">*</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                  String (Text)
                </span>
              </label>
              <div className="relative">
                <Info className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <textarea
                  title="Event Description — Type: String (Mandatory)"
                  {...register("eventDescription", { required: "Description is required" })}
                  placeholder="Join us for the ultimate coding showdown..."
                  rows="1"
                  className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                ></textarea>
              </div>
              {errors.eventDescription && (
                <p className="mt-1 text-xs text-danger">
                  {errors.eventDescription.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section : Student Details */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 mb-6 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold">
                <Users className="w-5 h-5 text-accent" />
                Attendee Details
              </h2>
              <span className="text-xs font-semibold bg-accent/10 text-accent px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap">
                {fields.length} Attendee(s)
              </span>
              <span className="text-[11px] font-mono text-text-muted hidden md:inline-flex items-center gap-1.5 ml-2">
                <span className="text-red-500 font-bold">*</span> Mandatory fields | Hover over fields to view data types (String / Number)
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              {/* CSV Download Template */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-border bg-card hover:bg-card-hover text-text font-medium transition-colors shadow-sm whitespace-nowrap"
                title="Download CSV Template"
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
              <span>{importStatus || "Importing attendee records from CSV..."}</span>
            </div>
          )}

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-card-hover border border-border rounded-xl p-4 sm:p-5"
              >
                {/* Row 1: Core Info */}
                {/* Name */}
                <div className="md:col-span-3 group/field">
                  <label className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-text mb-1">
                    <span>
                      Name <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="text"
                      title="Attendee Name — Type: String (Mandatory)"
                      placeholder="Attendee Name *"
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
                <div className="md:col-span-3 group/field">
                  <label className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-text mb-1">
                    <span>
                      Email <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="email"
                      title="Attendee Email — Type: String (Mandatory)"
                      placeholder="attendee@email.com *"
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

                {/* QID */}
                <div className="md:col-span-2 group/field">
                  <label className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-text mb-1">
                    <span>
                      QID <span className="text-red-500 font-bold ml-0.5" title="Mandatory">*</span>
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="text"
                      title="Student QID — Type: String (Mandatory)"
                      placeholder="QID (e.g. 24001) *"
                      {...register(`students.${index}.qid`, {
                        required: "QID is required",
                      })}
                      className="w-full bg-card text-text rounded-lg border border-border pl-9 p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                    />
                  </div>
                  {errors.students?.[index]?.qid && (
                    <p className="mt-1 text-[11px] text-danger">
                      {errors.students[index].qid.message}
                    </p>
                  )}
                </div>

                {/* Team Name */}
                <div className="md:col-span-2 group/field">
                  <label className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase text-text-muted mb-1">
                    <span>Team</span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                    <input
                      type="text"
                      title="Team Name — Type: String (Optional)"
                      placeholder="Team Name (Opt)"
                      {...register(`students.${index}.teamName`)}
                      className="w-full bg-card text-text rounded-lg border border-border pl-9 p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="md:col-span-1 group/field">
                  <label className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase text-text-muted mb-1">
                    <span>Time</span>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                      String
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      title="Time Slot — Type: String (Optional)"
                      placeholder="Time"
                      {...register(`students.${index}.time`)}
                      className="w-full bg-card text-text rounded-lg border border-border p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* Desk Number & Delete Action */}
                <div className="md:col-span-1 flex items-end gap-1.5">
                  <div className="flex-1 group/field">
                    <label className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase text-text-muted mb-1">
                      <span>Desk</span>
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                        String
                      </span>
                    </label>
                    <input
                      type="text"
                      title="Desk Number — Type: String (Optional)"
                      placeholder="Desk"
                      {...register(`students.${index}.deskNumber`)}
                      className="w-full bg-card text-text rounded-lg border border-border p-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    title="Remove Attendee"
                    className="text-text-muted hover:text-danger disabled:opacity-40 p-2 mb-0.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Row 2: Optional Credentials */}
                <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-1 pt-3 border-t border-border/50">
                  <div className="group/field">
                    <label className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase text-text-muted mb-1">
                      <span>Login ID</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                        String
                      </span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                      <input
                        type="text"
                        title="Login ID — Type: String (Optional)"
                        placeholder="Login ID (Optional)"
                        {...register(`students.${index}.loginUser`)}
                        className="w-full bg-card text-text rounded-lg border border-border pl-9 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase text-text-muted mb-1">
                      <span>Login Password</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                        String
                      </span>
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                      <input
                        type="text"
                        title="Login Password — Type: String (Optional)"
                        placeholder="Login Password (Optional)"
                        {...register(`students.${index}.loginPass`)}
                        className="w-full bg-card text-text rounded-lg border border-border pl-9 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase text-text-muted mb-1">
                      <span>WiFi ID</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                        String
                      </span>
                    </label>
                    <div className="relative">
                      <Wifi className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                      <input
                        type="text"
                        title="WiFi ID — Type: String (Optional)"
                        placeholder="WiFi ID (Optional)"
                        {...register(`students.${index}.wifiUser`)}
                        className="w-full bg-card text-text rounded-lg border border-border pl-9 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="group/field">
                    <label className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase text-text-muted mb-1">
                      <span>WiFi Password</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-card border border-border text-text-muted opacity-0 group-hover/field:opacity-100 transition-opacity">
                        String
                      </span>
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 w-3.5 h-3.5 text-text-muted" />
                      <input
                        type="text"
                        title="WiFi Password — Type: String (Optional)"
                        placeholder="WiFi Password (Optional)"
                        {...register(`students.${index}.wifiPass`)}
                        className="w-full bg-card text-text rounded-lg border border-border pl-9 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-border mt-6 pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() =>
                append({ name: "", email: "", qid: "", teamName: "", time: "", loginUser: "", loginPass: "", wifiUser: "", wifiPass: "", deskNumber: "" })
              }
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-text hover:bg-card-hover transition-all font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Attendee
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-[#111111] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed font-bold shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Boarding Passes...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate & Send Passes
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* History Modal Popup */}
      {showHistoryModal && (
        <IssuedBoardingPassesModal onClose={() => setShowHistoryModal(false)} />
      )}
    </div>
  );
}