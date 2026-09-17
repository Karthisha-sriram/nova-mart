import { test, expect } from '@playwright/test';

test.describe('NOVA MART - Playwright Smoke Tests', () => {

  test('application loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('user menu button is available', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByTestId('user-menu-btn')
    ).toBeVisible();
  });

});
