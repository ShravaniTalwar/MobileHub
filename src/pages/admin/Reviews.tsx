import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react';
import { adminService } from '../../api/services';
import { Review } from '../../types';
import { formatDate } from '../../utils/formatters';
import { StarRating } from '../../components/StarRating';
import { useToast } from '../../context/ToastContext';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    loadReviews();
  }, [statusFilter]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllReviews({
        status: statusFilter || undefined
      });
      setReviews(res.content || []);
    } catch (err: any) {
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await adminService.moderateReview(id, status);
      showToast(`Review ${status.toLowerCase()}!`, 'success');
      loadReviews();
    } catch (err: any) {
      showToast('Failed to moderate review', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await adminService.deleteReview(id);
      showToast('Review deleted', 'info');
      loadReviews();
    } catch (err: any) {
      showToast('Failed to delete review', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Review Moderation</h1>
          <p className="text-xs text-gray-400 mt-1">Audit customer ratings, feedback authenticity & verified purchase badges</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 self-start sm:self-auto"
        >
          <option value="">All Reviews</option>
          <option value="PENDING">Pending Moderation</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-gray-800/80 border border-gray-700/80 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">No reviews to display.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 bg-gray-900/50 border-b border-gray-700/80">
                  <th className="py-3 px-4">Smartphone</th>
                  <th className="py-3 px-4">Reviewer</th>
                  <th className="py-3 px-4">Rating & Content</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-750/30 transition">
                    <td className="py-3 px-4 font-bold text-white max-w-[180px] truncate">
                      {rev.productName || `Product #${rev.productId}`}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{rev.userName}</td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="flex items-center gap-1 mb-1">
                        <StarRating rating={rev.rating} size={14} />
                        <span className="font-bold text-white text-xs ml-1">{rev.title}</span>
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2">{rev.comment}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        rev.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : rev.status === 'REJECTED'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{formatDate(rev.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleModerate(rev.id, 'APPROVED')}
                            className="p-1.5 text-emerald-400 hover:bg-emerald-950/60 rounded-lg transition"
                            title="Approve review"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {rev.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleModerate(rev.id, 'REJECTED')}
                            className="p-1.5 text-amber-400 hover:bg-amber-950/60 rounded-lg transition"
                            title="Reject review"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-950/60 rounded-lg transition"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
