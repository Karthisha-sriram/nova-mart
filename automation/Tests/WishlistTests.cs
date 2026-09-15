using NUnit.Framework;
using NOVAMart.Automation.Pages;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Tests
{
    [TestFixture]
    [Category("Wishlist")]
    public class WishlistTests : BaseTest
    {
        private ShopPage _shopPage = null!;
        private WishlistPage _wishlistPage = null!;
        private LoginPage _loginPage = null!;
        private CartPage _cartPage = null!;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            _shopPage = new ShopPage(Driver);
            _wishlistPage = new WishlistPage(Driver);
            _loginPage = new LoginPage(Driver);
            _cartPage = new CartPage(Driver);

            // Log in so wishlist is persistent to user account
            var user = TestDataHelper.ValidUser;
            _loginPage.Login(user.Email, user.Password);
            WaitHelper.WaitUntil(Driver, d => _loginPage.IsUserLoggedIn(), timeoutSeconds: 8);
        }

        [Test]
        [Order(20)]
        [Description("TC20: Verify adding product to wishlist displays item in user wishlist")]
        public void Test_20_AddToWishlistAndVerify()
        {
            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToWishlist();

            _wishlistPage.NavigateTo();
            WaitHelper.WaitUntil(Driver, d => _wishlistPage.GetWishlistItemCount() > 0, timeoutSeconds: 6);

            var count = _wishlistPage.GetWishlistItemCount();
            Assert.That(count, Is.GreaterThan(0), "Wishlist should contain at least 1 item after adding from shop.");
        }

        [Test]
        [Order(21)]
        [Description("TC21: Verify removing item from wishlist updates wishlist items")]
        public void Test_21_RemoveFromWishlist()
        {
            // Seed wishlist if empty
            _wishlistPage.NavigateTo();
            if (_wishlistPage.IsWishlistEmpty())
            {
                _shopPage.NavigateTo();
                _shopPage.AddFirstProductToWishlist();
                _wishlistPage.NavigateTo();
                WaitHelper.WaitUntil(Driver, d => _wishlistPage.GetWishlistItemCount() > 0, timeoutSeconds: 6);
            }

            var initialCount = _wishlistPage.GetWishlistItemCount();
            _wishlistPage.RemoveFirstWishlistItem();

            WaitHelper.WaitUntil(Driver, d => _wishlistPage.GetWishlistItemCount() < initialCount || _wishlistPage.IsWishlistEmpty(), timeoutSeconds: 6);
            var newCount = _wishlistPage.GetWishlistItemCount();

            Assert.That(newCount, Is.LessThan(initialCount), "Wishlist count should decrease after removing item.");
        }

        [Test]
        [Order(22)]
        [Description("TC22: Verify moving wishlist item to cart adds to cart")]
        public void Test_22_MoveWishlistItemToCart()
        {
            _shopPage.NavigateTo();
            _shopPage.AddFirstProductToWishlist();

            _wishlistPage.NavigateTo();
            WaitHelper.WaitUntil(Driver, d => _wishlistPage.GetWishlistItemCount() > 0, timeoutSeconds: 6);

            _wishlistPage.MoveFirstItemToCart();

            WaitHelper.WaitUntil(Driver, d => _wishlistPage.GetCartBadgeCount() > 0, timeoutSeconds: 6);
            var badge = _wishlistPage.GetCartBadgeCount();

            Assert.That(badge, Is.GreaterThan(0), "Cart badge should increase after moving wishlist item to cart.");
        }
    }
}
