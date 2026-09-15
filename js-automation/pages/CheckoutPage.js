import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class CheckoutPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.fullNameInput = By.css("[data-testid='checkout-fullname']");
    this.emailInput = By.css("[data-testid='checkout-email']");
    this.phoneInput = By.css("[data-testid='checkout-phone']");
    this.streetInput = By.css("[data-testid='checkout-street']");
    this.cityInput = By.css("[data-testid='checkout-city']");
    this.stateInput = By.css("[data-testid='checkout-state']");
    this.postalCodeInput = By.css("[data-testid='checkout-postalcode']");
    this.placeOrderButton = By.css("[data-testid='place-order'], #place-order-submit-btn");
    this.orderSuccessContainer = By.css("[data-testid='order-success'], #order-success-container");
    this.orderErrorAlert = By.css("[data-testid='checkout-error']");
  }

  async load() {
    await this.navigateTo('/checkout');
    await this.waitForVisible(this.fullNameInput);
  }

  async fillShippingForm(data) {
    if (data.fullName) await this.type(this.fullNameInput, data.fullName);
    if (data.email) await this.type(this.emailInput, data.email);
    if (data.phone) await this.type(this.phoneInput, data.phone);
    if (data.street) await this.type(this.streetInput, data.street);
    if (data.city) await this.type(this.cityInput, data.city);
    if (data.state) await this.type(this.stateInput, data.state);
    if (data.postalCode) await this.type(this.postalCodeInput, data.postalCode);
  }

  async placeOrder() {
    await this.click(this.placeOrderButton);
    await this.sleep(1000);
  }

  async isOrderSuccessful() {
    return await this.isElementPresent(this.orderSuccessContainer, 12000);
  }
}
