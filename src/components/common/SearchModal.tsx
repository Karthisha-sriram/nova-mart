import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles, Tag, TrendingUp, Package } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('novamart_recent_searches') || '["NovaPods Pro", "Mechanical Keyboard", "Smart Watch"]');
    } catch {
      return ['NovaPods Pro', 'Mechanical Keyboard', 'Smart Watch'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus on mount & escape key listener
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const data = await api.getProducts({ search: query.trim(), limit: 6 });
        setResults(data.products || []);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSelectProduct = (productId: number, productName: string) => {
    saveRecentSearch(productName);
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleExecuteSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery.trim());
    onClose();
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('novamart_recent_searches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('novamart_recent_searches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transition-all transform scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="search-modal-input"
            data-testid="search-input"
            data-role="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecuteSearch(query);
            }}
            placeholder="Search headphones, keyboards, shoes, watches..."
            className="w-full text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            aria-label="Close search (Esc)"
          >
            ESC
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
          {/* Live Search Results */}
          {query.trim() && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <span>Matching Products</span>
                {loading && <span className="text-indigo-600 animate-pulse">Searching catalog...</span>}
              </div>

              {results.length > 0 ? (
                <div className="divide-y divide-slate-100" data-testid="product-search">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id, product.name)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-11 h-11 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">{product.category_name || 'Category'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900">
                          ₹{product.discounted_price.toLocaleString('en-IN')}
                        </span>
                        {product.discount_percent > 0 && (
                          <span className="ml-2 text-xs text-emerald-600 font-semibold">
                            {product.discount_percent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => handleExecuteSearch(query)}
                    className="w-full mt-3 py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                  >
                    <span>View all results for &ldquo;{query}&rdquo;</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                !loading && (
                  <div className="py-8 text-center">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No products found for &ldquo;{query}&rdquo;</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching for &quot;earbuds&quot;, &quot;keyboard&quot;, or &quot;backpack&quot;</p>
                  </div>
                )
              )}
            </div>
          )}

          {/* Quick Suggestions & Recent Searches when query is empty */}
          {!query.trim() && (
            <div className="space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-slate-400 hover:text-slate-600 transition-colors text-[11px]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleExecuteSearch(term)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-500" /> Suggested Categories
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'Electronics', slug: 'electronics' },
                    { name: 'Fashion', slug: 'fashion' },
                    { name: 'Home & Living', slug: 'home-living' },
                    { name: 'Fitness', slug: 'fitness' },
                    { name: 'Accessories', slug: 'accessories' },
                    { name: 'Gadgets', slug: 'gadgets' }
                  ].map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        onClose();
                        navigate(`/shop?category=${cat.slug}`);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all"
                    >
                      <span className="text-xs font-semibold text-slate-800">{cat.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Products Shortcut */}
              <div className="p-3 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Today&apos;s Featured Deals</p>
                    <p className="text-[11px] text-slate-500">Save up to 30% on flagship tech and lifestyle</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/deals');
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  Explore Deals
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
