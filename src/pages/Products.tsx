import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/client';
import { Brand, Category, PageResponse, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { QuickViewModal } from '../components/QuickViewModal';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { 
  FALLBACK_PRODUCTS, 
  FALLBACK_CATEGORIES, 
  FALLBACK_BRANDS 
} from '../data/mockFallbackProducts';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(FALLBACK_BRANDS);
  const [loading, setLoading] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Pagination & Sorting
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  // Filters read from URL params
  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const is5gParam = searchParams.get('is5g') === 'true' ? true : undefined;
  const minRatingParam = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;
  const ramParam = searchParams.get('ram') || '';
  const storageParam = searchParams.get('storage') || '';
  const sortByParam = searchParams.get('sortBy') || 'featured';

  // Load initial Categories & Brands
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get<Category[]>('/categories'),
          api.get<Brand[]>('/brands'),
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products based on filters and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page,
          size: 12,
          sortBy: sortByParam,
        };
        if (queryParam) params.query = queryParam;
        if (categoryParam) params.category = categoryParam;
        if (brandParam) params.brand = brandParam;
        if (minPriceParam !== undefined) params.minPrice = minPriceParam;
        if (maxPriceParam !== undefined) params.maxPrice = maxPriceParam;
        if (is5gParam !== undefined) params.is5g = is5gParam;
        if (minRatingParam !== undefined) params.minRating = minRatingParam;
        if (ramParam) params.ram = ramParam;
        if (storageParam) params.storage = storageParam;

        const res = await api.get<PageResponse<Product>>('/products', { params });
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      } catch (err) {
        console.error('Failed to load products from API, using fallback catalog', err);
        let fallback = [...FALLBACK_PRODUCTS];
        if (categoryParam) fallback = fallback.filter(p => p.categorySlug === categoryParam);
        if (brandParam) fallback = fallback.filter(p => p.brandSlug === brandParam);
        if (queryParam) fallback = fallback.filter(p => p.name.toLowerCase().includes(queryParam.toLowerCase()));
        setProducts(fallback);
        setTotalPages(1);
        setTotalElements(fallback.length);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    page,
    queryParam,
    categoryParam,
    brandParam,
    minPriceParam,
    maxPriceParam,
    is5gParam,
    minRatingParam,
    ramParam,
    storageParam,
    sortByParam,
  ]);

  const updateFilters = (newFilters: Record<string, any>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(val));
      }
    });
    setPage(0);
    setSearchParams(nextParams);
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
    setPage(0);
  };

  const hasActiveFilters =
    !!categoryParam ||
    !!brandParam ||
    minPriceParam !== undefined ||
    maxPriceParam !== undefined ||
    is5gParam !== undefined ||
    minRatingParam !== undefined ||
    !!ramParam ||
    !!storageParam ||
    !!queryParam;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Title and Sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {queryParam
              ? `Results for "${queryParam}"`
              : categoryParam
              ? `${categoryParam.replace('-', ' ').toUpperCase()} PHONES`
              : brandParam
              ? `${brandParam.toUpperCase()} SMARTPHONES`
              : 'All Mobile Phones & Accessories'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-800">{totalElements}</span> authentic smartphones and gear
          </p>
        </div>

        {/* Controls: Mobile Filter Trigger & Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
            Filters {hasActiveFilters && '•'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:block whitespace-nowrap">Sort by:</span>
            <div className="relative">
              <select
                value={sortByParam}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-brand-blue shadow-sm cursor-pointer"
              >
                <option value="featured">Popularity & Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Latest Launches</option>
                <option value="discount">Biggest Discounts</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs font-bold text-slate-500 mr-1">Active Filters:</span>
          {categoryParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-200">
              Category: {categoryParam}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ category: undefined })} />
            </span>
          )}
          {brandParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-200">
              Brand: {brandParam}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ brand: undefined })} />
            </span>
          )}
          {(minPriceParam !== undefined || maxPriceParam !== undefined) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-200">
              Price: ₹{minPriceParam || 0} - ₹{maxPriceParam || '2L+'}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })} />
            </span>
          )}
          {is5gParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-200">
              5G Only
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ is5g: undefined })} />
            </span>
          )}
          {ramParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-200">
              RAM: {ramParam}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ ram: undefined })} />
            </span>
          )}
          {storageParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-200">
              Storage: {storageParam}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ storage: undefined })} />
            </span>
          )}
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-bold text-rose-500 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid & Left Sidebar */}
      <div className="flex gap-8 mt-6">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          categories={categories}
          brands={brands}
          selectedCategory={categoryParam}
          selectedBrand={brandParam}
          minPrice={minPriceParam}
          maxPrice={maxPriceParam}
          selectedRam={ramParam}
          selectedStorage={storageParam}
          is5g={is5gParam}
          minRating={minRatingParam}
          onFilterChange={updateFilters}
          onClearAll={handleClearAll}
          isMobileOpen={mobileFilterOpen}
          onMobileClose={() => setMobileFilterOpen(false)}
        />

        {/* Product Listing Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(i)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                        page === i
                          ? 'bg-brand-blue text-white shadow-md shadow-blue-500/20'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Smartphones Matched Your Filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try resetting some of your filter criteria such as brand, price, or RAM to see more devices.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="mt-5 px-5 py-2.5 bg-brand-blue hover:bg-brand-darkBlue text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
