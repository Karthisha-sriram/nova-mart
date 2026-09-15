import { By, until } from 'selenium-webdriver';

export class BasePage {
  constructor(driver, baseUrl = 'http://localhost:3000') {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async navigateTo(path = '/') {
    await this.driver.get(`${this.baseUrl}${path}`);
  }

  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForVisible(locator, timeout = 10000) {
    const el = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    return el;
  }

  async click(locator, timeout = 10000) {
    const el = await this.waitForVisible(locator, timeout);
    await this.driver.wait(until.elementIsEnabled(el), timeout);
    await el.click();
    return el;
  }

  async type(locator, text, timeout = 10000) {
    const el = await this.waitForVisible(locator, timeout);
    await el.clear();
    await el.sendKeys(text);
    return el;
  }

  async getText(locator, timeout = 10000) {
    const el = await this.waitForVisible(locator, timeout);
    return await el.getText();
  }

  async isElementPresent(locator, timeout = 3000) {
    try {
      await this.waitForElement(locator, timeout);
      return true;
    } catch {
      return false;
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
