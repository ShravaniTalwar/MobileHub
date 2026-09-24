import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CheckCircle, 
  X, 
  Percent, 
  Info,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, calculateEMI } from '../utils/formatters';
import { handleImageError } from '../utils/imageFallback';

export const Cart: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    discountAmount, 
    finalTotal 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    const res = await applyCoupon(couponCodeInput.trim());
    setCouponLoading(false);
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode.trim())) {
      setDeliveryStatus(`Delivery available to ${pincode.trim()} within 2-3 business days.`);
    } else {
      showToast('Please enter a valid 6-digit Indian PIN code', 'warning');
      setDeliveryStatus(null);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to proceed to checkout', 'info');
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Looks like you haven't added any smartphones or accessories to your cart yet. Explore our latest flagship deals!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-md hover:shadow-lg"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const freeShippingThreshold = 999;
  const currentTotal = cart.grandTotal ?? cart.subtotal;
  const isFreeDelivery = currentTotal >= freeShippingThreshold;
  const progressToFreeDelivery = Math.min(100, (currentTotal / freeShippingThreshold) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Shopping Cart ({cart.totalItems} items)</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-1.5 font-medium text-gray-800">
                <Truck className="w-4 h-4 text-blue-600" />
                {isFreeDelivery ? (
                  <span className="text-green-600 font-semibold">Yay! You unlocked FREE Super-fast Delivery!</span>
                ) : (
                  <span>Add {formatCurrency(freeShippingThreshold - currentTotal)} more for <strong>FREE Delivery</strong></span>
                )}
              </span>
              <span className="text-xs text-gray-500 font-semibold">{Math.round(progressToFreeDelivery)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${isFreeDelivery ? 'bg-green-500' : 'bg-blue-600'}`}
                style={{ width: `${progressToFreeDelivery}%` }}
              />
            </div>
          </div>

          {/* Cart Items Header */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Shopping Cart
                <span className="text-sm font-normal text-gray-500">({cart.items.length} unique items)</span>
              </h1>
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:underline transition"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            {/* Item Rows */}
            <div className="divide-y divide-gray-100">
              {cart.items.map((item) => {
                const emi = calculateEMI(item.price);
                return (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:bg-gray-50/50 transition">
                    {/* Thumbnail */}
                    <Link to={`/products/${item.productId}`} className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-lg p-2 border border-gray-100 flex items-center justify-center">
                      <img
                        src={item.productImageUrl || item.productImage || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'}
                        alt={item.productName}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => handleImageError(e, 'phone')}
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${item.productId}`} 
                        className="text-base font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 transition"
                      >
                        {item.productName}
                      </Link>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded">In Stock</span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-500">No Cost EMI from {formatCurrency(emi)}/mo</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">{formatCurrency(item.originalPrice)}</span>
                        )}
                        <span className="text-xs text-gray-500">x {item.quantity} = <strong>{formatCurrency(item.subtotal)}</strong></span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition font-medium"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.availableStock !== undefined && item.quantity >= item.availableStock}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition font-medium"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Value props banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50/70 p-4 rounded-xl border border-blue-100 text-sm text-blue-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span>100% Genuine Brand Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span>Express 24-48hr Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span>7 Days Return / Replacement</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              Coupons & Bank Offers
            </h3>

            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="font-bold text-green-800 uppercase text-sm">
                      {typeof appliedCoupon === 'string' ? appliedCoupon : (appliedCoupon as any)?.code}
                    </span>
                    <p className="text-xs text-green-600 font-medium">Applied! Saved {formatCurrency(discountAmount)}</p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-gray-400 hover:text-red-500 p-1 transition"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. WELCOME500)"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCodeInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>
            )}

            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <p>💡 Tip: Use <strong className="text-blue-600">WELCOME500</strong> for ₹500 off on your first order!</p>
              <p>💡 Use <strong className="text-blue-600">FESTIVE10</strong> for 10% discount on cart value!</p>
            </div>
          </div>

          {/* Delivery Pincode Box */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Check Delivery Pincode
            </h3>
            <form onSubmit={handleCheckDelivery} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit PIN"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                Check
              </button>
            </form>
            {deliveryStatus && (
              <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {deliveryStatus}
              </p>
            )}
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Price Details</h3>
            
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Price ({cart.totalItems} items)</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Estimated Delivery</span>
                <span>
                  {isFreeDelivery ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : (
                    <span>{formatCurrency(99)}</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-500 text-xs">
                <span>Included GST (18%)</span>
                <span>Calculated</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline font-bold text-gray-900 text-lg">
                <span>Total Amount</span>
                <span className="text-blue-600">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Savings Callout */}
            {discountAmount > 0 && (
              <div className="bg-green-50 text-green-700 text-xs font-semibold p-2.5 rounded-lg text-center">
                You are saving {formatCurrency(discountAmount)} on this order!
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-base"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span>Safe & Secure 256-Bit Encrypted Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
