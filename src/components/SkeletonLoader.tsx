import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse flex flex-col justify-between">
      <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
      <div className="space-y-2">
        <div className="w-20 h-4 bg-slate-200 rounded"></div>
        <div className="w-full h-5 bg-slate-200 rounded"></div>
        <div className="w-28 h-4 bg-slate-200 rounded"></div>
        <div className="flex gap-2 items-center pt-2">
          <div className="w-24 h-6 bg-slate-200 rounded"></div>
          <div className="w-16 h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="w-full h-10 bg-slate-200 rounded-xl mt-4"></div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 border-b border-slate-100 flex items-center px-6 gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="w-1/3 h-4 bg-slate-200 rounded"></div>
            <div className="w-1/4 h-3 bg-slate-200 rounded"></div>
          </div>
          <div className="w-20 h-6 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonLoader: React.FC<{ count?: number; type?: 'card' | 'table' }> = ({ count = 4, type = 'card' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        type === 'table' ? <TableSkeleton key={i} /> : <ProductCardSkeleton key={i} />
      ))}
    </>
  );
};
