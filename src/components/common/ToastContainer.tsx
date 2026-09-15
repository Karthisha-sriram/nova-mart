import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 bg-slate-900/95 text-white rounded-2xl shadow-xl border border-slate-800 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200"
        >
          {toast.image ? (
            <img
              src={toast.image}
              alt=""
              className="w-10 h-10 object-cover rounded-xl shrink-0 border border-slate-700"
            />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-100">{toast.title}</p>
            <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
