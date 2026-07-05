import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, X, Image as ImageIcon, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    description: '',
    registrationLink: '',
    coverImage: null, 
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/events', { withCredentials: true });
      setEvents(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ eventName: '', date: '', description: '', registrationLink: '', coverImage: null });
    setImagePreview(null);
    setIsModalOpen(true);
  };
  const openEditModal = (event) => {
    setEditingId(event._id);
    const formattedDate = new Date(event.date).toISOString().slice(0, 16);
    setFormData({
      eventName: event.eventName,
      date: formattedDate,
      description: event.description,
      registrationLink: event.registrationLink || '',
      coverImage: null, 
    });
    setImagePreview(event.coverImage); 
    setIsModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const submitData = new FormData();
      submitData.append('eventName', formData.eventName);
      submitData.append('date', formData.date);
      submitData.append('description', formData.description);
      if (formData.registrationLink) submitData.append('registrationLink', formData.registrationLink);
      if (formData.coverImage) {
        submitData.append('coverImage', formData.coverImage);
      }
      
      if (editingId) {
        await axios.patch(`/api/v1/events/${editingId}`, submitData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/v1/events', submitData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also remove the image from Cloudinary.')) return;
    try {
      await axios.delete(`/api/v1/events/${id}`, { withCredentials: true });
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event.');
    }
  };
  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full relative">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create, edit, and organize public events.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </header>
      {error && !isModalOpen && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-lg text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-4" />
          <span className="text-slate-500 font-medium text-sm">Syncing Database...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Events</h3>
          <p className="text-slate-500 text-sm">Click "Create Event" to schedule a new one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                <div className="h-48 w-full bg-slate-100 border-b border-slate-100 relative overflow-hidden flex items-center justify-center">
                {event.coverImage ? (
                  <img src={event.coverImage} alt={event.eventName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                )}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-lg font-bold text-slate-900 leading-none">{new Date(event.date).getDate()}</span>
                </div>
              </div>
                <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1" title={event.eventName}>{event.eventName}</h3>
                
                <div className="flex items-center gap-2 text-slate-500 mb-4 text-xs font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">{event.description}</p>
                  <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => openEditModal(event)} 
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-teal-200"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(event._id)} 
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
                {editingId ? 'Edit Event Details' : 'Initialize New Event'}
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
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Name</label>
                    <input
                      type="text"
                      name="eventName"
                      required
                      value={formData.eventName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
                      placeholder="Event Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm resize-none"
                    placeholder="Event Description"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Registration URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      name="registrationLink"
                      value={formData.registrationLink}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cover Image</label>
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
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? 'Save Changes' : 'Create Event')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}