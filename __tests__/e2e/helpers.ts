/**
 * Shared E2E helpers — used across all Playwright test files.
 */

import { Page } from '@playwright/test';

/** Complete onboarding with default settings and land on the Home tab. */
export async function completeOnboarding(page: Page) {
  await page.goto('/');
  // Welcome screen — click Get Started
  await page.getByText('Get Started').click();
  // Test date — pick first option
  await page.getByText('In less than 2 weeks').click();
  await page.getByText('Next').last().click();
  // English level — keep default (Intermediate)
  await page.getByText('Intermediate').click();
  await page.getByText('Next').last().click();
  // Daily time — keep default (15 minutes)
  await page.getByText('15 minutes').click();
  await page.getByText('Next').last().click();
  // Study mode — mixed
  await page.getByText('Mixed').click();
  await page.getByText('Next').last().click();
  // Study plan — 14-day
  await page.getByText('14-Day Balanced').click();
  await page.getByText('Start Studying').click();
  // Should now be on Home
  await page.waitForSelector('text=Quick Practice', { timeout: 5000 });
}

/** Clear all AsyncStorage data so tests start fresh. */
export async function clearAppData(page: Page) {
  // Must navigate first — localStorage is inaccessible on about:blank
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload();
  // Wait for the app to settle (onboarding or home)
  await page.waitForLoadState('networkidle');
}
