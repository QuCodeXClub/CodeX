import { useState } from 'react';
import { Award, Plus, Trash2, Image as ImageIcon, Loader2, Send, Users, User, Mail, Calendar, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function BulkCertificates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    coordinatorName: '',
    signature: null,
  });
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [students, setStudents] = useState([{ name: '', email: '' }]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, signature: file }));
      setSignaturePreview(URL.createObjectURL(file));
    }
  };
  
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const addStudentRow = () => {
    setStudents([...students, { name: '', email: '' }]);
  };

  const removeStudentRow = (index) => {
    if (students.length === 1) return; 
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    const validStudents = students.filter(s => s.name.trim() !== '' && s.email.trim() !== '');
    
    if (validStudents.length === 0) {
      setError('You must provide at least one valid student name and email.');
      setLoading(false);
      return;
    }

    if (!formData.signature) {
      setError('Coordinator signature image is required.');
      setLoading(false);
      return;
    }
    
    try {
      const submitData = new FormData();
      submitData.append('eventName', formData.eventName);
      submitData.append('eventDate', formData.eventDate);
      submitData.append('coordinatorName', formData.coordinatorName);
      submitData.append('studentsStr', JSON.stringify(validStudents));
      submitData.append('signature', formData.signature);
      
      const response = await axios.post('/api/v1/certificates/bulk', submitData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setSuccessMsg(`Successfully generated ${response.data.data.count} certificates and dispatched emails.`);
      setFormData({ eventName: '', eventDate: '', coordinatorName: '', signature: null });
      setSignaturePreview(null);
      setStudents([{ name: '', email: '' }]);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate certificates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full">
            <header className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Credential Forge</h1>
          <p className="text-sm text-slate-500 mt-1">Bulk generate and dispatch event certificates.</p>
        </div>
        <div className="p-3 bg-teal-50 rounded-xl hidden sm:block">
          <Award className="w-8 h-8 text-teal-600" />
        </div>
      </header>
      {error && (
        <div className="mb-8 border border-red-200 bg-red-50 p-4 rounded-xl text-red-700 text-sm font-medium flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-8 border border-teal-200 bg-teal-50 p-4 rounded-xl text-teal-700 text-sm font-medium flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {successMsg}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-500" />
            Event Parameters
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Name</label>
              <input
                type="text"
                name="eventName"
                required
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Event Name"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Event</label>
              <input
                type="date"
                name="eventDate"
                required
                value={formData.eventDate}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Authorizing Coordinator</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="coordinatorName"
                  required
                  value={formData.coordinatorName}
                  onChange={handleInputChange}
                  placeholder="Coordinator Name"
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Digital Signature</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-teal-400 rounded-xl p-6 cursor-pointer transition-colors group">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {signaturePreview ? (
                  <div className="w-full h-20 relative flex items-center justify-center">
                     <img src={signaturePreview} alt="Signature Preview" className="max-h-full max-w-full object-contain" />
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
              TOTAL: {students.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[500px]">
            {students.map((student, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100 transition-colors hover:border-slate-300">
                
                <div className="flex-1 w-full relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Recipient Name"
                    value={student.name}
                    onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 p-2 pl-9 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                  />
                </div>
                <div className="flex-1 w-full relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Recipient Email"
                    value={student.email}
                    onChange={(e) => handleStudentChange(index, 'email', e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 p-2 pl-9 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeStudentRow(index)}
                  disabled={students.length === 1}
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
              onClick={addStudentRow}
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