import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-xs text-gray-500">Last updated: September 2026 • Compliant with Information Technology Act, 2000</p>
          </div>
        </div>

        <div className="prose prose-blue text-sm text-gray-600 space-y-4 leading-relaxed">
          <p>
            At <strong>MobileHub</strong>, your privacy is paramount. This Privacy Policy details the types of personal data we collect, how we store and safeguard it, and your rights concerning your personal information.
          </p>

          <h2 className="text-base font-bold text-gray-900 pt-2">1. Information We Collect</h2>
          <p>
            When you register an account, make a purchase, or contact customer care, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact Information: Name, email address, mobile phone number, delivery address, postal code.</li>
            <li>Transaction Details: Products purchased, order totals, chosen payment method, GSTIN (if corporate).</li>
            <li>Device & Log Data: IP address, browser type, operating system for fraud prevention.</li>
          </ul>

          <h2 className="text-base font-bold text-gray-900 pt-2">2. How We Use Your Data</h2>
          <p>
            Your information is used strictly to process orders, schedule doorstep courier delivery, send SMS order updates, manage warranty claims, and offer personalized shopping recommendations. We do not sell your personal data to third parties.
          </p>

          <h2 className="text-base font-bold text-gray-900 pt-2">3. Payment Security</h2>
          <p>
            We do not store your complete credit card number or CVV on our servers. All financial transactions are encrypted using 256-bit SSL encryption and processed through RBI-compliant, PCI-DSS Level 1 certified payment gateways.
          </p>

          <h2 className="text-base font-bold text-gray-900 pt-2">4. Your Rights & Grievance Officer</h2>
          <p>
            You have the right to review, update, or delete your account data at any time through your Profile settings. For grievance escalation, reach out to our Data Protection Officer at <code>grievance@mobilehub.com</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
