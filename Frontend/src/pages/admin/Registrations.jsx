import { useState, useEffect } from 'react';
import { Search, Filter, Loader2, CheckCircle, Clock, XCircle, Check, X } from 'lucide-react';
import { registrationService } from '../../services/registrationService'; 

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await registrationService.getRegistrations();
      
      const payload = response.data?.data || response.data || response;
      const records = payload.registrations || (Array.isArray(payload) ? payload : []);
      
      setRegistrations(records);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch registration data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this registration as ${newStatus}? The system will dispatch an automated email to the candidate.`)) return;

    try {
      await registrationService.updateRegistrationStatus(id, newStatus);
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update status to ${newStatus}.`);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const currentStatus = reg.status || 'PENDING';
    const matchesStatus = statusFilter === 'ALL' || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    switch(status?.toUpperCase()) {
      case 'APPROVED': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'REJECTED': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full">
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Registration Information</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and verify new applicant submissions.</p>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Q-ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-teal-600 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-300 transition-colors shadow-sm cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          {/* Custom Select Arrow */}
          <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-400 pointer-events-none"></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-lg text-red-700 text-sm font-medium flex items-center gap-2">
          <XCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Academic Data</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Verification</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
                    <span className="text-slate-500 font-medium text-sm">Extracting Database Records...</span>
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500 font-medium">
                    No records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{reg.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">D/O, S/O: {reg.fatherName}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{reg.email}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{reg.phone}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {reg.course} <span className="text-slate-400 font-normal ml-1">({reg.year})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Q-ID: <span className="font-medium text-slate-600">{reg.studentId}</span> | Sec: {reg.section} | Set: {reg.set}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs">
                        UTR: {reg.transactionId}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <StatusBadge status={reg.status} />
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      {reg.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusChange(reg._id, 'APPROVED')} 
                            className="p-1.5 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors border border-teal-100" 
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(reg._id, 'REJECTED')} 
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-100" 
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">Processed</span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}