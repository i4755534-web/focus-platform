import { test, expect } from '@playwright/test';

test.describe('WebRTC Video Calls', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming user is logged in
    await page.goto('/calls');
  });

  test('should start video call', async ({ page }) => {
    const startCallButton = page.locator('[data-testid="start-video-call"]');
    await startCallButton.click();

    // Wait for call interface to appear
    await expect(page.locator('[data-testid="video-call-interface"]')).toBeVisible();
  });

  test('should display local video', async ({ page }) => {
    await page.locator('[data-testid="start-video-call"]').click();

    const localVideo = page.locator('[data-testid="local-video"]');
    await expect(localVideo).toBeVisible();
  });

  test('should toggle mute', async ({ page }) => {
    await page.locator('[data-testid="start-video-call"]').click();

    const muteButton = page.locator('[data-testid="mute-button"]');
    const initialState = await muteButton.getAttribute('data-muted');

    await muteButton.click();

    const newState = await muteButton.getAttribute('data-muted');
    expect(newState).not.toBe(initialState);
  });

  test('should toggle video', async ({ page }) => {
    await page.locator('[data-testid="start-video-call"]').click();

    const videoButton = page.locator('[data-testid="video-button"]');
    const initialState = await videoButton.getAttribute('data-video-off');

    await videoButton.click();

    const newState = await videoButton.getAttribute('data-video-off');
    expect(newState).not.toBe(initialState);
  });

  test('should start screen sharing', async ({ page }) => {
    await page.locator('[data-testid="start-video-call"]').click();

    const screenShareButton = page.locator('[data-testid="screen-share-button"]');
    await screenShareButton.click();

    // Note: Actual screen sharing requires user permission and may not work in headless mode
    // This test checks if the button state changes
    await expect(screenShareButton).toHaveAttribute('data-sharing', 'true');
  });

  test('should end call', async ({ page }) => {
    await page.locator('[data-testid="start-video-call"]').click();

    const endCallButton = page.locator('[data-testid="end-call-button"]');
    await endCallButton.click();

    // Should return to calls list
    await expect(page.locator('[data-testid="video-call-interface"]')).not.toBeVisible();
  });

  test('should handle call connection states', async ({ page }) => {
    await page.locator('[data-testid="start-video-call"]').click();

    // Check for connecting state
    const connectingIndicator = page.locator('[data-testid="connecting-indicator"]');
    await expect(connectingIndicator).toBeVisible();

    // Wait for connection or timeout
    await expect(page.locator('[data-testid="connected-indicator"]')).toBeVisible({ timeout: 10000 });
  });
});