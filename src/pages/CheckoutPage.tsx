import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart, showToast } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Customer & Shipping state
  const [fullName, setFullName] = useState(user?.fullName || 'Alex Sharma');
  const [email, setEmail] = useState(user?.email || 'alex.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [street, setStreet] = useState(user?.street || '402 Cyber Heights, HSR Layout');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '560102');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [upiId, setUpiId] = useState('alex@okaxis');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="mt-4 inline-block px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fullShippingAddress = `${street}, ${city}, ${state} - ${postalCode}, India`;
      const paymentMethodDisplay =
        paymentMethod === 'card'
          ? 'Credit Card (Visa / Mastercard)'
          : paymentMethod === 'upi'
          ? `UPI (${upiId})`
          : 'Cash on Delivery';

      const res = await api.createOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: fullShippingAddress,
        paymentMethod: paymentMethodDisplay
      });

      if (res.order) {
        await refreshCart();
        showToast({
          title: 'Order Placed!',
          message: `Order #${res.order.order_number} confirmed.`,
          type: 'success'
        });
        navigate(`/order-confirmation/${res.order.order_number}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
          Express Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Enter shipping details and choose your preferred payment method.
        </p>
      </div>

      {error && (
        <div
          data-testid="checkout-error"
          className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs font-semibold text-rose-700"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customer, Shipping & Payment */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Contact Information */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                1
              </span>
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  data-testid="checkout-fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  data-testid="checkout-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  data-testid="checkout-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                2
              </span>
              <span>Shipping Address</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  data-testid="checkout-street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Flat, building, street, area"
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    data-testid="checkout-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">State</label>
                  <input
                    type="text"
                    required
                    data-testid="checkout-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">PIN / Postal Code</label>
                  <input
                    type="text"
                    required
                    data-testid="checkout-postalcode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                3
              </span>
              <span>Payment Option</span>
            </h2>

            {/* Payment Selector Tabs */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Card</p>
                  <p className="text-[10px] text-slate-500">Credit / Debit</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <QrCode className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900">UPI</p>
                  <p className="text-[10px] text-slate-500">GPay, PhonePe</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Truck className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900">COD</p>
                  <p className="text-[10px] text-slate-500">Cash on Delivery</p>
                </div>
              </button>
            </div>

            {/* Payment Fields */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <label className="block font-bold text-slate-700 uppercase">Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                />
                <p className="text-[11px] text-slate-500">
                  Instant authorization request will be sent to your UPI app.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs text-amber-800">
                Please keep exact cash or UPI QR scan ready at the time of delivery.
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Place Order Button with data-testid */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Order Items ({cart.itemCount})</h2>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 space-y-2">
              {cart.items.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-xl border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{item.lineTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery</span>
                {cart.shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase">Free</span>
                ) : (
                  <span>₹{cart.shippingFee.toLocaleString('en-IN')}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated Tax (5%)</span>
                <span>₹{cart.tax.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-baseline justify-between text-slate-900 pt-3 border-t border-slate-100 font-black text-base">
                <span>Total Due</span>
                <span className="text-xl text-indigo-600 font-black">
                  ₹{cart.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order Button with data-testid */}
            <button
              type="submit"
              id="place-order-submit-btn"
              data-testid="place-order"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:scale-101"
            >
              {loading ? (
                <span>Authorizing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • ₹{cart.grandTotal.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-slate-600 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Guaranteed safe checkout. Instant email confirmation sent.</span>
          </div>
        </div>
      </form>
    </div>
  );
};
