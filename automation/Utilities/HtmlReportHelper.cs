using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace NOVAMart.Automation.Utilities
{
    public class TestRecord
    {
        public string TestName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Status { get; set; } = "Passed";
        public double DurationSeconds { get; set; }
        public string? ErrorMessage { get; set; }
        public string? ScreenshotPath { get; set; }
        public DateTime ExecutionTime { get; set; } = DateTime.UtcNow;
    }

    public static class HtmlReportHelper
    {
        private static readonly ConcurrentBag<TestRecord> Records = new ConcurrentBag<TestRecord>();
        private static readonly DateTime SuiteStartTime = DateTime.UtcNow;

        public static void AddTestRecord(TestRecord record)
        {
            Records.Add(record);
        }

        public static string GenerateReport()
        {
            try
            {
                var projectDir = ScreenshotHelper.GetAutomationDirectory();
                var reportsDir = Path.Combine(projectDir, "Reports");

                if (!Directory.Exists(reportsDir))
                {
                    Directory.CreateDirectory(reportsDir);
                }

                var totalDuration = (DateTime.UtcNow - SuiteStartTime).TotalSeconds;
                var total = Records.Count;
                var passed = 0;
                var failed = 0;
                var skipped = 0;

                foreach (var r in Records)
                {
                    if (r.Status.Equals("Passed", StringComparison.OrdinalIgnoreCase)) passed++;
                    else if (r.Status.Equals("Failed", StringComparison.OrdinalIgnoreCase)) failed++;
                    else skipped++;
                }

                var passRate = total > 0 ? (double)passed / total * 100.0 : 100.0;
                var browser = DriverFactory.BrowserType;
                var reportPath = Path.Combine(reportsDir, "TestReport.html");

                var sb = new StringBuilder();
                sb.AppendLine("<!DOCTYPE html>");
                sb.AppendLine("<html lang=\"en\">");
                sb.AppendLine("<head>");
                sb.AppendLine("  <meta charset=\"UTF-8\">");
                sb.AppendLine("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
                sb.AppendLine("  <title>NOVA MART - Automated Test Execution Report</title>");
                sb.AppendLine("  <style>");
                sb.AppendLine("    :root { --bg: #0b0f19; --surface: #141c2e; --border: #232f48; --text: #f1f5f9; --text-muted: #94a3b8; --accent: #6366f1; --pass: #10b981; --fail: #ef4444; }");
                sb.AppendLine("    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }");
                sb.AppendLine("    body { background-color: var(--bg); color: var(--text); padding: 2rem 1.5rem; line-height: 1.5; }");
                sb.AppendLine("    .container { max-width: 1200px; margin: 0 auto; }");
                sb.AppendLine("    .header { margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }");
                sb.AppendLine("    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }");
                sb.AppendLine("    .badge-primary { background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }");
                sb.AppendLine("    .title { font-size: 1.75rem; font-weight: 800; margin-top: 0.5rem; letter-spacing: -0.02em; }");
                sb.AppendLine("    .subtitle { color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem; }");
                sb.AppendLine("    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }");
                sb.AppendLine("    .metric-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; padding: 1.25rem; }");
                sb.AppendLine("    .metric-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }");
                sb.AppendLine("    .metric-value { font-size: 1.75rem; font-weight: 800; margin-top: 0.25rem; }");
                sb.AppendLine("    .val-pass { color: var(--pass); } .val-fail { color: var(--fail); }");
                sb.AppendLine("    .table-card { background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; overflow: hidden; }");
                sb.AppendLine("    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }");
                sb.AppendLine("    th { background: rgba(255, 255, 255, 0.02); padding: 0.875rem 1.25rem; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border); }");
                sb.AppendLine("    td { padding: 1rem 1.25rem; border-bottom: 1px solid rgba(35, 47, 72, 0.5); vertical-align: top; }");
                sb.AppendLine("    tr:last-child td { border-bottom: none; }");
                sb.AppendLine("    .status-pill { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; }");
                sb.AppendLine("    .status-passed { background: rgba(16, 185, 129, 0.15); color: var(--pass); border: 1px solid rgba(16, 185, 129, 0.3); }");
                sb.AppendLine("    .status-failed { background: rgba(239, 68, 68, 0.15); color: var(--fail); border: 1px solid rgba(239, 68, 68, 0.3); }");
                sb.AppendLine("    .error-box { margin-top: 0.5rem; padding: 0.75rem; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 0.5rem; font-family: monospace; font-size: 0.75rem; color: #fca5a5; white-space: pre-wrap; }");
                sb.AppendLine("    .screenshot-thumb { margin-top: 0.5rem; max-width: 280px; border-radius: 0.5rem; border: 1px solid var(--border); display: block; }");
                sb.AppendLine("  </style>");
                sb.AppendLine("</head>");
                sb.AppendLine("<body>");
                sb.AppendLine("  <div class=\"container\">");
                sb.AppendLine("    <div class=\"header\">");
                sb.AppendLine("      <span class=\"badge badge-primary\">Automated QA Suite &bull; Selenium WebDriver</span>");
                sb.AppendLine("      <h1 class=\"title\">NOVA MART Test Execution Report</h1>");
                sb.AppendLine($"      <p class=\"subtitle\">Generated on {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC | Platform: .NET 8 / NUnit | Browser: {browser}</p>");
                sb.AppendLine("    </div>");
                sb.AppendLine("    <div class=\"metrics\">");
                sb.AppendLine($"      <div class=\"metric-card\"><div class=\"metric-label\">Total Tests</div><div class=\"metric-value\">{total}</div></div>");
                sb.AppendLine($"      <div class=\"metric-card\"><div class=\"metric-label\">Passed</div><div class=\"metric-value val-pass\">{passed}</div></div>");
                sb.AppendLine($"      <div class=\"metric-card\"><div class=\"metric-label\">Failed</div><div class=\"metric-value val-fail\">{failed}</div></div>");
                sb.AppendLine($"      <div class=\"metric-card\"><div class=\"metric-label\">Pass Rate</div><div class=\"metric-value val-pass\">{passRate:F1}%</div></div>");
                sb.AppendLine($"      <div class=\"metric-card\"><div class=\"metric-label\">Duration</div><div class=\"metric-value\">{totalDuration:F2}s</div></div>");
                sb.AppendLine("    </div>");
                sb.AppendLine("    <div class=\"table-card\">");
                sb.AppendLine("      <table>");
                sb.AppendLine("        <thead>");
                sb.AppendLine("          <tr>");
                sb.AppendLine("            <th>Test Scenario</th>");
                sb.AppendLine("            <th>Category</th>");
                sb.AppendLine("            <th>Status</th>");
                sb.AppendLine("            <th>Duration</th>");
                sb.AppendLine("            <th>Details</th>");
                sb.AppendLine("          </tr>");
                sb.AppendLine("        </thead>");
                sb.AppendLine("        <tbody>");

                foreach (var r in Records)
                {
                    var isPass = r.Status.Equals("Passed", StringComparison.OrdinalIgnoreCase);
                    var pillClass = isPass ? "status-passed" : "status-failed";
                    sb.AppendLine("          <tr>");
                    sb.AppendLine($"            <td><strong>{r.TestName}</strong></td>");
                    sb.AppendLine($"            <td><span style=\"color: var(--text-muted);\">{r.Category}</span></td>");
                    sb.AppendLine($"            <td><span class=\"status-pill {pillClass}\">{r.Status}</span></td>");
                    sb.AppendLine($"            <td>{r.DurationSeconds:F2}s</td>");
                    sb.AppendLine("            <td>");
                    if (!string.IsNullOrEmpty(r.ErrorMessage))
                    {
                        sb.AppendLine($"              <div class=\"error-box\">{r.ErrorMessage}</div>");
                    }
                    if (!string.IsNullOrEmpty(r.ScreenshotPath) && File.Exists(r.ScreenshotPath))
                    {
                        var fileName = Path.GetFileName(r.ScreenshotPath);
                        sb.AppendLine($"              <a href=\"../Screenshots/{fileName}\" target=\"_blank\"><img class=\"screenshot-thumb\" src=\"../Screenshots/{fileName}\" alt=\"Failure Screenshot\" /></a>");
                    }
                    else if (isPass)
                    {
                        sb.AppendLine("              <span style=\"color: var(--text-muted); font-size: 0.8rem;\">Verified assertion completed successfully.</span>");
                    }
                    sb.AppendLine("            </td>");
                    sb.AppendLine("          </tr>");
                }

                sb.AppendLine("        </tbody>");
                sb.AppendLine("      </table>");
                sb.AppendLine("    </div>");
                sb.AppendLine("  </div>");
                sb.AppendLine("</body>");
                sb.AppendLine("</html>");

                File.WriteAllText(reportPath, sb.ToString());
                return reportPath;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[HtmlReportHelper] Warning generating HTML report: {ex.Message}");
                return string.Empty;
            }
        }
    }
}
