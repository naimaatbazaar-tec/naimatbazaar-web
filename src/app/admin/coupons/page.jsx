'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, Ticket, Percent, CheckCircle, XCircle } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    expirationDate: '',
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/admin/coupons');
      setCoupons(data.data?.coupons || data.data || []);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/coupons', formData);
      setIsModalOpen(false);
      setFormData({ code: '', discountPercentage: '', expirationDate: '', isActive: true });
      fetchCoupons();
    } catch (err) {
      console.error('Failed to save coupon:', err);
      alert(err.response?.data?.message || 'Error creating coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Coupon Management</h1>
          <p className="text-sm text-gray-500">Create and monitor store promo discount codes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-[#5c0000] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#420000] transition shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Ticket className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">No active discount codes found.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Expiration</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((cp) => (
                <tr key={cp._id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-[#5c0000] font-mono uppercase">{cp.code}</td>
                  <td className="p-4 font-bold text-emerald-700">{cp.discountPercentage}% OFF</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      cp.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {cp.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{cp.isActive ? 'Active' : 'Disabled'}</span>
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">
                    {cp.expirationDate ? new Date(cp.expirationDate).toLocaleDateString() : 'No Limit'}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(cp._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900">Create New Coupon Code</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000] font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  required
                  placeholder="20"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000]"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5c0000] text-white text-sm font-bold hover:bg-[#420000]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}