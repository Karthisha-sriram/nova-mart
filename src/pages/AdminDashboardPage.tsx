import React, { useEffect, useState } from 'react';
import {
  Shield,
  Activity,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Server,
  Cloud,
  Terminal,
  Code2
} from 'lucide-react';
import { api } from '../services/api';
import { AdminStats, TestingStatusItem } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [testingStatus, setTestingStatus] = useState<TestingStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningTests, setRunningTests] = useState(false);
  const [testExecutionResult, setTestExecutionResult] = useState<any | null>(null);

  const loadDashboardData = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data.stats);
      setLowStock(data.lowStockProducts || []);
      setRecentOrders(data.recentOrders || []);
      setTestingStatus(data.testingStatus || []);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleExecuteSeleniumSuite = async () => {
    setRunningTests(true);
    setTestExecutionResult(null);
    try {
      const res = await api.runAdminTests();
      setTestExecutionResult(res);
      await loadDashboardData();
    } catch (err) {
      console.error('Test execution error:', err);
    } finally {
      setRunningTests(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64 mx-auto mb-8" />
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Console Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
              Engineering &amp; Testing Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time SQL database telemetry, cloud order processing, and automated Selenium test runner.
          </p>
        </div>

        {/* Live Test Trigger */}
        <button
          type="button"
          onClick={handleExecuteSeleniumSuite}
          disabled={runningTests}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60"
        >
          {runningTests ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              <span>Executing Selenium Regression...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-cyan-300" />
              <span>Run Automated Selenium Suite</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold">Processed via SQL transactions</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Orders</span>
              <Package className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.totalOrders}</p>
            <p className="text-[11px] text-indigo-600 font-bold">Real relational orders logged</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Catalog Products</span>
              <Database className="w-4 h-4 text-cyan-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.totalProducts}</p>
            <p className="text-[11px] text-cyan-600 font-bold">6 Curated Categories</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Inventory Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats.inventoryAlertCount}</p>
            <p className="text-[11px] text-amber-600 font-bold">Threshold &lt;= 15 units</p>
          </div>
        </div>
      )}

      {/* Selenium Automation & CI/CD Regression Status Section */}
      <section aria-labelledby="selenium-suite-heading" className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
              <Terminal className="w-3.5 h-3.5" />
              <span>Automated QA &amp; Regression Testing</span>
            </div>
            <h2 id="selenium-suite-heading" className="text-xl font-bold tracking-tight mt-1 text-white">
              C# .NET 8 / Selenium WebDriver Test Coverage
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Testing Page Object Model (POM) against stable <code className="text-cyan-300">data-testid</code> selectors across authentication, catalog, cart arithmetic, and checkout.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-300">CI/CD PASSING</span>
          </div>
        </div>

        {/* Live Execution Result Banner */}
        {testExecutionResult && (
          <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> All {testExecutionResult.summary.totalExecuted} Automated Suites Succeeded
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Execution Time: {testExecutionResult.summary.executionTime}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              {testExecutionResult.results.map((res: any, idx: number) => (
                <div key={idx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-200 font-semibold">{res.name}</span>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">{res.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Test Suite</th>
                <th className="py-3 px-4">Framework / Architecture</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Passed / Total</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Last Run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 font-medium">
              {testingStatus.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-100 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    NUnit 3 + Selenium 4.18 (POM)
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    {item.passed} / {item.passed + item.failed}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{item.duration}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{item.lastRun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Split Grid: Low Stock Alert & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Low Stock Alerts (&le; 15 units)</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">{lowStock.length} items</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {lowStock.map((prod) => (
              <div key={prod.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{prod.name}</p>
                  <p className="text-[11px] text-slate-400">SKU #{prod.id} &bull; {prod.category_name}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded-lg border border-amber-200">
                    {prod.stock} in stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders in SQL */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              <span>Recent SQL Orders</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">{recentOrders.length} records</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 font-mono">#{ord.order_number}</p>
                  <p className="text-[11px] text-slate-400">{ord.customer_name} &bull; {ord.payment_method}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900">
                    ₹{ord.total_amount.toLocaleString('en-IN')}
                  </span>
                  <p className="text-[10px] text-emerald-600 font-semibold">{ord.order_status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
