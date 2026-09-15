import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Category } from '../types';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
          <Layers className="w-3.5 h-3.5" />
          <span>Product Taxonomy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-['Space_Grotesk',sans-serif]">
          Shop by Department
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore curated collections engineered for everyday performance and minimalist modern aesthetics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.slug}`}
            data-testid="category-card"
            data-category-slug={cat.slug}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="aspect-16/10 w-full overflow-hidden bg-slate-100 relative">
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span data-testid="category-count" className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest block">
                  {cat.product_count} Products
                </span>
                <h2 data-testid="category-name" className="text-xl font-bold tracking-tight">{cat.name}</h2>
              </div>
            </div>

            <div className="p-5 flex items-center justify-between">
              <p className="text-xs text-slate-500 line-clamp-2 pr-4">{cat.description}</p>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
