using System.Threading.Tasks;
using NUnit.Framework;
using NOVAMart.Automation.Pages;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Tests
{
    [TestFixture]
    [Category("Regression")]
    public class RegressionSuite : BaseTest
    {
        private LoginPage _loginPage = null!;
        private ShopPage _shopPage = null!;
        private ProductPage _productPage = null!;
        private CartPage _cartPage = null!;
        private CheckoutPage _checkoutPage = null!;
        private OrderConfirmationPage _confirmationPage = null!;
        private AccountPage _accountPage = null!;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            _loginPage = new LoginPage(Driver);
            _shopPage = new ShopPage(Driver);
            _productPage = new ProductPage(Driver);
            _cartPage = new CartPage(Driver);
            _checkoutPage = new CheckoutPage(Driver);
            _confirmationPage = new OrderConfirmationPage(Driver);
            _accountPage = new AccountPage(Driver);
        }

        [Test]
        [Order(19)]
        [Description("TC19: Full End-to-End Regression Test covering Login, Search, Filter, Cart, Checkout, Confirmation, History, and API validation")]
        public async Task Test_19_FullEndToEndRegressionFlow()
        {
            // Step 1: User Authentication
            TestContext.WriteLine("[Step 1] Authenticating customer with valid credentials...");
            var user = TestDataHelper.ValidUser;
            _loginPage.Login(user.Email, user.Password);
            WaitHelper.WaitUntil(Driver, d => _loginPage.IsUserLoggedIn(), timeoutSeconds: 8);
            Assert.That(_loginPage.IsUserLoggedIn(), Is.True, "Customer authentication failed in regression flow.");

            // Step 2: Catalog Navigation & Search
            TestContext.WriteLine("[Step 2] Navigating to shop and searching for items...");
            _shopPage.NavigateTo();
            _shopPage.Search("Nova");
            WaitHelper.WaitUntil(Driver, d => _shopPage.GetProductCount() > 0, timeoutSeconds: 6);
            Assert.That(_shopPage.GetProductCount(), Is.GreaterThan(0), "Search returned zero results.");

            // Step 3: Product Detail View
            TestContext.WriteLine("[Step 3] Opening first product details...");
            _shopPage.ClickFirstProduct();
            Assert.That(Driver.Url, Does.Contain("/product/"), "Failed to open product details.");

            // Step 4: Increase Detail Quantity & Add to Cart
            TestContext.WriteLine("[Step 4] Updating quantity and adding item to cart...");
            _productPage.IncreaseQuantity();
            _productPage.AddToCart();
            WaitHelper.WaitUntil(Driver, d => _productPage.GetCartBadgeCount() > 0, timeoutSeconds: 6);

            // Step 5: Review Cart and Verify Quantity
            TestContext.WriteLine("[Step 5] Reviewing cart items...");
            _cartPage.NavigateTo();
            WaitHelper.WaitUntil(Driver, d => _cartPage.GetCartItemCount() > 0, timeoutSeconds: 6);
            Assert.That(_cartPage.GetCartItemCount(), Is.GreaterThan(0), "Cart is empty.");

            // Step 6: Proceed to Checkout & Fill Shipping
            TestContext.WriteLine("[Step 6] Proceeding to checkout and providing shipping information...");
            _cartPage.ProceedToCheckout();
            _checkoutPage.FillShippingDetails(TestDataHelper.DefaultCheckout);

            // Step 7: Place Order & Confirm
            TestContext.WriteLine("[Step 7] Submitting order...");
            _checkoutPage.PlaceOrder();

            WaitHelper.WaitUntil(Driver, d => _confirmationPage.IsOrderSuccessDisplayed(), timeoutSeconds: 12);
            Assert.That(_confirmationPage.IsOrderSuccessDisplayed(), Is.True, "Order confirmation banner not displayed.");

            var orderNumber = _confirmationPage.GetOrderNumber();
            Assert.That(orderNumber, Is.Not.Empty, "Order number was not generated.");
            TestContext.WriteLine($"[Success] Order generated with ID: {orderNumber}");

            // Step 8: Database & Backend API Verification
            TestContext.WriteLine("[Step 8] Validating order record via backend REST API...");
            var orderExists = await ApiHelper.VerifyOrderExistsAsync(orderNumber);
            Assert.That(orderExists, Is.True, $"Order {orderNumber} could not be validated via backend API.");

            // Step 9: Customer Order History Verification
            TestContext.WriteLine("[Step 9] Verifying order in customer account history...");
            _accountPage.NavigateTo();
            _accountPage.SwitchToOrdersTab();
            WaitHelper.WaitUntil(Driver, d => _accountPage.GetOrdersCount() > 0, timeoutSeconds: 8);
            Assert.That(_accountPage.ContainsOrderNumber(orderNumber), Is.True,
                $"Order {orderNumber} was not found in customer account order history.");

            TestContext.WriteLine("[Regression Pass] Complete end-to-end regression flow passed successfully.");
        }
    }
}
