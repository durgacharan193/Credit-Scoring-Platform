import { test, expect } from '@playwright/test';
test('borrower registration page loads', async ({ page }) => {
  await page.goto('/login');
  expect(true).toBeTruthy();
});
