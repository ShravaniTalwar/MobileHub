import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Package, 
  Calendar, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../api/services';
import { Order } from '../types';
import { formatDate } from '../utils/formatters';
import { OrderTimeline } from '../components/OrderTimeline';

export const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const trackingParam = searchParams.get('trackingId') || '';

  const [searchQuery, setSearchQuery] = useState(trackingParam);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (trackingParam) {
      handleSearch(trackingParam);
    }
  }, [trackingParam]);

  const handleSearch = async (query: string) => {
    const clean = query.trim();
    if (!clean) return;

    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getOrderByNumber(clean);
      setOrder(data);
    } catch (err: any) {
      setError('No shipment found for the provided Tracking ID / Order Number. Please verify and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Track Your Shipment</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Enter your Order Number (e.g. MH-2026-...) or Courier Tracking Airway Bill (AWB) to get real-time delivery status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order Number or Tracking ID..."
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl transition shadow flex items-center justify-center gap-2"
          >
            {loading ? 'Searching...' : 'Track Package'}
          </button>
        </form>
      </div>

      {/* Error View */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-sm mb-8 flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Result Card */}
      {order && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm space-y-6">
          <div className="bg-blue-50/70 p-6 border-b border-blue-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">Current Status</span>
              <span className="text-xl font-bold text-gray-900 mt-0.5 block">{order.orderStatus.replace(/_/g, ' ')}</span>
              <span className="text-xs text-gray-500">AWB Tracking: {order.trackingNumber || 'Pending Courier Assignment'}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Destination</span>
              <span className="font-semibold text-gray-800 text-sm">{order.shippingCity}, {order.shippingPincode}</span>
            </div>
          </div>

          <div className="px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">Shipment Timeline</h3>
            <OrderTimeline currentStatus={order.orderStatus} />
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
            <div>
              Ordered on <strong className="text-gray-900">{formatDate(order.createdAt)}</strong>
            </div>
            <Link
              to={`/orders/${order.id}`}
              className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Full Order Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
