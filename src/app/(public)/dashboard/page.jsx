'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, Mail, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser) {
      window.location.href = '/login';
      return;
    }

    let parsedUser = null;
    try {
      parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (e) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    const fetchOrdersDirectly = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        let orderList = [];

        // 1. Try standard authorized endpoint first
        if (token) {
          try {
            const res = await fetch(`${apiUrl}/orders/my-orders`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const responseData = await res.json();
              orderList = Array.isArray(responseData)
                ? responseData
                : responseData.data || responseData.orders || [];
            }
          } catch (err) {
            console.log('Standard auth fetch failed, trying direct lookup...');
          }
        }

        // 2. Fallback: If no orders found, try fetching all orders or querying by user email/ID directly if a public/search route exists,
        // or check if we can query matching shipping info email
        if (orderList.length === 0 && parsedUser?.email) {
          const allRes = await fetch(`${apiUrl}/orders`); // Adjust if your backend has an unprotected or admin route, or create a direct user filter route
          if (allRes.ok) {
            const allData = await allRes.json();
            const allOrders = Array.isArray(allData) ? allData : allData.data || allData.orders || [];
            
            // Filter client-side by user email in shippingInfo or matching user ID
            orderList = allOrders.filter((ord) => {
              const ordUserId = ord.user?._id || ord.user;
              const ordEmail = ord.shippingInfo?.email?.toLowerCase();
              const targetEmail = parsedUser.email.toLowerCase();
              const targetId = parsedUser._id || parsedUser.id;

              return (ordUserId && targetId && ordUserId.toString() === targetId.toString()) || 
                     (ordEmail && ordEmail === targetEmail);
            });
          }
        }

        setOrders(Array.isArray(orderList) ? orderList : []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersDirectly();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-bold text-[#8B0000]">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">User Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Customer'}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Account Details Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-[#8B0000]" /> Account Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-semibold">Email</p>
                <p className="font-bold text-gray-800">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-semibold">Account Status</p>
                <p className="font-bold text-emerald-600">Active Customer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#8B0000]" /> My Orders
          </h2>
          <div className="pt-2 border-t border-gray-100">
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                You haven't placed any orders yet.
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id || order.id}
                    className="p-4 rounded-xl border border-gray-200 bg-slate-50 text-xs sm:text-sm space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div>
                        <p className="font-bold text-gray-900">
                          Order #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#8B0000] text-base">
                          Rs. {(order.total || order.totalAmount)?.toLocaleString()}
                        </p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                          {order.orderStatus || order.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-1.5 pt-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-700">
                          <span>
                            {item.title || item.product?.title || 'Khaalis Product'} ({item.grammage || 'Std'}) x {item.qty}
                          </span>
                          <span className="font-semibold text-gray-900">
                            Rs. {(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}