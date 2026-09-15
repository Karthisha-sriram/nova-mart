import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.cartItems = By.css("[data-testid='cart-item']");
    this.emptyCartMessage = By.css("[data-testid='cart-empty']");
    this.checkoutButton = By.css("[data-testid='checkout-button'], #cart-checkout-button");
    this.grandTotal = By.css("[data-testid='cart-grand-total']");
    this.removeButton = By.css("[data-testid='remove-from-cart']");
    this.quantityIncrease = By.css("[data-testid='quantity-increase']");
    this.quantityDecrease = By.css("[data-testid='quantity-decrease']");
    this.itemQuantity = By.css("[data-testid='cart-item-quantity']");
  }

  async load() {
    await this.navigateTo('/cart');
  }

  async getItemCount() {
    const items = await this.driver.findElements(this.cartItems);
    return items.length;
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);
    await this.sleep(500);
  }

  async removeItem() {
    await this.click(this.removeButton);
    await this.sleep(500);
  }

  async increaseFirstItemQuantity() {
    await this.click(this.quantityIncrease);
    await this.sleep(400);
  }

  async getFirstItemQuantity() {
    return await this.getText(this.itemQuantity);
  }

  async getGrandTotal() {
    return await this.getText(this.grandTotal);
  }
}
