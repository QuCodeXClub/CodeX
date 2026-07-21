import { useState, useRef } from "react";
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
  Calendar,
  Info,
  Hash,
  Wifi,
  KeyRound,
  Upload,
  Download,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../context/messageSlice";
import { boardingPassService } from "../../services/boardingPassService";

export default function BulkBoardingPasses() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const csvInputRef = useRef(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventName: "",
      eventDescription: "",
      qid: "",
      students: [{ name: "", email: "", loginUser: "", loginPass: "", wifiUser: "", wifiPass: "", citeNumber: "" }],
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

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split(/\r?\n/).filter((row) => row.trim() !== "");

      if (rows.length === 0) return;

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
            loginUser: cols[2] || "",
            loginPass: cols[3] || "",
            wifiUser: cols[4] || "",
            wifiPass: cols[5] || "",
            citeNumber: cols[6] || "",
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
          setSuccess(`${parsedStudents.length} students imported from CSV.`)
        );
      } else {
        dispatch(setError("Could not parse valid students from the CSV."));
      }
    };

    reader.onerror = () => {
      dispatch(setError("Failed to read the CSV file."));
    };

    reader.readAsText(file);
    e.target.value = null;
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Email,LoginID,LoginPassword,WiFiID,WiFiPassword,CiteNumber\n";
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
          student.name.trim() && student.email.trim()
      );

      if (validStudents.length === 0) {
        dispatch(setError("Please provide at least one valid student."));
        setLoading(false);
        return;
      }

      const submitData = {
        eventName: data.eventName,
        eventDescription: data.eventDescription,
        qid: data.qid,
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
    <div className="p-8 lg:p-10 font-sans text-text min-h-full">
      <header className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Boarding Pass Forge</h1>
          <p className="text-sm text-text-muted mt-1">
            Bulk generate and email boarding passes.
          </p>
        </div>
        <div className="hidden sm:block p-3 rounded-xl bg-accent/10">
          <Ticket className="w-8 h-8 text-accent" />
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Top Section : Event Details */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-lg font-bold border-b border-border-soft pb-4 mb-6">
            <Calendar className="w-5 h-5 text-accent" />
            Event Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Event Name
              </label>
              <input
                type="text"
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

            {/* QID */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                QID
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  {...register("qid", { required: "QID is required" })}
                  placeholder="e.g. QID-12345"
                  className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              {errors.qid && (
                <p className="mt-1 text-xs text-danger">
                  {errors.qid.message}
                </p>
              )}
            </div>

            {/* Event Description */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-text mb-2">
                Event Description
              </label>
              <div className="relative">
                <Info className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                <textarea
                  {...register("eventDescription", { required: "Description is required" })}
                  placeholder="Join us for the ultimate coding showdown..."
                  rows="2"
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
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-soft pb-4 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Users className="w-5 h-5 text-accent" />
                Attendee Details
              </h2>
              <span className="text-xs font-semibold bg-accent/10 text-accent px-3 py-1 rounded-full">
                {fields.length} Attendee(s)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* CSV Download Template */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-border bg-card hover:bg-card-hover text-text font-medium transition-colors shadow-sm"
                title="Download CSV Template"
              >
                <Download className="w-4 h-4" />
                Template
              </button>

              {/* CSV Upload Button */}
              <input
                type="file"
                accept=".csv"
                ref={csvInputRef}
                onChange={handleCsvUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => csvInputRef.current.click()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-border bg-card hover:bg-card-hover text-text font-medium transition-colors shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-card-hover border border-border rounded-xl p-5"
              >
                {/* Row 1: Core Info */}
                <div className="md:col-span-4 relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Attendee Name"
                    {...register(`students.${index}.name`, {
                      required: "Name is required",
                    })}
                    className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  {errors.students?.[index]?.name && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.students[index].name.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-4 relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    placeholder="attendee@email.com"
                    {...register(`students.${index}.email`, {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  {errors.students?.[index]?.email && (
                    <p className="mt-1 text-xs text-danger">
                      {errors.students[index].email.message}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-3 relative">
                  <Hash className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Desk Number (Opt)"
                    {...register(`students.${index}.citeNumber`)}
                    className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="md:col-span-1 flex justify-end md:justify-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-text-muted hover:text-danger disabled:opacity-40 p-2 md:p-0 md:mt-2 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Row 2: Optional Credentials */}
                <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 pt-4 border-t border-border-soft">
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Login ID (Opt)"
                      {...register(`students.${index}.loginUser`)}
                      className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Login Pass (Opt)"
                      {...register(`students.${index}.loginPass`)}
                      className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="relative">
                    <Wifi className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="WiFi ID (Opt)"
                      {...register(`students.${index}.wifiUser`)}
                      className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      placeholder="WiFi Pass (Opt)"
                      {...register(`students.${index}.wifiPass`)}
                      className="w-full bg-card text-text rounded-lg border border-border pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
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
                append({ name: "", email: "", loginUser: "", loginPass: "", wifiUser: "", wifiPass: "", citeNumber: "" })
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
    </div>
  );
}