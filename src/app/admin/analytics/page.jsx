'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle, Users } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockItems: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/admin/analytics');
        setAnalytics(data.data || data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-gray-500">Loading store performance insights...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Analytics & Reports</h1>
        <p className="text-sm text-gray-500">Monitor store revenue, customer growth, and stock alerts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Revenue</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">Rs. {analytics.totalSales || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Orders Completed</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{analytics.totalOrders || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Active Customers</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{analytics.totalCustomers || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Low Stock Inventory Alert */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-amber-600 font-bold">
          <AlertTriangle className="w-5 h-5" />
          <span>Low Inventory Warnings</span>
        </div>
        {analytics.lowStockItems?.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {analytics.lowStockItems.map((item) => (
              <div key={item._id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">Category: {typeof item.category === 'object' ? item.category?.name : item.category}</p>
                </div>
                <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold">
                  {item.stock} left
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">All products have healthy inventory levels.</p>
        )}
      </div>
    </div>
  );
}