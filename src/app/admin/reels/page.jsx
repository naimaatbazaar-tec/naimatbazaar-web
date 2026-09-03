'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { Plus, Trash2, Edit3, X, Video, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminReelsPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [desc, setDesc] = useState('');
  const [thumb, setThumb] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [order, setOrder] = useState(0);

  const fetchReels = async () => {
    try {
      const { data } = await api.get('/reels');
      if (data.success) {
        setReels(data.data);
      }
    } catch (err) {
      console.error('Failed to load reels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleOpenModal = (reel = null) => {
    if (reel) {
      setEditingReel(reel);
      setTitle(reel.title);
      setSubtitle(reel.subtitle);
      setDesc(reel.desc);
      setThumb(reel.thumb);
      setVideoUrl(reel.videoUrl);
      setOrder(reel.order || 0);
    } else {
      setEditingReel(null);
      setTitle('');
      setSubtitle('');
      setDesc('');
      setThumb('');
      setVideoUrl('');
      setOrder(reels.length + 1);
    }
    setIsModalOpen(true);
  };

  const handleSaveReel = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, subtitle, desc, thumb, videoUrl, order };
      if (editingReel) {
        await api.put(`/reels/${editingReel._id}`, payload);
      } else {
        await api.post('/reels', payload);
      }
      setIsModalOpen(false);
      fetchReels();
    } catch (err) {
      console.error('Failed to save reel:', err);
      alert(err.response?.data?.message || 'Error saving reel');
    }
  };

  const handleDeleteReel = async (id) => {
    if (!confirm('Are you sure you want to delete this reel?')) return;
    try {
      await api.delete(`/reels/${id}`);
      fetchReels();
    } catch (err) {
      console.error('Failed to delete reel:', err);
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
                <Film className="w-3 h-3" /> Video Content
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Customer Unboxing Reels</h1>
            <p className="text-sm text-gray-500">Manage video reels and customer unboxing clips shown on your storefront.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-[#5c0000] text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md hover:bg-[#450000] transition cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Reel</span>
          </button>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
            Loading reels from database...
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
            {reels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reels.map((reel) => (
                  <motion.div 
                    key={reel._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 flex flex-col justify-between space-y-4 hover:shadow-md transition"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[9/16] w-full max-h-48 rounded-xl bg-gray-200 overflow-hidden relative flex items-center justify-center">
                        {reel.thumb ? (
                          <img src={reel.thumb} alt={reel.title} className="w-full h-full object-cover" />
                        ) : (
                          <Video className="w-8 h-8 text-gray-400" />
                        )}
                        <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Order: {reel.order}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 text-base">{reel.title}</h3>
                        <p className="text-xs font-bold text-[#5c0000]">{reel.subtitle}</p>
                        <p className="text-xs text-gray-500 mt-1">{reel.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200/60">
                      <button
                        onClick={() => handleOpenModal(reel)}
                        className="p-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer shadow-sm"
                        title="Edit Reel"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReel(reel._id)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-100 transition cursor-pointer shadow-sm"
                        title="Delete Reel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm flex flex-col items-center justify-center space-y-2">
                <Video className="w-10 h-10 text-gray-300" />
                <p>No reels found. Click "Add New Reel" to create one.</p>
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
                    {editingReel ? 'Edit Unboxing Reel' : 'Add New Unboxing Reel'}
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveReel} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Talbina POV" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtitle</label>
                      <input 
                        type="text" 
                        value={subtitle} 
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="e.g. Rustom Power Talbina" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                    <input 
                      type="text" 
                      value={desc} 
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="e.g. Real Customer Unboxing" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Thumbnail Image URL/Path</label>
                      <input 
                        type="text" 
                        value={thumb} 
                        onChange={(e) => setThumb(e.target.value)}
                        placeholder="/images/Talbina.jpeg" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Display Order</label>
                      <input 
                        type="number" 
                        value={order} 
                        onChange={(e) => setOrder(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#5c0000]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Video Embed URL</label>
                    <input 
                      type="text" 
                      value={videoUrl} 
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/embed/..." 
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
                      {editingReel ? 'Update Reel' : 'Save Reel'}
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