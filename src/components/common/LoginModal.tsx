import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, login, register, demoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!loginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(fullName, email, password, phone);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickLogin = async (role: 'customer' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header */}
        <div className="p-6 pb-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            onClick={() => setLoginModalOpen(false)}
            data-testid="login-modal-close"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-md">
              N
            </span>
            <span className="font-extrabold tracking-wider text-lg">NOVA MART</span>
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold text-white">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {isRegister
              ? 'Join NOVA MART for fast checkouts, tracking, and rewards'
              : 'Sign in to access your orders, wishlist, and saved addresses'}
          </p>
        </div>

        {/* Demo Account Quick-Fill Card (Convenient for recruiters & automated testing) */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Recruiter &amp; Test Quick Sign-In</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoQuickLogin('customer')}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="font-bold text-slate-900">Alex Sharma</p>
                <p className="text-[10px] text-slate-500">Customer Demo</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoQuickLogin('admin')}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50/40 text-left transition-all flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-cyan-600" />
              <div>
                <p className="font-bold text-slate-900">Lead QA Admin</p>
                <p className="text-[10px] text-slate-500">Admin Dashboard</p>
              </div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              data-testid="login-error"
              className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl"
            >
              {error}
            </div>
          )}

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="full-name-input">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="full-name-input"
                    data-testid="register-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="phone-input">
                  Phone (Optional)
                </label>
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="login-email-input">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="login-email-input"
                data-testid="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.sharma@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="login-password-input">
                Password
              </label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => alert('Demo password reminder: demo_hash_pwd_123 or any value in demo mode')}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="login-password-input"
                data-testid="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            data-testid="login-submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-60"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <div className="pt-2 text-center text-xs text-slate-600">
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  data-testid="toggle-login-btn"
                  onClick={() => {
                    setIsRegister(false);
                    setError(null);
                  }}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New to NOVA MART?{' '}
                <button
                  type="button"
                  data-testid="toggle-register-btn"
                  onClick={() => {
                    setIsRegister(true);
                    setError(null);
                  }}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Create an account
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
