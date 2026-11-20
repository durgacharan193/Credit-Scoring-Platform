import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should display login page and switch role tabs', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Sign In');

    // Switch between role tabs
    const borrowerTab = page.locator('button:has-text("Borrower")');
    const lenderTab = page.locator('button:has-text("Merchant")');
    const officerTab = page.locator('button:has-text("Bank Officer")');

    await expect(borrowerTab).toBeVisible();
    await lenderTab.click();
    await expect(page.locator('input[type="email"]')).toHaveValue('lender1@test.com');

    await officerTab.click();
    await expect(page.locator('input[type="email"]')).toHaveValue('officer1@test.com');
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Register here');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('h1')).toContainText('Create an Account');
  });
});
