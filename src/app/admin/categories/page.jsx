'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data?.categories || data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory._id}`, formData);
      } else {
        await api.post('/admin/categories', formData);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', image: '' });
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Category Management</h1>
          <p className="text-sm text-gray-500">Organize store product categories and taxonomies.</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', description: '', image: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-[#5c0000] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#420000] transition shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FolderTree className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">No categories found yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-800 flex items-center space-x-3">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-cover border" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <FolderTree className="w-4 h-4" />
                      </div>
                    )}
                    <span>{cat.name}</span>
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="p-4 text-gray-500 text-xs truncate max-w-xs">{cat.description || '-'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer">
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
            <h2 className="text-xl font-bold text-gray-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#5c0000]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}