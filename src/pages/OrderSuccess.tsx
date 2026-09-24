import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Printer, 
  ArrowRight, 
  FileText, 
  MapPin, 
  CreditCard 
} from 'lucide-react';
import { orderService } from '../api/services';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { handleImageError } from '../utils/imageFallback';

export const OrderSuccess: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      orderService
        .getOrderByNumber(orderNumber)
        .then((res) => setOrder(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Generating order receipt...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Confirmation Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm text-center mb-8">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full">
          Order Confirmed
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">Thank you for your order!</h1>
        <p className="text-gray-600 max-w-md mx-auto text-sm">
          We have received your order #{orderNumber}. A confirmation SMS and email with invoice details have been dispatched.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <Link
            to={`/track-order?trackingId=${order?.trackingNumber || orderNumber}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow transition text-sm"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery</span>
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Order Summary & Delivery Details */}
      {order && (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-sm">
            <div>
              <span className="text-gray-500 text-xs block">Order Number</span>
              <span className="font-bold text-gray-900">#{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Date Placed</span>
              <span className="font-semibold text-gray-800">{formatDate(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Total Amount</span>
              <span className="font-extrabold text-blue-600 text-base">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs block">Payment</span>
              <span className="inline-flex items-center gap-1 font-semibold text-gray-800 uppercase text-xs">
                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Shipping Address */}
            <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-xl flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold text-gray-900">Delivery Address:</span>
                <p className="text-gray-700 font-medium">{order.shippingFullName} ({order.shippingPhone})</p>
                <p className="text-gray-600">
                  {order.shippingAddressLine1}
                  {order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ''}
                </p>
                <p className="text-gray-600">
                  {order.shippingCity}, {order.shippingState} - <strong>{order.shippingPincode}</strong>
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Items in this Order ({order.items.length})
              </h3>
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImageUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'}
                        alt={item.productName}
                        className="w-12 h-12 object-contain bg-gray-50 rounded border border-gray-100 p-1"
                        onError={(e) => handleImageError(e, 'phone')}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} x {formatCurrency(item.unitPrice)}</p>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-gray-900">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-gray-200 pt-4 max-w-xs ml-auto space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>- {formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Paid Total</span>
                <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/products"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <span className="text-gray-300">|</span>
        <Link
          to="/my-orders"
          className="text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1.5"
        >
          <FileText className="w-4 h-4" />
          <span>View All Orders</span>
        </Link>
      </div>
    </div>
  );
};
