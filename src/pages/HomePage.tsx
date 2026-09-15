import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Zap,
  Star,
  ChevronRight,
  TrendingUp,
  Headphones,
  Shirt,
  Lamp,
  Activity,
  Briefcase,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/product/ProductSkeleton';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, dealsRes] = await Promise.all([
          api.getProducts({ featured: 'true', limit: 8 }),
          api.getCategories(),
          api.getProducts({ sort: 'discount_desc', limit: 4 })
        ]);
        setFeaturedProducts(prodRes.products || []);
        setCategories(catRes.categories || []);
        setDealProducts(dealsRes.products || []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryIcons: Record<string, React.ReactNode> = {
    electronics: <Headphones className="w-5 h-5 text-indigo-400" />,
    fashion: <Shirt className="w-5 h-5 text-rose-400" />,
    'home-living': <Lamp className="w-5 h-5 text-amber-400" />,
    fitness: <Activity className="w-5 h-5 text-emerald-400" />,
    accessories: <Briefcase className="w-5 h-5 text-cyan-400" />,
    gadgets: <Cpu className="w-5 h-5 text-purple-400" />
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 border border-slate-800 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute -top-36 -left-36 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-36 -right-36 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Gen Commercial E-Commerce</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-['Space_Grotesk',sans-serif]">
                SHOP SMART. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300">
                  LIVE BETTER.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover thoughtfully selected products designed for modern everyday life. Engineered with speed, precision, and reliable SQL cloud transactions.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/shop"
                id="hero-explore-collection-btn"
                data-testid="hero-shop-button"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-sm transition-all hover:scale-102"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/deals"
                id="hero-view-deals-btn"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>View Today&apos;s Deals</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-400 text-xs font-medium">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <RotateCcw className="w-4 h-4 text-indigo-400" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Quality Products</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Stage */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950/80 border border-slate-800 p-4 shadow-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"
                alt="NovaPods Pro Flagship Product"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Highlight Card 1 */}
              <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                    Flagship Pick
                  </span>
                  <p className="font-bold text-white text-sm sm:text-base">NovaPods Pro</p>
                  <p className="text-xs text-slate-400 font-semibold">Active Hybrid ANC • 36h Battery</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-white">₹3,749</span>
                  <p className="text-[11px] text-emerald-400 font-bold">25% OFF</p>
                </div>
              </div>

              {/* Floating Top Rating Badge */}
              <div className="absolute top-8 right-8 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.8 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ANIMATED CATEGORY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Browse by Category</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Curated For Every Lifestyle
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 group transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group relative bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3.5 bg-slate-100 shadow-xs group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 p-1 rounded-lg bg-slate-900/80 backdrop-blur-xs">
                  {categoryIcons[cat.slug] || <Sparkles className="w-4 h-4 text-cyan-400" />}
                </div>
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {cat.product_count ? `${cat.product_count} items` : 'Explore'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-600">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Handpicked Gear</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Innovations
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 group transition-colors"
          >
            <span>See Complete Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. TODAY'S FLASH DEALS HIGHLIGHT */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-950 to-indigo-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 py-12 px-6 sm:px-10 border border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                Limited Time Flash Deals
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Top Discounts Ending Soon
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Save up to 30% on flagship audio, monitors, and smart lifestyle accessories.
              </p>
            </div>
            <Link
              to="/deals"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md shrink-0"
            >
              <span>Explore All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dealProducts.map((prod) => (
              <div key={prod.id} className="bg-slate-900/70 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
                <Link to={`/product/${prod.id}`} className="block aspect-square rounded-xl overflow-hidden bg-slate-950 mb-3 group">
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-cyan-400 font-semibold">{prod.category_name}</span>
                    <span className="bg-rose-500 text-white font-black px-2 py-0.5 rounded text-[10px]">
                      {prod.discount_percent}% OFF
                    </span>
                  </div>
                  <Link to={`/product/${prod.id}`} className="font-bold text-sm text-white hover:text-indigo-400 transition-colors line-clamp-1">
                    {prod.name}
                  </Link>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-black text-white">
                      ₹{prod.discounted_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
