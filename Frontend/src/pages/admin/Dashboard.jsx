import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Calendar, Activity, ShieldCheck, CalendarDays, Users2, FileText, Settings } from 'lucide-react';
import { registrationService } from '../../services/registrationService';
import { adminService } from '../../services/adminService';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    pendingApps: 0,
    activeEvents: 0,
    liveSessions: 0,
    totalApps: 0,
    teamSize: 0,
    loading: true
  });
  
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [pendingRes, allRegRes, eventsRes, sessionsRes, teamRes] = await Promise.all([
          registrationService.getRegistrations({ status: 'PENDING' }),
          registrationService.getRegistrations({ limit: 5 }),
          axios.get('/api/v1/events', { withCredentials: true }),
          adminService.getSessions(),
          axios.get('/api/v1/teams', { withCredentials: true })
        ]);

        const pendingData = pendingRes.data?.data || pendingRes.data || {};
        const allRegData = allRegRes.data?.data || allRegRes.data || {};
        const evData = eventsRes.data?.data || eventsRes.data || [];
        const sessData = sessionsRes.data?.data || sessionsRes.data || [];
        const teamData = teamRes.data?.data || teamRes.data || [];

        setMetrics({
          pendingApps: pendingData.total || 0,
          totalApps: allRegData.total || 0,
          activeEvents: evData.length || 0,
          liveSessions: sessData.length || 0,
          teamSize: teamData.length || 0,
          loading: false
        });

        setRecentLogs(allRegData.registrations || (Array.isArray(allRegData) ? allRegData : []));
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
        setMetrics(prev => ({ ...prev, loading: false }));
      }
    };

    fetchMetrics();
  }, []);

  const currentDate = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
  }).format(new Date());

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time metrics and system health</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm text-sm font-medium text-slate-700">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          {currentDate}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10">
              <p className="text-slate-300 text-sm mb-1">Welcome back,</p>
              <h2 className="text-3xl font-bold mb-4">Admin User</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[85%]">
                Here's what's happening with Codex today.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/admin/events" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50 transition-colors group">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-teal-700">
                  <Calendar className="w-5 h-5 text-teal-500" /> Event Management
                </div>
              </Link>
              <Link to="/admin/team" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50 transition-colors group">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-teal-700">
                  <Users2 className="w-5 h-5 text-teal-500" /> Team Management
                </div>
              </Link>
              <Link to="/admin/certificates" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50 transition-colors group">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-teal-700">
                  <FileText className="w-5 h-5 text-teal-500" /> Certificate Management
                </div>
              </Link>
              <Link to="/admin/dashboard" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50 transition-colors group">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-teal-700">
                  <Settings className="w-5 h-5 text-slate-400 group-hover:text-teal-500" /> System Settings
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-sm font-medium text-slate-500">Pending Applications</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-slate-900">{metrics.loading ? '-' : metrics.pendingApps}</span>
                <p className="text-xs font-medium text-teal-600 mt-2">Real-time sync</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-slate-500">Active Events</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-slate-900">{metrics.loading ? '-' : metrics.activeEvents}</span>
                <p className="text-xs font-medium text-teal-600 mt-2">Real-time sync</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Activity className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-slate-500">Live Sessions</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-slate-900">{metrics.loading ? '-' : metrics.liveSessions}</span>
                <p className="text-xs font-medium text-teal-600 mt-2">Real-time sync</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-500">System Status</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-slate-900">OK</span>
                <p className="text-xs font-medium text-teal-600 mt-2">All systems operational</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">Database Aggregates</h3>
                <Link to="/admin/events" className="text-xs font-medium text-teal-600 hover:underline">Manage Records</Link>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-6">
                <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Total Applications Received</span>
                  <span className="text-xl font-bold text-slate-900">{metrics.loading ? '-' : metrics.totalApps}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Total Events Hosted</span>
                  <span className="text-xl font-bold text-slate-900">{metrics.loading ? '-' : metrics.activeEvents}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Active Team Roster</span>
                  <span className="text-xl font-bold text-slate-900">{metrics.loading ? '-' : metrics.teamSize}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-[320px]">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="font-bold text-slate-900">Recent Registrations</h3>
                <Link to="/admin/registrations" className="text-xs font-medium text-teal-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-4 overflow-y-auto pr-2">
                {metrics.loading ? (
                  <p className="text-sm text-slate-500">Loading activity...</p>
                ) : recentLogs.length === 0 ? (
                  <p className="text-sm text-slate-500">No recent registrations found.</p>
                ) : (
                  recentLogs.map((log) => (
                    <div key={log._id} className="flex gap-4">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        log.status === 'APPROVED' ? 'bg-teal-500' : 
                        log.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">
                          <span className="font-medium text-slate-900">{log.name}</span> applied for CodeX ({log.course}).
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}