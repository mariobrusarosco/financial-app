// e2e/utils/navigation-helpers.ts
import { Page } from '@playwright/test';

/**
 * Navigate using the sidebar navigation
 */
export const navigateTo = async (page: Page, section: string) => {
  // Ensure we're on a page with navigation (not login)
  const currentUrl = page.url();
  if (currentUrl.includes('/login') || currentUrl.includes('/signup')) {
    // If not authenticated, wait for redirect or navigate to dashboard first
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
  }
  
  // Wait for navigation menu to be visible
  await page.waitForSelector('nav, [role="navigation"]', { timeout: 10000 }).catch(() => {
    // If navigation not found, try going to dashboard first
  });
  
  // Try exact match first, then fallback to partial match
  const link = page.getByRole('link', { name: section, exact: true });
  const isVisible = await link.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (!isVisible) {
    // Fallback to partial match
    await page.getByRole('link', { name: new RegExp(section, 'i') }).click();
  } else {
    await link.click();
  }
  
  // Wait for navigation to complete
  await page.waitForURL(new RegExp(`/${section.toLowerCase()}`), { timeout: 10000 });
};

/**
 * Available navigation sections
 */
export const NAVIGATION_SECTIONS = {
  HOME: 'Home',
  ACCOUNTS: 'Accounts',
  TRANSACTIONS: 'Transactions',
  BROKERS: 'Brokers',
  INVESTMENTS: 'Investments',
  VENDORS: 'Vendors',
  SUBSCRIPTIONS: 'Subscriptions',
  SETTINGS: 'Settings',
} as const;

/**
 * Navigate to dashboard/home
 */
export const goToDashboard = async (page: Page) => {
  await navigateTo(page, NAVIGATION_SECTIONS.HOME);
};

/**
 * Navigate to accounts
 */
export const goToAccounts = async (page: Page) => {
  await navigateTo(page, NAVIGATION_SECTIONS.ACCOUNTS);
};

/**
 * Navigate to transactions
 */
export const goToTransactions = async (page: Page) => {
  await navigateTo(page, NAVIGATION_SECTIONS.TRANSACTIONS);
};

/**
 * Navigate to brokers
 */
export const goToBrokers = async (page: Page) => {
  await navigateTo(page, NAVIGATION_SECTIONS.BROKERS);
};

/**
 * Navigate to vendors
 */
export const goToVendors = async (page: Page) => {
  await navigateTo(page, NAVIGATION_SECTIONS.VENDORS);
};

/**
 * Navigate to subscriptions
 */
export const goToSubscriptions = async (page: Page) => {
  await navigateTo(page, NAVIGATION_SECTIONS.SUBSCRIPTIONS);
};

