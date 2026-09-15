import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PackageOpen } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <PackageOpen className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
