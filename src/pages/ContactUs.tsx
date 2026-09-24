import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { enquiryService } from '../api/services';
import { useToast } from '../context/ToastContext';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Enquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      await enquiryService.submit(formData);
      setSubmitted(true);
      showToast('Enquiry submitted successfully! Our team will contact you soon.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Order Enquiry',
        message: ''
      });
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit enquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Get in Touch with MobileHub</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Have a question about smartphone specs, warranty, or order status? We are here 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-green-900">Message Received!</h3>
              <p className="text-xs text-green-700">
                Thank you for contacting MobileHub. A support executive will respond to your registered email within 2-4 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-semibold text-green-800 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="rahul@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Order Enquiry">Order Enquiry / Status</option>
                    <option value="Product Advice">Product Advice & Compatibility</option>
                    <option value="Warranty Claim">Warranty Claim / Replacement</option>
                    <option value="Corporate Order">Bulk / Corporate Purchase</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition shadow flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Store Locations & Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-blue-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <h3 className="text-xl font-bold">Direct Customer Care</h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-blue-200">Toll-Free Helpline</div>
                  <div className="font-bold text-base">1800-425-MOBILE (6624)</div>
                  <div className="text-xs text-blue-100">9:00 AM - 9:00 PM IST (Mon-Sun)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-blue-200">Email Inquiries</div>
                  <div className="font-bold text-base">support@mobilehub.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-blue-200">Headquarters</div>
                  <div className="font-medium text-blue-50">
                    MobileHub Retail Technologies Pvt Ltd<br />
                    Outer Ring Road, Kadubeesanahalli<br />
                    Bengaluru, Karnataka - 560103
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 text-sm mb-3">Flagship Experience Centers</h4>
            <div className="space-y-3 text-xs text-gray-600">
              <div>
                <strong className="text-gray-800 block">Bengaluru - Indiranagar 100ft Road</strong>
                <span>Open daily 10:30 AM - 9:30 PM • Live smartphone demo lounge</span>
              </div>
              <div>
                <strong className="text-gray-800 block">Mumbai - Bandra Linking Road</strong>
                <span>Open daily 11:00 AM - 10:00 PM • Authorized brand repair desk</span>
              </div>
              <div>
                <strong className="text-gray-800 block">New Delhi - Connaught Place Outer Circle</strong>
                <span>Open daily 10:30 AM - 9:00 PM • Fast pickup & device trade-in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
