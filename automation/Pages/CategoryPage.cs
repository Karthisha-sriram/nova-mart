using System;
using System.Collections.Generic;
using System.Linq;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class CategoryPage : BasePage
    {
        public CategoryPage(IWebDriver driver) : base(driver) { }

        public void NavigateTo()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/categories");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public int GetCategoriesCount()
        {
            try
            {
                WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='category-card']"), 8);
                return Driver.FindElements(By.CssSelector("[data-testid='category-card']")).Count;
            }
            catch
            {
                return 0;
            }
        }

        public List<string> GetCategoryNames()
        {
            try
            {
                WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='category-name']"), 8);
                return Driver.FindElements(By.CssSelector("[data-testid='category-name']"))
                    .Select(e => e.Text.Trim())
                    .Where(t => !string.IsNullOrEmpty(t))
                    .ToList();
            }
            catch
            {
                return new List<string>();
            }
        }

        public void ClickCategoryBySlug(string slug)
        {
            var element = WaitHelper.WaitForElementClickable(Driver, By.CssSelector($"[data-testid='category-card'][data-category-slug='{slug.ToLowerInvariant()}'], a[href*='category={slug.ToLowerInvariant()}']"));
            element.Click();
            WaitHelper.WaitForUrlContains(Driver, "/shop");
        }

        public void ClickCategoryByName(string categoryName)
        {
            var cards = Driver.FindElements(By.CssSelector("[data-testid='category-card']"));
            foreach (var card in cards)
            {
                if (card.Text.Contains(categoryName, StringComparison.OrdinalIgnoreCase))
                {
                    card.Click();
                    WaitHelper.WaitForUrlContains(Driver, "/shop");
                    return;
                }
            }

            // Fallback: navigate directly
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/shop?category={categoryName.ToLowerInvariant()}");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public string GetCategoryProductCountText(string slug)
        {
            try
            {
                var card = Driver.FindElement(By.CssSelector($"[data-testid='category-card'][data-category-slug='{slug.ToLowerInvariant()}'], a[href*='category={slug.ToLowerInvariant()}']"));
                var countElem = card.FindElement(By.CssSelector("[data-testid='category-count']"));
                return countElem.Text.Trim();
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
