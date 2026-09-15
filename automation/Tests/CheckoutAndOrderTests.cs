using System;
using NUnit.Framework;
using NOVAMart.Automation.Pages;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Tests
{
    [TestFixture]
    [Category("CheckoutAndOrders")]
    public class CheckoutAndOrderTests : BaseTest
    {
        private ShopPage _shopPage = null!;
        private CartPage _cartPage = null!;
        private CheckoutPage _checkoutPage = null!;
        private OrderConfirmationPage _confirmationPage = null!;
        private AccountPage _accountPage = null!;
        private LoginPage _loginPage = null!;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            _shopPage = new ShopPage(Driver);
            _cartPage = new CartPage(Driver);
            _checkoutPage = new CheckoutPage(Driver);
            _confirmationPage = new OrderConfirmationPage(Driver);
            _accountPage = new AccountPage(Driver);
            _loginPage = new LoginPage(Driver);
        }

        [Test]
        [Order(15)]
        [Description("TC15: Verify checkout form validates required fields")]
        public void Test_15_CheckoutFormValidation()
        {
            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToCart();

            _cartPage.NavigateTo();
            _cartPage.ProceedToCheckout();

            // Try to place order without filling fields
            _checkoutPage.PlaceOrder();

            Assert.That(Driver.Url, Does.Contain("/checkout"), "Form should remain on checkout page without submitting empty inputs.");
        }

        [Test]
        [Order(16)]
        [Description("TC16: Verify successful checkout flow with valid shipping information")]
        public void Test_16_SuccessfulDemoCheckout()
        {
            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToCart();

            _cartPage.NavigateTo();
            _cartPage.ProceedToCheckout();

            _checkoutPage.FillShippingDetails(TestDataHelper.DefaultCheckout);
            _checkoutPage.PlaceOrder();

            WaitHelper.WaitUntil(Driver, d => d.Url.Contains("/order-confirmation/"), timeoutSeconds: 12);
            Assert.That(Driver.Url, Does.Contain("/order-confirmation/"), "Expected navigation to order confirmation page.");
        }

        [Test]
        [Order(17)]
        [Description("TC17: Verify order confirmation displays order number and success status")]
        public void Test_17_OrderConfirmation()
        {
            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToCart();

            _cartPage.NavigateTo();
            _cartPage.ProceedToCheckout();

            _checkoutPage.FillShippingDetails(TestDataHelper.DefaultCheckout);
            _checkoutPage.PlaceOrder();

            WaitHelper.WaitUntil(Driver, d => _confirmationPage.IsOrderSuccessDisplayed(), timeoutSeconds: 12);

            Assert.That(_confirmationPage.IsOrderSuccessDisplayed(), Is.True, "Order success banner should be visible.");
            var orderNumber = _confirmationPage.GetOrderNumber();
            Assert.That(orderNumber, Is.Not.Empty, "Order number should be generated and displayed.");
        }

        [Test]
        [Order(18)]
        [Description("TC18: Verify customer order history lists previously placed orders")]
        public void Test_18_OrderHistory()
        {
            var user = TestDataHelper.ValidUser;
            _loginPage.Login(user.Email, user.Password);
            WaitHelper.WaitUntil(Driver, d => _loginPage.IsUserLoggedIn(), timeoutSeconds: 8);

            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToCart();

            _cartPage.NavigateTo();
            _cartPage.ProceedToCheckout();

            _checkoutPage.FillShippingDetails(TestDataHelper.DefaultCheckout);
            _checkoutPage.PlaceOrder();

            WaitHelper.WaitUntil(Driver, d => _confirmationPage.IsOrderSuccessDisplayed(), timeoutSeconds: 12);
            var orderNumber = _confirmationPage.GetOrderNumber();

            _accountPage.NavigateTo();
            _accountPage.SwitchToOrdersTab();

            WaitHelper.WaitUntil(Driver, d => _accountPage.GetOrdersCount() > 0, timeoutSeconds: 8);
            var count = _accountPage.GetOrdersCount();

            Assert.That(count, Is.GreaterThan(0), "Account orders tab should list customer orders.");
            if (!string.IsNullOrEmpty(orderNumber))
            {
                Assert.That(_accountPage.ContainsOrderNumber(orderNumber), Is.True,
                    $"Account order history should contain recent order {orderNumber}.");
            }
        }
    }
}
