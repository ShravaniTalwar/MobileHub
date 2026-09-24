import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  Building, 
  Home, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { addressService } from '../api/services';
import { Address } from '../types';
import { useToast } from '../context/ToastContext';

export const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { showToast } = useToast();

  const initialForm: Omit<Address, 'id'> = {
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    landmark: '',
    isDefault: false,
    addressType: 'HOME'
  };

  const [formData, setFormData] = useState<Omit<Address, 'id'>>(initialForm);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressService.getAll();
      setAddresses(data);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to load addresses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark || '',
      isDefault: addr.isDefault,
      addressType: addr.addressType || 'HOME'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      showToast('Please fill all mandatory fields', 'warning');
      return;
    }

    try {
      if (editingAddress && editingAddress.id) {
        await addressService.update(editingAddress.id, formData);
        showToast('Address updated successfully', 'success');
      } else {
        await addressService.create(formData);
        showToast('Address added successfully', 'success');
      }
      setShowModal(false);
      loadAddresses();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save address', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressService.delete(id);
      showToast('Address deleted', 'info');
      loadAddresses();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Could not delete address', 'error');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefault(id);
      showToast('Default address updated', 'success');
      loadAddresses();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to set default', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Delivery Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Saved shipping destinations for 1-click checkout</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No addresses saved yet</h3>
          <p className="text-sm text-gray-500 mb-6">Add an address for fast and effortless order delivery.</p>
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition"
          >
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-2xl border-2 p-6 shadow-sm flex flex-col justify-between transition ${
                addr.isDefault ? 'border-blue-600 bg-blue-50/20' : 'border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      {addr.addressType === 'WORK' ? <Building className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                      {addr.addressType || 'HOME'}
                    </span>
                    {addr.isDefault && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(addr)}
                      className="text-gray-400 hover:text-blue-600 p-1 transition"
                      title="Edit address"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => addr.id && handleDelete(addr.id)}
                      className="text-gray-400 hover:text-red-600 p-1 transition"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-base">{addr.fullName}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                </p>
                {addr.landmark && (
                  <p className="text-xs text-gray-500 mt-1">Landmark: {addr.landmark}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">Mobile: <strong>{addr.phone}</strong></p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                {!addr.isDefault && addr.id ? (
                  <button
                    onClick={() => handleSetDefault(addr.id!)}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Default Shipping Address
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Flat, House No., Building *</label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Area, Street, Sector</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="addrType"
                      checked={formData.addressType === 'HOME'}
                      onChange={() => setFormData({ ...formData, addressType: 'HOME' })}
                      className="text-blue-600"
                    />
                    Home (All day delivery)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="addrType"
                      checked={formData.addressType === 'WORK'}
                      onChange={() => setFormData({ ...formData, addressType: 'WORK' })}
                      className="text-blue-600"
                    />
                    Work (10 AM - 6 PM delivery)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
