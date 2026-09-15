import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, loading, updateQuantity, removeFromCart, showToast } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountRate: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();

    if (code === 'NOVA10' || code === 'SAVE10') {
      setAppliedPromo({ code, discountRate: 0.1 });
      showToast({
        title: 'Coupon Applied!',
        message: 'You unlocked an extra 10% off your order.',
        type: 'success'
      });
      setPromoCode('');
    } else if (code === 'NOVA20') {
      setAppliedPromo({ code, discountRate: 0.2 });
      showToast({
        title: 'Special VIP 20% Applied!',
        message: 'You unlocked an extra 20% off your order.',
        type: 'success'
      });
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try NOVA10 or NOVA20');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-8" />
        <div className="h-64 bg-slate-100 rounded-3xl" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div data-testid="cart-empty" className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Cart is Empty</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          Explore our handpicked collection of modern audio, workspace tech, and lifestyle gear.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-sm shadow-md transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const promoDiscount = appliedPromo ? Math.round(cart.subtotal * appliedPromo.discountRate) : 0;
  const finalGrandTotal = Math.max(0, cart.grandTotal - promoDiscount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
          Shopping Cart ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review your order details and calculate shipping thresholds.
        </p>
      </div>

      {/* Free Shipping Progress Indicator (Prompt requirement: ₹999 threshold) */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 via-cyan-50 to-indigo-50 border border-indigo-100 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            {cart.freeShippingUnlocked ? (
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free Standard Delivery Unlocked!
              </span>
            ) : (
              <span>
                Add{' '}
                <span className="text-indigo-600 font-extrabold">
                  ₹{cart.amountNeededForFreeShipping.toLocaleString('en-IN')}
                </span>{' '}
                more to unlock <span className="text-indigo-600 uppercase">FREE DELIVERY</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            ₹{cart.subtotal.toLocaleString('en-IN')} / ₹{cart.freeShippingThreshold.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.round((cart.subtotal / cart.freeShippingThreshold) * 100))}%`
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {cart.items.map((item) => (
            <div
              key={item.id}
              data-testid="cart-item"
              className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <Link to={`/product/${item.productId}`} className="shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-2xl border border-slate-200"
                  />
                </Link>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                    {item.categoryName}
                  </span>
                  <Link
                    to={`/product/${item.productId}`}
                    className="block text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{item.discountedPrice.toLocaleString('en-IN')}
                    </span>
                    {item.discountPercent > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity controls + Remove with exact data-testid */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                {/* Quantity increment / decrement */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <button
                    type="button"
                    data-testid="quantity-decrease"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-l-xl font-bold transition-colors"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    -
                  </button>
                  <span
                    data-testid="cart-item-quantity"
                    className="w-9 text-center text-xs font-bold text-slate-800"
                  >
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    data-testid="quantity-increase"
                    disabled={item.quantity >= item.stock}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 rounded-r-xl font-bold transition-colors"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>

                {/* Line total */}
                <div className="text-right min-w-[80px]">
                  <span className="text-sm font-black text-slate-900">
                    ₹{item.lineTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  data-testid="remove-from-cart"
                  onClick={() => removeFromCart(item.id, item.name)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Order Summary</h2>

            {/* Price breakdown */}
            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex items-center justify-between text-slate-600 pt-1">
                <span>Original Price</span>
                <span>₹{cart.originalTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-600 pt-2 font-semibold">
                <span>Catalog Discounts</span>
                <span>- ₹{cart.totalDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 pt-2">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 pt-2">
                <span>Estimated Shipping</span>
                {cart.shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase">Free</span>
                ) : (
                  <span>₹{cart.shippingFee.toLocaleString('en-IN')}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-slate-600 pt-2">
                <span>Estimated Taxes (GST 5%)</span>
                <span>₹{cart.tax.toLocaleString('en-IN')}</span>
              </div>

              {/* Promo code discount if applied */}
              {appliedPromo && (
                <div className="flex items-center justify-between text-indigo-600 pt-2 font-bold">
                  <span>Coupon ({appliedPromo.code})</span>
                  <span>- ₹{promoDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Grand Total */}
              <div className="flex items-baseline justify-between text-slate-900 pt-4 font-black text-base">
                <span>Grand Total</span>
                <span data-testid="cart-grand-total" className="text-xl text-indigo-600 font-black">
                  ₹{finalGrandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Promo Code Input Form */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <label htmlFor="cart-promo-code" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Promo Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="cart-promo-code"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Try NOVA10 or NOVA20"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{promoError}</p>}
              {appliedPromo && (
                <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
                  Coupon active: {appliedPromo.code}
                </p>
              )}
            </form>

            {/* Checkout Button with data-testid */}
            <button
              type="button"
              id="cart-checkout-button"
              data-testid="checkout-button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-101"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Security & Guarantee Note */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-slate-600 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Encrypted 256-bit checkout with immediate confirmation.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
