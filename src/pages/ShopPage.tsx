import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Star,
  Check,
  PackageOpen,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/product/ProductSkeleton';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter values
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [priceRange, setPriceRange] = useState<number>(30000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load Categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters or pagination changes
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: currentPage,
        limit: 12,
        sort: selectedSort
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (priceRange < 30000) params.maxPrice = priceRange;
      if (selectedRating > 0) params.rating = selectedRating;
      if (inStockOnly) params.inStock = 'true';
      if (minDiscount > 0) params.discount = minDiscount;

      const data = await api.getProducts(params);
      setProducts(data.products || []);
      setTotalCount(data.pagination.total || 0);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch shop products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedSort, priceRange, selectedRating, inStockOnly, minDiscount, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync state with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedSort !== 'featured') params.sort = selectedSort;
    if (currentPage > 1) params.page = String(currentPage);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, selectedSort, currentPage, setSearchParams]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSort('featured');
    setPriceRange(30000);
    setSelectedRating(0);
    setInStockOnly(false);
    setMinDiscount(0);
    setCurrentPage(1);
  };

  const sortOptions = [
    { value: 'featured', label: 'Featured Recommendations' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_desc', label: 'Highest Customer Rating' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'discount_desc', label: 'Biggest Discount' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-900">{products.length}</span> of{' '}
            <span className="font-bold text-slate-900">{totalCount}</span> products
          </p>
        </div>

        {/* Top Controls: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box with data-testid */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              id="shop-search-input"
              data-testid="search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              id="shop-sort-select"
              data-testid="sort-select"
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto appearance-none bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            id="mobile-filters-trigger"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Filter Sidebar + Right Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Categories
            </label>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                data-testid="category-filter-all"
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span>{totalCount}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  data-testid={`category-filter-${cat.slug}`}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[11px] text-slate-400">{cat.product_count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="price-range-slider" className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Max Price
              </label>
              <span className="text-xs font-bold text-indigo-600">
                ₹{priceRange.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              id="price-range-slider"
              data-testid="price-slider"
              type="range"
              min={999}
              max={30000}
              step={500}
              value={priceRange}
              onChange={(e) => {
                setPriceRange(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹999</span>
              <span>₹30,000+</span>
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Customer Rating
            </label>
            <div className="space-y-1">
              {[4, 3].map((stars) => (
                <button
                  key={stars}
                  onClick={() => {
                    setSelectedRating(selectedRating === stars ? 0 : stars);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedRating === stars
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{stars} Stars &amp; Above</span>
                  </div>
                  {selectedRating === stars && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Filter */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Min Discount
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[10, 20, 25].map((disc) => (
                <button
                  key={disc}
                  onClick={() => {
                    setMinDiscount(minDiscount === disc ? 0 : disc);
                    setCurrentPage(1);
                  }}
                  className={`py-1 text-center rounded-lg text-xs font-bold transition-colors ${
                    minDiscount === disc
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {disc}%+
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* RIGHT: PRODUCTS GRID & PAGINATION */}
        <main className="lg:col-span-3 space-y-8">
          {/* Active filter badges preview */}
          {(selectedCategory !== 'all' || selectedRating > 0 || minDiscount > 0 || inStockOnly || priceRange < 30000) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-lg border border-indigo-100">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} aria-label="Remove category filter">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedRating > 0 && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-semibold px-2.5 py-1 rounded-lg border border-amber-100">
                  {selectedRating}★ &amp; up
                  <button onClick={() => setSelectedRating(0)} aria-label="Remove rating filter">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {minDiscount > 0 && (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 font-semibold px-2.5 py-1 rounded-lg border border-rose-100">
                  {minDiscount}%+ off
                  <button onClick={() => setMinDiscount(0)} aria-label="Remove discount filter">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg border border-emerald-100">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} aria-label="Remove in stock filter">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="product-search">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* No Results State */
            <div
              data-testid="no-products-found"
              className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs"
            >
              <PackageOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-extrabold text-slate-800">No products match your criteria</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your price range or clearing category and rating filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNumber
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="font-extrabold text-base text-slate-900">Filter Products</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Max Price</span>
                <span className="text-indigo-600">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={999}
                max={30000}
                step={500}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <button
              onClick={() => {
                setMobileFilterOpen(false);
              }}
              className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
