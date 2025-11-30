import { test, expect } from '@playwright/test';

test.describe('Plugin Marketplace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plugins');
    await page.waitForLoadState('networkidle');
  });

  test('should load marketplace page', async ({ page }) => {
    await expect(page).toHaveTitle(/FOCUS/);
    await expect(page.locator('text=Marketplace плагинов')).toBeVisible();
  });

  test('should display marketplace stats', async ({ page }) => {
    await expect(page.locator('text=Всего плагинов')).toBeVisible();
    await expect(page.locator('text=Загрузок')).toBeVisible();
    await expect(page.locator('text=Выручка')).toBeVisible();
    await expect(page.locator('text=Активных установок')).toBeVisible();
  });

  test('should display plugins grid', async ({ page }) => {
    await expect(page.locator('text=Slack Integration')).toBeVisible();
    await expect(page.locator('text=AI Assistant Pro')).toBeVisible();
  });

  test('should filter plugins by category', async ({ page }) => {
    // Click on category filter
    await page.locator('select').first().selectOption('productivity');
    await expect(page.locator('text=AI Assistant Pro')).toBeVisible();
    await expect(page.locator('text=Slack Integration')).not.toBeVisible();
  });

  test('should search plugins', async ({ page }) => {
    await page.fill('input[placeholder="Поиск плагинов..."]', 'AI');
    await expect(page.locator('text=AI Assistant Pro')).toBeVisible();
    await expect(page.locator('text=Slack Integration')).not.toBeVisible();
  });

  test('should install plugin', async ({ page }) => {
    const installButton = page.locator('text=Установить').first();
    await installButton.click();
    // Check if plugin appears in installed tab
    await page.locator('text=Установленные').click();
    await expect(page.locator('text=Slack Integration')).toBeVisible();
  });

  test('should show plugin details modal', async ({ page }) => {
    await page.locator('text=Подробнее').first().click();
    await expect(page.locator('text=Описание')).toBeVisible();
    await expect(page.locator('text=Возможности')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    await page.locator('text=Установленные').click();
    await expect(page.locator('text=Управление установленными плагинами')).toBeVisible();

    await page.locator('text=Купленные').click();
    await expect(page.locator('text=История покупок')).toBeVisible();

    await page.locator('text=Разработчик').click();
    await expect(page.locator('text=Инструменты разработчика')).toBeVisible();
  });
});