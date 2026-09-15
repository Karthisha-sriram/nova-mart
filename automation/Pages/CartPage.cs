using System;
using System.Linq;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class CartPage : BasePage
    {
        public CartPage(IWebDriver driver) : base(driver) { }

        public IWebElement CheckoutButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='checkout-button']"));

        public void NavigateTo()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/cart");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public int GetCartItemCount()
        {
            try
            {
                return Driver.FindElements(By.CssSelector("[data-testid='cart-item']")).Count;
            }
            catch
            {
                return 0;
            }
        }

        public int GetFirstItemQuantity()
        {
            var elem = Driver.FindElements(By.CssSelector("[data-testid='cart-item-quantity']")).FirstOrDefault();
            if (elem != null && int.TryParse(elem.Text.Trim(), out var qty))
            {
                return qty;
            }
            return 0;
        }

        public void IncreaseFirstItemQuantity()
        {
            var btn = WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='quantity-increase']"));
            btn.Click();
            System.Threading.Thread.Sleep(500);
        }

        public void DecreaseFirstItemQuantity()
        {
            var btn = WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='quantity-decrease']"));
            btn.Click();
            System.Threading.Thread.Sleep(500);
        }

        public void RemoveFirstItem()
        {
            var btn = WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='remove-from-cart']"));
            btn.Click();
            System.Threading.Thread.Sleep(500);
        }

        public void ProceedToCheckout()
        {
            CheckoutButton.Click();
            WaitHelper.WaitForUrlContains(Driver, "/checkout");
        }

        public bool IsEmptyCartDisplayed()
        {
            try
            {
                var elem = WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='cart-empty']"), 4);
                return elem != null && elem.Displayed;
            }
            catch
            {
                return false;
            }
        }

        public string GetGrandTotal()
        {
            try
            {
                var totalElem = Driver.FindElement(By.CssSelector("[data-testid='cart-grand-total']"));
                return totalElem.Text.Trim();
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
