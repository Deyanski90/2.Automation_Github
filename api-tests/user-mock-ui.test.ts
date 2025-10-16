import { test, expect } from '@playwright/test';

test('Create user with mocked API', async ({ page }) => {
  await page.route('**/api/users', async route => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ userId: 'mock-user-123' })
    });
  });
  await page.goto('https://your-app-url.com/register');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  await page.click('#submit');
  await expect(page.locator('#success-message')).toHaveText('User mock-user-123 has been created.');
});
