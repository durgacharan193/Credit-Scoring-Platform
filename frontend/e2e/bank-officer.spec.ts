import { test, expect } from '@playwright/test';

test.describe('Bank Officer Portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Bank Officer")');
    await page.click('button:has-text("Sign in as Bank Officer")');
    await page.waitForURL('/bank-officer');
  });

  test('should display officer portal and consent request form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bank Officer Portal');
    
    // Check request consent button
    const requestBtn = page.locator('button:has-text("Request Consent")');
    await expect(requestBtn).toBeVisible();
  });
});
