import { test, expect } from '@playwright/test';

test.describe('Contextual Transitions', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming user is logged in
    await page.goto('/');
  });

  test('should show hover preview on sidebar navigation', async ({ page }) => {
    // Hover over integrations link
    const integrationsLink = page.locator('[href="/integrations"]');
    await integrationsLink.hover();

    // Check if preview appears
    const preview = page.locator('[class*="bg-purple-900"]').first();
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('Интеграции');
  });

  test('should have smooth page transitions', async ({ page }) => {
    // Navigate to integrations
    await page.click('[href="/integrations"]');

    // Check if page loads with transition
    await expect(page.locator('h2')).toContainText('Интеграции');

    // Check if shared element transition works (icon should be present)
    const icon = page.locator('span').filter({ hasText: '🔗' });
    await expect(icon).toBeVisible();
  });

  test('should handle different transition directions', async ({ page }) => {
    // Test chat to call transition (if applicable)
    // This would require specific page navigation patterns
    await page.click('[href="/friends"]');
    await expect(page.locator('h1, h2')).toBeVisible();

    await page.click('[href="/calls"]');
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Test mobile navigation
    const menuButton = page.locator('button').filter({ hasText: /menu|навигация/i }).first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }

    // Check if transitions still work on mobile
    const integrationsLink = page.locator('[href="/integrations"]');
    await integrationsLink.click();

    await expect(page.locator('h2')).toContainText('Интеграции');
  });
});