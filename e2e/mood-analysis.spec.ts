import { test, expect } from '@playwright/test';

test.describe('Mood Analysis', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming user is logged in and navigated to chat
    await page.goto('/chats/1');
  });

  test('should display chat with mood-based styling', async ({ page }) => {
    // Check if chat loads
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();

    // Check if mood analysis is applied (background should change based on mood)
    const chatContainer = page.locator('[data-testid="chat-container"]');
    const backgroundStyle = await chatContainer.evaluate(el => getComputedStyle(el).background);

    // Background should be a gradient (mood-based)
    expect(backgroundStyle).toContain('linear-gradient');
  });

  test('should analyze positive messages and apply joyful theme', async ({ page }) => {
    // Type positive messages
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('I am so happy today!');
    await messageInput.press('Enter');

    await messageInput.fill('This is absolutely wonderful!');
    await messageInput.press('Enter');

    // Wait for mood analysis
    await page.waitForTimeout(2000);

    // Check if joyful colors are applied
    const chatContainer = page.locator('[data-testid="chat-container"]');
    const background = await chatContainer.evaluate(el => getComputedStyle(el).background);

    // Should contain joyful colors (red/pink tones)
    expect(background).toMatch(/#[Ff][Ff]\w{4}/); // Should contain FF (red) colors
  });

  test('should analyze negative messages and apply serious theme', async ({ page }) => {
    // Type negative messages
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('This is really bad');
    await messageInput.press('Enter');

    await messageInput.fill('I am very disappointed');
    await messageInput.press('Enter');

    // Wait for mood analysis
    await page.waitForTimeout(2000);

    // Check if serious colors are applied
    const chatContainer = page.locator('[data-testid="chat-container"]');
    const background = await chatContainer.evaluate(el => getComputedStyle(el).background);

    // Should contain serious colors (dark/blue tones)
    expect(background).toMatch(/#[23][Cc]\w{4}/); // Should contain 2C or 3E (dark blue/gray)
  });

  test('should handle mood transitions smoothly', async ({ page }) => {
    // Start with positive messages
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('Great day!');
    await messageInput.press('Enter');

    await page.waitForTimeout(1000);

    // Then negative messages
    await messageInput.fill('Actually, this is terrible');
    await messageInput.press('Enter');

    await page.waitForTimeout(2000);

    // Theme should transition to serious
    const chatContainer = page.locator('[data-testid="chat-container"]');
    const background = await chatContainer.evaluate(el => getComputedStyle(el).background);

    expect(background).toMatch(/#[23][Cc]\w{4}/);
  });

  test('should apply time-based mood overlay', async ({ page }) => {
    // Check if time-based mood is applied
    const body = page.locator('body');
    const timeMood = await body.evaluate(el => el.getAttribute('data-time-mood'));

    // Should have a time-based mood attribute
    expect(['dawn', 'day', 'dusk', 'night']).toContain(timeMood);
  });
});