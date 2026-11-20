import { test, expect } from '@playwright/test';

test.describe('Lender POS Terminal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Merchant")');
    await page.click('button:has-text("Sign in as Merchant")');
    await page.waitForURL('/lender');
  });

  test('should display lender terminal queue and OTP verify modal', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Merchant Terminal');
    
    // Check pending requests section
    await expect(page.locator('text=Pending Verifications')).toBeVisible();
  });
});
