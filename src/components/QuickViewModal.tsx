import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, calculateEMI } from '../utils/formatters';
import { handleImageError } from '../utils/imageFallback';
import { StarRating } from './StarRating';
import { useCart } from '../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, isLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  if (!isOpen || !product) return null;

  const currentStorage = selectedStorage || product.storage || '128GB';
  const currentColor = selectedColor || product.color || 'Standard';

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity, currentColor, currentStorage, product.ram);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 p-6 bg-slate-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
          <img
            src={product.mainImageUrl}
            alt={product.name}
            className="max-h-64 object-contain"
            onError={(e) => handleImageError(e, product.categorySlug?.includes('accessories') || product.categorySlug?.includes('audio') || product.categorySlug?.includes('smartwatch') ? 'accessory' : 'phone')}
          />
        </div>

        {/* Details & Action */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">{product.brandName}</span>
            <h2 className="text-lg font-bold text-slate-900 mt-1 leading-snug">{product.name}</h2>

            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={product.rating} size={14} />
              <span className="text-xs font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
              )}
              {product.discountPercent > 0 && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-brand-orange">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-emerald-600 font-medium mt-1">{calculateEMI(product.price)}</p>

            {/* Specs summary */}
            <div className="mt-4 text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p><span className="font-semibold text-slate-700">Display:</span> {product.display || 'Full HD+ OLED'}</p>
              <p><span className="font-semibold text-slate-700">Processor:</span> {product.processor || 'Octa Core'}</p>
              <p><span className="font-semibold text-slate-700">Camera:</span> {product.camera || 'High-res setup'}</p>
            </div>

            {/* Quantity Stepper */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= product.stockQuantity}
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={product.stockQuantity <= 0 || isLoading}
              onClick={handleAddToCart}
              className="w-full py-3 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Add {quantity} to Cart ({formatCurrency(product.price * quantity)})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
