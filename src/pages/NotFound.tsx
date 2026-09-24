import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Smartphone } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Smartphone className="w-12 h-12 rotate-12 text-blue-600" />
        </div>

        <div>
          <span className="text-7xl font-extrabold text-blue-600 tracking-tight">404</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Page Not Found</h1>
          <p className="text-gray-500 text-sm mt-2">
            The smartphone, category, or page you are looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm shadow"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Phones</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
