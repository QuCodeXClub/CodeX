import { useState,useRef } from "react";
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
  Upload, // Added Upload icon
} from "lucide-react";

import { useDispatch } from "react-redux";

import { setError, setSuccess } from "../../context/messageSlice";
import { certificateService } from "../../services/certificateService";

export default function BulkCertificates() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    coordinatorName: "",
    signatureImage: null,
  });

  const [signaturePreview, setSignaturePreview] = useState(null);

  const [students, setStudents] = useState([
    {
      name: "",
      email: "",
      position: "Participant",
    },
  ]);

  // Ref for the hidden CSV file input
  const csvInputRef = useRef(null);

  //-----------------------------------------------------
  // Event Details
  //-----------------------------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //-----------------------------------------------------
  // Signature Upload
  //-----------------------------------------------------

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      signatureImage: file,
    }));

    setSignaturePreview(URL.createObjectURL(file));
  };

  //-----------------------------------------------------
  // CSV Upload (Native JS, No Dependencies)
  //-----------------------------------------------------

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      // Split by newlines, handling both Windows (\r\n) and Unix (\n)
      const rows = text.split(/\r?\n/).filter((row) => row.trim() !== "");

      if (rows.length === 0) return;

      // Basic check if the first row is a header
      let startIndex = 0;
      if (rows[0].toLowerCase().includes("name") || rows[0].toLowerCase().includes("email")) {
        startIndex = 1;
      }

      const parsedStudents = [];

      for (let i = startIndex; i < rows.length; i++) {
        // Regex to split by commas but ignore commas inside double quotes
        const cols = rows[i]
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((col) => col.replace(/^"|"$/g, "").trim()); // Remove quotes and whitespace

        if (cols.length >= 2) {
          parsedStudents.push({
            name: cols[0] || "",
            email: cols[1] || "",
            position: cols[2] || "Participant",
          });
        }
      }

      if (parsedStudents.length > 0) {
        setStudents((prev) => {
          // If the list only has one empty default row, replace it. Otherwise, append.
          if (prev.length === 1 && !prev[0].name && !prev[0].email) {
            return parsedStudents;
          }
          return [...prev, ...parsedStudents];
        });
        dispatch(setSuccess(`${parsedStudents.length} students imported from CSV.`));
      } else {
        dispatch(setError("Could not parse valid students from the CSV."));
      }
    };

    reader.onerror = () => {
      dispatch(setError("Failed to read the CSV file."));
    };

    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again if needed
    e.target.value = null;
  };

  //-----------------------------------------------------
  // Student Handlers
  //-----------------------------------------------------

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const addStudentRow = () => {
    setStudents((prev) => [
      ...prev,
      {
        name: "",
        email: "",
        position: "Participant",
      },
    ]);
  };

  const removeStudentRow = (index) => {
    if (students.length === 1) return;
    setStudents((prev) => prev.filter((_, i) => i !== index));
  };

  //-----------------------------------------------------
  // Reset Form
  //-----------------------------------------------------

  const resetForm = () => {
    setFormData({
      eventName: "",
      eventDate: "",
      coordinatorName: "",
      signatureImage: null,
    });

    setStudents([
      {
        name: "",
        email: "",
        position: "Participant",
      },
    ]);

    setSignaturePreview(null);
  };

  //-----------------------------------------------------
  // Validation
  //-----------------------------------------------------

  const validateForm = () => {
    if (!formData.eventName.trim()) {
      dispatch(setError("Event name is required."));
      return false;
    }

    if (!formData.eventDate) {
      dispatch(setError("Event date is required."));
      return false;
    }

    if (!formData.coordinatorName.trim()) {
      dispatch(setError("Coordinator name is required."));
      return false;
    }

    if (!formData.signatureImage) {
      dispatch(setError("Coordinator signature image is required."));
      return false;
    }

    const validStudents = students.filter(
      (student) =>
        student.name.trim() &&
        student.email.trim() &&
        student.position.trim()
    );

    if (validStudents.length === 0) {
      dispatch(
        setError("Please provide at least one valid student.")
      );
      return false;
    }

    return true;
  };

  //-----------------------------------------------------
  // Submit
  //-----------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const validStudents = students.filter(
        (student) =>
          student.name.trim() &&
          student.email.trim() &&
          student.position.trim()
      );

      const submitData = new FormData();
      submitData.append("eventName", formData.eventName);
      submitData.append("eventDate", formData.eventDate);
      submitData.append("coordinatorName", formData.coordinatorName);
      submitData.append("studentsStr", JSON.stringify(validStudents));
      submitData.append("signatureImage", formData.signatureImage);

      const response = await certificateService.generateBulkCertificates(submitData);

      dispatch(
        setSuccess(
          response.message ||
            "Certificates generated successfully."
        )
      );

      resetForm();
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
          <h1 className="text-2xl font-bold">
            Credential Forge
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bulk generate and email certificates.
          </p>
        </div>
        <div className="hidden sm:block p-3 rounded-xl bg-teal-50">
          <Award className="w-8 h-8 text-teal-600" />
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* ========================================================= */}
        {/* Left Panel : Event Details */}
        {/* ========================================================= */}
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
              name="eventName"
              required
              value={formData.eventName}
              onChange={handleInputChange}
              placeholder="Hackathon 2026"
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Event Date
            </label>
            <input
              type="date"
              name="eventDate"
              required
              value={formData.eventDate}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
                name="coordinatorName"
                required
                value={formData.coordinatorName}
                onChange={handleInputChange}
                placeholder="Dr. Smith"
                className="w-full rounded-lg border border-slate-300 pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.eventName && <p className="mt-1 text-xs text-red-500">{errors.eventName.message}</p>}
            </div>
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
                onChange={handleFileChange}
                className="hidden"
              />
              {signaturePreview ? (
                <img
                  src={signaturePreview}
                  alt="Signature Preview"
                  className="max-h-24 object-contain"
                />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">
                    Upload Signature
                  </span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Right Panel : Student Details */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Users className="w-5 h-5 text-teal-600" />
              Student Details
            </h2>
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                {students.length} Student(s)
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
            {students.map((student, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-4"
              >
                {/* Name */}
                <div className="md:col-span-4 relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={student.name}
                    onChange={(e) =>
                      handleStudentChange(index, "name", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-4 relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="student@email.com"
                    value={student.email}
                    onChange={(e) =>
                      handleStudentChange(index, "email", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 pl-10 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Position */}
                <div className="md:col-span-3">
                  <select
                    value={student.position}
                    onChange={(e) =>
                      handleStudentChange(index, "position", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option>Winner</option>
                    <option>Runner Up</option>
                    <option>Participant</option>
                    <option>Volunteer</option>
                    <option>Organizer</option>
                    <option>Coordinator</option>
                  </select>
                </div>

                {/* Delete */}
                <div className="md:col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeStudentRow(index)}
                    disabled={students.length === 1}
                    className="text-slate-400 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================= */}
          {/* Action Buttons */}
          {/* ========================================================= */}
          <div className="border-t border-slate-200 mt-6 pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={addStudentRow}
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