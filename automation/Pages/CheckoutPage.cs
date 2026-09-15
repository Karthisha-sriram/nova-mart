using System;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Models;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class CheckoutPage : BasePage
    {
        public CheckoutPage(IWebDriver driver) : base(driver) { }

        public IWebElement FullNameInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='checkout-fullname']"));

        public IWebElement EmailInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='checkout-email']"));

        public IWebElement PhoneInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='checkout-phone']"));

        public IWebElement StreetInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='checkout-street']"));

        public IWebElement CityInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='checkout-city']"));

        public IWebElement StateInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='checkout-state']"));

        public IWebElement PostalCodeInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='checkout-postalcode']"));

        public IWebElement PlaceOrderButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='place-order']"));

        public void NavigateTo()
        {
            Driver.Navigate().GoToUrl($"{TestConfiguration.Instance.BaseUrl}/checkout");
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='place-order']"));
        }

        public void FillShippingDetails(CheckoutModel data)
        {
            FullNameInput.Clear();
            FullNameInput.SendKeys(data.FullName);

            EmailInput.Clear();
            EmailInput.SendKeys(data.Email);

            PhoneInput.Clear();
            PhoneInput.SendKeys(data.Phone);

            StreetInput.Clear();
            StreetInput.SendKeys(data.Address);

            CityInput.Clear();
            CityInput.SendKeys(data.City);

            StateInput.Clear();
            StateInput.SendKeys(data.State);

            PostalCodeInput.Clear();
            PostalCodeInput.SendKeys(data.PostalCode);
        }

        public void SelectPaymentMethod(string method)
        {
            var selector = method.ToLowerInvariant() switch
            {
                "upi" => "button:has(svg.text-cyan-600), button:contains('UPI')",
                "cod" => "button:has(svg.text-amber-600), button:contains('COD')",
                _ => "button:has(svg.text-indigo-600), button:contains('Card')"
            };

            try
            {
                var buttons = Driver.FindElements(By.CssSelector("button"));
                foreach (var btn in buttons)
                {
                    if (btn.Text.Contains(method, StringComparison.OrdinalIgnoreCase))
                    {
                        btn.Click();
                        break;
                    }
                }
            }
            catch (Exception)
            {
                // Default is card
            }
        }

        public void PlaceOrder()
        {
            PlaceOrderButton.Click();
            WaitHelper.WaitForUrlContains(Driver, "/order-confirmation", 15);
        }

        public bool IsErrorDisplayed()
        {
            try
            {
                var error = WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='checkout-error']"), 4);
                return error != null && error.Displayed;
            }
            catch
            {
                return false;
            }
        }
    }
}
