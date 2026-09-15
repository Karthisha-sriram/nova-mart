import React from 'react';
import {
  Code2,
  Database,
  Terminal,
  Cloud,
  CheckCircle2,
  Server,
  Layers,
  Shield,
  Sparkles,
  GitBranch,
  Boxes
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" /> Engineering &amp; Architecture Showcase
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
          Behind NOVA MART
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          NOVA MART is a commercial full-stack e-commerce portfolio application specifically engineered to demonstrate production proficiency across modern JavaScript/React, Node.js REST APIs, SQL relational schemas, C# Selenium automated regression testing, and Azure CI/CD.
        </p>
      </div>

      {/* 4 Pillars Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Frontend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Modern Frontend &amp; UI</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>React 19 &amp; TypeScript</strong> with functional hooks and strict typings</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Tailwind CSS</strong> responsive layout, mobile drawer, and touch targets</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Stable <code>data-testid</code> attributes across all interactive components for test automation</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Backend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Node.js Express &amp; REST APIs</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Structured endpoints for <code>/api/products</code>, <code>/api/cart</code>, <code>/api/orders</code>, <code>/api/wishlist</code>, and <code>/api/reviews</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Standardized JSON response envelope with HTTP status codes and centralized error handling middleware</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Persistent Cart calculations with free shipping threshold (&gt;₹999) &amp; tax calculation</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: Database */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Relational SQL Schema</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>7 Normalized Relational Tables: <code>users</code>, <code>categories</code>, <code>products</code>, <code>cart_items</code>, <code>orders</code>, <code>order_items</code>, <code>reviews</code>, and <code>wishlists</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Foreign key constraints with cascading deletes and index optimizations on search/slug columns</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Local SQLite compatibility and pre-configured Microsoft Azure SQL migration scripts</span>
            </li>
          </ul>
        </div>

        {/* Pillar 4: Selenium & CI/CD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900">C# Selenium &amp; CI/CD</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>C# .NET 8 / NUnit</strong> automated test suite located in <code>/automation/</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Page Object Model (POM)</strong> architecture targeting robust <code>[data-testid]</code> attributes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>GitHub Actions CI/CD</strong> pipeline for automated linting, building, regression testing, and deployment to Microsoft Azure</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
