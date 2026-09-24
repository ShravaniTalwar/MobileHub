import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  CheckCircle2,
  MapPin,
  Sparkles,
  Share2,
  ChevronRight,
  Star,
  MessageSquare,
} from 'lucide-react';
import api from '../api/client';
import { Product, Review } from '../types';
import { formatCurrency, calculateEMI, formatDate } from '../utils/formatters';
import { handleImageError } from '../utils/imageFallback';
import { FALLBACK_PRODUCTS } from '../data/mockFallbackProducts';
import { StarRating } from '../components/StarRating';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, isLoading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Selected Variants
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedRam, setSelectedRam] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Delivery Pincode Checker
  const [pincode, setPincode] = useState<string>('400053');
  const [pincodeChecked, setPincodeChecked] = useState<boolean>(true);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  // Active Tab: specs vs reviews
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'reviews'>('specs');

  useEffect(() => {
    if (!slug) return;
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get<Product>(`/products/slug/${slug}`);
        const p = res.data && res.data.id ? res.data : (FALLBACK_PRODUCTS.find(f => f.slug === slug || String(f.id) === slug) || FALLBACK_PRODUCTS[0]);
        setProduct(p);
        setSelectedImage(p.mainImageUrl);
        setSelectedColor(p.color || 'Standard');
        setSelectedStorage(p.storage || '128GB');
        setSelectedRam(p.ram || '8GB');

        // Fetch Related products safely
        try {
          const relRes = await api.get<Product[]>(`/products/${p.id}/related`);
          if (Array.isArray(relRes.data) && relRes.data.length > 0) {
            setRelatedProducts(relRes.data);
          } else {
            setRelatedProducts(FALLBACK_PRODUCTS.filter(item => item.id !== p.id).slice(0, 4));
          }
        } catch (e) {
          setRelatedProducts(FALLBACK_PRODUCTS.filter(item => item.id !== p.id).slice(0, 4));
        }

        // Fetch Reviews safely
        try {
          const revRes = await api.get<Review[]>(`/reviews/product/${p.id}`);
          if (Array.isArray(revRes.data)) {
            setReviews(revRes.data);
          }
        } catch (e) {
          // Keep default reviews
        }

        // Estimate Delivery (3 days from today)
        const date = new Date();
        date.setDate(date.getDate() + 3);
        setEstimatedDelivery(
          date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
        );
      } catch (err) {
        console.error('Failed to load product details from API, using fallback data', err);
        const fallback = FALLBACK_PRODUCTS.find(f => f.slug === slug || String(f.id) === slug) || FALLBACK_PRODUCTS[0];
        setProduct(fallback);
        setSelectedImage(fallback.mainImageUrl);
        setSelectedColor(fallback.color || 'Standard');
        setSelectedStorage(fallback.storage || '128GB');
        setSelectedRam(fallback.ram || '8GB');
        setRelatedProducts(FALLBACK_PRODUCTS.filter(item => item.id !== fallback.id).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 mt-2">The smartphone you requested does not exist or has been discontinued.</p>
        <Link to="/products" className="mt-6 inline-block px-6 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-sm">
          Browse All Phones
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity, selectedColor, selectedStorage, selectedRam);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, quantity, selectedColor, selectedStorage, selectedRam);
    navigate('/cart');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeChecked(true);
      const date = new Date();
      date.setDate(date.getDate() + 2);
      setEstimatedDelivery(
        date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
      );
      success(`Delivery is available to PIN ${pincode}!`);
    } else {
      toastError('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toastError('Please log in to submit a review');
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await api.post<Review>('/reviews', {
        productId: product.id,
        rating: newRating,
        title: newTitle,
        comment: newComment,
      });
      setReviews([res.data, ...reviews]);
      success('Thank you! Your verified review has been published.');
      setReviewModalOpen(false);
      setNewTitle('');
      setNewComment('');
    } catch (err: any) {
      toastError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const colorVariants = ['Midnight', 'Titanium Silver', 'Phantom Black', 'Ice Blue'];
  const storageVariants = ['128GB', '256GB', '512GB', '1TB'];
  const ramVariants = ['8GB', '12GB', '16GB'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-brand-blue">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-brand-blue">Smartphones</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?brand=${product.brandSlug}`} className="hover:text-brand-blue">{product.brandName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery (Left) & Buy Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-96 scrollbar-thin">
            {(product.images && product.images.length > 0 ? product.images : [product.mainImageUrl]).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-xl p-1 bg-slate-50 border flex-shrink-0 transition-all ${
                  selectedImage === img
                    ? 'border-brand-blue ring-2 ring-blue-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} - ${idx}`} 
                  className="w-full h-full object-contain" 
                  onError={(e) => handleImageError(e, product.categorySlug?.includes('accessories') || product.categorySlug?.includes('audio') || product.categorySlug?.includes('smartwatch') ? 'accessory' : 'phone')}
                />
              </button>
            ))}
          </div>

          {/* Main Large Image with Zoom Container */}
          <div className="flex-1 bg-slate-50 rounded-2xl p-8 border border-slate-100 flex items-center justify-center relative group min-h-[380px]">
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full shadow-sm">
                {product.discountPercent}% OFF
              </span>
            )}

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm ${
                inWishlist ? 'bg-rose-50 text-rose-500' : 'bg-white text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
            </button>

            <img
              src={selectedImage}
              alt={product.name}
              className="max-h-80 sm:max-h-96 object-contain group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              onError={(e) => handleImageError(e, product.categorySlug?.includes('accessories') || product.categorySlug?.includes('audio') || product.categorySlug?.includes('smartwatch') ? 'accessory' : 'phone')}
            />
          </div>
        </div>

        {/* Right Column: Information, Variants & Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Brand & Title */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-blue bg-blue-50 px-2.5 py-1 rounded-md">
                {product.brandName}
              </span>
              <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
                <span>★</span>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {product.reviewCount || 0} Verified Ratings & {reviews.length} Reviews
              </span>
            </div>

            {/* Price & EMI Section */}
            <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Save {formatCurrency(product.originalPrice - product.price)} ({product.discountPercent}%)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Inclusive of all taxes (18% GST included in price)</p>
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>{calculateEMI(product.price)} • Credit Card & Debit Card EMI available</span>
              </div>
            </div>

            {/* Variant Selectors: Storage, RAM, Color */}
            <div className="mt-6 space-y-4">
              {/* Storage Selection */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Internal Storage: <span className="text-brand-blue">{selectedStorage}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {storageVariants.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStorage(st)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                        selectedStorage === st
                          ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Color Finish: <span className="text-brand-blue">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {colorVariants.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition flex items-center gap-2 ${
                        selectedColor === col
                          ? 'bg-blue-50 text-brand-blue border-brand-blue font-bold shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status & Quantity Stepper */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      disabled={quantity >= product.stockQuantity}
                      onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                      className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  {product.stockQuantity > 0 ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> In Stock Ready to Ship
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-500">Currently Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* CTAs: Add to Cart & Buy Now */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={product.stockQuantity <= 0 || cartLoading}
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm bg-brand-orange hover:bg-brand-darkOrange text-white shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                type="button"
                disabled={product.stockQuantity <= 0 || cartLoading}
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm bg-navy-900 hover:bg-navy-800 text-white shadow-lg shadow-navy-950/20 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                Buy Now
              </button>
            </div>

            {/* Delivery & Pincode Checker */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-800 block mb-2">Delivery & Services</span>
              <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter Indian PIN Code"
                    className="w-full text-xs font-bold px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue uppercase"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
                >
                  Check
                </button>
              </form>

              {pincodeChecked && (
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Express Delivery by <span className="font-bold">{estimatedDelivery}</span>
                  </p>
                  <p className="text-slate-500 pl-5.5">Cash on Delivery (COD) available for this pincode.</p>
                </div>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="w-5 h-5 text-brand-blue mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">100% Genuine</span>
                <span className="text-[10px] text-slate-400">Brand Sealed</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <RotateCcw className="w-5 h-5 text-brand-orange mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">7 Days Return</span>
                <span className="text-[10px] text-slate-400">Easy Replacement</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Brand Warranty</span>
                <span className="text-[10px] text-slate-400">{product.warranty || '1 Year'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Description, Reviews */}
      <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex border-b border-slate-200 gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'specs' ? 'text-brand-blue' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
            {activeTab === 'specs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"></span>}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'description' ? 'text-brand-blue' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Features
            {activeTab === 'description' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"></span>}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'reviews' ? 'text-brand-blue' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Verified Customer Reviews ({reviews.length})
            {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"></span>}
          </button>
        </div>

        {/* Tab 1: Specifications Matrix */}
        {activeTab === 'specs' && (
          <div className="py-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Complete Specifications Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Brand</span>
                <span className="font-bold text-slate-900">{product.brandName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Model Name</span>
                <span className="font-bold text-slate-900">{product.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Display</span>
                <span className="font-bold text-slate-900">{product.display || 'OLED 120Hz'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Processor</span>
                <span className="font-bold text-slate-900">{product.processor || 'High performance chipset'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Camera</span>
                <span className="font-bold text-slate-900">{product.camera || 'Multi-lens system'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">RAM</span>
                <span className="font-bold text-slate-900">{product.ram || '8GB'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Internal Storage</span>
                <span className="font-bold text-slate-900">{product.storage || '128GB'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Battery & Charging</span>
                <span className="font-bold text-slate-900">{product.battery || '5000 mAh'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Operating System</span>
                <span className="font-bold text-slate-900">{product.os || 'Android / iOS'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Network & 5G</span>
                <span className="font-bold text-slate-900">{product.is5g ? 'Dual SIM 5G Supported' : '4G LTE'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Warranty</span>
                <span className="font-bold text-slate-900">{product.warranty || '1 Year Brand Warranty'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Description */}
        {activeTab === 'description' && (
          <div className="py-6 text-slate-700 text-sm leading-relaxed space-y-4 max-w-3xl">
            <p>{product.description}</p>
            <p>
              Engineered with premier craftsmanship, each unit is thoroughly tested and guaranteed by official authorized distribution channels. Designed for fast multitasking, vivid gaming, professional-grade photography, and long battery life.
            </p>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Customer Ratings & Verified Feedback</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={product.rating} size={16} />
                  <span className="text-sm font-bold text-slate-800">{product.rating.toFixed(1)} out of 5</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    toastError('Please log in to write a review');
                  } else {
                    setReviewModalOpen(true);
                  }
                }}
                className="px-4 py-2 bg-brand-blue hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition"
              >
                <MessageSquare className="w-4 h-4" />
                Write a Review
              </button>
            </div>

            {/* Review List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <StarRating rating={rev.rating} size={13} />
                        <h4 className="font-bold text-xs text-slate-900">{rev.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">{rev.comment}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                      <span className="text-slate-800 font-bold">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-emerald-600 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-500">No reviews yet for this product. Be the first to review!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-slate-900">Review {product.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Share your experience with other shoppers</p>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Rating</label>
                <StarRating
                  rating={newRating}
                  size={24}
                  interactive={true}
                  onRatingChange={(r) => setNewRating(r)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Blazing fast and amazing battery!"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell us what you loved about this device..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-blue text-white hover:bg-brand-darkBlue shadow-md transition"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <h3 className="text-xl font-extrabold text-slate-900 mb-6">Similar Products You May Like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
