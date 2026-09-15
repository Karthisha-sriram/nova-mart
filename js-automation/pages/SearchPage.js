import { By, Key } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class SearchPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.searchInput = By.css("[data-testid='search-input'], input#shop-search-input");
    this.searchModalInput = By.css('#search-modal-input, [data-testid=' + "'search-input']");
    this.productCards = By.css("[data-testid='product-card']");
    this.categorySelect = By.css("select[id*='category'], select[id*='sort']");
  }

  async loadShop() {
    await this.navigateTo('/shop');
    await this.waitForVisible(this.searchInput);
  }

  async searchProduct(keyword) {
    const el = await this.waitForVisible(this.searchInput);
    await el.clear();
    await el.sendKeys(keyword, Key.ENTER);
    await this.sleep(800);
  }

  async getMatchingProductsCount() {
    const cards = await this.driver.findElements(this.productCards);
    return cards.length;
  }
}
