import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const AdminReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const { showToast } = useToast();

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Date,Orders,Gross Revenue,GST Collected,Shipping Fees\n2026-09-01,14,750000,135000,0\n2026-09-02,22,1120000,201600,0\n2026-09-03,19,980000,176400,0';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mobilehub_sales_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sales report exported to CSV successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales & Financial Reports</h1>
          <p className="text-xs text-gray-400 mt-1">Audit Gross Merchandise Value (GMV), GST liability & brand turnover</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
          >
            <option value="week">This Week</option>
            <option value="month">Current Month (September 2026)</option>
            <option value="quarter">Q3 FY26</option>
            <option value="year">Full Year 2026</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total GMV</span>
          <div className="text-2xl font-black text-white mt-1">{formatCurrency(4850000)}</div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">+24.5% vs previous period</p>
        </div>

        <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Average Order Value (AOV)</span>
          <div className="text-2xl font-black text-white mt-1">{formatCurrency(48500)}</div>
          <p className="text-[11px] text-gray-400 mt-1">Driven by 5G flagship purchases</p>
        </div>

        <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total GST Liability (18%)</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(873000)}</div>
          <p className="text-[11px] text-gray-400 mt-1">Ready for GSTR-1 & GSTR-3B filings</p>
        </div>
      </div>

      {/* Brand Revenue Table */}
      <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl overflow-hidden shadow-lg p-5">
        <h3 className="text-base font-bold text-white mb-4">Turnover by Smartphone Manufacturer</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 bg-gray-900/50 border-b border-gray-700/80">
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Units Sold</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Market Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {[
                { brand: 'Apple', units: 28, revenue: 2688000, share: '55.4%' },
                { brand: 'Samsung', units: 34, revenue: 1428000, share: '29.4%' },
                { brand: 'OnePlus', units: 18, revenue: 540000, share: '11.1%' },
                { brand: 'Xiaomi', units: 12, revenue: 194000, share: '4.1%' }
              ].map((row) => (
                <tr key={row.brand} className="hover:bg-gray-750/30 transition">
                  <td className="py-3 px-4 font-bold text-white">{row.brand}</td>
                  <td className="py-3 px-4 text-gray-300">{row.units} units</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{formatCurrency(row.revenue)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: row.share }}
                        />
                      </div>
                      <span className="text-gray-400 text-[10px] font-bold">{row.share}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
