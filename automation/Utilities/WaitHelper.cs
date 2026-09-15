using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace NOVAMart.Automation.Utilities
{
    public static class WaitHelper
    {
        public static IWebElement WaitForElementVisible(IWebDriver driver, By by, int timeoutSeconds = 10)
        {
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutSeconds));
            return wait.Until(d =>
            {
                try
                {
                    var elem = d.FindElement(by);
                    return elem.Displayed ? elem : null;
                }
                catch (StaleElementReferenceException)
                {
                    return null;
                }
                catch (NoSuchElementException)
                {
                    return null;
                }
            })!;
        }

        public static IWebElement WaitForElementClickable(IWebDriver driver, By by, int timeoutSeconds = 10)
        {
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutSeconds));
            return wait.Until(d =>
            {
                try
                {
                    var elem = d.FindElement(by);
                    return (elem.Displayed && elem.Enabled) ? elem : null;
                }
                catch (StaleElementReferenceException)
                {
                    return null;
                }
                catch (NoSuchElementException)
                {
                    return null;
                }
            })!;
        }

        public static bool WaitForUrlContains(IWebDriver driver, string fraction, int timeoutSeconds = 10)
        {
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutSeconds));
            return wait.Until(d => d.Url.Contains(fraction, StringComparison.OrdinalIgnoreCase));
        }

        public static bool WaitForTextPresent(IWebDriver driver, By by, string expectedText, int timeoutSeconds = 10)
        {
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutSeconds));
            return wait.Until(d =>
            {
                try
                {
                    var elem = d.FindElement(by);
                    return elem.Text.Contains(expectedText, StringComparison.OrdinalIgnoreCase);
                }
                catch (Exception)
                {
                    return false;
                }
            });
        }

        public static void WaitUntil(IWebDriver driver, Func<IWebDriver, bool> condition, int timeoutSeconds = 10)
        {
            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutSeconds));
            wait.Until(condition);
        }
    }
}
