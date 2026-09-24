import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, Check, X } from 'lucide-react';
import { brandService, adminService } from '../../api/services';
import { Brand } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const { showToast } = useToast();

  const initialForm = {
    name: '',
    slug: '',
    description: '',
    logoUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    websiteUrl: 'https://brand.com',
    active: true
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await brandService.getAll();
      setBrands(data);
    } catch (err: any) {
      showToast('Failed to load brands', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logoUrl: brand.logoUrl || initialForm.logoUrl,
      websiteUrl: brand.websiteUrl || initialForm.websiteUrl,
      active: brand.active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await adminService.updateBrand(editingBrand.id, formData);
        showToast('Brand updated successfully', 'success');
      } else {
        await adminService.createBrand(formData);
        showToast('Brand added successfully', 'success');
      }
      setShowModal(false);
      loadBrands();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save brand', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await adminService.deleteBrand(id);
      showToast('Brand deleted', 'info');
      loadBrands();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete brand', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Smartphone Brands</h1>
          <p className="text-xs text-gray-400 mt-1">Manage OEM partners, brand logos & warranty links</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">Loading brands...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 bg-gray-900/50 border-b border-gray-700/80">
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Catalog Models</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-750/30 transition">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-3">
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-8 h-8 object-contain bg-white rounded p-0.5"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center font-bold text-gray-300">
                          {brand.name.charAt(0)}
                        </div>
                      )}
                      <span>{brand.name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">{brand.slug}</td>
                    <td className="py-3 px-4 text-blue-400 hover:underline">
                      <a href={brand.websiteUrl} target="_blank" rel="noreferrer">
                        {brand.websiteUrl?.replace('https://', '') || '-'}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-medium">{brand.productCount ?? 0} Models</td>
                    <td className="py-3 px-4">
                      {brand.active ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-1 text-[11px]">
                          <X className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(brand)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-gray-700 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-gray-700 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingBrand ? 'Edit Brand Profile' : 'Register New Brand'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Logo URL</label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Official Website</label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Brand Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
