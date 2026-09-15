using System;
using NUnit.Framework;
using NOVAMart.Automation.Pages;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Tests
{
    [TestFixture]
    [Category("Authentication")]
    public class AuthenticationTests : BaseTest
    {
        private LoginPage _loginPage = null!;
        private RegisterPage _registerPage = null!;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            _loginPage = new LoginPage(Driver);
            _registerPage = new RegisterPage(Driver);
        }

        [Test]
        [Order(1)]
        [Description("TC01: Verify successful login with valid credentials")]
        public void Test_01_ValidLogin()
        {
            var user = TestDataHelper.ValidUser;
            _loginPage.Login(user.Email, user.Password);

            WaitHelper.WaitUntil(Driver, d => _loginPage.IsUserLoggedIn(), timeoutSeconds: 8);

            Assert.That(_loginPage.IsUserLoggedIn(), Is.True, "Expected user to be authenticated and user menu displayed.");
        }

        [Test]
        [Order(2)]
        [Description("TC02: Verify invalid login displays appropriate error alert")]
        public void Test_02_InvalidLogin()
        {
            var user = TestDataHelper.InvalidUser;
            _loginPage.Login(user.Email, user.Password);

            var isError = _loginPage.IsErrorDisplayed();
            Assert.That(isError, Is.True, "Expected error notification on invalid credentials.");
            Assert.That(_loginPage.IsUserLoggedIn(), Is.False, "User should not be logged in with invalid credentials.");
        }

        [Test]
        [Order(3)]
        [Description("TC03: Verify empty login form validation prevents submission")]
        public void Test_03_EmptyLoginValidation()
        {
            _loginPage.OpenLoginModal();
            _loginPage.SubmitButton.Click();

            Assert.That(_loginPage.IsUserLoggedIn(), Is.False, "Form should not submit with empty fields.");
        }

        [Test]
        [Order(4)]
        [Description("TC04: Verify new user registration flow")]
        public void Test_04_UserRegistration()
        {
            var uniqueEmail = $"qa.user.{Guid.NewGuid().ToString().Substring(0, 8)}@example.com";
            _registerPage.Register("Test QA Member", uniqueEmail, "Password_123!");

            WaitHelper.WaitUntil(Driver, d => _loginPage.IsUserLoggedIn(), timeoutSeconds: 8);
            Assert.That(_loginPage.IsUserLoggedIn(), Is.True, "Expected registered user to be automatically signed in.");
        }

        [Test]
        [Order(5)]
        [Description("TC05: Verify logout functionality returns user to unauthenticated state")]
        public void Test_05_UserLogout()
        {
            var user = TestDataHelper.ValidUser;
            _loginPage.Login(user.Email, user.Password);
            WaitHelper.WaitUntil(Driver, d => _loginPage.IsUserLoggedIn(), timeoutSeconds: 8);

            _loginPage.Logout();
            WaitHelper.WaitUntil(Driver, d => !_loginPage.IsUserLoggedIn(), timeoutSeconds: 8);

            Assert.That(_loginPage.IsUserLoggedIn(), Is.False, "User should be signed out.");
        }
    }
}
