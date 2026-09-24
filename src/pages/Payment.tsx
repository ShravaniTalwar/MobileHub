import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  CreditCard, 
  QrCode, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Copy
} from 'lucide-react';
import { orderService, paymentService } from '../api/services';
import { Order } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const Payment: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minute countdown

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC');

  useEffect(() => {
    if (orderNumber) {
      loadOrder(orderNumber);
    }
  }, [orderNumber]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadOrder = async (num: string) => {
    setLoading(true);
    try {
      const data = await orderService.getOrderByNumber(num);
      setOrder(data);
      if (data.paymentStatus === 'PAID') {
        navigate(`/order-success/${num}`);
      }
    } catch (err: any) {
      showToast('Order details not found', 'error');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async (method: string) => {
    if (!order) return;
    setProcessing(true);

    try {
      const txnId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      await paymentService.processPayment(order.id, method, txnId);
      showToast('Payment successful! Verifying...', 'success');
      setTimeout(() => {
        navigate(`/order-success/${order.orderNumber}`);
      }, 1200);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Payment simulation failed', 'error');
      setProcessing(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Securing payment gateway session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Secure Payment Gateway</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Completing transaction for {order.items.length} item(s)</p>
        </div>
        <div className="sm:text-right">
          <span className="text-xs text-gray-500 block">Total Payable</span>
          <span className="text-3xl font-extrabold text-gray-900">{formatCurrency(order.totalAmount)}</span>
          <div className="flex items-center sm:justify-end gap-1.5 text-xs text-orange-600 font-medium mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires in {formatTimer(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Payment Methods Tabs */}
        <div className="md:col-span-4 space-y-2">
          <button
            onClick={() => setActiveTab('upi')}
            className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition ${
              activeTab === 'upi'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm font-bold text-blue-700'
                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <QrCode className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm">UPI / QR Code</div>
              <div className="text-xs text-gray-500 font-normal">GPay, PhonePe, Paytm</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition ${
              activeTab === 'card'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm font-bold text-blue-700'
                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <CreditCard className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm">Credit / Debit Card</div>
              <div className="text-xs text-gray-500 font-normal">Visa, Mastercard, RuPay</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition ${
              activeTab === 'netbanking'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm font-bold text-blue-700'
                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm">Net Banking</div>
              <div className="text-xs text-gray-500 font-normal">SBI, HDFC, ICICI, Axis</div>
            </div>
          </button>

          <div className="pt-4 text-xs text-gray-400 space-y-2 p-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>PCI-DSS Level 1 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>256-Bit SSL Encryption</span>
            </div>
          </div>
        </div>

        {/* Payment Form Details */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {/* UPI Tab */}
            {activeTab === 'upi' && (
              <div className="space-y-6 text-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Scan & Pay with any UPI App</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Scan the QR code below using Google Pay, PhonePe, Paytm or BHIM UPI
                  </p>
                </div>

                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-inner">
                  {/* Stylized QR placeholder */}
                  <div className="w-48 h-48 bg-gray-900 p-2 rounded-xl flex flex-col items-center justify-center text-white relative group">
                    <QrCode className="w-36 h-36 text-white" />
                    <span className="text-[10px] tracking-widest text-blue-400 font-mono mt-1">MOBILEHUB•UPI</span>
                  </div>
                </div>

                <div className="max-w-xs mx-auto bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-700">mobilehub.pay@icici</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('mobilehub.pay@icici');
                      showToast('UPI ID copied to clipboard!', 'info');
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Copy UPI ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => handleSimulatePayment('UPI')}
                    disabled={processing}
                    className="w-full sm:w-auto min-w-[260px] bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2 mx-auto"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>{processing ? 'Processing Payment...' : `Simulate UPI Success (${formatCurrency(order.totalAmount)})`}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Credit/Debit Card Tab */}
            {activeTab === 'card' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSimulatePayment('CREDIT_CARD');
                }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Enter Card Details</h3>
                  <p className="text-xs text-gray-500 mt-1">Pay with Visa, MasterCard, RuPay, or Maestro</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4532 •••• •••• 8910"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Name as printed on card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{processing ? 'Processing Card...' : `Pay ${formatCurrency(order.totalAmount)}`}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Net Banking Tab */}
            {activeTab === 'netbanking' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Select Bank</h3>
                  <p className="text-xs text-gray-500 mt-1">You will be redirected to your bank's secure authorization page</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'HDFC', name: 'HDFC Bank' },
                    { id: 'SBI', name: 'State Bank of India' },
                    { id: 'ICICI', name: 'ICICI Bank' },
                    { id: 'AXIS', name: 'Axis Bank' },
                    { id: 'KOTAK', name: 'Kotak Mahindra' },
                    { id: 'PNB', name: 'Punjab National Bank' }
                  ].map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3 rounded-xl border text-sm font-semibold transition text-left flex flex-col justify-between ${
                        selectedBank === bank.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span>{bank.name}</span>
                      {selectedBank === bank.id && (
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-2 self-end" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleSimulatePayment('NET_BANKING')}
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{processing ? 'Connecting Bank...' : `Proceed with ${selectedBank} (${formatCurrency(order.totalAmount)})`}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
