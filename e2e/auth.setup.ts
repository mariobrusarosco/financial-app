import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('user@example.com').fill('user@example.com');
  await page.getByPlaceholder('Enter your password').fill('password123');

  // Check "Remember me" to ensure data is in localStorage
  await page.getByLabel(/Remember me/i).check();

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/.*dashboard/);
  // Wait for the welcome toast to ensure session is fully settled if needed
  await expect(page.getByText(/Welcome back/i)).toBeVisible();

  // Wait for a bit to ensure localStorage is written
  await page.waitForTimeout(1000);

  await page.context().storageState({ path: authFile });
});
