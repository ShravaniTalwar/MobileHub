import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, ArrowRight, Smartphone } from 'lucide-react';
import { categoryService } from '../api/services';
import { Category } from '../types';

import { FALLBACK_CATEGORIES } from '../data/mockFallbackProducts';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) setCategories(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <LayoutGrid className="w-8 h-8 text-blue-600" />
          <span>Shop by Category</span>
        </h1>
        <p className="text-gray-500 mt-2">Browse our curated mobile hardware categories and audio gear</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-44 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full">
                  {cat.productCount ?? 'Browse'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {cat.description || `Explore the finest selection of ${cat.name.toLowerCase()} at MobileHub.`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
