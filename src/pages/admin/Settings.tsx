import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Store, Truck, Percent, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    storeName: 'MobileHub',
    tagline: 'India\'s Premier Smartphone Destination',
    supportPhone: '1800-425-6624',
    supportEmail: 'support@mobilehub.com',
    storeAddress: 'Outer Ring Road, Kadubeesanahalli, Bengaluru, Karnataka 560103',
    freeShippingThreshold: 999,
    standardShippingFee: 99,
    gstRate: 18,
    currencySymbol: '₹',
    currencyCode: 'INR',
    maintenanceMode: false
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Store settings saved successfully!', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System & Commerce Settings</h1>
        <p className="text-xs text-gray-400 mt-1">Configure global store rules, shipping thresholds, and tax compliance</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Store Details */}
        <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-700 pb-3">
            <Store className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Store Identity & Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Tagline / Brand Claim</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Toll-Free Support Line</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Support Email Address</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 font-semibold mb-1">Corporate Physical Address</label>
            <input
              type="text"
              value={settings.storeAddress}
              onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Shipping & Taxes */}
        <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-700 pb-3">
            <Truck className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">Shipping Rules & Tax Parameters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Free Delivery Min. Order (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-semibold mb-1">Smartphones GST Rate (%)</label>
              <input
                type="number"
                value={settings.gstRate}
                onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl text-sm transition shadow flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
