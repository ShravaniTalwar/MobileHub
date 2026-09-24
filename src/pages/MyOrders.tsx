import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search,
  ArrowRight
} from 'lucide-react';
import { orderService } from '../api/services';
import { Order, OrderStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { handleImageError } from '../utils/imageFallback';
import { useToast } from '../context/ToastContext';

export const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('Found a better price elsewhere');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders(0, 50);
      setOrders(res.content || []);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancellingOrderId) return;
    try {
      await orderService.cancelOrder(cancellingOrderId, cancelReason);
      showToast('Order cancelled successfully', 'info');
      setShowCancelModal(false);
      setCancellingOrderId(null);
      fetchOrders();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Unable to cancel order', 'error');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE') {
      return ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.orderStatus);
    }
    if (activeFilter === 'DELIVERED') return order.orderStatus === 'DELIVERED';
    if (activeFilter === 'CANCELLED') return order.orderStatus === 'CANCELLED';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full"><Truck className="w-3.5 h-3.5" /> On the way</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full"><Clock className="w-3.5 h-3.5" /> {status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your smartphone and accessory orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1 self-start sm:self-auto text-xs font-semibold">
          {(['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeFilter === filter ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter === 'ALL' ? 'All Orders' : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No orders found</h3>
          <p className="text-sm text-gray-500 mb-6">
            {activeFilter !== 'ALL'
              ? `You don't have any ${activeFilter.toLowerCase()} orders.`
              : "Looks like you haven't placed any orders yet."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm shadow"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {/* Order Header */}
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-gray-500 block">ORDER PLACED</span>
                    <span className="font-semibold text-gray-800">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">TOTAL</span>
                    <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">SHIP TO</span>
                    <span className="font-semibold text-gray-800">{order.shippingFullName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>{getStatusBadge(order.orderStatus)}</div>
                  <span className="text-gray-400">|</span>
                  <div className="text-gray-500 font-mono">#{order.orderNumber}</div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6">
                <div className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.productImageUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'}
                          alt={item.productName}
                          className="w-16 h-16 object-contain bg-gray-50 p-2 rounded-xl border border-gray-100 flex-shrink-0"
                          onError={(e) => handleImageError(e, 'phone')}
                        />
                        <div>
                          <Link
                            to={`/products/${item.productId}`}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 transition"
                          >
                            {item.productName}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity} • {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-sm text-gray-900">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Actions Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-gray-500">
                    Payment: <strong className="text-gray-700">{order.paymentMethod}</strong> ({order.paymentStatus})
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Track Order */}
                    <Link
                      to={`/track-order?trackingId=${order.trackingNumber || order.orderNumber}`}
                      className="text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Shipment</span>
                    </Link>

                    {/* View Details */}
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 px-3.5 py-2 rounded-lg transition"
                    >
                      Order Details
                    </Link>

                    {/* Cancel Order Option */}
                    {['PLACED', 'CONFIRMED'].includes(order.orderStatus) && (
                      <button
                        onClick={() => {
                          setCancellingOrderId(order.id);
                          setShowCancelModal(true);
                        }}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline px-2 py-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Delivery time is too long">Delivery time is too long</option>
                <option value="Change of delivery address">Change of delivery address</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-semibold rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
