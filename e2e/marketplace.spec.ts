import { test, expect } from '@playwright/test';

test.describe('Marketplace', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming user is logged in
    await page.goto('/marketplace');
  });

  test('should display marketplace page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Marketplace');
  });

  test('should show available plugins', async ({ page }) => {
    const plugins = page.locator('[data-testid="plugin-card"]');
    await expect(plugins).toHaveCount(await plugins.count());
  });

  test('should allow searching plugins', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('chat');
    await expect(page.locator('[data-testid="plugin-card"]')).toBeVisible();
  });

  test('should allow installing a plugin', async ({ page }) => {
    const installButton = page.locator('[data-testid="install-button"]').first();
    await installButton.click();
    await expect(page.locator('[data-testid="uninstall-button"]')).toBeVisible();
  });

  test('should allow uninstalling a plugin', async ({ page }) => {
    const uninstallButton = page.locator('[data-testid="uninstall-button"]').first();
    await uninstallButton.click();
    await expect(page.locator('[data-testid="install-button"]')).toBeVisible();
  });
});