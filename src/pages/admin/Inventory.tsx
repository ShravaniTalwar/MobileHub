import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Save 
} from 'lucide-react';
import { adminService } from '../../api/services';
import { useToast } from '../../context/ToastContext';

export const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});
  const { showToast } = useToast();

  useEffect(() => {
    loadInventory();
  }, [lowStockOnly]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await adminService.getInventory({ lowStock: lowStockOnly || undefined });
      const items = res.content || [];
      setInventory(items);
      const initialMap: Record<number, number> = {};
      items.forEach((item: any) => {
        initialMap[item.productId || item.id] = item.currentStock ?? item.stockQuantity;
      });
      setStockUpdates(initialMap);
    } catch (err: any) {
      showToast('Failed to load inventory levels', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId: number) => {
    const qty = stockUpdates[productId];
    if (qty === undefined || qty < 0) return;

    try {
      await adminService.updateStock(productId, qty);
      showToast('Inventory stock updated successfully!', 'success');
      loadInventory();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update stock', 'error');
    }
  };

  const filtered = inventory.filter((item: any) => {
    const name = item.productName || item.product?.name || item.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Warehouse & Stock Control</h1>
          <p className="text-xs text-gray-400 mt-1">Audit inventory levels, set replenishment triggers, and prevent stock-outs</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800/80 border border-gray-700/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU or device model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-300">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="rounded bg-gray-900 border-gray-700 text-amber-500 focus:ring-0"
          />
          <span className="text-amber-400">Show Low Stock Only (&le; 5 units)</span>
        </label>
      </div>

      {/* Table */}
      <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">Auditing warehouse inventory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No inventory records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 bg-gray-900/50 border-b border-gray-700/80">
                  <th className="py-3 px-4">Smartphone / SKU</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filtered.map((item: any) => {
                  const pId = item.productId || item.product?.id || item.id;
                  const pName = item.productName || item.product?.name || item.name;
                  const pBrand = item.brandName || item.product?.brandName || item.brand?.name || 'MobileHub';
                  const currentQty = stockUpdates[pId] ?? (item.currentStock ?? item.stockQuantity);
                  const isLow = currentQty <= 5 && currentQty > 0;
                  const isOut = currentQty === 0;

                  return (
                    <tr key={pId} className="hover:bg-gray-750/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white line-clamp-1">{pName}</div>
                        <span className="text-[10px] text-gray-400 font-mono">ID: #{pId}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 font-medium">{pBrand}</td>
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-base font-black text-white">{currentQty}</span>
                        <span className="text-gray-400 text-[10px] ml-1">units</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="0"
                            value={stockUpdates[pId] ?? ''}
                            onChange={(e) =>
                              setStockUpdates({ ...stockUpdates, [pId]: Number(e.target.value) })
                            }
                            className="w-20 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white text-center font-bold"
                          />
                          <button
                            onClick={() => handleUpdateStock(pId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition"
                            title="Save stock level"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
