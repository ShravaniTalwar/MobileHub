import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Percent, Check, X } from 'lucide-react';
import { adminService } from '../../api/services';
import { Coupon } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const initialForm = {
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 10000,
    maxDiscountAmount: 3000,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    usageLimit: 1000,
    active: true
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllCoupons();
      setCoupons(data);
    } catch (err: any) {
      showToast('Failed to load coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;
    try {
      await adminService.createCoupon(formData);
      showToast('Promotional coupon created successfully!', 'success');
      setShowModal(false);
      setFormData(initialForm);
      loadCoupons();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create coupon', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await adminService.deleteCoupon(id);
      showToast('Coupon removed', 'info');
      loadCoupons();
    } catch (err: any) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Coupons & Promo Codes</h1>
          <p className="text-xs text-gray-400 mt-1">Configure festival discounts, bank offers, and customer retention coupons</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">Loading active vouchers...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No discount coupons configured.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 bg-gray-900/50 border-b border-gray-700/80">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min. Cart Value</th>
                  <th className="py-3 px-4">Max Cap</th>
                  <th className="py-3 px-4">Usage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {coupons.map((cp) => (
                  <tr key={cp.id} className="hover:bg-gray-750/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-400 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-blue-400" />
                      {cp.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {cp.discountType === 'PERCENTAGE' ? `${cp.discountValue}% OFF` : formatCurrency(cp.discountValue)}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {cp.minOrderAmount ? formatCurrency(cp.minOrderAmount) : 'No Minimum'}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {cp.maxDiscountAmount ? formatCurrency(cp.maxDiscountAmount) : 'No Cap'}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {cp.usageCount} {cp.usageLimit ? `/ ${cp.usageLimit}` : 'uses'}
                    </td>
                    <td className="py-3 px-4">
                      {cp.active ? (
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
                      <button
                        onClick={() => handleDelete(cp.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            <h3 className="text-base font-bold text-white">Create New Coupon</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE2026"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
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
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
