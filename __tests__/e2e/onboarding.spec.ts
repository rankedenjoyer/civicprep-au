/**
 * E2E — ONBOARDING FLOW
 * Covers: first launch shows onboarding, all steps navigable,
 * completing onboarding lands on Home tab.
 */

import { test, expect } from '@playwright/test';
import { clearAppData } from './helpers';

test.beforeEach(async ({ page }) => {
  await clearAppData(page);
});

test('shows the Welcome screen with disclaimer on first launch', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('CivicPrep AU')).toBeVisible();
  await expect(page.getByText('Get Started')).toBeVisible();
  // Disclaimer must be visible
  await expect(page.getByText('not affiliated')).toBeVisible();
});

test('navigates through all 5 onboarding steps', async ({ page }) => {
  await page.goto('/');

  // Step 1: Welcome
  await page.getByText('Get Started').click();

  // Step 2: Test date
  await expect(page.getByText('When is your test?')).toBeVisible();
  await page.getByText('In less than 2 weeks').click();
  await page.getByText('Next').last().click();

  // Step 3: English level
  await expect(page.getByText('Your English level')).toBeVisible();
  await page.getByText('Intermediate').click();
  await page.getByText('Next').last().click();

  // Step 4: Daily time
  await expect(page.getByText('Daily study time')).toBeVisible();
  await page.getByText('15 minutes').click();
  await page.getByText('Next').last().click();

  // Step 5: Study mode
  await expect(page.getByText('How do you like to study?')).toBeVisible();
  await page.getByText('Mixed').click();
  await page.getByText('Next').last().click();

  // Step 6: Study plan
  await expect(page.getByText('Your study plan')).toBeVisible();
  await page.getByText('14-Day Balanced').click();
  await page.getByText('Start Studying').click();

  // Should land on Home
  await expect(page.getByText('Quick Practice')).toBeVisible({ timeout: 5000 });
});

test('Back button returns to previous onboarding step', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Get Started').click();
  // On test date step
  await page.getByText('In less than 2 weeks').click();
  await page.getByText('Next').last().click();
  // On english step — go back
  await page.getByText('Back').click();
  await expect(page.getByText('When is your test?')).toBeVisible();
});

test('each study plan option is selectable', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Get Started').click();
  await page.getByText('Not sure yet').click();
  await page.getByText('Next').last().click();
  await page.getByText('Beginner').click();
  await page.getByText('Next').last().click();
  await page.getByText('10 minutes', { exact: true }).click();
  await page.getByText('Next').last().click();
  await page.getByText('Quiz').click();
  await page.getByText('Next').last().click();

  // All three plans visible
  await expect(page.getByText('7-Day Cram')).toBeVisible();
  await expect(page.getByText('14-Day Balanced')).toBeVisible();
  await expect(page.getByText('30-Day Mastery')).toBeVisible();
});

test('after completing onboarding, refreshing the page goes straight to Home', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Get Started').click();
  await page.getByText('In less than 2 weeks').click();
  await page.getByText('Next').last().click();
  await page.getByText('Intermediate').click();
  await page.getByText('Next').last().click();
  await page.getByText('15 minutes').click();
  await page.getByText('Next').last().click();
  await page.getByText('Mixed').click();
  await page.getByText('Next').last().click();
  await page.getByText('14-Day Balanced').click();
  await page.getByText('Start Studying').click();
  await page.waitForSelector('text=Quick Practice');

  // Reload — should skip onboarding
  await page.reload();
  await expect(page.getByText('Quick Practice')).toBeVisible({ timeout: 5000 });
});
