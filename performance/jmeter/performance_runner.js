import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CONCURRENCY = 20;
const TOTAL_REQUESTS = 200;

const ENDPOINTS = [
  { name: 'GET /api/health', url: `${BASE_URL}/api/health` },
  { name: 'GET /api/products?page=1&limit=12', url: `${BASE_URL}/api/products?page=1&limit=12` },
  { name: 'GET /api/products?search=NovaPods', url: `${BASE_URL}/api/products?search=NovaPods` },
  { name: 'GET /api/products/1', url: `${BASE_URL}/api/products/1` },
  { name: 'GET /api/categories', url: `${BASE_URL}/api/categories` },
  { name: 'GET /api/admin/stats', url: `${BASE_URL}/api/admin/stats` }
];

async function runPerformanceBench() {
  console.log('====================================================');
  console.log('⚡ Starting NOVA MART Synthetic Load & Performance Benchmark');
  console.log(`🌐 Target: ${BASE_URL} | Concurrency: ${CONCURRENCY} | Total Requests: ${TOTAL_REQUESTS}`);
  console.log('====================================================\n');

  const endpointStats = {};
  for (const ep of ENDPOINTS) {
    endpointStats[ep.name] = { latencies: [], errors: 0 };
  }

  const overallStart = Date.now();
  let completed = 0;

  async function worker() {
    while (completed < TOTAL_REQUESTS) {
      const idx = completed++;
      const ep = ENDPOINTS[idx % ENDPOINTS.length];
      const start = Date.now();
      try {
        const res = await fetch(ep.url);
        const duration = Date.now() - start;
        if (res.ok) {
          endpointStats[ep.name].latencies.push(duration);
        } else {
          endpointStats[ep.name].errors++;
        }
      } catch (err) {
        endpointStats[ep.name].errors++;
      }
    }
  }

  // Run concurrent workers
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const totalTimeSeconds = (Date.now() - overallStart) / 1000;
  const throughput = (TOTAL_REQUESTS / totalTimeSeconds).toFixed(1);

  console.log('Endpoint Benchmark Results:');
  console.log('--------------------------------------------------------------------------------------------');
  console.log('Endpoint                               | Req Count | Avg (ms) | P50 (ms) | P95 (ms) | P99 (ms) | Errors');
  console.log('--------------------------------------------------------------------------------------------');

  const reportData = [];

  for (const ep of ENDPOINTS) {
    const stats = endpointStats[ep.name];
    const lats = stats.latencies.sort((a, b) => a - b);
    const count = lats.length;
    const avg = count > 0 ? (lats.reduce((a, b) => a + b, 0) / count).toFixed(1) : 0;
    const p50 = count > 0 ? lats[Math.floor(count * 0.5)] : 0;
    const p95 = count > 0 ? lats[Math.floor(count * 0.95)] : 0;
    const p99 = count > 0 ? lats[Math.floor(count * 0.99)] : 0;

    reportData.push({
      endpoint: ep.name,
      requests: count,
      avgMs: parseFloat(avg),
      p50Ms: p50,
      p95Ms: p95,
      p99Ms: p99,
      errors: stats.errors
    });

    console.log(
      `${ep.name.padEnd(38)} | ${String(count).padStart(9)} | ${String(avg).padStart(8)} | ${String(p50).padStart(8)} | ${String(p95).padStart(8)} | ${String(p99).padStart(8)} | ${String(stats.errors).padStart(6)}`
    );
  }

  console.log('--------------------------------------------------------------------------------------------');
  console.log(`⏱ Total Benchmark Duration: ${totalTimeSeconds.toFixed(2)}s | Aggregated Throughput: ${throughput} req/sec`);
  console.log('====================================================\n');

  const outDir = path.resolve(process.cwd(), 'performance');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'performance_summary.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), concurrency: CONCURRENCY, throughputReqSec: parseFloat(throughput), endpoints: reportData }, null, 2),
    'utf-8'
  );
}

runPerformanceBench().catch(console.error);
