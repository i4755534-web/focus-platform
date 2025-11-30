import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login and save state
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3000');

  // Save signed-in state to 'storageState.json'.
  await page.context().storageState({ path: 'e2e/storageState.json' });
  await browser.close();
}

export default globalSetup;