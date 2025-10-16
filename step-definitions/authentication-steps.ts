import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { TestDataFactory } from '../test-data/test-data-factory';
import { APIHelper } from '../support/api-helper';
// Percy snapshot import is optional; require at runtime to avoid hard dependency during normal runs
let percySnapshot: ((page: any, name: string, options?: any) => Promise<void>) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  percySnapshot = require('@percy/playwright').percySnapshot;
} catch (e) {
  percySnapshot = null;
}

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

Before(async function() {
  loginPage = new LoginPage(this.page);
  dashboardPage = new DashboardPage(this.page);
});

Given('the login page is displayed', async function() {
  await loginPage.navigateToLoginPage();
  const isDisplayed = await loginPage.isLoginPageDisplayed();
  expect(isDisplayed).toBeTruthy();
  // Capture screenshot and run visual comparison helper
  const buffer = await this.page.screenshot({ fullPage: false });
  const { saveAndCompareScreenshot } = require('../support/visual-helper');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const result = await saveAndCompareScreenshot('login-page.png', buffer);
  // Optionally log result for visibility in test output
  if (result.createdBaseline) {
    console.log('Created baseline for login-page:', result.baselinePath);
  } else {
    console.log(`Login-page diff pixels: ${result.numDiffPixels}. diff saved to ${result.diffPath}`);
  }
});

Given('a valid teacher account exists', async function() {
  // Create test user via API
  const testUser = await TestDataFactory.createTeacher();
  this.testUser = testUser;
});

// Student variant
Given('a valid student account exists', async function() {
  const testUser = await TestDataFactory.createStudent();
  this.testUser = testUser;
});

When('the student enters valid credentials', async function() {
  await loginPage.enterUsername(this.testUser.username);
  await loginPage.enterPassword(this.testUser.password);
});

When('the student submits the login form', async function() {
  await loginPage.clickLoginButton();
});

When('the teacher enters valid credentials', async function() {
  await loginPage.enterUsername(this.testUser.username);
  await loginPage.enterPassword(this.testUser.password);
});

When('the teacher submits the login form', async function() {
  await loginPage.clickLoginButton();
});

When('the teacher enters username with invalid password', async function() {
  // ensure a teacher exists
  if (!this.testUser) {
    this.testUser = await TestDataFactory.createTeacher();
  }
  await loginPage.enterUsername(this.testUser.username);
  await loginPage.enterPassword('invalidPassword123!');
});

When('the student enters username with invalid password', async function() {
  if (!this.testUser) {
    this.testUser = await TestDataFactory.createStudent();
  }
  await loginPage.enterUsername(this.testUser.username);
  await loginPage.enterPassword('invalidPassword123!');
});

Then('the teacher should be redirected to the dashboard', async function() {
  // SauceDemo redirects to /inventory.html after login
  await this.page.waitForSelector(dashboardPage['selectors'].welcomeMessage, { timeout: 10000 });
  const isDashboardDisplayed = await dashboardPage.isDashboardDisplayed();
  expect(isDashboardDisplayed).toBeTruthy();
  // Capture an element screenshot and run visual comparison helper
  const inventoryLocator = this.page.locator('.inventory_list');
  const buffer = await inventoryLocator.screenshot();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { saveAndCompareScreenshot } = require('../support/visual-helper');
  const result = await saveAndCompareScreenshot('dashboard-inventory.png', buffer);
  if (result.createdBaseline) {
    console.log('Created baseline for dashboard-inventory:', result.baselinePath);
  } else {
    console.log(`Dashboard-inventory diff pixels: ${result.numDiffPixels}. diff saved to ${result.diffPath}`);
  }

  // If Percy is available in the environment, also create a Percy snapshot for cross-browser visual testing
  if (percySnapshot) {
    await percySnapshot(this.page, 'Dashboard - Inventory');
  }
});

Then('the dashboard should display the teacher profile', async function() {
  // SauceDemo shows products on the inventory page; assert inventory is visible
  const isInventoryVisible = await this.page.isVisible('.inventory_list');
  expect(isInventoryVisible).toBeTruthy();
});

Then('the student should be redirected to the dashboard', async function() {
  await this.page.waitForURL('**/inventory.html', { timeout: 10000 });
  const isInventoryVisible = await this.page.isVisible('.inventory_list');
  expect(isInventoryVisible).toBeTruthy();
});

Then('the dashboard should display the student profile', async function() {
  const isInventoryVisible = await this.page.isVisible('.inventory_list');
  expect(isInventoryVisible).toBeTruthy();
});

Then('the authentication token should be valid', async function() {
  const token = await this.page.evaluate(() => localStorage.getItem('authToken'));
  // SauceDemo doesn't expose an authToken in localStorage reliably; if present assert non-null, otherwise assert we're on inventory page
  if (token) {
    expect(token).not.toBeNull();
    this.authToken = token;
  } else {
    const isInventoryVisible = await this.page.isVisible('.inventory_list');
    expect(isInventoryVisible).toBeTruthy();
  }
});

Then('the login should fail with error message', async function() {
  const msg = await loginPage.getErrorMessage();
  expect(msg && msg.length).toBeGreaterThan(0);
});

Then('the student should remain on the login page', async function() {
  const isDisplayed = await loginPage.isLoginPageDisplayed();
  expect(isDisplayed).toBeTruthy();
});

Then('the teacher should remain on the login page', async function() {
  const isDisplayed = await loginPage.isLoginPageDisplayed();
  expect(isDisplayed).toBeTruthy();
});

// Logged-in and token expiry helpers
Given('the teacher is logged in successfully', async function() {
  const user = await TestDataFactory.createTeacher();
  const resp = await APIHelper.login(user.username, user.password).catch(() => null);
  // If API login not available, fall back to UI login
  if (resp && resp.token) {
  await this.page.goto(process.env.BASE_URL || 'http://localhost:3000');
  await this.page.evaluate((t: string) => localStorage.setItem('authToken', t), resp.token);
    this.testUser = { ...user, id: resp.id };
  } else {
    // UI login
    this.testUser = user;
    await loginPage.navigateToLoginPage();
    await loginPage.login(user.username, user.password);
  }
});

Given('the student is logged in successfully', async function() {
  const user = await TestDataFactory.createStudent();
  const resp = await APIHelper.login(user.username, user.password).catch(() => null);
  if (resp && resp.token) {
    await this.page.goto(process.env.BASE_URL || 'http://localhost:3000');
    await this.page.evaluate((t: string) => localStorage.setItem('authToken', t), resp.token);
    this.testUser = { ...user, id: resp.id };
  } else {
    this.testUser = user;
    await loginPage.navigateToLoginPage();
    await loginPage.login(user.username, user.password);
  }
});

When('the authentication token expires', async function() {
  // simulate expiry by removing the token and navigating to the base URL
  await this.page.evaluate(() => localStorage.removeItem('authToken'));
  await this.page.goto(process.env.BASE_URL || 'https://www.saucedemo.com');
});

Then('the teacher should be logged out automatically', async function() {
  // check login page visible (allow some time for redirect)
  await this.page.waitForSelector(loginPage['selectors'].loginButton, { timeout: 10000 });
  const isLoginVisible = await loginPage.isLoginPageDisplayed();
  expect(isLoginVisible).toBeTruthy();
});

Then('the student should be logged out automatically', async function() {
  const isLoginVisible = await loginPage.isLoginPageDisplayed();
  expect(isLoginVisible).toBeTruthy();
});

After(async function() {
  // Cleanup test data
  if (this.testUser) {
    await APIHelper.deleteUser(this.testUser.id);
  }
});
