import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class ProductPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.productTitle = By.css('#product-title, h1');
    this.productPrice = By.css("[data-testid='product-price'], span.text-3xl");
    this.addToCartButton = By.css("[data-testid='add-to-cart']");
    this.wishlistButton = By.css("[data-testid='detail-wishlist-button'], [data-testid='add-to-wishlist']");
    this.quantityInput = By.css("[data-testid='quantity-input']");
    this.quantityIncrease = By.css("[data-testid='quantity-increase']");
    this.quantityDecrease = By.css("[data-testid='quantity-decrease']");
    this.cartBadge = By.css("[data-testid='cart-button'] span");
  }

  async loadProduct(productId = 1) {
    await this.navigateTo(`/product/${productId}`);
    await this.waitForVisible(this.productTitle);
  }

  async getTitle() {
    return await this.getText(this.productTitle);
  }

  async addToCart() {
    await this.click(this.addToCartButton);
    await this.sleep(600);
  }

  async increaseQuantity() {
    await this.click(this.quantityIncrease);
    await this.sleep(200);
  }

  async getQuantity() {
    const el = await this.waitForVisible(this.quantityInput);
    return await el.getAttribute('value');
  }

  async toggleWishlist() {
    await this.click(this.wishlistButton);
    await this.sleep(400);
  }
}
