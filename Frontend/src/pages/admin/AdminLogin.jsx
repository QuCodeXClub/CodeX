import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Lock, Mail, KeyRound, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminService.loginAdmin(credentials.email, credentials.password);
      setStep(2); 
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminService.verifyAdminOtp(credentials.email, credentials.otp);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP sequence.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'linear-gradient(#2ec5d4 1px, transparent 1px), linear-gradient(90deg, #2ec5d4 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            CodeX 
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {step === 1 ? 'Authorized personnel access only' : 'Multi-factor verification required'}
          </p>
        </div>
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-xl text-red-700 text-sm font-medium flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}
        {step === 1 ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
               Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm placeholder:text-slate-400"
                  placeholder="Enter your Mail"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-teal-700 disabled:opacity-70 shadow-sm mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Secure Login <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-600">
                A 6-digit code has been sent to <br/>
                <span className="font-semibold text-teal-600">{credentials.email}</span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 text-center">
                Authentication Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="otp"
                  required
                  maxLength={6}
                  value={credentials.otp}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors font-mono shadow-inner placeholder:text-slate-300"
                  placeholder="000000"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-teal-700 disabled:opacity-70 shadow-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Access'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}