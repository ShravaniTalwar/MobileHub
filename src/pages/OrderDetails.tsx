import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Package, 
  Printer, 
  Truck, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { orderService } from '../api/services';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { handleImageError } from '../utils/imageFallback';
import { OrderTimeline } from '../components/OrderTimeline';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      orderService
        .getOrderById(Number(id))
        .then((res) => setOrder(res))
        .catch((err) => setError(err.response?.data?.message || 'Failed to load order details'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">{error || 'Could not retrieve information for this order.'}</p>
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-xl transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print Tax Invoice</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Order Information</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Order #{order.orderNumber}</h1>
          <p className="text-xs text-gray-500 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500 block">Total Billed</span>
          <span className="text-2xl font-extrabold text-blue-600">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      {/* Order Status Stepper */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-6">Delivery Progress</h3>
        <OrderTimeline currentStatus={order.orderStatus} />
        {order.trackingNumber && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Airway Bill / Tracking ID: <strong className="font-mono text-gray-900">{order.trackingNumber}</strong></span>
            <Link
              to={`/track-order?trackingId=${order.trackingNumber}`}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              Live Courier Tracking
            </Link>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Shipping Address</span>
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-gray-900">{order.shippingFullName}</p>
            <p>{order.shippingAddressLine1}</p>
            {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
            <p>
              {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
            </p>
            <p className="text-xs text-gray-500 mt-2">Contact: {order.shippingPhone}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Payment Summary</span>
          </div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <strong className="text-gray-900 uppercase">{order.paymentMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount ({order.couponCode}):</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-sm text-gray-900">
              <span>Total Paid:</span>
              <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 font-bold text-sm text-gray-900">
          <Package className="w-4 h-4 text-blue-600" />
          <span>Purchased Items ({order.items.length})</span>
        </div>
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.productImageUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'}
                  alt={item.productName}
                  className="w-16 h-16 object-contain bg-gray-50 p-2 rounded-xl border border-gray-100"
                  onError={(e) => handleImageError(e, 'phone')}
                />
                <div>
                  <Link
                    to={`/products/${item.productId}`}
                    className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-1"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">SKU: {item.productSku || 'MH-PROD'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-8 text-sm">
                <span className="text-gray-500">Qty: <strong>{item.quantity}</strong></span>
                <span className="text-gray-500">{formatCurrency(item.unitPrice)} each</span>
                <span className="font-bold text-gray-900 min-w-[80px] text-right">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
