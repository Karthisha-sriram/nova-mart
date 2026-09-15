using NUnit.Framework;
using NOVAMart.Automation.Pages;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Tests
{
    [TestFixture]
    [Category("CartManagement")]
    public class CartManagementTests : BaseTest
    {
        private ShopPage _shopPage = null!;
        private CartPage _cartPage = null!;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            _shopPage = new ShopPage(Driver);
            _cartPage = new CartPage(Driver);
        }

        [Test]
        [Order(10)]
        [Description("TC10: Verify adding product to cart updates badge and cart items")]
        public void Test_10_AddProductToCart()
        {
            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToCart();

            WaitHelper.WaitUntil(Driver, d => _shopPage.GetCartBadgeCount() > 0, timeoutSeconds: 6);
            var badge = _shopPage.GetCartBadgeCount();

            Assert.That(badge, Is.GreaterThan(0), "Cart badge should display at least 1 item after adding to cart.");
        }

        [Test]
        [Order(11)]
        [Description("TC11: Verify increasing item quantity in cart")]
        public void Test_11_IncreaseQuantity()
        {
            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToCart();

            _cartPage.NavigateTo();
            WaitHelper.WaitUntil(Driver, d => _cartPage.GetCartItemCount() > 0, timeoutSeconds: 6);

            var initialQty = _cartPage.GetFirstItemQuantity();
            _cartPage.IncreaseFirstItemQuantity();

            WaitHelper.WaitUntil(Driver, d => _cartPage.GetFirstItemQuantity() > initialQty, timeoutSeconds: 6);
            var updatedQty = _cartPage.GetFirstItemQuantity();

            Assert.That(updatedQty, Is.EqualTo(initialQty + 1), "Item quantity should increment by 1.");
        }

        [Test]
        [Order(12)]
        [Description("TC12: Verify decreasing item quantity in cart")]
        public void Test_12_DecreaseQuantity()
        {
            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToCart();

            _cartPage.NavigateTo();
            WaitHelper.WaitUntil(Driver, d => _cartPage.GetCartItemCount() > 0, timeoutSeconds: 6);

            _cartPage.IncreaseFirstItemQuantity();
            WaitHelper.WaitUntil(Driver, d => _cartPage.GetFirstItemQuantity() >= 2, timeoutSeconds: 6);

            var beforeQty = _cartPage.GetFirstItemQuantity();
            _cartPage.DecreaseFirstItemQuantity();

            WaitHelper.WaitUntil(Driver, d => _cartPage.GetFirstItemQuantity() < beforeQty, timeoutSeconds: 6);
            var afterQty = _cartPage.GetFirstItemQuantity();

            Assert.That(afterQty, Is.EqualTo(beforeQty - 1), "Item quantity should decrement by 1.");
        }

        [Test]
        [Order(13)]
        [Description("TC13: Verify removing product removes item or displays empty cart")]
        public void Test_13_RemoveProduct()
        {
            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToCart();

            _cartPage.NavigateTo();
            WaitHelper.WaitUntil(Driver, d => _cartPage.GetCartItemCount() > 0, timeoutSeconds: 6);

            _cartPage.RemoveFirstItem();

            WaitHelper.WaitUntil(Driver, d => _cartPage.IsEmptyCartDisplayed() || _cartPage.GetCartItemCount() == 0, timeoutSeconds: 6);

            Assert.That(_cartPage.IsEmptyCartDisplayed() || _cartPage.GetCartItemCount() == 0, Is.True,
                "Cart should be empty or item count should decrease to 0 after removing the item.");
        }
    }
}
