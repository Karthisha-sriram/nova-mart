using System;
using System.IO;
using NUnit.Framework;
using OpenQA.Selenium;

namespace NOVAMart.Automation.Utilities
{
    public static class ScreenshotHelper
    {
        public static string CaptureScreenshot(IWebDriver driver, string testName)
        {
            try
            {
                if (driver is not ITakesScreenshot screenshotDriver)
                {
                    return string.Empty;
                }

                var screenshot = screenshotDriver.GetScreenshot();
                var projectDir = GetAutomationDirectory();
                var screenshotDir = Path.Combine(projectDir, "Screenshots");

                if (!Directory.Exists(screenshotDir))
                {
                    Directory.CreateDirectory(screenshotDir);
                }

                // Sanitize test name
                var sanitizedTestName = string.Concat(testName.Split(Path.GetInvalidFileNameChars()));
                var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
                var fileName = $"{sanitizedTestName}_{timestamp}.png";
                var filePath = Path.Combine(screenshotDir, fileName);

                screenshot.SaveAsFile(filePath);

                // Attach to NUnit TestContext
                TestContext.AddTestAttachment(filePath, $"Failure Screenshot for {testName}");

                return filePath;
            }
            catch (Exception ex)
            {
                TestContext.WriteLine($"[ScreenshotHelper] Warning: Failed to capture screenshot: {ex.Message}");
                return string.Empty;
            }
        }

        public static string GetAutomationDirectory()
        {
            var baseDirectory = AppContext.BaseDirectory;
            var dir = new DirectoryInfo(baseDirectory);
            while (dir != null)
            {
                if (File.Exists(Path.Combine(dir.FullName, "NOVAMart.Automation.csproj")))
                {
                    return dir.FullName;
                }
                var subAuto = Path.Combine(dir.FullName, "automation");
                if (Directory.Exists(subAuto) && File.Exists(Path.Combine(subAuto, "NOVAMart.Automation.csproj")))
                {
                    return subAuto;
                }
                dir = dir.Parent;
            }

            return Path.Combine(baseDirectory, "automation");
        }
    }
}
