using System;
using NUnit.Framework;
using NUnit.Framework.Interfaces;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;

namespace NOVAMart.Automation.Utilities
{
    [TestFixture]
    public abstract class BaseTest
    {
        protected IWebDriver Driver { get; private set; } = null!;
        private DateTime _testStartTime;

        [SetUp]
        public virtual void SetUp()
        {
            Driver = DriverFactory.CreateDriver();
            _testStartTime = DateTime.UtcNow;
            Driver.Navigate().GoToUrl(DriverFactory.BaseUrl);
        }

        [TearDown]
        public virtual void TearDown()
        {
            var outcome = TestContext.CurrentContext.Result.Outcome.Status;
            var duration = (DateTime.UtcNow - _testStartTime).TotalSeconds;
            var testName = TestContext.CurrentContext.Test.Name;
            string? screenshotPath = null;
            string? errorMessage = null;

            if (outcome == TestStatus.Failed)
            {
                try
                {
                    TestContext.WriteLine($"[BaseTest] Failure on URL: {Driver.Url} | Title: {Driver.Title}");
                    screenshotPath = ScreenshotHelper.CaptureScreenshot(Driver, testName);
                }
                catch (Exception ex)
                {
                    TestContext.WriteLine($"[BaseTest] Exception while diagnosing failure: {ex.Message}");
                }
                errorMessage = TestContext.CurrentContext.Result.Message;
            }

            HtmlReportHelper.AddTestRecord(new TestRecord
            {
                TestName = testName,
                Category = GetType().Name,
                Status = outcome == TestStatus.Passed ? "Passed" : outcome == TestStatus.Failed ? "Failed" : "Skipped",
                DurationSeconds = duration,
                ErrorMessage = errorMessage,
                ScreenshotPath = screenshotPath
            });

            try
            {
                Driver?.Quit();
                Driver?.Dispose();
            }
            catch (Exception ex)
            {
                TestContext.WriteLine($"[BaseTest] Warning during driver cleanup: {ex.Message}");
            }
        }

        [OneTimeTearDown]
        public virtual void OneTimeTearDown()
        {
            var reportPath = HtmlReportHelper.GenerateReport();
            if (!string.IsNullOrEmpty(reportPath))
            {
                TestContext.WriteLine($"[BaseTest] Execution Report Generated: {reportPath}");
            }
        }
    }
}
