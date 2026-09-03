'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { Users, Shield, Ban, CheckCircle, Mail, Calendar, Search, Eye, UserCheck, UserX } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.data?.users || data.data || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    if (!confirm(`Are you sure you want to mark this user as ${newStatus}?`)) return;

    setActionLoading(userId);
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      fetchUsers();
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
      alert(err.response?.data?.message || 'Error updating user status');
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered users based on search input
  const filteredUsers = useMemo(() => {
    return users.filter((cust) => {
      const name = cust.name?.toLowerCase() || '';
      const email = cust.email?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [users, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = users.length;
    const blocked = users.filter((u) => u.status === 'blocked').length;
    const active = total - blocked;
    const admins = users.filter((u) => u.role === 'admin').length;
    return { total, active, blocked, admins };
  }, [users]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Customer Management</h1>
        <p className="text-sm text-gray-500">View registered user accounts, manage permission roles, and control account status.</p>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Users</p>
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Active Accounts</p>
            <p className="text-2xl font-black text-emerald-700">{stats.active}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-bold">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Blocked Users</p>
            <p className="text-2xl font-black text-rose-700">{stats.blocked}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Administrators</p>
            <p className="text-2xl font-black text-purple-700">{stats.admins}</p>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customer by name or email address..."
          className="w-full bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-gray-400 hover:text-gray-700 px-3 py-1 bg-gray-100 rounded-lg cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading customer database...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">No matching registered customers found.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((cust, index) => {
                const isBlocked = cust.status === 'blocked';
                const isAdmin = cust.role === 'admin';

                // Check if this row is the transition from admin to regular users (or vice-versa) for visual grouping
                const prevCust = filteredUsers[index - 1];
                const showDivider = index > 0 && prevCust && prevCust.role !== cust.role;

                return (
                  <>
                    {showDivider && (
                      <tr key={`divider-${cust._id}`}>
                        <td colSpan="5" className="bg-gray-100/80 px-4 py-2 font-bold text-xs uppercase text-gray-500 tracking-wider border-y border-gray-200">
                          Regular Customers
                        </td>
                      </tr>
                    )}
                    {index === 0 && isAdmin && (
                      <tr key={`divider-admin-${cust._id}`}>
                        <td colSpan="5" className="bg-purple-50/60 px-4 py-2 font-bold text-xs uppercase text-purple-700 tracking-wider border-y border-purple-100">
                          Administrators
                        </td>
                      </tr>
                    )}
                    <tr 
                      key={cust._id} 
                      className={`transition ${
                        isAdmin 
                          ? 'bg-purple-50/30 hover:bg-purple-50/60 border-l-4 border-purple-600' 
                          : 'hover:bg-gray-50/50'
                      }`}
                    >
                      <td className="p-4 flex items-center space-x-3">
                        <div className={`w-10 h-10 font-bold rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-[#5c0000]/10 text-[#5c0000]'
                        }`}>
                          {cust.name ? cust.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-bold text-gray-800">{cust.name || 'Unnamed User'}</p>
                            {isAdmin && (
                              <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{cust.email}</span>
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {isAdmin && <Shield className="w-3 h-3" />}
                          <span className="capitalize">{cust.role || 'customer'}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isBlocked ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {isBlocked ? <Ban className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          <span className="capitalize">{cust.status || 'active'}</span>
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(cust.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedUser(cust)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white rounded-lg font-semibold text-xs transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                        {!isAdmin && (
                          <button
                            disabled={actionLoading === cust._id}
                            onClick={() => handleToggleBlock(cust._id, cust.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              isBlocked
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {actionLoading === cust._id ? 'Updating...' : isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        )}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Customer Profile Details</h2>
                <p className="text-xs text-gray-500">System Record ID: {selectedUser._id}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-2xl text-sm">
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                <span className="text-gray-500 font-medium">Full Name</span>
                <span className="font-bold text-gray-800">{selectedUser.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                <span className="text-gray-500 font-medium">Email Address</span>
                <span className="font-bold text-gray-800">{selectedUser.email || 'N/A'}</span>
              </div>
                <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                <span className="text-gray-500 font-medium">Account Role</span>
                <span className="font-bold uppercase text-purple-700">{selectedUser.role || 'customer'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                <span className="text-gray-500 font-medium">Account Status</span>
                <span className={`font-bold uppercase ${selectedUser.status === 'blocked' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {selectedUser.status || 'active'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Registration Date</span>
                <span className="font-bold text-gray-800">{new Date(selectedUser.createdAt || Date.now()).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              {selectedUser.role !== 'admin' && (
                <button
                  disabled={actionLoading === selectedUser._id}
                  onClick={() => handleToggleBlock(selectedUser._id, selectedUser.status)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    selectedUser.status === 'blocked'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {selectedUser.status === 'blocked' ? 'Unblock User Account' : 'Block User Account'}
                </button>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black ml-auto cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}