import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Sparkles,
  Shield,
  Layers,
  Flame,
  HelpCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from './SearchModal';
import { LoginModal } from './LoginModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, cartAnimated } = useCart();
  const { wishlist } = useWishlist();
  const { user, setLoginModalOpen, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Deals', path: '/deals', badge: 'HOT' },
    { name: 'About', path: '/about' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile Menu Trigger + Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-indigo-900 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <span className="font-extrabold text-white text-xl tracking-tighter">N</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xl tracking-tight text-slate-950 font-['Space_Grotesk',sans-serif]">
                      NOVA<span className="text-indigo-600">MART</span>
                    </span>
                    <span className="hidden sm:inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 border border-cyan-500/20 uppercase tracking-widest">
                      PRO
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                    Shop Smart. Live Better.
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      active
                        ? 'text-indigo-600 bg-indigo-50/70 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Admin Portal Shortcut Link for Portfolio Evaluators */}
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  location.pathname === '/admin'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>Admin &amp; Testing</span>
              </Link>
            </nav>

            {/* Right: Actions (Search, Wishlist, Cart, User) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Trigger Button */}
              <button
                type="button"
                id="search-trigger-btn"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] transition-colors border border-transparent hover:border-slate-200"
                aria-label="Open search dialog"
              >
                <Search className="w-5 h-5 text-slate-600" />
                <span className="hidden md:inline-block text-xs font-medium text-slate-400">
                  Search catalog...
                </span>
                <kbd className="hidden md:inline-block text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Wishlist Button */}
              <Link
                to="/account?tab=wishlist"
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                aria-label={`Wishlist with ${wishlist.length} items`}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Button (with stable data-testid and badge animation) */}
              <Link
                to="/cart"
                id="global-cart-button"
                data-testid="cart-button"
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl min-h-[44px] transition-all duration-300 ${
                  itemCount > 0
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                aria-label={`Shopping cart with ${itemCount} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span
                      className={`absolute -top-2 -right-2 px-1.5 min-w-[18px] h-[18px] rounded-full bg-cyan-400 text-slate-950 text-[11px] font-black flex items-center justify-center shadow-xs transition-transform duration-300 ${
                        cartAnimated ? 'scale-130' : 'scale-100'
                      }`}
                    >
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold hidden sm:inline-block">Cart</span>
              </Link>

              {/* Account Dropdown or Trigger */}
              {user ? (
                <div className="relative group">
                  <Link
                    to="/account"
                    data-testid="user-menu-btn"
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 min-h-[44px] transition-colors border border-slate-200/80"
                    aria-label="View account"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="text-xs font-bold hidden md:inline-block max-w-[90px] truncate">
                      {user.fullName.split(' ')[0]}
                    </span>
                  </Link>

                  {/* Dropdown Menu on hover */}
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 hidden group-hover:block transition-all z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account?tab=profile"
                      data-testid="nav-profile-link"
                      className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/account?tab=orders"
                      data-testid="nav-orders-link"
                      className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/account?tab=wishlist"
                      data-testid="nav-wishlist-link"
                      className="block px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Wishlist ({wishlist.length})
                    </Link>
                    <Link
                      to="/admin"
                      data-testid="nav-admin-link"
                      className="block px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={logout}
                      data-testid="sign-out-btn"
                      className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  id="navbar-signin-button"
                  data-testid="signin-button"
                  onClick={() => setLoginModalOpen(true)}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl min-h-[44px] flex items-center gap-1.5 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline-block">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-3 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-indigo-50 text-indigo-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" /> Admin &amp; Testing Status
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                  PORTFOLIO
                </span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500">View Account</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md text-center"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoginModal />
    </>
  );
};
