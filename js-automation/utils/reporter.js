import fs from 'fs';
import path from 'path';

export class HtmlReporter {
  constructor(reportPath) {
    this.reportPath = reportPath || path.resolve(process.cwd(), 'js-automation/reports/js-test-report.html');
    this.results = [];
    this.startTime = Date.now();
  }

  addResult(testName, status, durationMs, error = null) {
    this.results.push({
      testName,
      status, // 'PASSED' | 'FAILED'
      durationMs,
      error: error ? (error.stack || error.message || String(error)) : null,
      timestamp: new Date().toISOString()
    });
  }

  generate() {
    const dir = path.dirname(this.reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const total = this.results.length;
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NOVA MART - JavaScript Selenium Test Automation Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #6366f1;
      --pass: #10b981;
      --fail: #ef4444;
      --border: #334155;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      margin: 0;
      padding: 32px 16px;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
    header {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px 32px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    h1 {
      margin: 0 0 6px 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .meta {
      color: var(--text-muted);
      font-size: 13px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 24px;
    }
    .stat-card .label {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .stat-card .value {
      font-size: 28px;
      font-weight: 900;
    }
    .stat-card.pass .value { color: var(--pass); }
    .stat-card.fail .value { color: var(--fail); }
    .stat-card.rate .value { color: var(--accent); }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    th, td {
      padding: 14px 20px;
      text-align: left;
      font-size: 13px;
    }
    th {
      background: #1e293b;
      color: var(--text-muted);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border);
    }
    tr:not(:last-child) td {
      border-bottom: 1px solid var(--border);
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .badge.passed {
      background: rgba(16, 185, 129, 0.15);
      color: var(--pass);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .badge.failed {
      background: rgba(239, 68, 68, 0.15);
      color: var(--fail);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    pre.error-log {
      background: #090d16;
      color: #fca5a5;
      padding: 12px;
      border-radius: 8px;
      font-size: 11px;
      margin-top: 8px;
      white-space: pre-wrap;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>NOVA MART &mdash; JavaScript Selenium Suite</h1>
        <div class="meta">Automated End-to-End Regression Execution Report &bull; Virtusa Standards Compliant</div>
      </div>
      <div class="meta" style="text-align: right;">
        <div><strong>Framework:</strong> Selenium WebDriver 4.x (JavaScript)</div>
        <div><strong>Execution Date:</strong> ${new Date().toLocaleString()}</div>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Total Tests</div>
        <div class="value">${total}</div>
      </div>
      <div class="stat-card pass">
        <div class="label">Passed</div>
        <div class="value">${passed}</div>
      </div>
      <div class="stat-card fail">
        <div class="label">Failed</div>
        <div class="value">${failed}</div>
      </div>
      <div class="stat-card rate">
        <div class="label">Pass Rate</div>
        <div class="value">${passRate}%</div>
      </div>
      <div class="stat-card">
        <div class="label">Execution Time</div>
        <div class="value">${totalDuration}s</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 50px;">#</th>
          <th>Test Case Scenario</th>
          <th style="width: 120px;">Status</th>
          <th style="width: 110px;">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${this.results.map((r, i) => `
        <tr>
          <td style="color: var(--text-muted); font-weight: 700;">${i + 1}</td>
          <td>
            <strong>${r.testName}</strong>
            ${r.error ? `<pre class="error-log">${r.error}</pre>` : ''}
          </td>
          <td>
            <span class="badge ${r.status.toLowerCase()}">${r.status}</span>
          </td>
          <td style="color: var(--text-muted); font-family: monospace;">${r.durationMs} ms</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    fs.writeFileSync(this.reportPath, html, 'utf-8');
    return this.reportPath;
  }
}
