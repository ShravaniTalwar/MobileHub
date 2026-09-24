import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Footer: React.FC = () => {
  const { success } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      success('Thank you for subscribing to MobileHub newsletter!');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-navy-950 text-slate-300 pt-14 pb-8 border-t border-navy-800">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-navy-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Products</h4>
              <p className="text-xs text-slate-400">Direct from authorized brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Delivery</h4>
              <p className="text-xs text-slate-400">Across 19,000+ Indian pincodes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-brand-orange">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7 Days Easy Replacement</h4>
              <p className="text-xs text-slate-400">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Brand Warranty</h4>
              <p className="text-xs text-slate-400">1-Year official service support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center text-white">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white">
                Mobile<span className="text-brand-orange">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 pr-6">
              MobileHub is India’s premier destination for genuine smartphones, tablets, wearables, and smartphone accessories. Experience top flagship launches, verified reviews, unbeatable exchange offers, and express doorstep delivery.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-blue" />
                MobileHub Tech Tower, BKC, Bandra East, Mumbai, Maharashtra 400051
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-blue" />
                Toll Free: 1800-266-9999 (9:00 AM – 9:00 PM IST)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-blue" />
                support@mobilehub.com
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Popular Categories</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/products?category=flagship-phones" className="hover:text-white transition">Flagship Smartphones</Link></li>
              <li><Link to="/products?category=5g-phones" className="hover:text-white transition">5G Android Phones</Link></li>
              <li><Link to="/products?category=foldable-phones" className="hover:text-white transition">Foldable & Flip Phones</Link></li>
              <li><Link to="/products?category=budget-phones" className="hover:text-white transition">Budget Phones Under ₹25k</Link></li>
              <li><Link to="/products?category=tablets" className="hover:text-white transition">Apple iPads & Android Tablets</Link></li>
              <li><Link to="/products?category=smartwatches" className="hover:text-white transition">Smartwatches & Fitness</Link></li>
              <li><Link to="/products?category=audio-accessories" className="hover:text-white transition">Audio & GaN Chargers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/orders" className="hover:text-white transition">Track Your Order</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Help Center & Enquiries</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About MobileHub</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stay Connected</h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get exclusive mobile launch alerts, coupon drops, and weekly tech deals.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-navy-900 border border-navy-700 text-white placeholder-slate-500 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-brand-blue"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-brand-blue hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                Subscribe Now
              </button>
            </form>

            <div className="mt-6">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Accepted Payments</span>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-navy-900 rounded border border-navy-700 text-[10px] font-bold text-slate-300">UPI</span>
                <span className="px-2 py-1 bg-navy-900 rounded border border-navy-700 text-[10px] font-bold text-slate-300">RuPay</span>
                <span className="px-2 py-1 bg-navy-900 rounded border border-navy-700 text-[10px] font-bold text-slate-300">Visa</span>
                <span className="px-2 py-1 bg-navy-900 rounded border border-navy-700 text-[10px] font-bold text-slate-300">MasterCard</span>
                <span className="px-2 py-1 bg-navy-900 rounded border border-navy-700 text-[10px] font-bold text-slate-300">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-navy-900 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} MobileHub Retail Limited. All rights reserved. Registered under Ministry of Corporate Affairs, India.</p>
      </div>
    </footer>
  );
};
