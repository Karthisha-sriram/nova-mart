using System;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class OrderConfirmationPage : BasePage
    {
        public OrderConfirmationPage(IWebDriver driver) : base(driver) { }

        public IWebElement OrderSuccessContainer =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='order-success'], h1"));

        public IWebElement OrderNumberElement =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='order-number']"));

        public bool IsOrderSuccessDisplayed()
        {
            try
            {
                var elem = WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='order-success']"), 10);
                return elem != null && elem.Displayed;
            }
            catch
            {
                return false;
            }
        }

        public string GetOrderNumber()
        {
            try
            {
                var text = OrderNumberElement.Text.Trim();
                // Text is "Order ID: ORD-..."
                if (text.Contains("Order ID:"))
                {
                    return text.Replace("Order ID:", "").Trim();
                }
                return text;
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
