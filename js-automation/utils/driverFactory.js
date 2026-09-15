import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export async function createDriver() {
  const options = new chrome.Options();
  options.addArguments(
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-extensions',
    '--window-size=1920,1080'
  );
  if (process.env.CHROME_BIN) {
    options.setChromeBinaryPath(process.env.CHROME_BIN);
  } else {
    options.setChromeBinaryPath('/usr/bin/chromium');
  }

  const service = new chrome.ServiceBuilder('/usr/bin/chromedriver');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  await driver.manage().setTimeouts({ implicit: 8000, pageLoad: 30000 });
  return driver;
}
