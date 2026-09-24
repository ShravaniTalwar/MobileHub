import React from 'react';
import { FileText } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Terms and Conditions</h1>
            <p className="text-xs text-gray-500">Effective Date: September 2026 • MobileHub Retail Technologies Pvt Ltd</p>
          </div>
        </div>

        <div className="prose prose-blue text-sm text-gray-600 space-y-4 leading-relaxed">
          <p>
            Welcome to MobileHub. By accessing our platform, placing orders, or using our mobile-commerce services, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-base font-bold text-gray-900 pt-2">1. Electronic Contracting & Account Responsibility</h2>
          <p>
            By creating an account, you ensure that you are at least 18 years of age or possess legal parental consent. You are solely responsible for maintaining the confidentiality of your credentials and all activities occurring under your account.
          </p>

          <h2 className="text-base font-bold text-gray-900 pt-2">2. Pricing, Invoicing & Tax Details</h2>
          <p>
            All prices listed on MobileHub are in Indian Rupees (INR) and inclusive of 18% Goods and Services Tax (GST). In case of accidental pricing errors or inventory mismatch, MobileHub reserves the right to cancel the order and provide a 100% full refund immediately.
          </p>

          <h2 className="text-base font-bold text-gray-900 pt-2">3. Shipping, Delivery & Couriers</h2>
          <p>
            We partner with premier courier networks (BlueDart, Delhivery, Shadowfax) for insured delivery. Title and risk of loss pass to the customer upon confirmation of delivery by the courier partner.
          </p>

          <h2 className="text-base font-bold text-gray-900 pt-2">4. Official Manufacturer Warranty</h2>
          <p>
            Smartphones sold are covered exclusively by official brand warranty across their authorized service centers in India. Physical damage, water ingress, and unauthorized modifications are excluded per manufacturer terms.
          </p>

          <h2 className="text-base font-bold text-gray-900 pt-2">5. Governing Law & Jurisdiction</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.
          </p>
        </div>
      </div>
    </div>
  );
};
