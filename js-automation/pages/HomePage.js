import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.brandLogo = By.css("a[href='/']");
    this.heroBanner = By.css('section, div[class*="hero"], main');
    this.shopNavLink = By.css("a[href='/shop']");
    this.categoriesNavLink = By.css("a[href='/categories']");
    this.dealsNavLink = By.css("a[href='/deals']");
    this.cartButton = By.css("[data-testid='cart-button']");
    this.signInButton = By.css("[data-testid='signin-button']");
    this.searchTrigger = By.css('#search-trigger-btn');
    this.productCards = By.css("[data-testid='product-card']");
  }

  async load() {
    await this.navigateTo('/');
    await this.waitForVisible(this.brandLogo);
  }

  async getProductCardsCount() {
    const cards = await this.driver.findElements(this.productCards);
    return cards.length;
  }

  async clickFirstProduct() {
    const cards = await this.driver.findElements(this.productCards);
    if (cards.length > 0) {
      await cards[0].click();
    }
  }

  async openCart() {
    await this.click(this.cartButton);
  }

  async openSignInModal() {
    await this.click(this.signInButton);
  }

  async openSearch() {
    await this.click(this.searchTrigger);
  }
}
