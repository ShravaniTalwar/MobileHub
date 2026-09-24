import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: 'Are all smartphones sold on MobileHub 100% brand authentic?',
      a: 'Yes! All smartphones and accessories sold on MobileHub are 100% genuine, brand-sealed, and sourced directly from authorized brand manufacturers or their official national distributors. Every phone includes valid IMEI numbers that can be registered on the brand website for warranty verification.'
    },
    {
      q: 'How does No Cost EMI work on MobileHub?',
      a: 'No Cost EMI allows you to pay for your smartphone in equal monthly installments without any interest charges. The total interest amount charged by the bank is given upfront as an instant discount at checkout on major credit cards (HDFC, ICICI, Axis, SBI, Kotak).'
    },
    {
      q: 'What is your delivery timeframe and shipping cost?',
      a: 'We offer FREE express delivery across India on all orders above ₹999. Orders below ₹999 incur a nominal fee of ₹99. Orders are usually dispatched within 24 hours and delivered in 2 to 4 business days depending on your delivery pin code.'
    },
    {
      q: 'What is your return and replacement policy?',
      a: 'We offer a 7-day replacement window for any smartphone that arrives damaged, defective, or with hardware malfunctions. Our support team can arrange a doorstep reverse pickup and deliver a replacement unit post-inspection.'
    },
    {
      q: 'Can I get a GST Tax Invoice for input tax credit (ITC)?',
      a: 'Yes, absolutely! Every order placed on MobileHub generates a 18% GST tax invoice with detailed breakups of CGST/SGST or IGST. You can view or download the invoice anytime from your "My Orders" dashboard.'
    },
    {
      q: 'How do I track my active courier shipment?',
      a: 'Once your order is packed and dispatched from our fulfillment center, you will receive an SMS and email with the Courier Airway Bill (AWB) tracking number. You can also visit our "Track Order" page anytime and enter your order number or tracking ID for real-time milestones.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h1>
        <p className="text-gray-500 text-sm">Answers to common inquiries about smartphones, orders, payments, and delivery.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 divide-y divide-gray-100 shadow-sm overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="transition">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-gray-900 hover:text-blue-600 transition"
              >
                <span className="text-base">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed bg-blue-50/20">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
