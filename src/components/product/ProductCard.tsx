import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlistBouncing, setIsWishlistBouncing] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const discountedPrice = product.discounted_price || Math.round(product.price * (1 - (product.discount_percent || 0) / 100));
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(product.id, 1, product.name, product.image_url);
    } catch (err) {
      // Error handled in toast
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlistBouncing(true);
    setTimeout(() => setIsWishlistBouncing(false), 400);
    await toggleWishlist(product);
  };

  return (
    <article
      data-testid="product-card"
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discount_percent > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-rose-600 text-white shadow-sm uppercase tracking-wide">
              {product.discount_percent}% OFF
            </span>
          )}
          {product.is_new === 1 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-indigo-600 text-white shadow-sm uppercase tracking-wide">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button with Heart Animation */}
        <button
          type="button"
          data-testid="add-to-wishlist"
          onClick={handleToggleWishlist}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all duration-200 z-10 min-h-[36px] min-w-[36px] flex items-center justify-center ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-sm border border-rose-200'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600 border border-slate-200/60 shadow-xs'
          } ${isWishlistBouncing ? 'scale-125' : 'scale-100'}`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Link Button Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden group-hover:flex items-center justify-center transition-opacity duration-200 z-10">
          <Link
            to={`/product/${product.id}`}
            className="w-full py-2 bg-slate-950/80 hover:bg-slate-950 text-white text-xs font-bold rounded-xl backdrop-blur-sm flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </Link>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Stock Indicator */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[10px]">
              {product.category_name || 'Electronics'}
            </span>
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-semibold">Only {product.stock} left</span>
            ) : (
              <span className="text-emerald-600 font-semibold">In Stock</span>
            )}
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.id}`}
            data-testid="product-title"
            className="block text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400">({product.review_count})</span>
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span data-testid="product-price" className="text-base font-extrabold text-slate-900">
                ₹{discountedPrice.toLocaleString('en-IN')}
              </span>
              {product.discount_percent > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discount_percent > 0 && (
              <p className="text-[10px] font-semibold text-emerald-600">
                Save ₹{(product.price - discountedPrice).toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* Add to Cart Button with data-testid */}
          <button
            type="button"
            data-testid="add-to-cart"
            disabled={isOutOfStock || isAdding}
            onClick={handleAddToCart}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 min-h-[40px] transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isAdding
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-md shadow-indigo-600/20'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdding ? (
              <Check className="w-4 h-4" />
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline-block">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
