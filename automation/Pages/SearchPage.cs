using System;
using System.Collections.Generic;
using System.Linq;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class SearchPage : BasePage
    {
        public SearchPage(IWebDriver driver) : base(driver) { }

        public IWebElement SearchModalInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='search-input'], input[placeholder*='Search']"));

        public IWebElement ShopSearchInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='shop-search-input'], input[placeholder*='Search entire']"));

        public void OpenSearchModal()
        {
            SearchButton.Click();
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='search-input'], input[placeholder*='Search']"));
        }

        public void SearchInModal(string query)
        {
            OpenSearchModal();
            var input = SearchModalInput;
            input.Clear();
            input.SendKeys(query);
            // Brief wait for debounced search results
            System.Threading.Thread.Sleep(600);
        }

        public int GetModalResultsCount()
        {
            try
            {
                return Driver.FindElements(By.CssSelector("[data-testid='search-result-item'], a[href*='/product/']")).Count;
            }
            catch
            {
                return 0;
            }
        }

        public void SubmitModalSearch()
        {
            SearchModalInput.SendKeys(Keys.Enter);
            WaitHelper.WaitForUrlContains(Driver, "/shop");
        }

        public void NavigateToShopSearch(string query)
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/shop?q={Uri.EscapeDataString(query)}");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public void SearchOnShopPage(string query)
        {
            NavigateToShop();
            var input = ShopSearchInput;
            input.Clear();
            input.SendKeys(query);
            input.SendKeys(Keys.Enter);
            System.Threading.Thread.Sleep(500);
        }

        public int GetProductCount()
        {
            try
            {
                return Driver.FindElements(By.CssSelector("[data-testid='product-card']")).Count;
            }
            catch
            {
                return 0;
            }
        }

        public string GetFirstProductTitle()
        {
            try
            {
                var titles = Driver.FindElements(By.CssSelector("[data-testid='product-card'] h3, [data-testid='product-card'] h4, [data-testid='product-card'] a"));
                return titles.Count > 0 ? titles[0].Text.Trim() : string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }

        public bool IsNoResultsDisplayed()
        {
            try
            {
                var elements = Driver.FindElements(By.CssSelector("[data-testid='no-products-found'], [data-testid='no-search-results']"));
                if (elements.Count > 0 && elements[0].Displayed) return true;

                // Also check if text says "No products found"
                var bodyText = Driver.FindElement(By.TagName("body")).Text;
                return bodyText.Contains("No products found", StringComparison.OrdinalIgnoreCase) ||
                       bodyText.Contains("No matching products", StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }
    }
}
