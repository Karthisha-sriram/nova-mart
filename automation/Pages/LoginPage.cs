using System;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class LoginPage : BasePage
    {
        public LoginPage(IWebDriver driver) : base(driver) { }

        public IWebElement EmailInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='login-email']"));

        public IWebElement PasswordInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='login-password']"));

        public IWebElement SubmitButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='login-submit']"));

        public IWebElement CloseButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='login-modal-close']"));

        public IWebElement SwitchToRegisterButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='toggle-register-btn']"));

        public void OpenLoginModal()
        {
            if (IsUserLoggedIn())
            {
                Logout();
            }

            var modalInputs = Driver.FindElements(By.CssSelector("[data-testid='login-email']"));
            if (modalInputs.Count == 0 || !modalInputs[0].Displayed)
            {
                var signinButtons = Driver.FindElements(By.CssSelector("[data-testid='signin-button'], #navbar-signin-button"));
                if (signinButtons.Count > 0 && signinButtons[0].Displayed)
                {
                    signinButtons[0].Click();
                }
                else
                {
                    var js = (IJavaScriptExecutor)Driver;
                    js.ExecuteScript("document.querySelector('[data-testid=\\\"signin-button\\\"]')?.click();");
                }
            }

            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='login-email']"), 8);
        }

        public void Login(string email, string password)
        {
            OpenLoginModal();

            // If register mode is currently showing, switch to login
            var toggleLoginButtons = Driver.FindElements(By.CssSelector("[data-testid='toggle-login-btn']"));
            if (toggleLoginButtons.Count > 0 && toggleLoginButtons[0].Displayed)
            {
                toggleLoginButtons[0].Click();
            }

            var emailField = EmailInput;
            emailField.Clear();
            if (!string.IsNullOrEmpty(email))
            {
                emailField.SendKeys(email);
            }

            var passwordField = PasswordInput;
            passwordField.Clear();
            if (!string.IsNullOrEmpty(password))
            {
                passwordField.SendKeys(password);
            }

            SubmitButton.Click();
        }

        public bool IsErrorDisplayed()
        {
            try
            {
                var alert = WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='auth-error-alert'], [data-testid='login-error'], .text-rose-600"), 4);
                return alert != null && alert.Displayed;
            }
            catch
            {
                return false;
            }
        }

        public string GetErrorMessage()
        {
            try
            {
                var alert = WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='auth-error-alert'], [data-testid='login-error'], .text-rose-600"), 4);
                return alert?.Text.Trim() ?? string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }

        public void CloseModal()
        {
            try
            {
                CloseButton.Click();
            }
            catch
            {
                var js = (IJavaScriptExecutor)Driver;
                js.ExecuteScript("document.querySelector('[data-testid=\\\"login-modal-close\\\"]')?.click();");
            }
        }

        public void SwitchToRegister()
        {
            OpenLoginModal();
            SwitchToRegisterButton.Click();
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='register-name']"));
        }
    }
}
