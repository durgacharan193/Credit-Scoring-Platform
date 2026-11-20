import { test, expect } from '@playwright/test';

test.describe('Borrower Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate as Alice Kumar
    await page.goto('/login');
    await page.click('button:has-text("Sign in as Borrower")');
    await page.waitForURL('/borrower');
  });

  test('should render credit gauge and transaction history', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Borrower Dashboard');
    
    // Check score gauge exists
    const gauge = page.locator('svg');
    await expect(gauge).toBeVisible();

    // Check transaction ledger table is visible
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('should initiate transaction and display 6-digit OTP modal', async ({ page }) => {
    await page.click('button:has-text("Record Cash Transaction")');
    
    // Fill in amount
    await page.fill('input[placeholder="e.g. 5000"]', '2500');
    await page.click('button:has-text("Generate OTP & Submit")');

    // Verification modal check
    await expect(page.locator('text=Verification Code')).toBeVisible();
  });
});
