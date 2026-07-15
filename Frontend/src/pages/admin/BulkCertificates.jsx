import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../context/messageSlice";
import { certificateService } from "../../services/certificateService";

export default function BulkCertificates() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [previousSignatureUrl, setPreviousSignatureUrl] = useState(null);
  const csvInputRef = useRef(null);

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
        setSuccess(response.message || "Certificates generated successfully.")
      );
      reset();
      setSignaturePreview(null);
    } catch (error) {
      dispatch(
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to generate certificates."
        )
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full">
      <header className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Credential Forge</h1>
          <p className="text-sm text-slate-500 mt-1">
            Bulk generate and email certificates.
          </p>
        </div>
        <div className="hidden sm:block p-3 rounded-xl bg-teal-50">
          <Award className="w-8 h-8 text-teal-600" />
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Panel : Event Details */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 h-fit space-y-6">
          <h2 className="flex items-center gap-2 text-lg font-bold border-b border-slate-100 pb-4">
            <Calendar className="w-5 h-5 text-teal-600" />
            Event Details
          </h2>

          {/* Event Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Event Name
            </label>
            <input
              type="text"
              {...register("eventName", { required: "Event name is required" })}
              placeholder="Hackathon 2026"
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.eventName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.eventName.message}
              </p>
            )}
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Event Date
            </label>
            <input
              type="date"
              {...register("eventDate", { required: "Event date is required" })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.eventDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.eventDate.message}
              </p>
            )}
          </div>

          {/* Coordinator */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Coordinator Name
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                {...register("coordinatorName", {
                  required: "Coordinator name is required",
                })}
                placeholder="Dr. Smith"
                className="w-full rounded-lg border border-slate-300 pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            {errors.coordinatorName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.coordinatorName.message}
              </p>
            )}
          </div>

          {/* Signature Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Signature Image
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition">
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
                  <span className="text-xs text-teal-600 font-medium">
                    Click to change signature
                  </span>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">
                    Upload Signature
                  </span>
                </>
              )}
            </label>
            {errors.signatureImage && (
              <p className="mt-1 text-xs text-red-500">
                {errors.signatureImage.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Panel : Student Details */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Users className="w-5 h-5 text-teal-600" />
              Student Details
            </h2>

            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                {fields.length} Student(s)
              </span>

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
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-sm"
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
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl p-4"
              >
                {/* Name */}
                <div className="md:col-span-4 relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Student Name"
                    {...register(`students.${index}.name`, {
                      required: "Name is required",
                    })}
                    className="w-full rounded-lg border border-slate-300 pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.students?.[index]?.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.students[index].name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-4 relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="student@email.com"
                    {...register(`students.${index}.email`, {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full rounded-lg border border-slate-300 pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.students?.[index]?.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.students[index].email.message}
                    </p>
                  )}
                </div>

                {/* Position */}
                <div className="md:col-span-3">
                  <select
                    {...register(`students.${index}.position`, {
                      required: "Position is required",
                    })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Winner">Winner</option>
                    <option value="Runner Up">Runner Up</option>
                    <option value="Participant">Participant</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Organizer">Organizer</option>
                    <option value="Coordinator">Coordinator</option>
                  </select>
                  {errors.students?.[index]?.position && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.students[index].position.message}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <div className="md:col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-slate-400 hover:text-red-600 disabled:opacity-40 mt-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-200 mt-6 pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() =>
                append({ name: "", email: "", position: "Participant" })
              }
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Student
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Certificates...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate & Send Certificates
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
