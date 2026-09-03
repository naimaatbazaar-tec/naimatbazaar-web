'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { Star, Plus, Trash2, Edit3, X, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Form states
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews');
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenModal = (review = null) => {
    if (review) {
      setEditingReview(review);
      setAuthor(review.author);
      setLocation(review.location);
      setText(review.text);
      setRating(review.rating || 5);
    } else {
      setEditingReview(null);
      setAuthor('');
      setLocation('');
      setText('');
      setRating(5);
    }
    setIsModalOpen(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, { author, location, text, rating });
      } else {
        await api.post('/reviews', { author, location, text, rating });
      }
      setIsModalOpen(false);
      fetchReviews();
    } catch (err) {
      console.error('Failed to save review:', err);
      alert(err.response?.data?.message || 'Error saving review');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5c0000]/15 text-[#5c0000] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Testimonials Control
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Customer Reviews</h1>
            <p className="text-sm text-gray-500">Manage store feedback and customer ratings displayed on the site.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-[#5c0000] text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md hover:bg-[#450000] transition cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Review</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
            Loading reviews from database...
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <motion.div 
                    key={rev._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-gray-900 text-base">{rev.author}</span>
                        <span className="text-xs bg-gray-200/80 px-2.5 py-0.5 rounded-full font-semibold text-gray-700">{rev.location}</span>
                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">"{rev.text}"</p>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenModal(rev)}
                        className="p-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer shadow-sm"
                        title="Edit Review"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-100 transition cursor-pointer shadow-sm"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm flex flex-col items-center justify-center space-y-2">
                <MessageSquare className="w-10 h-10 text-gray-300" />
                <p>No reviews added yet. Click "Add New Review" to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
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
                    {editingReview ? 'Edit Customer Review' : 'Add New Customer Review'}
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveReview} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Author Name</label>
                      <input 
                        type="text" 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. Usman Ali" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Location</label>
                      <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Lahore" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Rating (1-5)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5"
                      value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Review Text</label>
                    <textarea 
                      value={text} 
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Write customer feedback..." 
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
                      {editingReview ? 'Update Review' : 'Save Review'}
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