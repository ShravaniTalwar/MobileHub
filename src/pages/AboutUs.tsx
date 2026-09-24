import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, ShieldCheck, Truck, Headphones, Award, Store, ArrowRight } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          About MobileHub
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          India's Most Trusted Smartphone Destination
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Founded with a vision to deliver genuine smartphones at competitive Indian prices with lightning-fast delivery, zero-cost EMI, and unmatched customer care.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl">
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-extrabold">500,000+</div>
          <div className="text-xs sm:text-sm text-blue-100 mt-1">Smartphones Delivered</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-extrabold">19,000+</div>
          <div className="text-xs sm:text-sm text-blue-100 mt-1">Pin Codes Serviced</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-extrabold">100%</div>
          <div className="text-xs sm:text-sm text-blue-100 mt-1">Genuine Warranty</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-extrabold">4.8 / 5</div>
          <div className="text-xs sm:text-sm text-blue-100 mt-1">Customer Rating</div>
        </div>
      </div>

      {/* Value Pillars */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Millions Choose MobileHub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Direct Brand Partnerships</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We source directly from Apple, Samsung, OnePlus, Xiaomi, Realme, and Vivo. Every device is backed by official brand manufacturer warranty across India.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Express 24-48 Hr Dispatch</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              With automated fulfillment hubs in Bengaluru, Mumbai, and Delhi, your smartphone is safely packed and dispatched via premium express air couriers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Dedicated Phone Specialists</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Our support team includes mobile tech experts ready to assist with pre-purchase comparisons, trade-ins, data migration, and warranty service.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 sm:p-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Looking for your next smartphone?</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
          Explore our wide range of 5G smartphones, flagship cameras, and fast chargers at unbeatable prices.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition"
        >
          <span>Shop Now</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};
