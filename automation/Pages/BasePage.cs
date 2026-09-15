using System;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public abstract class BasePage
    {
        protected readonly IWebDriver Driver;

        protected BasePage(IWebDriver driver)
        {
            Driver = driver;
        }

        // Global Navigation Elements
        public IWebElement BrandLogo =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='navbar-brand'], a[href='/']"));

        public IWebElement SearchButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='search-button'], #search-trigger-btn, button[aria-label='Open search dialog']"));

        public IWebElement SearchInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='search-input'], input#global-search-input, input#shop-search-input"));

        public IWebElement CartButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='cart-button'], #global-cart-button, a[href='/cart']"));

        public IWebElement CartBadgeCount =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='nav-cart-count'], [data-testid='cart-badge']"));

        public IWebElement SignInButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='signin-button'], #navbar-signin-button, [data-testid='nav-signin-btn']"));

        public IWebElement UserMenuButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='user-menu-btn'], [data-testid='nav-user-menu-btn']"));

        public IWebElement SignOutButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='sign-out-btn'], [data-testid='nav-signout-btn']"));

        public IWebElement OrdersMenuLink =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='nav-orders-link'], a[href*='orders']"));

        public IWebElement WishlistMenuLink =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='nav-wishlist-link'], a[href*='wishlist']"));

        public IWebElement CategoriesNavLink =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("a[href='/categories']"));

        public IWebElement ShopNavLink =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("a[href='/shop']"));

        // Global Navigation Methods
        public void OpenGlobalSearch()
        {
            try
            {
                SearchButton.Click();
                WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='search-input'], input[placeholder*='Search']"));
            }
            catch (Exception)
            {
                var js = (IJavaScriptExecutor)Driver;
                js.ExecuteScript("document.getElementById('search-trigger-btn')?.click();");
            }
        }

        public void NavigateToHome()
        {
            Driver.Navigate().GoToUrl(TestConfiguration.Instance.BaseUrl);
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public void NavigateToShop()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/shop");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public void NavigateToCart()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/cart");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public void NavigateToCheckout()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/checkout");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public void NavigateToCategories()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/categories");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public void NavigateToWishlist()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/account?tab=wishlist");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public int GetCartBadgeCount()
        {
            try
            {
                var elements = Driver.FindElements(By.CssSelector("[data-testid='nav-cart-count'], [data-testid='cart-badge'], #global-cart-button span.rounded-full"));
                if (elements.Count == 0 || !elements[0].Displayed) return 0;
                var text = elements[0].Text.Trim();
                return int.TryParse(text, out var count) ? count : 0;
            }
            catch
            {
                return 0;
            }
        }

        public bool IsUserLoggedIn()
        {
            try
            {
                var elements = Driver.FindElements(By.CssSelector("[data-testid='user-menu-btn'], [data-testid='nav-user-menu-btn']"));
                return elements.Count > 0 && elements[0].Displayed;
            }
            catch
            {
                return false;
            }
        }

        public void Logout()
        {
            try
            {
                var js = (IJavaScriptExecutor)Driver;
                js.ExecuteScript("document.querySelector('[data-testid=\\\"sign-out-btn\\\"]')?.click();");
                System.Threading.Thread.Sleep(300);

                if (IsUserLoggedIn())
                {
                    js.ExecuteScript("const btns = Array.from(document.querySelectorAll('button')); const b = btns.find(x => x.textContent.includes('Sign Out')); if (b) b.click();");
                    System.Threading.Thread.Sleep(300);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[BasePage] Logout attempt exception: {ex.Message}");
            }
        }
    }
}
