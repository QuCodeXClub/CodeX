import { useState } from "react";
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
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../../context/messageSlice";

export default function BulkCertificates() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [signaturePreview, setSignaturePreview] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    defaultValues: {
      eventName: "",
      eventDate: "",
      coordinatorName: "",
      students: [{ name: "", email: "" }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "students",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignatureFile(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = async (data) => {
    setLoading(true);

    if (!signatureFile) {
      dispatch(setError("Coordinator signature image is required."));
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("eventName", data.eventName);
      submitData.append("eventDate", data.eventDate);
      submitData.append("coordinatorName", data.coordinatorName);
      submitData.append("studentsStr", JSON.stringify(data.students));
      submitData.append("signature", signatureFile);

      const response = await axiosInstance.post(
        "/certificates/bulk",
        submitData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      reset({
        eventName: "",
        eventDate: "",
        coordinatorName: "",
        students: [{ name: "", email: "" }]
      });
      setSignatureFile(null);
      setSignaturePreview(null);
    } catch (err) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full">
      <header className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Credential Forge
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bulk generate and dispatch event certificates.
          </p>
        </div>
        <div className="p-3 bg-teal-50 rounded-xl hidden sm:block">
          <Award className="w-8 h-8 text-teal-600" />
        </div>
      </header>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-4 space-y-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-500" />
            Event Parameters
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Event Name
              </label>
              <input
                type="text"
                {...register("eventName", { required: "Event name is required" })}
                placeholder="Event Name"
                className={`w-full bg-white border ${errors.eventName ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
              />
              {errors.eventName && <p className="mt-1 text-xs text-red-500">{errors.eventName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Date of Event
              </label>
              <input
                type="date"
                {...register("eventDate", { required: "Date is required" })}
                className={`w-full bg-white border ${errors.eventDate ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
              />
              {errors.eventDate && <p className="mt-1 text-xs text-red-500">{errors.eventDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Authorizing Coordinator
              </label>
              <div className="relative">
                <UserCheck className={`absolute left-3 top-2.5 w-4 h-4 ${errors.coordinatorName ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  {...register("coordinatorName", { required: "Coordinator name is required" })}
                  placeholder="Coordinator Name"
                  className={`w-full bg-white border ${errors.coordinatorName ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-2 transition-colors shadow-sm`}
                />
              </div>
              {errors.coordinatorName && <p className="mt-1 text-xs text-red-500">{errors.coordinatorName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Digital Signature
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-teal-400 rounded-xl p-6 cursor-pointer transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {signaturePreview ? (
                  <div className="w-full h-20 relative flex items-center justify-center">
                    <img
                      src={signaturePreview}
                      alt="Signature Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-slate-400 mb-2 group-hover:text-teal-500 transition-colors" />
                    <span className="text-sm font-medium text-slate-500 group-hover:text-teal-600 text-center">
                      Upload Signature Image
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col h-fit">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-500" />
              Recipient Details
            </h2>
            <span className="bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
              TOTAL: {fields.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[500px]">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col md:flex-row gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100 transition-colors hover:border-slate-300"
              >
                <div className="flex-1 w-full relative">
                  <User className={`absolute left-3 top-2.5 w-4 h-4 ${errors?.students?.[index]?.name ? 'text-red-400' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    {...register(`students.${index}.name`, { required: "Required" })}
                    className={`w-full bg-white border ${errors?.students?.[index]?.name ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 p-2 pl-9 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors`}
                  />
                </div>
                <div className="flex-1 w-full relative">
                  <Mail className={`absolute left-3 top-2.5 w-4 h-4 ${errors?.students?.[index]?.email ? 'text-red-400' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    placeholder="Recipient Email"
                    {...register(`students.${index}.email`, { required: "Required", pattern: /^\S+@\S+$/i })}
                    className={`w-full bg-white border ${errors?.students?.[index]?.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300 focus:ring-teal-500/20 focus:border-teal-500'} text-slate-900 p-2 pl-9 rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="w-full md:w-auto p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex justify-center border border-transparent hover:border-red-100"
                  title="Remove Recipient"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 mt-6 pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => append({ name: "", email: "" })}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 border border-slate-200 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Certificates.....
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generate & Dispatch
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
