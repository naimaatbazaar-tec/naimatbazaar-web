'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    grammage: '1kg', // Added grammage field state
    image: '',
  });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      const productList = data.data?.products || data.data || data;
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      const catList = Array.isArray(data.data) ? data.data : (data.categories || data || []);
      setCategories(Array.isArray(catList) ? catList : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category, 
        isFeatured: false,
        variants: [{ 
          price: Number(formData.price), 
          stock: Number(formData.stock), 
          grammage: formData.grammage, // Sent directly from form state
          unit: 'standard' 
        }],
        images: formData.image ? [{ url: formData.image }] : []
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ title: '', description: '', price: '', category: '', stock: '', grammage: '1kg', image: '' });
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const firstVariant = product.variants?.[0] || {};
    const firstImage = product.images?.[0]?.url || product.image || '';

    setFormData({
      title: product.title || product.name || '',
      description: product.description || '',
      price: firstVariant.price || product.price || '',
      category: typeof product.category === 'object' ? product.category?._id || '' : product.category || '',
      stock: firstVariant.stock || product.stock || 0,
      grammage: firstVariant.grammage || '1kg',
      image: firstImage,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Product Management</h1>
          <p className="text-sm text-gray-500">Manage your store inventory, pricing, and stock items.</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({ title: '', description: '', price: '', category: '', stock: '', grammage: '1kg', image: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-[#5c0000] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#420000] transition shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading inventory catalog...</p>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Grammage</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((product) => {
                const imageUrl = product.images?.[0]?.url || product.image;
                const firstVariant = product.variants?.[0] || {};
                const price = firstVariant.price || product.price || 0;
                const stock = firstVariant.stock || product.stock || 0;
                const grammage = firstVariant.grammage || '1 Unit';
                const title = product.title || product.name;

                return (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 flex items-center justify-center">
                        {imageUrl ? (
                          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{title}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">{product.description}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {typeof product.category === 'object' ? product.category?.name : product.category}
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-bold">
                        {grammage}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-emerald-700">Rs. {price}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8 border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#5c0000] transition"
                  placeholder="e.g. Organic Basmati Rice"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Grammage</label>
                  <select
                    value={formData.grammage}
                    onChange={(e) => setFormData({ ...formData, grammage: e.target.value })}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#5c0000] transition cursor-pointer"
                  >
                    <option value="500g">500g</option>
                    <option value="750g">750g</option>
                    <option value="1kg">1kg</option>
                    <option value="3 pack">3 pack</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#5c0000] transition"
                    placeholder="1200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#5c0000] transition"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#5c0000] transition cursor-pointer"
                >
                  <option value="">{categories.length === 0 ? 'No categories found (Add one first)' : 'Select a category'}</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#5c0000] transition"
                  placeholder="https://res.cloudinary.com/.../image.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-[#5c0000] transition resize-none"
                  placeholder="Product specifications..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5c0000] text-white text-sm font-bold hover:bg-[#420000] transition shadow-md cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}