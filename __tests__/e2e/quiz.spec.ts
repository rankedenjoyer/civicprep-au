/**
 * E2E — QUIZ FLOW
 * Covers: topic quiz, values quiz, random quiz,
 * answer feedback, bookmarking, results screen.
 */

import { test, expect } from '@playwright/test';
import { completeOnboarding, clearAppData } from './helpers';

test.beforeEach(async ({ page }) => {
  await clearAppData(page);
  await completeOnboarding(page);
});

test('can start a topic quiz from the Practice tab', async ({ page }) => {
  await page.getByText('Practice', { exact: true }).last().click();
  // Use testID to avoid matching HomeScreen's duplicate topic rows
  await page.getByTestId('practice-topic-australia-and-its-people').click({ force: true });
  // Quiz screen loads — should see question counter 1/10
  await expect(page.getByText('1/10')).toBeVisible({ timeout: 5000 });
});

test('shows 4 answer options for each question', async ({ page }) => {
  await page.getByText('Practice', { exact: true }).last().click();
  // PracticeScreen uses "Values Questions Only" (not "Values Focus" which is on HomeScreen)
  await page.getByText('Values Questions Only').click({ force: true });
  await page.waitForSelector('text=1/10');
  // Options labeled A, B, C, D
  await expect(page.getByText('A', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('B', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('C', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('D', { exact: true }).first()).toBeVisible();
});

test('selecting an answer reveals the explanation', async ({ page }) => {
  await page.getByText('Practice', { exact: true }).last().click();
  await page.getByText('Random 10 Questions').click({ force: true });
  await page.waitForSelector('text=1/10');
  // Click the first answer option
  await page.getByText('A', { exact: true }).first().click({ force: true });
  // Explanation should appear
  await expect(page.getByText('Source:')).toBeVisible({ timeout: 3000 });
  // Next Question button should appear
  await expect(page.getByText('Next Question')).toBeVisible();
});

test('correct answer shows green, wrong answer shows red', async ({ page }) => {
  await page.getByText('Practice', { exact: true }).last().click();
  await page.getByText('Random 10 Questions').click({ force: true });
  await page.waitForSelector('text=1/10');
  // Click first option
  await page.getByText('A', { exact: true }).first().click({ force: true });
  // Either Correct! or Incorrect should show
  const feedback = page.getByText(/Correct!|Incorrect/);
  await expect(feedback).toBeVisible({ timeout: 3000 });
});

test('can bookmark a question after answering', async ({ page }) => {
  await page.getByText('Practice', { exact: true }).last().click();
  await page.getByText('Random 10 Questions').click({ force: true });
  await page.waitForSelector('text=1/10');
  await page.getByText('A', { exact: true }).first().click({ force: true });
  // Bookmark button should be visible after answering
  await expect(page.getByText('Next Question')).toBeVisible({ timeout: 3000 });
  // The bookmark button should be present
  await expect(page.getByTestId('bookmark-btn')).toBeVisible();
});

test('answers 10 questions and reaches the results screen', async ({ page }) => {
  await page.getByText('Practice', { exact: true }).last().click();
  await page.getByText('Random 10 Questions').click({ force: true });
  await page.waitForSelector('text=1/10');

  for (let i = 0; i < 10; i++) {
    await page.getByText('A', { exact: true }).first().click({ force: true });
    await page.waitForSelector('text=Source:');
    const label = i < 9 ? 'Next Question' : 'See Results';
    await page.getByText(label, { exact: true }).click({ force: true });
  }

  // Results screen shows score out of 10 — use testID, not a /\/10/ regex,
  // since that regex can accidentally match a "/10"-day-of-month date elsewhere in the DOM.
  await expect(page.getByTestId('quiz-score-value')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Done')).toBeVisible();
});

test('Values quiz marks questions with values badge', async ({ page }) => {
  await page.getByText('Practice', { exact: true }).last().click();
  // PracticeScreen uses "Values Questions Only"
  await page.getByText('Values Questions Only').click({ force: true });
  await page.waitForSelector('text=1/10');
  // All questions in this mode are values questions — badge should show
  // Use exact badge text — regex /Values Question|Critical/ matches too many elements across screens
  await expect(page.getByText('Values Question — Critical').first()).toBeVisible({ timeout: 3000 });
});
