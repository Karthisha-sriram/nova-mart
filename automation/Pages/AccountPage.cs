using System;
using System.Linq;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class AccountPage : BasePage
    {
        public AccountPage(IWebDriver driver) : base(driver) { }

        public IWebElement OrdersTab =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='tab-orders']"));

        public IWebElement WishlistTab =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='tab-wishlist']"));

        public void NavigateTo()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/account");
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='tab-orders'], h1"));
        }

        public void SwitchToOrdersTab()
        {
            OrdersTab.Click();
            System.Threading.Thread.Sleep(400);
        }

        public void SwitchToWishlistTab()
        {
            WishlistTab.Click();
            System.Threading.Thread.Sleep(400);
        }

        public int GetOrdersCount()
        {
            try
            {
                return Driver.FindElements(By.CssSelector("[data-testid='order-card']")).Count;
            }
            catch
            {
                return 0;
            }
        }

        public bool ContainsOrderNumber(string orderNumber)
        {
            try
            {
                var elements = Driver.FindElements(By.CssSelector("[data-testid='order-card-number']"));
                return elements.Any(e => e.Text.Contains(orderNumber, StringComparison.OrdinalIgnoreCase));
            }
            catch
            {
                return false;
            }
        }
    }
}
