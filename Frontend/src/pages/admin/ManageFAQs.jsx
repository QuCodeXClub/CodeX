import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, ToggleLeft, ToggleRight, AlertCircle, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function ManageFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isActive: true
  });

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/faqs', { withCredentials: true });
      setFaqs(response.data?.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch FAQ manifest.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFAQs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axios.patch(`/api/v1/faqs/${editingId}`, formData, { withCredentials: true });
      } else {
        await axios.post('/api/v1/faqs', formData, { withCredentials: true });
      }
      setIsModalOpen(false);
      fetchFAQs();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ entry?')) return;
    try {
      await axios.delete(`/api/v1/faqs/${id}`, { withCredentials: true });
      fetchFAQs();
    } catch (err) {
      setError('Failed to purge entry.');
    }
  };

  return (
    <div className="p-8 lg:p-10 font-sans text-slate-900 min-h-full relative">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
          <p className="text-sm text-slate-500 mt-1">Manage public FAQs and system documentation.</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({question:'', answer:'', isActive: true}); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
      </header>

      {error && !isModalOpen && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-lg text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* FAQs List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-4" />
          <span className="text-slate-500 font-medium text-sm">Loading Knowledge Base...</span>
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No FAQs Found</h3>
          <p className="text-slate-500 text-sm">Click "New Entry" to start building your knowledge base.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    faq.isActive 
                      ? 'bg-teal-50 text-teal-700 border-teal-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {faq.isActive ? 'Live' : 'Hidden'}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
              
              <div className="flex items-center gap-2 shrink-0 md:flex-col md:items-end">
                <button 
                  onClick={() => { setEditingId(faq._id); setFormData(faq); setIsModalOpen(true); }} 
                  className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-transparent hover:border-teal-200"
                  title="Edit Entry"
                >
                  <Edit className="w-4 h-4"/>
                </button>
                <button 
                  onClick={() => handleDelete(faq._id)} 
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setIsModalOpen(false)}>
          <form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative my-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                {editingId ? 'Edit FAQ Entry' : 'New FAQ Entry'}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Question</label>
                  <input 
                    type="text" 
                    placeholder="e.g., When is the next hackathon?" 
                    required 
                    value={formData.question} 
                    onChange={e => setFormData({...formData, question: e.target.value})} 
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Answer</label>
                  <textarea 
                    placeholder="Provide a clear, concise answer..." 
                    required 
                    value={formData.answer} 
                    onChange={e => setFormData({...formData, answer: e.target.value})} 
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg p-3 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors shadow-sm resize-none" 
                  />
                </div>
                
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                      {formData.isActive 
                        ? <ToggleRight className="w-10 h-10 text-teal-500 group-hover:text-teal-600 transition-colors" /> 
                        : <ToggleLeft className="w-10 h-10 text-slate-300 group-hover:text-slate-400 transition-colors" />
                      }
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">Visibility Status</span>
                      <span className="text-xs text-slate-500">
                        {formData.isActive ? 'Visible to the public on the main website.' : 'Hidden from the public view.'}
                      </span>
                    </div>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-teal-700 disabled:opacity-50 mt-4 shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? 'Save Changes' : 'Publish Entry')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}