import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  Building,
  Home
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { addressService, orderService } from '../api/services';
import { Address, PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatters';
import { handleImageError } from '../utils/imageFallback';

export const Checkout: React.FC = () => {
  const { cart, appliedCoupon, discountAmount, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Address Form State
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    landmark: '',
    isDefault: true,
    addressType: 'HOME'
  });

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [customerNotes, setCustomerNotes] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressService.getAll();
      setAddresses(data);
      if (data.length > 0) {
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        setSelectedAddressId(defaultAddr.id || null);
      } else {
        setShowAddressForm(true);
      }
    } catch (err) {
      // If none exist, show form
      setShowAddressForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.pincode) {
      showToast('Please fill all required address fields', 'warning');
      return;
    }

    try {
      const saved = await addressService.create(newAddress);
      setAddresses([...addresses, saved]);
      setSelectedAddressId(saved.id || null);
      setShowAddressForm(false);
      showToast('Address added successfully', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && !showAddressForm) {
      showToast('Please select or add a delivery address', 'warning');
      setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        addressId: selectedAddressId || undefined,
        newAddress: showAddressForm ? newAddress : undefined,
        couponCode: typeof appliedCoupon === 'string' ? appliedCoupon : (appliedCoupon as any)?.code,
        paymentMethod: paymentMethod,
        customerNotes: customerNotes
      };

      const order = await orderService.createOrder(orderPayload);
      clearCart();
      showToast('Order placed successfully!', 'success');

      if (paymentMethod === 'COD') {
        navigate(`/order-success/${order.orderNumber}`);
      } else {
        // Online simulated payment screen
        navigate(`/payment/${order.orderNumber}`);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Add products to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Explore Smartphones
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Checkout Steps Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-gray-200 -z-10" />
          
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>1. Delivery Address</span>
          </button>

          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>2. Order Review</span>
          </button>

          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>3. Payment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Select Delivery Address
                </h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Address
                  </button>
                )}
              </div>

              {/* Address Form */}
              {showAddressForm ? (
                <form onSubmit={handleSaveAddress} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">New Address Details</h3>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number (10 digits) *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Flat, House No., Building, Street *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      placeholder="e.g. Flat 402, Sunshine Heights, MG Road"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Area, Colony, Sector (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.addressLine2 || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      placeholder="e.g. Indiranagar, Stage 2"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">City / District *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode *</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        placeholder="560001"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition"
                    >
                      Save & Use This Address
                    </button>
                  </div>
                </form>
              ) : (
                /* Address Cards */
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition ${
                        selectedAddressId === addr.id
                          ? 'border-blue-600 bg-blue-50/40'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="addressGroup"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id || null)}
                          className="mt-1 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{addr.fullName}</span>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              {addr.addressType === 'WORK' ? <Building className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                              {addr.addressType || 'HOME'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Phone: {addr.phone}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedAddressId && !showAddressForm) {
                      showToast('Please select or add an address', 'warning');
                      return;
                    }
                    setStep(2);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2"
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Order Review */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Review Items & Delivery
              </h2>

              <div className="divide-y divide-gray-100 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center gap-4">
                    <img
                      src={item.productImageUrl || item.productImage || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'}
                      alt={item.productName}
                      className="w-16 h-16 object-contain bg-gray-50 p-2 rounded-lg border border-gray-100"
                      onError={(e) => handleImageError(e, 'phone')}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.productName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(item.subtotal)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                        Express Delivery
                      </span>
                      <p className="text-xs text-gray-400 mt-1">Est. 2-3 Days</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Order Notes / Delivery Instructions</label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Please leave package at reception or call upon arrival"
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  &larr; Back to Address
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition flex items-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Select Payment Method
              </h2>

              <div className="space-y-3">
                {[
                  {
                    id: 'UPI',
                    title: 'UPI (Google Pay, PhonePe, Paytm, BHIM)',
                    badge: 'Fast & Seamless',
                    desc: 'Pay instantly via QR code or your registered UPI ID'
                  },
                  {
                    id: 'CREDIT_CARD',
                    title: 'Credit / Debit Card',
                    badge: 'All Major Cards',
                    desc: 'Visa, MasterCard, RuPay, Diners with 3D Secure OTP'
                  },
                  {
                    id: 'COD',
                    title: 'Cash on Delivery (COD)',
                    badge: 'Pay at Doorstep',
                    desc: 'Pay using cash or UPI at the time of delivery'
                  }
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === method.id
                        ? 'border-blue-600 bg-blue-50/40'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentGroup"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as PaymentMethod)}
                        className="mt-1 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{method.title}</span>
                          <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded">
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  &larr; Back to Review
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-lg flex items-center gap-2 text-base"
                >
                  <Lock className="w-4 h-4" />
                  <span>{submitting ? 'Placing Order...' : `Pay ${formatCurrency(finalTotal)}`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon Discount ({typeof appliedCoupon === 'string' ? appliedCoupon : (appliedCoupon as any)?.code})</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span>
                  {cart.subtotal >= 999 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span>{formatCurrency(99)}</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-500 text-xs">
                <span>Estimated Taxes (GST 18%)</span>
                <span>Included</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline font-bold text-gray-900 text-lg">
                <span>Payable Amount</span>
                <span className="text-blue-600">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>100% Secure Checkout with 256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>GST Tax Invoice provided for warranty & claims</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
