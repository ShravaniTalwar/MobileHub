import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowRight } from 'lucide-react';
import { brandService } from '../api/services';
import { Brand } from '../types';

import { FALLBACK_BRANDS } from '../data/mockFallbackProducts';
import { handleImageError } from '../utils/imageFallback';

export const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(FALLBACK_BRANDS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    brandService
      .getAll()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) setBrands(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Award className="w-8 h-8 text-blue-600" />
          <span>Official Brand Stores</span>
        </h1>
        <p className="text-gray-500 mt-2">100% Genuine authorized warranties from India's favorite smartphone manufacturers</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-44 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/products?brandId=${brand.id}`}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between p-6 text-center"
            >
              <div className="h-24 flex items-center justify-center p-2 mb-4 bg-gray-50 rounded-xl">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-16 max-w-full object-contain group-hover:scale-105 transition-transform"
                    onError={(e) => handleImageError(e, 'brand')}
                  />
                ) : (
                  <span className="text-2xl font-black text-gray-800 tracking-tight">{brand.name}</span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition">
                  {brand.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {brand.description || `Browse authorized ${brand.name} flagship smartphones and accessories.`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
