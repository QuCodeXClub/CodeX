import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { registrationService } from '../services/registrationService'; 

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [turnstileToken, setTurnstileToken] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    email: '',
    phone: '',
    course: '',
    year: '',
    semester: '',
    section: '',
    set: '',
    studentId: '',
    transactionId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!turnstileToken) {
      setError("Please complete the security check.");
      setLoading(false);
      return;
    }

    try {
              const payload = {
        ...formData,
        turnstileToken
      };

      await registrationService.registerStudent(payload);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit registration.');
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#Faf9f6] flex flex-col items-center justify-center font-jetbrains p-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="bg-white border-4 border-gray-800 p-12 max-w-lg w-full text-center relative z-10 shadow-[12px_12px_0px_rgba(46,197,212,0.2)]">
          <CheckCircle className="w-20 h-20 text-[#2ec5d4] mx-auto mb-6" />
          <h2 className="font-oswald text-4xl font-bold uppercase text-[#0a0a0a] mb-4">Transmission Received</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm leading-relaxed mb-8">
            Your application is now in the queue. You will receive an email notification once Central Command (Admin) reviews and approves your registration.
          </p>
          <button onClick={() => navigate('/')} className="bg-[#0a0a0a] text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-[#2ec5d4] hover:text-[#0a0a0a] transition-colors border-2 border-transparent hover:border-[#0a0a0a]">
            Return to Base
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#Faf9f6] relative font-jetbrains flex flex-col">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 w-full max-w-[1000px] mx-auto pb-20 pt-16 px-4 md:px-12">
        
        <header className="mb-12">
          <p className="text-[#2ec5d4] text-xs font-bold uppercase tracking-widest mb-3">
           REGISTRATION
          </p>
          <h1 className="font-oswald text-5xl md:text-6xl font-bold uppercase text-[#0a0a0a] mb-3">
            Join The <span className="text-[#27EBF5]">Club</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Initialize your profile and secure your position in the CodeX network.
          </p>
        </header>

        {error && (
          <div className="mb-8 border-l-4 border-red-500 bg-red-50 p-4 text-red-700 font-bold tracking-wide uppercase text-sm border-2 border-y-red-200 border-r-red-200">
            [ERROR]: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border-4 border-gray-800 p-6 md:p-10 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
                    <h3 className="font-oswald text-2xl font-bold uppercase tracking-widest text-[#0a0a0a] border-b-2 border-gray-200 pb-2 mb-6">
            1. Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Full  Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300" placeholder="Enter Your Name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Father's Name</label>
              <input type="text" name="fatherName" required value={formData.fatherName} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors font-bold text-sm tracking-wider placeholder-gray-300" placeholder="Email" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Phone Number</label>
              <input type="text" name="phone" required pattern="[0-9]{10}" title="Must be a 10-digit number" value={formData.phone} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors font-bold text-sm tracking-wider placeholder-gray-300" placeholder="Enter Phone Number" />
            </div>
          </div>
          <h3 className="font-oswald text-2xl font-bold uppercase tracking-widest text-[#0a0a0a] border-b-2 border-gray-200 pb-2 mb-6">
            2. Academic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">University ID (QID)</label>
              <input type="text" name="studentId" required value={formData.studentId} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300" placeholder="QID" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Course</label>
              <select name="course" required value={formData.course} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors uppercase font-bold text-sm tracking-wider cursor-pointer">
                <option value="">SELECT COURSE</option>
                {['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BBA', 'MBA', 'B.Sc', 'M.Sc'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Year</label>
                <select name="year" required value={formData.year} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors uppercase font-bold text-sm tracking-wider cursor-pointer">
                  <option value="">YEAR</option>
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Semester</label>
                <select name="semester" required value={formData.semester} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors uppercase font-bold text-sm tracking-wider cursor-pointer">
                  <option value="">SEM</option>
                  {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Section</label>
                <input type="text" name="section" required value={formData.section} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300" placeholder="Section" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Set / Group</label>
                <input type="text" name="set" required value={formData.set} onChange={handleInputChange} className="w-full bg-transparent border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300"  />
              </div>
            </div>
          </div>
          <h3 className="font-oswald text-2xl font-bold uppercase tracking-widest text-[#0a0a0a] border-b-2 border-gray-200 pb-2 mb-6">
            3. Verification Details
          </h3>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white border-2 border-gray-300 flex items-center justify-center shrink-0">
              <QrCode className="w-12 h-12 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-600 mb-2">
                1. Transfer the required membership fee to the official CodeX UPI handler.
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#b76e79] mb-4">
                UPI ID: CODEX@YBL
              </p>
              <label className="block text-xs font-bold text-[#2ec5d4] mb-2 uppercase tracking-wider">2. Enter Unique Transaction ID (UTR)</label>
              <input type="text" name="transactionId" required value={formData.transactionId} onChange={handleInputChange} className="w-full max-w-sm bg-white border-2 border-gray-300 text-[#0a0a0a] p-3 focus:outline-none focus:border-[#2ec5d4] transition-colors uppercase font-bold text-sm tracking-wider placeholder-gray-300" />
            </div>
          </div>
          <div className="mb-8 flex flex-col items-center border-2 border-gray-100 p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#2ec5d4]" /> Verification Required
            </div>
            <Turnstile 
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              onSuccess={(token) => setTurnstileToken(token)}
              options={{ theme: 'light' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !turnstileToken}
            className="w-full bg-[#0a0a0a] text-white py-5 font-bold uppercase tracking-widest hover:bg-[#2ec5d4] hover:text-[#0a0a0a] transition-colors border-2 border-transparent hover:border-[#0a0a0a] disabled:opacity-50 flex justify-center items-center gap-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Execute Registration Transfer'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Register;