using System;
using System.Collections.Generic;
using System.Linq;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class WishlistPage : BasePage
    {
        public WishlistPage(IWebDriver driver) : base(driver) { }

        public void NavigateTo()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/account?tab=wishlist");
            WaitHelper.WaitForElementVisible(Driver, By.TagName("body"));
        }

        public int GetWishlistItemCount()
        {
            try
            {
                return Driver.FindElements(By.CssSelector("[data-testid='wishlist-item']")).Count;
            }
            catch
            {
                return 0;
            }
        }

        public string GetFirstWishlistItemName()
        {
            try
            {
                var elements = Driver.FindElements(By.CssSelector("[data-testid='wishlist-item-name']"));
                return elements.Count > 0 ? elements[0].Text.Trim() : string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }

        public void RemoveFirstWishlistItem()
        {
            var removeButtons = Driver.FindElements(By.CssSelector("[data-testid='wishlist-remove']"));
            if (removeButtons.Count > 0)
            {
                removeButtons[0].Click();
                System.Threading.Thread.Sleep(500);
            }
        }

        public void MoveFirstItemToCart()
        {
            var moveButtons = Driver.FindElements(By.CssSelector("[data-testid='wishlist-move-to-cart']"));
            if (moveButtons.Count > 0)
            {
                moveButtons[0].Click();
                System.Threading.Thread.Sleep(500);
            }
        }

        public bool IsWishlistEmpty()
        {
            try
            {
                var emptyElements = Driver.FindElements(By.CssSelector("[data-testid='wishlist-empty']"));
                if (emptyElements.Count > 0 && emptyElements[0].Displayed) return true;

                return GetWishlistItemCount() == 0;
            }
            catch
            {
                return true;
            }
        }
    }
}
