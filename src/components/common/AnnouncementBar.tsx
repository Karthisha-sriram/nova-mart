import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside aria-label="Store Announcements" className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center">
          <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full text-[11px] border border-indigo-500/30">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Special Launch Offer
          </span>
          <span className="font-medium tracking-wide">
            FREE SHIPPING ON ORDERS OVER ₹999 • EASY 7-DAY RETURNS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1 hover:text-slate-200 transition-colors">
            <Truck className="w-3.5 h-3.5 text-cyan-400" /> Express Delivery
          </span>
          <span className="flex items-center gap-1 hover:text-slate-200 transition-colors">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" /> 7-Day Hassle-Free Returns
          </span>
          <span className="flex items-center gap-1 hover:text-slate-200 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Genuine Guarantee
          </span>
          <span className="font-mono text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
            INR (₹)
          </span>
        </div>
      </div>
    </aside>
  );
};
