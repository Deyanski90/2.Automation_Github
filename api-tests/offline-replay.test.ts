import { test, expect } from '@playwright/test';

test('Replay user flow offline using HAR', async ({ page }) => {
  // Save HAR file from a previous run (see Playwright docs)
  await page.routeFromHAR('user-flow.har');
  await page.goto('https://your-app-url.com');
  await page.click('#add-to-cart');
  await expect(page.locator('#cart-count')).toHaveText('1');
  // This test will pass offline if HAR is complete
});
