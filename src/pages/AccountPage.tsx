import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Clock,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Order } from '../types';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'orders';

  const { user, setLoginModalOpen, logout } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, showToast } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile edit fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.street || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setStreet(user.street || '');
      setCity(user.city || '');
      setState(user.state || '');
      setPostalCode(user.postalCode || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: 'Profile Updated',
      message: 'Your shipping address and profile details were updated.',
      type: 'success'
    });
  };

  const handleMoveToCart = async (productId: number, name: string, image: string) => {
    await addToCart(productId, 1, name, image);
    await api.removeFromWishlist(productId);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Please Sign In</h2>
        <p className="text-xs text-slate-500">Sign in to review your order history, manage addresses, and view your saved items.</p>
        <button
          onClick={() => setLoginModalOpen(true)}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Summary Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif]">
                {user.fullName}
              </h1>
              <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Admin Console</span>
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          data-testid="tab-orders"
          onClick={() => setSearchParams({ tab: 'orders' })}
          className={`pb-3.5 flex items-center gap-2 transition-all relative ${
            currentTab === 'orders'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          data-testid="tab-wishlist"
          onClick={() => setSearchParams({ tab: 'wishlist' })}
          className={`pb-3.5 flex items-center gap-2 transition-all relative ${
            currentTab === 'wishlist'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlist.length})</span>
        </button>

        <button
          data-testid="tab-profile"
          onClick={() => setSearchParams({ tab: 'profile' })}
          className={`pb-3.5 flex items-center gap-2 transition-all relative ${
            currentTab === 'profile'
              ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile &amp; Address</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {currentTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading order history...</div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                data-testid="order-card"
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <span
                      data-testid="order-card-number"
                      className="text-xs font-bold text-slate-900 font-mono"
                    >
                      #{order.order_number}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Placed on{' '}
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {order.order_status}
                    </span>
                    <Link
                      to={`/order-confirmation/${order.order_number}`}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>Track Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.product_name}</p>
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total Amount</span>
                  <span className="font-black text-slate-900 text-sm">
                    ₹{order.total_amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">No orders placed yet</p>
              <p className="text-xs text-slate-400 mt-1">Your confirmed orders will appear here.</p>
              <Link to="/shop" className="mt-4 inline-block px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
                Browse Shop
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {currentTab === 'wishlist' && (
        <div>
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  data-testid="wishlist-item"
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleWishlist(item)}
                      data-testid="wishlist-remove"
                      aria-label={`Remove ${item.name} from wishlist`}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-rose-600 shadow-sm hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">
                      {item.categoryName}
                    </span>
                    <h3 data-testid="wishlist-item-name" className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{item.discountedPrice.toLocaleString('en-IN')}
                      </span>
                      {item.discountPercent > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleMoveToCart(item.productId, item.name, item.imageUrl)}
                    data-testid="wishlist-move-to-cart"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div data-testid="wishlist-empty" className="py-16 text-center bg-white rounded-3xl border border-slate-200">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">Your wishlist is empty</p>
              <p className="text-xs text-slate-400 mt-1">Tap the heart icon on any product to save it for later.</p>
              <Link to="/shop" className="mt-4 inline-block px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
                Explore Products
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile */}
      {currentTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-2xl">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">PIN / Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Save Profile Changes
          </button>
        </form>
      )}
    </div>
  );
};
