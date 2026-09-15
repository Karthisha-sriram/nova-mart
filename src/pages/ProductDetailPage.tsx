import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  MessageSquarePlus,
  ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Review submission modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('Alex Sharma');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart, showToast } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getProduct(id);
        if (data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.image_url);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-4 text-left">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-10 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">The requested product could not be located in our catalog.</p>
        <Link to="/shop" className="mt-6 inline-block px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;
  const galleryImages = [product.image_url, ...(product.additional_images || [])];

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity, product.name, product.image_url);
    } catch {
      // Handled in CartContext
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await api.addReview({
        productId: product.id,
        userName: reviewerName,
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.review) {
        setProduct((prev) => {
          if (!prev) return prev;
          const updatedReviews = [res.review, ...(prev.reviews || [])];
          return {
            ...prev,
            reviews: updatedReviews,
            review_count: prev.review_count + 1
          };
        });
        showToast({
          title: 'Review Posted',
          message: 'Thank you for your feedback! Your review is now live.',
          type: 'success'
        });
        setReviewModalOpen(false);
        setReviewComment('');
      }
    } catch (err: any) {
      showToast({
        title: 'Review Failed',
        message: err.message || 'Unable to submit review',
        type: 'error'
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link to="/shop" className="hover:text-indigo-600 transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link to={`/shop?category=${product.category_slug}`} className="hover:text-indigo-600 transition-colors">
          {product.category_name}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <section aria-labelledby="product-title" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {product.discount_percent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider">
                {product.discount_percent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-indigo-600 shadow-md scale-102'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              {product.category_name}
            </span>
            <h1 id="product-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 font-['Space_Grotesk',sans-serif]">
              {product.name}
            </h1>

            {/* Rating & Review Counter */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-900">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Based on <span className="font-bold text-slate-800">{product.review_count}</span> verified ratings
              </span>
            </div>
          </div>

          {/* Price Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-slate-900">
                  ₹{product.discounted_price.toLocaleString('en-IN')}
                </span>
                {product.discount_percent > 0 && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-600 font-bold mt-1">
                Inclusive of all taxes &bull; Save ₹{(product.price - product.discounted_price).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Stock status badge */}
            <div>
              {isOutOfStock ? (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg animate-pulse">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-slate-600 font-normal">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label htmlFor="product-qty-select" className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs">
                <button
                  type="button"
                  data-testid="quantity-decrease"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded-l-xl font-bold transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  id="product-qty-select"
                  data-testid="quantity-input"
                  type="text"
                  readOnly
                  value={quantity}
                  className="w-12 text-center text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                  aria-label="Current quantity"
                />
                <button
                  type="button"
                  data-testid="quantity-increase"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded-r-xl font-bold transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                data-testid="add-to-cart"
                disabled={isOutOfStock || isAdding}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isAdding
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white shadow-indigo-600/25'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart ({quantity})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                data-testid="detail-wishlist-button"
                onClick={() => toggleWishlist(product)}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Delivery & Assurance Perks */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-slate-600 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Free Delivery &gt;₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-cyan-600" />
              <span>7-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Table Section */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section aria-labelledby="specs-heading" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 id="specs-heading" className="text-xl font-bold text-slate-900 tracking-tight">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 divide-y md:divide-y-0 divide-slate-100">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-2 text-xs sm:text-sm">
                <span className="font-semibold text-slate-500">{key}</span>
                <span className="font-bold text-slate-900 text-right">{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section aria-labelledby="reviews-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="reviews-heading" className="text-2xl font-bold text-slate-900 tracking-tight">Customer Reviews</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real verified ratings and feedback from verified purchasers</p>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{rev.user_name}</p>
                    <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  {rev.verified_purchase === 1 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Buyer
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{rev.comment}</p>
                <p className="text-[10px] text-slate-400">
                  {new Date(rev.created_at).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">No reviews written yet. Be the first to review!</p>
        )}
      </section>

      {/* Related Products Recommendations */}
      {product.related && product.related.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 id="related-heading" className="text-2xl font-bold text-slate-900 tracking-tight">You Might Also Like</h2>
            <Link to={`/shop?category=${product.category_slug}`} className="text-xs font-bold text-indigo-600 hover:underline">
              View More
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {product.related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="write-review-title"
          >
            <h3 id="write-review-title" className="text-lg font-bold text-slate-900">Review {product.name}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label htmlFor="review-author-name" className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                <input
                  id="review-author-name"
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase mb-1">Rating</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      aria-label={`Set rating to ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} out of 5</span>
                </div>
              </div>

              <div>
                <label htmlFor="review-text-body" className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Review</label>
                <textarea
                  id="review-text-body"
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share what you like about the quality, design, and performance..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
