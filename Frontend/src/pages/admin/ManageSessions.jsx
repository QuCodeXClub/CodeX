import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Monitor, Smartphone, Trash2, Globe, Activity, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';

export default function ManageSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      // Explicitly matching your frontend service method: getSessions()
      const res = await adminService.getSessions(); 
      
      // Safely extract the array from the ApiResponse object
      const sessionData = res.data?.data || res.data || [];
      setSessions(sessionData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load active sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleKill = async (id) => {
    if (!window.confirm('Are you sure you want to forcibly log out this device?')) return;
    
    try {
      await adminService.killSession(id);
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to terminate session.');
    }
  };

  // Helper to make local IPs readable during development
  const formatIP = (ip) => {
    if (!ip) return 'Unknown';
    if (ip === '::1' || ip.includes('127.0.0.1')) return '127.0.0.1 (Localhost)';
    return ip;
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full relative">
      
      {/* Header */}
      <header className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Session Control</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor and manage active device connections.</p>
        </div>
        <div className="p-3 bg-teal-50 rounded-xl hidden sm:block">
          <ShieldAlert className="w-8 h-8 text-teal-600" />
        </div>
      </header>

      {/* Alerts */}
      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-xl text-red-700 text-sm font-medium flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-4" />
          <span className="text-slate-500 font-medium text-sm">Scanning Network...</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Connections</h3>
          <p className="text-slate-500 text-sm">No secondary devices are currently linked to this system.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div 
              key={session._id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
            >
              
              <div className="flex items-start gap-4">
                {/* Device Icon */}
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                  {session.device?.toUpperCase() === 'MOBILE' ? (
                    <Smartphone className="w-6 h-6 text-slate-600" />
                  ) : (
                    <Monitor className="w-6 h-6 text-slate-600" />
                  )}
                </div>
                
                {/* Session Details */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {session.os || 'Unknown OS'} 
                    <span className="text-slate-300">/</span> 
                    <span className="text-teal-600">{session.browser || 'Unknown Browser'}</span>
                  </h3>
                  
                  <div className="mt-1.5 space-y-1">
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" /> 
                      IP: {formatIP(session.ipAddress)}
                    </p>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-400" /> 
                      Est: {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleKill(session._id)}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors border border-red-100 hover:border-red-200 shrink-0"
              >
                <Trash2 className="w-4 h-4" /> 
                Revoke Access
              </button>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}