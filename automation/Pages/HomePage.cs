using System;
using System.Collections.Generic;
using System.Linq;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class HomePage : BasePage
    {
        public HomePage(IWebDriver driver) : base(driver) { }

        public IWebElement HeroShopButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='hero-shop-button'], a[href='/shop']"));

        public IWebElement HeroTitle =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("h1, [data-testid='hero-title']"));

        public IWebElement AnnouncementBar =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='announcement-bar'], div.bg-slate-950"));

        public void NavigateTo()
        {
            Driver.Navigate().GoToUrl(TestConfiguration.Instance.BaseUrl);
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public bool IsLoaded()
        {
            try
            {
                return Driver.Title.Contains("NOVA MART", StringComparison.OrdinalIgnoreCase) ||
                       Driver.FindElements(By.CssSelector("nav, header, [data-testid='hero-shop-button'], a[href='/shop']")).Count > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool IsMainNavigationVisible()
        {
            try
            {
                return Driver.FindElements(By.CssSelector("nav, a[href='/shop'], a[href='/categories']")).Count > 0;
            }
            catch
            {
                return false;
            }
        }

        public void ClickExploreCollection()
        {
            HeroShopButton.Click();
            WaitHelper.WaitForUrlContains(Driver, "/shop");
        }

        public int GetFeaturedProductCount()
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

        public List<string> GetFeaturedProductNames()
        {
            try
            {
                return Driver.FindElements(By.CssSelector("[data-testid='product-card'] h3, [data-testid='product-card'] a"))
                    .Select(e => e.Text.Trim())
                    .Where(t => !string.IsNullOrEmpty(t))
                    .ToList();
            }
            catch
            {
                return new List<string>();
            }
        }

        public void ClickCategoryPill(string categorySlugOrName)
        {
            var selector = $"a[href*='/shop?category={categorySlugOrName.ToLowerInvariant()}'], [data-category='{categorySlugOrName}']";
            var element = WaitHelper.WaitForElementClickable(Driver, By.CssSelector(selector));
            element.Click();
        }
    }
}
