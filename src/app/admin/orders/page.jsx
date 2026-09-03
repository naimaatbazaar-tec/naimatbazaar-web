'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { ShoppingCart, Eye, CheckCircle2, Clock, XCircle, Truck, Search, Trash2, Edit3, DollarSign, Package } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pending: 0, processing: 0, delivered: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    orderStatus: 'placed',
    paymentStatus: 'pending',
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
  });

const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

      const response = await api.get(`/admin/orders?${params.toString()}`);
      const resData = response.data;

      // Safely extract the array from different possible API response structures
      const ordersArray = Array.isArray(resData) 
        ? resData 
        : Array.isArray(resData.data) 
        ? resData.data 
        : Array.isArray(resData.data?.orders) 
        ? resData.data.orders 
        : [];

      setOrders(ordersArray);

      if (resData.stats) {
        setStats(resData.stats);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]); // Fallback to an empty array on error
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchOrders();
  }, [searchQuery, statusFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setStatusLoading(true);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating order status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setStatusLoading(true);
    try {
      const payload = {
        orderStatus: editFormData.orderStatus,
        paymentStatus: editFormData.paymentStatus,
        shippingInfo: {
          fullName: editFormData.fullName,
          phone: editFormData.phone,
          addressLine: editFormData.addressLine,
          city: editFormData.city,
          email: selectedOrder.shippingInfo?.email || '',
        },
      };

      await api.put(`/admin/orders/${selectedOrder._id}`, payload);
      setIsEditModalOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order details:', err);
      alert('Error updating order details');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order? Inventory stock will be restored.')) return;
    try {
      await api.delete(`/admin/orders/${orderId}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
      alert('Error deleting order');
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setEditFormData({
      orderStatus: order.orderStatus || 'placed',
      paymentStatus: order.paymentStatus || 'pending',
      fullName: order.shippingInfo?.fullName || '',
      phone: order.shippingInfo?.phone || '',
      addressLine: order.shippingInfo?.addressLine || order.shippingInfo?.address || '',
      city: order.shippingInfo?.city || '',
    });
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center w-max space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /><span>Delivered</span></span>;
      case 'shipped':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold flex items-center w-max space-x-1"><Truck className="w-3.5 h-3.5" /><span>Shipped</span></span>;
      case 'processing':
      case 'confirmed':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold flex items-center w-max space-x-1"><Clock className="w-3.5 h-3.5" /><span>{status}</span></span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold flex items-center w-max space-x-1"><XCircle className="w-3.5 h-3.5" /><span>Cancelled</span></span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center w-max space-x-1"><Clock className="w-3.5 h-3.5" /><span>{status || 'Pending'}</span></span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Fulfillment & Management</h1>
        <p className="text-sm text-gray-500">Track store orders, filter customers, update shipping details, and execute complete CRUD actions.</p>
      </div>

      {/* Analytics Stats Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-[#5c0000] rounded-xl"><Package className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Orders</p>
            <p className="text-xl font-black text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Pending / Placed</p>
            <p className="text-xl font-black text-gray-900">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Delivered</p>
            <p className="text-xl font-black text-gray-900">{stats.delivered}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Revenue</p>
            <p className="text-xl font-black text-emerald-700">Rs. {stats.revenue}</p>
          </div>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order #, name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5c0000]"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['all', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#5c0000] text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading store orders...</p>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">No orders matched your search criteria.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-800">{order.orderNumber || order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">{order.shippingInfo?.fullName || order.user?.name || 'Guest Customer'}</p>
                    <p className="text-xs text-gray-400">{order.shippingInfo?.email || order.user?.email || 'No email provided'}</p>
                  </td>
                  <td className="p-4 font-bold text-emerald-700">Rs. {order.total}</td>
                  <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
                  <td className="p-4 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      title="View Details"
                      className="inline-flex items-center p-2 bg-gray-100 text-gray-700 hover:bg-[#5c0000] hover:text-white rounded-lg font-semibold text-xs transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(order)}
                      title="Edit Order"
                      className="inline-flex items-center p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-semibold text-xs transition cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      title="Delete Order"
                      className="inline-flex items-center p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg font-semibold text-xs transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Details View Modal */}
      {selectedOrder && !isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.orderNumber || selectedOrder._id}</h2>
                <p className="text-xs text-gray-500">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Customer Information</p>
                <p className="font-bold text-gray-800 mt-1">{selectedOrder.shippingInfo?.fullName || selectedOrder.user?.name || 'Guest'}</p>
                <p className="text-gray-600 text-xs">{selectedOrder.shippingInfo?.email || selectedOrder.user?.email}</p>
                <p className="text-gray-600 text-xs">{selectedOrder.shippingInfo?.phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Shipping Address</p>
                <p className="text-gray-700 text-xs mt-1">
                  {selectedOrder.shippingInfo?.addressLine || selectedOrder.shippingInfo?.address || 'N/A'}, {selectedOrder.shippingInfo?.city}
                </p>
                <p className="text-xs font-semibold text-gray-500 mt-2">Payment Method: <span className="uppercase">{selectedOrder.paymentMethod}</span></p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">Order Items</p>
              <div className="border rounded-2xl overflow-hidden divide-y text-sm">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{item.title || item.product?.name || 'Product Item'}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty || item.quantity} {item.grammage ? `(${item.grammage})` : ''} × Rs. {item.price}</p>
                    </div>
                    <p className="font-bold text-emerald-700">Rs. {(item.qty || item.quantity) * item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-bold text-gray-700">Total Bill:</span>
              <span className="text-xl font-black text-emerald-700">Rs. {selectedOrder.total}</span>
            </div>

            {/* Quick Status Control */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-gray-700 uppercase">Update Fulfillment Status</label>
              <div className="flex flex-wrap gap-2">
                {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    disabled={statusLoading}
                    onClick={() => handleStatusUpdate(selectedOrder._id, st)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                      selectedOrder.orderStatus === st
                        ? 'bg-[#5c0000] text-white shadow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t space-x-3">
              <button
                onClick={() => {
                  const ord = selectedOrder;
                  setSelectedOrder(null);
                  openEditModal(ord);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 cursor-pointer"
              >
                Full Edit Details
              </button>
              <button onClick={() => setSelectedOrder(null)} className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black cursor-pointer">
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900">Edit Order #{selectedOrder.orderNumber}</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Order Status</label>
                  <select
                    value={editFormData.orderStatus}
                    onChange={(e) => setEditFormData({ ...editFormData, orderStatus: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000] bg-white"
                  >
                    <option value="placed">Placed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={editFormData.paymentStatus}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000] bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Address Line</label>
                <input
                  type="text"
                  required
                  value={editFormData.addressLine}
                  onChange={(e) => setEditFormData({ ...editFormData, addressLine: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={editFormData.city}
                  onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#5c0000] text-white text-sm font-bold hover:bg-[#420000] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}