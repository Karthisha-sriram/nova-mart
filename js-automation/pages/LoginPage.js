import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(driver, baseUrl) {
    super(driver, baseUrl);
    this.emailInput = By.css("[data-testid='login-email']");
    this.passwordInput = By.css("[data-testid='login-password']");
    this.submitButton = By.css("[data-testid='login-submit']");
    this.closeButton = By.css("[data-testid='login-modal-close']");
    this.userMenuButton = By.css("[data-testid='user-menu-btn']");
    this.signOutButton = By.css("[data-testid='sign-out-btn']");
    this.errorAlert = By.css("[data-testid='login-error']");
    this.toggleRegisterButton = By.css("[data-testid='toggle-register-btn']");
    this.toggleLoginButton = By.css("[data-testid='toggle-login-btn']");
    this.registerNameInput = By.css("[data-testid='register-name']");
  }

  async openModal() {
    const isModalOpen = await this.isElementPresent(this.emailInput, 1000);
    if (!isModalOpen) {
      const loggedIn = await this.isElementPresent(this.userMenuButton, 1000);
      if (loggedIn) {
        await this.logout();
      }
      const signInBtn = By.css("[data-testid='signin-button'], #navbar-signin-button");
      await this.click(signInBtn);
    }
    await this.waitForVisible(this.emailInput);
  }

  async login(email, password) {
    await this.openModal();

    // Ensure we are on login view if register is active
    const hasToggleLogin = await this.isElementPresent(this.toggleLoginButton, 500);
    if (hasToggleLogin) {
      await this.click(this.toggleLoginButton);
      await this.sleep(200);
    }

    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitButton);
    await this.sleep(600);
  }

  async register(fullName, email, password) {
    await this.openModal();
    const hasToggleReg = await this.isElementPresent(this.toggleRegisterButton, 1000);
    if (hasToggleReg) {
      await this.click(this.toggleRegisterButton);
      await this.sleep(200);
    }

    await this.type(this.registerNameInput, fullName);
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitButton);
    await this.sleep(600);
  }

  async isUserLoggedIn() {
    return await this.isElementPresent(this.userMenuButton, 4000);
  }

  async isErrorDisplayed() {
    return await this.isElementPresent(this.errorAlert, 3000);
  }

  async getErrorMessage() {
    if (await this.isErrorDisplayed()) {
      return await this.getText(this.errorAlert);
    }
    return '';
  }

  async logout() {
    await this.driver.executeScript(`
      try {
        localStorage.removeItem('novamart_token');
        const signout = document.querySelector("[data-testid='sign-out-btn']");
        if (signout) signout.click();
      } catch (e) {}
    `);
    await this.sleep(800);
    // If signin-button is still not there, refresh
    const signin = await this.isElementPresent(By.css("[data-testid='signin-button']"), 500);
    if (!signin) {
      await this.driver.navigate().refresh();
      await this.sleep(800);
    }
  }
}
