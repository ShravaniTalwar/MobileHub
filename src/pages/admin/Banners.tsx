import React, { useState, useEffect } from 'react';
import { Image, Plus, Trash2, Check, X, ExternalLink } from 'lucide-react';
import { adminService } from '../../api/services';
import { Banner } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const initialForm = {
    title: '',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1400',
    linkUrl: '/products',
    ctaText: 'Shop Now',
    displayOrder: 1,
    active: true
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllBanners();
      setBanners(data);
    } catch (err: any) {
      showToast('Failed to load banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) return;
    try {
      await adminService.createBanner(formData);
      showToast('Hero banner created successfully!', 'success');
      setShowModal(false);
      setFormData(initialForm);
      loadBanners();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create banner', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this promotional banner?')) return;
    try {
      await adminService.deleteBanner(id);
      showToast('Banner deleted', 'info');
      loadBanners();
    } catch (err: any) {
      showToast('Failed to delete banner', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Homepage Banners</h1>
          <p className="text-xs text-gray-400 mt-1">Configure carousel advertisements, seasonal deals & launch promotions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-gray-400 text-xs">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-gray-400 text-xs">No banners created yet.</div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-gray-800/80 border border-gray-700/80 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div className="relative h-44 bg-gray-900">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-extrabold text-white text-base drop-shadow">{banner.title}</h3>
                  <p className="text-xs text-gray-300 drop-shadow line-clamp-1">{banner.subtitle}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs border-t border-gray-700/60">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">Order: <strong className="text-white">{banner.displayOrder}</strong></span>
                  <span className="text-gray-400">Link: <code className="text-blue-400">{banner.linkUrl}</code></span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    banner.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition"
                    title="Delete banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Homepage Banner</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. iPhone 16 Pro Max - Titanium Beauty"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Subtitle / Deal Hook</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. From ₹1,19,999 with ₹6,000 Instant Bank Discount"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Destination URL</label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
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
                  Add Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
