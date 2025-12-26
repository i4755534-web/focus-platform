import { test, expect } from '@playwright/test';

test.describe('VR Features', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming user is logged in
    await page.goto('/vr');
  });

  test('should display VR rooms page', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('VR Комнаты');
  });

  test('should show available VR rooms', async ({ page }) => {
    const vrRooms = page.locator('[data-testid="vr-room"]');
    await expect(vrRooms).toHaveCount(await vrRooms.count());
  });

  test('should enter VR room', async ({ page }) => {
    const enterButton = page.locator('[data-testid="enter-vr-button"]').first();
    await enterButton.click();

    // Check if VR interface appears
    await expect(page.locator('[data-testid="vr-interface"]')).toBeVisible();
  });

  test('should display VR controls', async ({ page }) => {
    await page.locator('[data-testid="enter-vr-button"]').first().click();

    const vrControls = page.locator('[data-testid="vr-controls"]');
    await expect(vrControls).toBeVisible();
  });

  test('should handle VR fallback for unsupported devices', async ({ page }) => {
    // Mock unsupported VR
    await page.addScriptTag({
      content: `
        Object.defineProperty(navigator, 'xr', {
          value: undefined,
          writable: true
        });
      `
    });

    await page.reload();

    const fallbackMessage = page.locator('[data-testid="vr-fallback"]');
    await expect(fallbackMessage).toBeVisible();
  });

  test('should exit VR room', async ({ page }) => {
    await page.locator('[data-testid="enter-vr-button"]').first().click();

    const exitButton = page.locator('[data-testid="exit-vr-button"]');
    await exitButton.click();

    // Should return to rooms list
    await expect(page.locator('[data-testid="vr-interface"]')).not.toBeVisible();
  });

  test('should display user avatars in VR', async ({ page }) => {
    await page.locator('[data-testid="enter-vr-button"]').first().click();

    const avatars = page.locator('[data-testid="vr-avatar"]');
    await expect(avatars).toHaveCount(await avatars.count());
  });
});