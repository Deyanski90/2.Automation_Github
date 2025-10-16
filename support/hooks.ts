import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser } from '@playwright/test';

let browser: Browser;

BeforeAll(async function() {
  const browserName = (process.env.BROWSER || 'chromium').toLowerCase();
  switch (browserName) {
    case 'firefox':
      browser = await firefox.launch({ headless: true });
      break;
    case 'webkit':
      browser = await webkit.launch({ headless: true });
      break;
    default:
      browser = await chromium.launch({ headless: true });
  }
});

Before(async function() {
  const context = await browser.newContext();
  this.page = await context.newPage();
});

After(async function() {
  if (this.page) {
    await this.page.context().close();
  }
});

AfterAll(async function() {
  if (browser) {
    await browser.close();
  }
});
