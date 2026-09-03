'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User, Lock, Save, LogOut, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [passLoading, setPassLoading] = useState(false);

  // Fetch complete and fresh admin data from the server on mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const { data } = await api.get('/admin/profile');
        const profile = data.data?.admin || data.data || data;
        setAdminData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          role: profile.role || 'admin',
        });
      } catch (err) {
        console.error('Failed to fetch fresh admin profile from server:', err);
        // Fallback to localStorage if API call fails
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setAdminData({ 
              name: parsed.name || '', 
              email: parsed.email || '',
              phone: parsed.phone || '',
              role: parsed.role || 'admin'
            });
          } catch (e) {
            console.error('Failed to parse user session', e);
          }
        }
      } finally {
        setFetching(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/admin/profile', adminData);
      
      // Update local storage cache to keep it synchronized
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const updatedUser = { ...parsed, name: adminData.name, email: adminData.email, phone: adminData.phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setPassLoading(true);
    try {
      await api.put('/admin/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      alert('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to update password:', err);
      alert(err.response?.data?.message || 'Error updating password');
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (fetching) {
    return (
      <div className="p-12 text-center text-gray-500 font-medium">
        Loading administrator profile configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Settings & Security</h1>
        <p className="text-sm text-gray-500">Manage your administrative credentials, security keys, and session controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-[#5c0000]" />
              <h2 className="font-bold text-gray-900">Admin Profile Details</h2>
            </div>
            <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full capitalize">
              {adminData.role}
            </span>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={adminData.name}
                onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[#5c0000]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={adminData.email}
                onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[#5c0000]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={adminData.phone || ''}
                onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[#5c0000]"
                placeholder="+92 300 0000000"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-[#5c0000] text-white py-3 rounded-xl font-bold hover:bg-[#420000] transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3">
            <Lock className="w-5 h-5 text-[#5c0000]" />
            <h2 className="font-bold text-gray-900">Security & Password</h2>
          </div>
          <form onSubmit={handlePasswordUpdate} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[#5c0000]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[#5c0000]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-[#5c0000]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={passLoading}
              className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{passLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Session Logout Action */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-rose-900 text-base">Terminate Admin Session</h2>
          <p className="text-xs text-rose-700 mt-0.5">Securely log out of your administrator token session on this device.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-rose-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-rose-700 transition shadow cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Secure Logout</span>
        </button>
      </div>
    </div>
  );
}