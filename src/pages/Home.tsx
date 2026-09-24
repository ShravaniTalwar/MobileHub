import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Award,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import api from '../api/client';
import { Banner, Brand, Category, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { StarRating } from '../components/StarRating';
import { 
  FALLBACK_BANNERS, 
  FALLBACK_CATEGORIES, 
  FALLBACK_BRANDS, 
  FALLBACK_PRODUCTS 
} from '../data/mockFallbackProducts';
import { handleImageError } from '../utils/imageFallback';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_BANNERS);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(FALLBACK_BRANDS);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(FALLBACK_PRODUCTS.filter(p => p.isFeatured));
  const [trendingProducts, setTrendingProducts] = useState<Product[]>(FALLBACK_PRODUCTS.filter(p => p.isTrending));
  const [latestProducts, setLatestProducts] = useState<Product[]>(FALLBACK_PRODUCTS.filter(p => p.isLatest));
  const [loading, setLoading] = useState<boolean>(false);
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bannerRes, catRes, brandRes, featRes, trendRes, lateRes] = await Promise.all([
          api.get<Banner[]>('/banners'),
          api.get<Category[]>('/categories'),
          api.get<Brand[]>('/brands'),
          api.get<Product[]>('/products/featured'),
          api.get<Product[]>('/products/trending'),
          api.get<Product[]>('/products/latest'),
        ]);

        if (Array.isArray(bannerRes.data) && bannerRes.data.length > 0) setBanners(bannerRes.data);
        if (Array.isArray(catRes.data) && catRes.data.length > 0) setCategories(catRes.data);
        if (Array.isArray(brandRes.data) && brandRes.data.length > 0) setBrands(brandRes.data);
        if (Array.isArray(featRes.data) && featRes.data.length > 0) setFeaturedProducts(featRes.data);
        if (Array.isArray(trendRes.data) && trendRes.data.length > 0) setTrendingProducts(trendRes.data);
        if (Array.isArray(lateRes.data) && lateRes.data.length > 0) setLatestProducts(lateRes.data);
      } catch (err) {
        console.error('Failed to load homepage content', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Carousel auto-advance
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="space-y-12">
      {/* 1. HERO PROMOTIONAL BANNER CAROUSEL */}
      <section className="relative overflow-hidden bg-navy-950 text-white min-h-[380px] sm:min-h-[460px] flex items-center">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${
                index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Dark Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-transparent"></div>
              </div>

              {/* Banner Content */}
              <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-12 w-full">
                <div className="max-w-xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/30 border border-blue-400/40 text-blue-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                    MobileHub Exclusive Launch
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                    {banner.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 line-clamp-3">
                    {banner.subtitle}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      to={banner.linkUrl || '/products'}
                      className="px-6 py-3 bg-brand-orange hover:bg-brand-darkOrange text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      {banner.ctaText || 'Shop Smartphones'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/products?category=flagship-phones"
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/20 transition-all"
                    >
                      Explore Offers
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-20 w-full text-center">
            <h1 className="text-4xl font-extrabold text-white">Upgrade Your World</h1>
            <p className="text-slate-300 mt-2">Latest Smartphones. Best Prices. Guaranteed Genuine.</p>
          </div>
        )}

        {/* Carousel Prev/Next Controls */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentBanner((b) => (b - 1 + banners.length) % banners.length)}
              className="absolute left-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentBanner((b) => (b + 1) % banners.length)}
              className="absolute right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentBanner ? 'w-6 bg-brand-orange' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. CATEGORY PILLS / QUICK DISCOVERY */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-xs text-slate-500">Explore our curated collections of devices and accessories</p>
          </div>
          <Link to="/categories" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center flex flex-col items-center justify-between"
            >
              <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden mb-2 p-1 group-hover:scale-110 transition-transform">
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'}
                  alt={cat.name}
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => handleImageError(e, 'phone')}
                />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-brand-blue line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">Handpicked For You</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Featured Smartphones</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
            See More <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Array.isArray(featuredProducts) ? featuredProducts : FALLBACK_PRODUCTS).slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. PROMOTIONAL CALLOUT BANNER: FESTIVE OFFER */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-navy-900 to-navy-950 p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 inline-block">
              Limited Period Offer
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Get Flat ₹1,000 Off on Flagship Phones
            </h3>
            <p className="text-sm text-slate-300">
              Use coupon code <span className="font-mono font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded">FLAT1000</span> or <span className="font-mono font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded">MOBILE500</span> at checkout for instant savings.
            </p>
            <div className="pt-2">
              <Link
                to="/products?category=flagship-phones"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-brand-darkOrange text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Claim Discount Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"
              alt="iPhone 16 Pro Max Offer"
              className="max-h-56 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              onError={(e) => handleImageError(e, 'phone')}
            />
          </div>
        </div>
      </section>

      {/* 5. TRENDING SMARTPHONES */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-orange flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-brand-orange" /> In High Demand
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trending Smartphones</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Array.isArray(trendingProducts) ? trendingProducts : FALLBACK_PRODUCTS).slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 6. BRANDS SHOWCASE (10 BRANDS) */}
      <section className="bg-white py-12 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Explore Official Brands</h2>
            <p className="text-xs text-slate-500 mt-1">
              Official warranty and 100% genuine products directly from world-class smartphone manufacturers
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/products?brand=${brand.slug}`}
                className="group p-5 rounded-2xl border border-slate-200/80 hover:border-brand-blue hover:shadow-lg transition-all flex flex-col items-center justify-center bg-slate-50 hover:bg-white text-center"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden mb-2 bg-white p-1 border border-slate-100 flex items-center justify-center">
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    onError={(e) => handleImageError(e, 'brand')}
                  />
                </div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-brand-blue">{brand.name}</h4>
                <span className="text-[10px] text-slate-400 font-medium">Explore Devices</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST LAUNCHES */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">Fresh In Store</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Latest Launches & Accessories</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Array.isArray(latestProducts) ? latestProducts : FALLBACK_PRODUCTS).slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 8. VERIFIED CUSTOMER TESTIMONIALS */}
      <section className="bg-slate-100 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">Trusted by 500,000+ Customers</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3">
                  <StarRating rating={5} size={16} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">“Unbelievable Camera & Fast Delivery!”</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ordered the iPhone 16 Pro Max from MobileHub. It arrived within 24 hours in Mumbai with original sealed packaging. Applied the MOBILE500 coupon for extra savings!
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-brand-blue font-bold text-xs flex items-center justify-center">
                  RS
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Rahul Sharma</p>
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer, Mumbai
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3">
                  <StarRating rating={5} size={16} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">“Galaxy S25 Ultra is a Masterpiece”</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Got the best exchange bonus and No-Cost EMI on my S25 Ultra. Customer service kept me updated at every step from packing to delivery.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-xs flex items-center justify-center">
                  PV
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Pooja Verma</p>
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer, Bengaluru
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3">
                  <StarRating rating={5} size={16} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">“Super Fast OnePlus 13 Delivery”</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The phone is blistering fast. 100W SuperVOOC charger in the box. Excellent prices compared to retail stores and easy tracking timeline.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs flex items-center justify-center">
                  AK
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Amit Kumar</p>
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer, Delhi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
