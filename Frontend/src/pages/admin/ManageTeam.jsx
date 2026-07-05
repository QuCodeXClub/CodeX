import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Loader2, ShieldCheck, Filter, AlertCircle, Users } from 'lucide-react';
import axios from 'axios';

export default function ManageTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [filterYear, setFilterYear] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    post: '',
    subTeam: '',
    academicYear: '',
    photo: null, 
  });
  
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch Team Members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const queryParams = filterYear && filterYear !== 'ALL' ? `?academicYear=${filterYear}` : '';
      const response = await axios.get(`/api/v1/teams${queryParams}`, { withCredentials: true });
      
      setMembers(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [filterYear]); 

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', post: '', subTeam: '', academicYear: '', photo: null });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      post: member.post,
      subTeam: member.subTeam,
      academicYear: member.academicYear,
      photo: null, 
    });
    setImagePreview(member.photo); 
    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('post', formData.post);
      submitData.append('subTeam', formData.subTeam);
      submitData.append('academicYear', formData.academicYear);
      
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      if (editingId) {
        await axios.patch(`/api/v1/teams/${editingId}`, submitData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/v1/teams', submitData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setIsModalOpen(false);
      fetchMembers(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save team member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this user\'s access? This action is permanent.')) return;
    
    try {
      await axios.delete(`/api/v1/teams/${id}`, { withCredentials: true });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete team member.');
    }
  };

  // Extract unique academic years for the filter dropdown
  const uniqueYears = [...new Set(members.map(m => m.academicYear))];

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full relative">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Roster</h1>
          <p className="text-sm text-slate-500 mt-1">Manage personnel and organizational structure.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-teal-600 pointer-events-none" />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-lg py-2 pl-9 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-300 transition-colors shadow-sm cursor-pointer w-full"
            >
              <option value="ALL">All Academic Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute right-3 top-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-400 pointer-events-none"></div>
          </div>
          
          <button 
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </header>

      {error && !isModalOpen && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-lg text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Roster Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-4" />
          <span className="text-slate-500 font-medium text-sm">Syncing Personnel Data...</span>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Personnel Records</h3>
          <p className="text-slate-500 text-sm">Click "Add Member" to assign new personnel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <div key={member._id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              
              {/* Photo Section */}
              <div className="h-56 w-full bg-slate-100 border-b border-slate-100 relative overflow-hidden flex items-center justify-center">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                )}
                {/* Year Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-slate-100 flex items-center">
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{member.academicYear}</span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1" title={member.name}>{member.name}</h3>
                
                <div className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" /> {member.post}
                </div>
                
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4">
                  {member.subTeam}
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => openEditModal(member)} 
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-teal-200"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(member._id)} 
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-red-200"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative my-auto">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                {editingId ? 'Edit Team Member' : 'Add New Team Member'}
              </h2>

              {error && (
                <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-lg text-red-700 text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
                     placeholder="Full Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role / Post</label>
                    <input
                      type="text"
                      name="post"
                      required
                      value={formData.post}
                      onChange={handleInputChange}
                      placeholder="Position"
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sub-Team / Department</label>
                    <input
                      type="text"
                      name="subTeam"
                      required
                      value={formData.subTeam}
                      onChange={handleInputChange}
                      placeholder="Sub Team"
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Academic Year</label>
                    <input
                      type="text"
                      name="academicYear"
                      required
                      value={formData.academicYear}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-teal-400 rounded-xl p-6 text-center cursor-pointer transition-colors group">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-teal-500 transition-colors" />
                      <span className="text-sm font-medium text-slate-500 group-hover:text-teal-600">
                        Click to browse or drag image here
                      </span>
                    </label>
                    {imagePreview && (
                      <div className="w-28 h-28 border border-slate-200 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-sm">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-teal-700 disabled:opacity-50 mt-4 shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? 'Save Changes' : 'Add Member')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}