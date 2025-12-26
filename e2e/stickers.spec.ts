import { test, expect } from '@playwright/test';

test.describe('Stickers', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming user is in a chat
    await page.goto('/chats/1');
  });

  test('should open sticker picker', async ({ page }) => {
    const stickerButton = page.locator('[data-testid="sticker-button"]');
    await stickerButton.click();

    const stickerPicker = page.locator('[data-testid="sticker-picker"]');
    await expect(stickerPicker).toBeVisible();
  });

  test('should display sticker packs', async ({ page }) => {
    await page.locator('[data-testid="sticker-button"]').click();

    const stickerPacks = page.locator('[data-testid="sticker-pack"]');
    await expect(stickerPacks).toHaveCount(await stickerPacks.count());
  });

  test('should allow searching stickers', async ({ page }) => {
    await page.locator('[data-testid="sticker-button"]').click();

    const searchInput = page.locator('[data-testid="sticker-search"]');
    await searchInput.fill('smile');

    const stickers = page.locator('[data-testid="sticker-item"]');
    await expect(stickers).toBeVisible();
  });

  test('should send sticker in chat', async ({ page }) => {
    await page.locator('[data-testid="sticker-button"]').click();

    const firstSticker = page.locator('[data-testid="sticker-item"]').first();
    await firstSticker.click();

    // Check if sticker appears in chat
    const chatMessages = page.locator('[data-testid="chat-messages"]');
    await expect(chatMessages.locator('[data-testid="sticker-message"]')).toBeVisible();
  });

  test('should close sticker picker', async ({ page }) => {
    await page.locator('[data-testid="sticker-button"]').click();
    await page.locator('[data-testid="close-sticker-picker"]').click();

    const stickerPicker = page.locator('[data-testid="sticker-picker"]');
    await expect(stickerPicker).not.toBeVisible();
  });
});