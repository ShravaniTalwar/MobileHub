import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Filter 
} from 'lucide-react';
import { adminService } from '../../api/services';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, [page, selectedStatus, search]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllOrders({
        page,
        size: 10,
        status: selectedStatus || undefined,
        search: search.trim() || undefined
      });
      setOrders(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus, trackingInput || undefined);
      showToast(`Order status updated to ${newStatus}`, 'success');
      setTrackingInput('');
      loadOrders();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const statuses: OrderStatus[] = [
    'PLACED',
    'CONFIRMED',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Order Management</h1>
          <p className="text-xs text-gray-400 mt-1">Review customer purchases, assign courier tracking & update fulfillment status</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-800/80 border border-gray-700/80 p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 bg-gray-900/50 border-b border-gray-700/80">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tracking AWB</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-750/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">
                      #{order.orderNumber}
                      <span className="block text-[10px] text-gray-400 font-normal">{formatDate(order.createdAt)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{order.shippingFullName || order.userName}</div>
                      <div className="text-[10px] text-gray-400">{order.shippingCity}, {order.shippingState}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-300 font-medium">{order.paymentMethod}</div>
                      <span className="text-[10px] text-emerald-400">{order.paymentStatus}</span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-[11px] text-blue-300 focus:outline-none focus:border-blue-500 font-bold uppercase"
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                      {order.trackingNumber ? (
                        <span className="text-blue-400 font-bold">{order.trackingNumber}</span>
                      ) : (
                        <span className="text-gray-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-gray-700 transition"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-900/50 border-t border-gray-700/80 flex items-center justify-between text-xs text-gray-400">
            <span>Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded bg-gray-800 text-gray-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <h3 className="text-base font-bold text-white">Order Details #{selectedOrder.orderNumber}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-700/50 space-y-1">
                <span className="font-bold text-gray-200">Customer & Shipping Address</span>
                <p>{selectedOrder.shippingFullName} ({selectedOrder.shippingPhone})</p>
                <p>{selectedOrder.shippingAddressLine1}, {selectedOrder.shippingCity}, {selectedOrder.shippingState} - {selectedOrder.shippingPincode}</p>
              </div>

              <div>
                <span className="font-bold text-gray-200 block mb-2">Purchased Items ({selectedOrder.items.length})</span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center bg-gray-900/40 p-2 rounded-lg">
                      <div>
                        <div className="font-semibold text-white">{it.productName}</div>
                        <span className="text-[10px] text-gray-400">Qty: {it.quantity} x {formatCurrency(it.unitPrice)}</span>
                      </div>
                      <span className="font-bold text-emerald-400">{formatCurrency(it.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-sm text-white">
                <span>Total Amount:</span>
                <span className="text-emerald-400">{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Set Courier AWB Tracking Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. BD-892301994"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-white font-mono"
                  />
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.orderStatus)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-xl transition"
                  >
                    Save AWB
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
