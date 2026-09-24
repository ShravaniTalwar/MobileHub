import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Zap } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, calculateEMI } from '../utils/formatters';
import { handleImageError } from '../utils/imageFallback';
import { StarRating } from './StarRating';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, isLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product.id, 1, product.color, product.storage, product.ram);
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-4 transition-all duration-300 hover:shadow-xl hover:border-blue-200 flex flex-col justify-between">
      {/* Discount & 5G Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
        {product.discountPercent > 0 && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-orange text-white shadow-sm">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.is5g && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-navy-800 text-white tracking-wider">
            5G
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
          inWishlist
            ? 'bg-rose-50 text-rose-500 shadow-sm ring-1 ring-rose-200'
            : 'bg-white/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm'
        }`}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Product Image Link */}
      <Link to={`/product/${product.slug}`} className="block overflow-hidden rounded-xl pt-4 pb-2 relative">
        <img
          src={product.mainImageUrl}
          alt={product.name}
          className="w-full h-48 sm:h-52 object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => handleImageError(e, product.categorySlug?.includes('accessories') || product.categorySlug?.includes('audio') || product.categorySlug?.includes('smartwatch') ? 'accessory' : 'phone')}
        />

        {/* Quick View Overlay on Desktop Hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={handleQuickView}
            className="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full hover:bg-slate-900 shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        )}
      </Link>

      {/* Product Meta */}
      <div className="pt-2 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-brand-blue uppercase tracking-wider">{product.brandName}</span>
            <span className="text-[11px] text-slate-400">{product.storage || '128GB'}</span>
          </div>

          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-brand-blue transition-colors leading-snug mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800">{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
              <span className="text-[10px] text-emerald-600">★</span>
            </div>
            <span className="text-xs text-slate-400">({product.reviewCount || 0})</span>
          </div>
        </div>

        {/* Price & EMI */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            {calculateEMI(product.price)}
          </p>

          {/* Stock state */}
          <div className="mt-2 mb-3">
            {product.stockQuantity > 0 ? (
              product.stockQuantity <= 5 ? (
                <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Only {product.stockQuantity} left in stock!
                </span>
              ) : (
                <span className="text-[11px] font-medium text-emerald-600">In Stock</span>
              )
            ) : (
              <span className="text-[11px] font-semibold text-rose-500">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={product.stockQuantity <= 0 || adding || isLoading}
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 ${
              product.stockQuantity <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-navy-800 hover:bg-brand-blue text-white shadow-sm hover:shadow-md active:scale-98'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {adding ? 'Adding...' : product.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
