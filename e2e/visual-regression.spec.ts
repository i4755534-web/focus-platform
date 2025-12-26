import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage visual regression', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('dashboard visual regression', async ({ page }) => {
    // Assuming user is logged in
    await page.goto('/chats');
    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('integrations page visual regression', async ({ page }) => {
    await page.goto('/integrations');
    await expect(page).toHaveScreenshot('integrations-page.png');
  });

  test('settings page visual regression', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveScreenshot('settings-page.png');
  });

  test('mobile layout visual regression', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });

  test('tablet layout visual regression', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-tablet.png');
  });

  test('dark mode visual regression', async ({ page }) => {
    await page.goto('/');
    // Assuming there's a dark mode toggle
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      await expect(page).toHaveScreenshot('homepage-dark-mode.png');
    }
  });

  test('error state visual regression', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page).toHaveScreenshot('404-error.png');
  });

  test('loading state visual regression', async ({ page }) => {
    await page.goto('/chats');
    // Capture loading state if visible
    const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    if (await loadingIndicator.isVisible()) {
      await expect(page).toHaveScreenshot('loading-state.png');
    }
  });

  test('form validation visual regression', async ({ page }) => {
    await page.goto('/auth/register');
    // Fill form with invalid data
    await page.fill('[name="email"]', 'invalid-email');
    await page.fill('[name="password"]', '123');
    // Trigger validation
    await page.click('button[type="submit"]');
    await expect(page).toHaveScreenshot('form-validation-errors.png');
  });
});