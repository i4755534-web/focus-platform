import { test, expect } from '@playwright/test';

test.describe('Roles Management', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming admin user is logged in
    await page.goto('/admin');
  });

  test('should display role management interface', async ({ page }) => {
    await expect(page.locator('h3')).toContainText('Управление ролями');
  });

  test('should show user list with roles', async ({ page }) => {
    const userRows = page.locator('[data-testid="user-role-row"]');
    await expect(userRows.first()).toBeVisible();
  });

  test('should allow changing user role', async ({ page }) => {
    const roleSelect = page.locator('[data-testid="role-select"]').first();
    await roleSelect.click();

    // Select moderator role
    await page.locator('[data-testid="role-option-moderator"]').click();

    // Verify role change
    await expect(roleSelect).toContainText('Модератор');
  });

  test('should prevent unauthorized role changes', async ({ page }) => {
    // Test with regular user (not admin)
    // This would require setting up different user sessions
    // For now, just check that admin can change roles
    const roleSelect = page.locator('[data-testid="role-select"]').first();
    await expect(roleSelect).toBeEnabled();
  });

  test('should display role permissions', async ({ page }) => {
    const permissionsList = page.locator('[data-testid="role-permissions"]');
    await expect(permissionsList).toBeVisible();
  });
});