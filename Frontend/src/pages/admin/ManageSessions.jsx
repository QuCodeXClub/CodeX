import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';

const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await adminService.getSessions();
      setSessions(res.data || []);
    } catch (err) {
      alert('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleKill = async (id) => {
    if (window.confirm('Are you sure you want to log out this device?')) {
      try {
        await adminService.killSession(id);
        alert('Session killed successfully');
        fetchSessions();
      } catch (err) {
        alert(err?.message || 'Failed to kill session');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-cyan-400">Loading sessions...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Active Sessions
        </h1>
        <p className="text-gray-400 mt-2">Manage the devices currently logged into your admin account.</p>
      </div>

      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <div className="text-gray-500">No active sessions found.</div>
        ) : (
          sessions.map((session, i) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                    {session.device === 'Mobile' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">{session.os} - {session.browser}</h3>
                    <p className="text-sm text-gray-500">IP: {session.ipAddress}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Started: {new Date(session.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => handleKill(session._id)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm font-medium border border-red-500/20"
              >
                Log Out Device
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageSessions;
