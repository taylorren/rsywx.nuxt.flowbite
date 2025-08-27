import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3001');

  // Intentionally wrong assertion to see what happens
  await expect(page).toHaveTitle(/任氏有无轩/);
});

test('check links', async ({ page }) => {
  await page.goto('http://localhost:3001/');

  await expect(page.getByRole('link', { name: '维客' })).toBeVisible();
  await expect(page.getByRole('link', { name: '博客' })).toBeVisible();


});
