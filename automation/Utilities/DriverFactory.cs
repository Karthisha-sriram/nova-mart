using System;
using System.IO;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Firefox;
using NOVAMart.Automation.Configuration;

namespace NOVAMart.Automation.Utilities
{
    public static class DriverFactory
    {
        public static string BaseUrl => TestConfiguration.Instance.BaseUrl;
        public static string BrowserType => TestConfiguration.Instance.Browser;
        public static bool IsHeadless => TestConfiguration.Instance.Headless;

        public static IWebDriver CreateDriver()
        {
            IWebDriver driver;
            var browser = BrowserType.Trim().ToLowerInvariant();

            switch (browser)
            {
                case "firefox":
                    var firefoxOptions = new FirefoxOptions();
                    if (IsHeadless)
                    {
                        firefoxOptions.AddArgument("-headless");
                    }
                    driver = new FirefoxDriver(firefoxOptions);
                    break;

                case "edge":
                    var edgeOptions = new EdgeOptions();
                    if (IsHeadless)
                    {
                        edgeOptions.AddArgument("--headless=new");
                        edgeOptions.AddArgument("--disable-gpu");
                    }
                    driver = new EdgeDriver(edgeOptions);
                    break;

                case "chrome":
                default:
                    var chromeOptions = new ChromeOptions();

                    // Detect chromium or chrome executable path
                    if (File.Exists("/usr/bin/chromium"))
                    {
                        chromeOptions.BinaryLocation = "/usr/bin/chromium";
                    }
                    else if (File.Exists("/usr/bin/google-chrome"))
                    {
                        chromeOptions.BinaryLocation = "/usr/bin/google-chrome";
                    }
                    else if (File.Exists("/usr/bin/chrome"))
                    {
                        chromeOptions.BinaryLocation = "/usr/bin/chrome";
                    }

                    if (IsHeadless)
                    {
                        chromeOptions.AddArgument("--headless=new");
                        chromeOptions.AddArgument("--disable-gpu");
                    }

                    chromeOptions.AddArgument("--no-sandbox");
                    chromeOptions.AddArgument("--disable-dev-shm-usage");
                    chromeOptions.AddArgument("--window-size=1920,1080");
                    chromeOptions.AddArgument("--ignore-certificate-errors");
                    chromeOptions.AddArgument("--disable-search-engine-choice-screen");
                    chromeOptions.AddArgument("--disable-extensions");
                    chromeOptions.AddArgument("--disable-infobars");

                    ChromeDriverService service;
                    if (File.Exists("/usr/bin/chromedriver"))
                    {
                        service = ChromeDriverService.CreateDefaultService("/usr/bin", "chromedriver");
                    }
                    else
                    {
                        service = ChromeDriverService.CreateDefaultService();
                    }

                    service.SuppressInitialDiagnosticInformation = true;
                    service.HideCommandPromptWindow = true;

                    driver = new ChromeDriver(service, chromeOptions, TimeSpan.FromSeconds(60));
                    break;
            }

            driver.Manage().Window.Size = new System.Drawing.Size(1920, 1080);
            driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(TestConfiguration.Instance.ImplicitWaitSeconds);
            return driver;
        }
    }
}
