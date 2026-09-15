import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
      <div className="aspect-square bg-slate-200 w-full" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-3 bg-slate-200 rounded w-12" />
          <div className="h-3 bg-slate-200 rounded w-16" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-slate-200 rounded w-20" />
          <div className="h-8 bg-slate-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
};
