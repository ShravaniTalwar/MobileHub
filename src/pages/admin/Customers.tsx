import React, { useState, useEffect } from 'react';
import { Users, Search, CheckCircle2, XCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { adminService } from '../../api/services';
import { User } from '../../types';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, [page, search]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllCustomers({
        page,
        size: 10,
        search: search.trim() || undefined
      });
      setCustomers(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err: any) {
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await adminService.toggleCustomerStatus(user.id, !user.active);
      showToast(`User account ${!user.active ? 'enabled' : 'disabled'}`, 'info');
      loadCustomers();
    } catch (err: any) {
      showToast('Failed to change user status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Accounts</h1>
          <p className="text-xs text-gray-400 mt-1">Review verified shoppers, loyalty privileges, and account security</p>
        </div>
      </div>

      <div className="bg-gray-800/80 border border-gray-700/80 p-4 rounded-2xl flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">Loading customer directory...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No registered customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 bg-gray-900/50 border-b border-gray-700/80">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Account State</th>
                  <th className="py-3 px-4 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-750/30 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <span className="text-[10px] text-gray-400 font-normal">{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">{c.phone || 'Not provided'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {c.roles?.map((r) => (
                          <span
                            key={r}
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
                          >
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{c.createdAt ? formatDate(c.createdAt) : '-'}</td>
                    <td className="py-3 px-4">
                      {c.active ? (
                        <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          c.active
                            ? 'bg-rose-900/40 text-rose-300 hover:bg-rose-900/60'
                            : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60'
                        }`}
                      >
                        {c.active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
