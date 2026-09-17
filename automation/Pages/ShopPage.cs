using System;
using System.Collections.Generic;
using System.Linq;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class ShopPage : BasePage
    {
        public ShopPage(IWebDriver driver) : base(driver) { }

        public IWebElement SortSelect =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='sort-select']"));

        public IWebElement PriceSlider =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='price-slider']"));

        public IWebElement ShopSearchInputField =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("#shop-search-input, [data-testid='search-input']"));

        public void NavigateTo()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/shop");
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='sort-select']"));
        }

        public void Search(string query)
        {
            var search = ShopSearchInputField;
            search.Clear();
            search.SendKeys(query);
            System.Threading.Thread.Sleep(500);
        }

        public void FilterByCategory(string categorySlug)
        {
            var selector = By.CssSelector($"[data-testid='category-filter-{categorySlug.ToLowerInvariant()}']");
            var button = WaitHelper.WaitForElementClickable(Driver, selector);
            button.Click();
            System.Threading.Thread.Sleep(500);
        }

        public void SetMaxPrice(int price)
        {
            var js = (IJavaScriptExecutor)Driver;
            var slider = PriceSlider;
            js.ExecuteScript(
                "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', { bubbles: true })); arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
                slider, price);
            System.Threading.Thread.Sleep(600);
        }

        public void SelectSortOption(string value)
        {
            var selectElement = new SelectElement(SortSelect);
            selectElement.SelectByValue(value);
            System.Threading.Thread.Sleep(600);
        }

        public IReadOnlyCollection<IWebElement> GetProductCards()
        {
            return Driver.FindElements(By.CssSelector("[data-testid='product-card']"));
        }

        public int GetProductCount()
        {
            return GetProductCards().Count;
        }

        public string GetFirstProductTitle()
        {
            var titles = Driver.FindElements(By.CssSelector("[data-testid='product-card'] h3, [data-testid='product-card-title']"));
            return titles.FirstOrDefault()?.Text.Trim() ?? string.Empty;
        }

        public decimal GetFirstProductPrice()
        {
            var priceElem = Driver.FindElements(By.CssSelector("[data-testid='product-card-price'], [data-testid='product-card'] .font-extrabold")).FirstOrDefault();
            if (priceElem != null)
            {
                var text = priceElem.Text.Replace("₹", "").Replace(",", "").Trim();
                if (decimal.TryParse(text, out var price)) return price;
            }
            return 0m;
        }

               public void ClickFirstProduct()
        {
            var card = WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='product-card'] a"));
            card.Click();
            WaitHelper.WaitForUrlContains(Driver, "/product/");
        }

        public void AddFirstProductToCart()
        {
            var btn = WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='product-card'] [data-testid='add-to-cart-btn']"));
            btn.Click();
            System.Threading.Thread.Sleep(500);
        }

        public void AddFirstProductToWishlist()
        {
            var btn = WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='product-card'] [data-testid='wishlist-btn'], [data-testid='product-card'] button[aria-label*='wishlist']"));
            btn.Click();
            System.Threading.Thread.Sleep(500);
        }

        public bool IsNoProductsMessageDisplayed()
        {
            try
            {
                var elem = WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='no-products-found']"), 4);
                return elem != null && elem.Displayed;
            }
            catch
            {
                return false;
            }
        }
    }
}
