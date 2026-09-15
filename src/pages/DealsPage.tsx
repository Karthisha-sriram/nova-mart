import React, { useEffect, useState } from 'react';
import { Zap, Clock, Sparkles, Filter } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/product/ProductSkeleton';

export const DealsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [discountFilter, setDiscountFilter] = useState<number>(0);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({ sort: 'discount_desc', limit: 20 });
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const filteredProducts = products.filter(
    (p) => discountFilter === 0 || p.discount_percent >= discountFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner for Flash Deals */}
      <div className="bg-gradient-to-r from-rose-600 via-indigo-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Today&apos;s Flash Drop</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk',sans-serif]">
            Exclusive Mega Savings
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-lg">
            Save up to 30% across premium mechanical peripherals, active noise cancelling audio, and smart lifestyle tech.
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-widest block mb-1">
            Deals Refresh In
          </span>
          <div className="flex items-center gap-2 font-mono text-xl sm:text-2xl font-black">
            <span>18h</span>
            <span>:</span>
            <span>42m</span>
            <span>:</span>
            <span>19s</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
            Discount:
          </span>
          {[0, 15, 20, 25].map((disc) => (
            <button
              key={disc}
              onClick={() => setDiscountFilter(disc)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                discountFilter === disc
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {disc === 0 ? 'All Deals' : `${disc}%+ Off`}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> deals
        </span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
