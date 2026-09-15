using System;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class ProductPage : BasePage
    {
        public ProductPage(IWebDriver driver) : base(driver) { }

        public IWebElement ProductTitle =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("h1, [data-testid='product-title']"));

        public IWebElement ProductPrice =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='product-price'], span.text-3xl"));

        public IWebElement AddToCartButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='add-to-cart'], [data-testid='add-to-cart-btn'], button.bg-indigo-600"));

        public IWebElement QuantityIncreaseButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='quantity-increase'], [data-testid='qty-plus-btn']"));

        public IWebElement QuantityDecreaseButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='quantity-decrease'], [data-testid='qty-minus-btn']"));

        public IWebElement QuantityInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='quantity-input'], [data-testid='qty-input']"));

        public IWebElement WishlistButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='detail-wishlist-button'], [data-testid='wishlist-btn']"));

        public void NavigateTo(string slugOrId)
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/product/{slugOrId}");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public string GetTitle()
        {
            return ProductTitle.Text.Trim();
        }

        public void IncreaseQuantity()
        {
            QuantityIncreaseButton.Click();
        }

        public void DecreaseQuantity()
        {
            QuantityDecreaseButton.Click();
        }

        public int GetQuantity()
        {
            var value = QuantityInput.GetAttribute("value");
            if (int.TryParse(value, out var qty))
            {
                return qty;
            }
            return 1;
        }

        public void AddToCart()
        {
            AddToCartButton.Click();
            System.Threading.Thread.Sleep(500);
        }

        public void AddToWishlist()
        {
            WishlistButton.Click();
            System.Threading.Thread.Sleep(500);
        }

        public bool IsAddToCartEnabled()
        {
            try
            {
                return AddToCartButton.Enabled;
            }
            catch
            {
                return false;
            }
        }
    }
}
