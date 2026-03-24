import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should show the home page with title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('OASIS');
  });

  test('should show the create world link', async ({ page }) => {
    await page.goto('/');
    const createLink = page.getByText('> 创造新世界');
    await expect(createLink).toBeVisible();
  });

  test('should navigate to world creation page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('> 创造新世界').click();
    await expect(page).toHaveURL('/world/create');
    await expect(page.locator('h1')).toContainText('世界锻造台');
  });

  test('world creation page should have input field', async ({ page }) => {
    await page.goto('/world/create');
    const input = page.getByPlaceholder('赛博朋克东京，武士与黑客并存');
    await expect(input).toBeVisible();
  });

  test('should show empty state on home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('还没有世界。创造你的第一个世界吧。')).toBeVisible();
  });
});
