import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { adminService } from '../services/adminService'; 
import { ShieldCheck } from 'lucide-react';
export default function AdminAuthGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const verifySession = async () => {
      try {
        await adminService.getCurrentAdmin();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    verifySession();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
             style={{ backgroundImage: 'linear-gradient(#2ec5d4 1px, transparent 1px), linear-gradient(90deg, #2ec5d4 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-teal-600 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
            Verifying Credentials...
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Authenticating secure session...
          </p>
        </div>
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}