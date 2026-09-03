'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { HelpCircle, Plus, Trash2, Edit3, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  // Form states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');

  const fetchFaqs = async () => {
    try {
      const { data } = await api.get('/faqs');
      if (data.success) {
        setFaqs(data.data);
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setCategory(faq.category || 'General');
    } else {
      setEditingFaq(null);
      setQuestion('');
      setAnswer('');
      setCategory('General');
    }
    setIsModalOpen(true);
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await api.put(`/faqs/${editingFaq._id}`, { question, answer, category });
      } else {
        await api.post('/faqs', { question, answer, category });
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      console.error('Failed to save FAQ:', err);
      alert(err.response?.data?.message || 'Error saving FAQ');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="space-y-6 pb-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5c0000]/15 text-[#5c0000] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Support Control
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Frequently Asked Questions</h1>
            <p className="text-sm text-gray-500">Manage customer queries and help content across the store.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-[#5c0000] text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md hover:bg-[#450000] transition cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>

        {/* Content Table / Grid */}
        {loading ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
            Loading FAQs from database...
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
            {faqs.length > 0 ? (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <motion.div 
                    key={faq._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider rounded-md">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base">{faq.question}</h3>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenModal(faq)}
                        className="p-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer shadow-sm"
                        title="Edit FAQ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq._id)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-100 transition cursor-pointer shadow-sm"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm flex flex-col items-center justify-center space-y-2">
                <HelpCircle className="w-10 h-10 text-gray-300" />
                <p>No FAQs added yet. Click "Add New FAQ" to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Modal for Create/Edit */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-black text-gray-900">
                    {editingFaq ? 'Edit FAQ Item' : 'Create New FAQ'}
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveFaq} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
                    <input 
                      type="text" 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Shipping, Returns, General" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Question</label>
                    <input 
                      type="text" 
                      value={question} 
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g. How long does shipping take?" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Answer</label>
                    <textarea 
                      value={answer} 
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Provide a clear, detailed response..." 
                      rows={4}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#5c0000] text-white rounded-xl text-sm font-bold hover:bg-[#450000] transition shadow-md cursor-pointer"
                    >
                      {editingFaq ? 'Update FAQ' : 'Save FAQ'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}