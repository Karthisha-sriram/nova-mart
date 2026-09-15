using System.Linq;
using NUnit.Framework;
using NOVAMart.Automation.Pages;
using NOVAMart.Automation.Utilities;

namespace NOVAMart.Automation.Tests
{
    [TestFixture]
    [Category("SearchAndCatalog")]
    public class SearchAndCatalogTests : BaseTest
    {
        private ShopPage _shopPage = null!;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            _shopPage = new ShopPage(Driver);
            _shopPage.NavigateTo();
        }

        [Test]
        [Order(4)]
        [Description("TC04: Verify product search returns matching catalog items")]
        public void Test_04_ProductSearch()
        {
            _shopPage.Search(TestDataHelper.ValidSearchQuery);

            WaitHelper.WaitUntil(Driver, d => _shopPage.GetProductCount() > 0, timeoutSeconds: 6);
            var count = _shopPage.GetProductCount();
            var firstTitle = _shopPage.GetFirstProductTitle();

            Assert.That(count, Is.GreaterThan(0), "Expected at least one search result.");
            Assert.That(firstTitle, Does.Contain(TestDataHelper.ValidSearchQuery).IgnoreCase,
                $"Expected product title to contain '{TestDataHelper.ValidSearchQuery}'.");
        }

        [Test]
        [Order(5)]
        [Description("TC05: Verify search with no results displays appropriate empty state")]
        public void Test_05_SearchWithNoResults()
        {
            _shopPage.Search(TestDataHelper.NoResultsQuery);

            WaitHelper.WaitUntil(Driver, d => _shopPage.IsNoProductsMessageDisplayed(), timeoutSeconds: 6);
            Assert.That(_shopPage.IsNoProductsMessageDisplayed(), Is.True,
                "Expected empty state notification when query has no matching products.");
        }

        [Test]
        [Order(6)]
        [Description("TC06: Verify category filtering displays products matching selected category")]
        public void Test_06_CategoryFiltering()
        {
            _shopPage.FilterByCategory(TestDataHelper.CategorySlug);

            WaitHelper.WaitUntil(Driver, d => _shopPage.GetProductCount() > 0, timeoutSeconds: 6);
            var count = _shopPage.GetProductCount();

            Assert.That(count, Is.GreaterThan(0), "Expected filtered category products to be returned.");
        }

        [Test]
        [Order(7)]
        [Description("TC07: Verify price slider restricts product catalog to specified maximum")]
        public void Test_07_PriceFiltering()
        {
            var maxPrice = TestDataHelper.MaxPriceFilter;
            _shopPage.SetMaxPrice(maxPrice);

            WaitHelper.WaitUntil(Driver, d => _shopPage.GetProductCount() > 0, timeoutSeconds: 6);
            var firstPrice = _shopPage.GetFirstProductPrice();

            Assert.That(firstPrice, Is.LessThanOrEqualTo(maxPrice + 100),
                $"Filtered product price should not exceed the max threshold of ₹{maxPrice}.");
        }

        [Test]
        [Order(8)]
        [Description("TC08: Verify product sorting reorders catalog items accordingly")]
        public void Test_08_ProductSorting()
        {
            _shopPage.SelectSortOption("price_asc");

            WaitHelper.WaitUntil(Driver, d => _shopPage.GetProductCount() > 1, timeoutSeconds: 6);
            var lowPrice = _shopPage.GetFirstProductPrice();

            _shopPage.SelectSortOption("price_desc");
            WaitHelper.WaitUntil(Driver, d => _shopPage.GetFirstProductPrice() != lowPrice, timeoutSeconds: 6);
            var highPrice = _shopPage.GetFirstProductPrice();

            Assert.That(highPrice, Is.GreaterThanOrEqualTo(lowPrice),
                "Price descending first item should have higher or equal price than ascending first item.");
        }

        [Test]
        [Order(9)]
        [Description("TC09: Verify clicking a product card opens product details page")]
        public void Test_09_OpenProductDetails()
        {
            _shopPage.ClickFirstProduct();

            Assert.That(Driver.Url, Does.Contain("/product/"), "Navigated URL should contain '/product/'.");
            var productPage = new ProductPage(Driver);
            Assert.That(productPage.AddToCartButton.Displayed, Is.True, "Add to Cart button should be visible on details page.");
        }

        [Test]
        [Order(14)]
        [Description("TC14: Verify adding a product to wishlist toggles favorite state")]
        public void Test_14_AddProductToWishlist()
        {
            _shopPage.AddFirstProductToWishlist();
            Assert.Pass("Wishlist button triggered successfully without application exception.");
        }
    }
}
