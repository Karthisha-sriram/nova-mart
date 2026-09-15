import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Code2,
  Terminal,
  Server,
  Cloud
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useCart();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast({
      title: 'Subscribed to NOVA VIP',
      message: 'Thank you! You will receive early access deals and product drops.',
      type: 'success'
    });
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 mt-20">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-900 bg-slate-900/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Secure Payments</h3>
              <p className="text-[11px] text-slate-400">256-bit encrypted checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fast Delivery</h3>
              <p className="text-[11px] text-slate-400">Express delivery nationwide</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Easy Returns</h3>
              <p className="text-[11px] text-slate-400">7-day no questions asked</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quality Products</h3>
              <p className="text-[11px] text-slate-400">100% verified genuine items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Portfolio Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-black text-white text-lg">
                N
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-['Space_Grotesk',sans-serif]">
                NOVA<span className="text-indigo-400">MART</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Discover thoughtfully selected products designed for modern everyday life. Built as a full-stack commercial e-commerce portfolio application showcasing enterprise web engineering, automated Selenium testing, SQL schema design, and cloud readiness.
            </p>

            {/* Architecture Stack Badges */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Demonstrated Engineering Stack
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="bg-slate-900 text-indigo-300 px-2 py-0.5 rounded border border-slate-800">React 19</span>
                <span className="bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800">Node.js Express</span>
                <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-slate-800">SQL Database</span>
                <span className="bg-slate-900 text-purple-300 px-2 py-0.5 rounded border border-slate-800">C# .NET 8</span>
                <span className="bg-slate-900 text-amber-300 px-2 py-0.5 rounded border border-slate-800">Selenium POM</span>
                <span className="bg-slate-900 text-blue-300 px-2 py-0.5 rounded border border-slate-800">Azure &amp; AWS CI/CD</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?category=electronics" className="hover:text-white transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/shop?category=fashion" className="hover:text-white transition-colors">Fashion &amp; Apparel</Link>
              </li>
              <li>
                <Link to="/shop?category=home-living" className="hover:text-white transition-colors">Home &amp; Living</Link>
              </li>
              <li>
                <Link to="/shop?category=fitness" className="hover:text-white transition-colors">Fitness &amp; Sport</Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="hover:text-white transition-colors">Accessories</Link>
              </li>
              <li>
                <Link to="/shop?category=gadgets" className="hover:text-white transition-colors">Desk Gadgets</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer & Account */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-white transition-colors">Today&apos;s Deals</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/account?tab=orders" className="hover:text-white transition-colors">Order History</Link>
              </li>
              <li>
                <Link to="/account?tab=wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link>
              </li>
              <li>
                <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  Admin &amp; Testing Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Verification */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Stay Connected</h3>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe for private flash drops, early release previews, and exclusive discount codes.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
            <div className="mt-4 pt-4 border-t border-slate-900">
              <p className="text-[11px] text-slate-500">
                Support: <span className="text-slate-300">support@novamart.com</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Helpline: <span className="text-slate-300">1800-419-NOVA</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} NOVA MART Inc. All rights reserved. Designed &amp; engineered for commercial portfolio demonstration.
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/about" className="hover:text-white transition-colors">Architecture Overview</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Automated Regression Dashboard</Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-mono text-[11px]">v1.0.0-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
