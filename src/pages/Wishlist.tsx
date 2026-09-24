import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';
import { handleImageError } from '../utils/imageFallback';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = async (product: any) => {
    try {
      await addToCart(product.id, 1);
      await removeFromWishlist(product.id);
      showToast(`Moved ${product.name} to Cart!`, 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to move to cart', 'error');
    }
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Heart className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Save items you love to your wishlist and revisit them anytime. Start browsing now!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-md hover:shadow-lg"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">You have {wishlist.length} items saved for later</p>
        </div>
        <button
          onClick={clearWishlist}
          className="self-start sm:self-auto text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 hover:underline transition"
        >
          <Trash2 className="w-4 h-4" />
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item: any) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
          >
            {/* Image Container */}
            <div className="relative pt-[80%] bg-gray-50 p-4">
              <Link to={`/products/${item.id}`} className="absolute inset-0 flex items-center justify-center p-4">
                <img
                  src={item.mainImageUrl || item.images?.[0] || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => handleImageError(e, 'phone')}
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full flex items-center justify-center shadow-sm transition"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <Link
                  to={`/products/${item.id}`}
                  className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 transition"
                >
                  {item.name}
                </Link>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-gray-900">{formatCurrency(item.price)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-gray-400 line-through">{formatCurrency(item.originalPrice)}</span>
                  )}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => handleMoveToCart(item)}
                className="mt-4 w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-semibold py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
