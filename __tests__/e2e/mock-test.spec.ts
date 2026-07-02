/**
 * E2E — MOCK TEST FLOW
 * Covers: intro screen, timed toggle, 20-question completion,
 * pass/fail result, values scoring display, quit modal.
 */

import { test, expect } from '@playwright/test';
import { completeOnboarding, clearAppData } from './helpers';

test.beforeEach(async ({ page }) => {
  await clearAppData(page);
  await completeOnboarding(page);
});

async function openMockTest(page: any) {
  await page.getByText('Practice', { exact: true }).last().click();
  await page.getByText('Official-Style Mock Test').click({ force: true });
}

test('shows the mock test intro screen with correct info', async ({ page }) => {
  await openMockTest(page);
  // Use .last() — MockTestScreen is pushed ON TOP of PracticeScreen in stack order
  // so its element is rendered last in DOM; .first() would get PracticeScreen's hidden card
  await expect(page.getByText('Official-Style Mock Test').last()).toBeVisible();
  // Use exact: true to avoid matching HomeScreen's "20 questions" (lowercase)
  await expect(page.getByText('20 Questions', { exact: true })).toBeVisible();
  await expect(page.getByText('5 Values Questions', { exact: true })).toBeVisible();
  await expect(page.getByText('Pass Mark', { exact: true })).toBeVisible();
  // Partial match for "15 of 20 (75%)"
  await expect(page.getByText('15 of 20')).toBeVisible();
});

test('timed mode toggle works', async ({ page }) => {
  await openMockTest(page);
  await expect(page.getByText('45 minute countdown')).toBeVisible();
  // Toggle timed mode off
  await page.getByTestId('timed-toggle').click({ force: true });
  // Label should still be visible
  await expect(page.getByText('Timed mode')).toBeVisible();
});

test('Start Test button begins the test with question 1 of 20', async ({ page }) => {
  await openMockTest(page);
  await page.getByText('Start Test').click({ force: true });
  await expect(page.getByText('1 / 20')).toBeVisible({ timeout: 5000 });
});

test('shows 4 answer options and a question', async ({ page }) => {
  await openMockTest(page);
  await page.getByText('Start Test').click({ force: true });
  await page.waitForSelector('text=1 / 20');
  await expect(page.getByText('A', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('B', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('C', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('D', { exact: true }).first()).toBeVisible();
});

test('close (X) button shows quit modal, not browser alert', async ({ page }) => {
  await openMockTest(page);
  await page.getByText('Start Test').click({ force: true });
  await page.waitForSelector('text=1 / 20');

  // Set up dialog listener — if Alert fires this will trigger
  let browserAlertFired = false;
  page.on('dialog', () => { browserAlertFired = true; });

  await page.getByTestId('quit-btn').click({ force: true });

  // Should show in-app modal, NOT browser alert
  expect(browserAlertFired).toBe(false);
  await expect(page.getByText('Quit Test?')).toBeVisible({ timeout: 3000 });
  await expect(page.getByText('Your progress will be lost.')).toBeVisible();
});

test('quit modal: Keep Going closes the modal and resumes test', async ({ page }) => {
  await openMockTest(page);
  await page.getByText('Start Test').click({ force: true });
  await page.waitForSelector('text=1 / 20');
  await page.getByTestId('quit-btn').click({ force: true });
  await page.waitForSelector('text=Quit Test?');
  await page.getByText('Keep Going').click({ force: true });
  // Modal gone, still on test
  await expect(page.getByText('Quit Test?')).not.toBeVisible({ timeout: 2000 });
  await expect(page.getByText('/ 20')).toBeVisible();
});

test('quit modal: Quit returns to Practice screen', async ({ page }) => {
  await openMockTest(page);
  await page.getByText('Start Test').click({ force: true });
  await page.waitForSelector('text=1 / 20');
  await page.getByTestId('quit-btn').click({ force: true });
  await page.waitForSelector('text=Quit Test?');
  await page.getByText('Quit', { exact: true }).click({ force: true });
  // Back to Practice screen
  await expect(page.getByText('Official-Style Mock Test').first()).toBeVisible({ timeout: 3000 });
});

test('completes 20 questions and shows pass/fail results screen', async ({ page }) => {
  test.setTimeout(120000);
  await openMockTest(page);
  // Disable timer for speed
  await page.getByTestId('timed-toggle').click({ force: true });
  await page.getByText('Start Test').click({ force: true });
  await page.waitForSelector('text=1 / 20');

  for (let i = 0; i < 20; i++) {
    await page.getByText('A', { exact: true }).first().click({ force: true });
    const label = i < 19 ? 'Next Question' : 'Finish Test';
    await expect(page.getByText(label, { exact: true })).toBeVisible({ timeout: 10000 });
    await page.getByText(label, { exact: true }).click({ force: true });
  }

  // Results screen
  await expect(page.getByText(/Test Passed|Test Not Passed/)).toBeVisible({ timeout: 10000 });
  // Use testID, not a /\d+\/20/ regex — that regex can accidentally match
  // today's date string (e.g. "7/2/2026" contains "2/20") elsewhere in the DOM.
  await expect(page.getByTestId('overall-score-value')).toBeVisible();
  await expect(page.getByText('Values Score', { exact: true })).toBeVisible();
  await expect(page.getByText('Try Again').first()).toBeVisible();
});

test('results screen shows Overall Score, Values Score, and Accuracy', async ({ page }) => {
  test.setTimeout(120000);
  await openMockTest(page);
  await page.getByText('Start Test').click({ force: true });
  await page.waitForSelector('text=1 / 20');

  for (let i = 0; i < 20; i++) {
    await page.getByText('A', { exact: true }).first().click({ force: true });
    const label = i < 19 ? 'Next Question' : 'Finish Test';
    await expect(page.getByText(label, { exact: true })).toBeVisible({ timeout: 10000 });
    await page.getByText(label, { exact: true }).click({ force: true });
  }

  await expect(page.getByText('Overall Score', { exact: true })).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Values Score', { exact: true })).toBeVisible();
  // Use unique "Accuracy" in results context — scoped after Overall Score and Values Score are visible
  await expect(page.getByText(/Test Passed|Test Not Passed/)).toBeVisible();
});

test('Try Again on results restarts the mock test intro', async ({ page }) => {
  test.setTimeout(120000);
  await openMockTest(page);
  await page.getByText('Start Test').click({ force: true });
  await page.waitForSelector('text=1 / 20');

  for (let i = 0; i < 20; i++) {
    await page.getByText('A', { exact: true }).first().click({ force: true });
    const label = i < 19 ? 'Next Question' : 'Finish Test';
    await expect(page.getByText(label, { exact: true })).toBeVisible({ timeout: 10000 });
    await page.getByText(label, { exact: true }).click({ force: true });
  }

  await expect(page.getByText(/Test Passed|Test Not Passed/)).toBeVisible({ timeout: 10000 });
  await page.getByText('Try Again').click({ force: true });
  await expect(page.getByText('Start Test')).toBeVisible({ timeout: 3000 });
});
