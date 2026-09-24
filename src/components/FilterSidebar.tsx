import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Brand, Category } from '../types';

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  selectedCategory?: string;
  selectedBrand?: string;
  minPrice?: number;
  maxPrice?: number;
  selectedRam?: string;
  selectedStorage?: string;
  is5g?: boolean;
  minRating?: number;
  onFilterChange: (filters: Record<string, any>) => void;
  onClearAll: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  minPrice,
  maxPrice,
  selectedRam,
  selectedStorage,
  is5g,
  minRating,
  onFilterChange,
  onClearAll,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const priceRanges = [
    { label: 'Under ₹20,000', min: 0, max: 20000 },
    { label: '₹20,000 - ₹40,000', min: 20000, max: 40000 },
    { label: '₹40,000 - ₹70,000', min: 40000, max: 70000 },
    { label: '₹70,000 & Above', min: 70000, max: 200000 },
  ];

  const ramOptions = ['6GB', '8GB', '12GB', '16GB'];
  const storageOptions = ['128GB', '256GB', '512GB'];

  const content = (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-blue" />
          <h3 className="font-bold text-slate-900">Filter By</h3>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-semibold text-brand-orange hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* 5G Switch */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <span className="font-bold text-slate-800 text-xs">5G Smartphones Only</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={!!is5g}
            onChange={(e) => onFilterChange({ is5g: e.target.checked ? true : undefined })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-blue"></div>
        </label>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">Category</h4>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => onFilterChange({ category: undefined })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              !selectedCategory ? 'bg-blue-50 text-brand-blue font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onFilterChange({ category: c.slug })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === c.slug
                  ? 'bg-blue-50 text-brand-blue font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">Brand</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => onFilterChange({ brand: undefined })}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
              !selectedBrand ? 'bg-blue-50 text-brand-blue font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onFilterChange({ brand: b.slug })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedBrand === b.slug
                  ? 'bg-blue-50 text-brand-blue font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Ranges */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">Price Range</h4>
        <div className="space-y-1.5">
          {priceRanges.map((range, i) => {
            const isSelected = minPrice === range.min && maxPrice === range.max;
            return (
              <button
                key={i}
                type="button"
                onClick={() =>
                  onFilterChange(
                    isSelected
                      ? { minPrice: undefined, maxPrice: undefined }
                      : { minPrice: range.min, maxPrice: range.max }
                  )
                }
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected ? 'bg-blue-50 text-brand-blue font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RAM */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">RAM Capacity</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {ramOptions.map((ram) => (
            <button
              key={ram}
              type="button"
              onClick={() => onFilterChange({ ram: selectedRam === ram ? undefined : ram })}
              className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                selectedRam === ram
                  ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {ram}
            </button>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Storage</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {storageOptions.map((storage) => (
            <button
              key={storage}
              type="button"
              onClick={() => onFilterChange({ storage: selectedStorage === storage ? undefined : storage })}
              className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                selectedStorage === storage
                  ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {storage}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Rating */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Minimum Rating</h4>
        <div className="space-y-1">
          {[4.5, 4.0, 3.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onFilterChange({ minRating: minRating === r ? undefined : r })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                minRating === r ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-amber-500 font-bold">★</span>
              <span>{r}★ & above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Desktop View
  return (
    <>
      <div className="hidden lg:block w-64 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24 self-start">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onMobileClose}></div>
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto z-10 shadow-2xl">
            <div className="flex justify-end mb-2">
              <button onClick={onMobileClose} className="p-2 text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
