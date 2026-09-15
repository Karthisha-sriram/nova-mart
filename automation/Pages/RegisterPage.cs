using System;
using OpenQA.Selenium;
using NOVAMart.Automation.Configuration;
using NOVAMart.Automation.Models;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Pages
{
    public class RegisterPage : BasePage
    {
        public RegisterPage(IWebDriver driver) : base(driver) { }

        public IWebElement NameInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='register-name']"));

        public IWebElement EmailInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='login-email']"));

        public IWebElement PasswordInput =>
            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='login-password']"));

        public IWebElement SubmitButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='login-submit']"));

        public IWebElement SwitchToLoginButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='toggle-login-btn']"));

        public IWebElement CloseButton =>
            WaitHelper.WaitForElementClickable(Driver, By.CssSelector("[data-testid='login-modal-close']"));

        public void OpenRegisterModal()
        {
            if (IsUserLoggedIn())
            {
                Logout();
            }

            var modalInputs = Driver.FindElements(By.CssSelector("[data-testid='register-name']"));
            if (modalInputs.Count == 0 || !modalInputs[0].Displayed)
            {
                var loginInputs = Driver.FindElements(By.CssSelector("[data-testid='login-email']"));
                if (loginInputs.Count == 0 || !loginInputs[0].Displayed)
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

                var toggleRegisterButtons = Driver.FindElements(By.CssSelector("[data-testid='toggle-register-btn']"));
                if (toggleRegisterButtons.Count > 0 && toggleRegisterButtons[0].Displayed)
                {
                    toggleRegisterButtons[0].Click();
                }
                else
                {
                    var js = (IJavaScriptExecutor)Driver;
                    js.ExecuteScript("document.querySelector('[data-testid=\\\"toggle-register-btn\\\"]')?.click();");
                }
            }

            WaitHelper.WaitForElementVisible(Driver, By.CssSelector("[data-testid='register-name']"), 8);
        }

        public void Register(string fullName, string email, string password)
        {
            OpenRegisterModal();

            var nameField = NameInput;
            nameField.Clear();
            if (!string.IsNullOrEmpty(fullName))
            {
                nameField.SendKeys(fullName);
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
    }
}
