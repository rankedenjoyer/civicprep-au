/**
 * E2E — STUDY + FLASHCARDS FLOW
 * Covers: Study tab, topic cards, lesson expand/collapse,
 * flashcard screen, flip, hard card marking.
 */

import { test, expect } from '@playwright/test';
import { completeOnboarding, clearAppData } from './helpers';

test.beforeEach(async ({ page }) => {
  await clearAppData(page);
  await completeOnboarding(page);
});

// ── Study tab ─────────────────────────────────────────────────────

test('Study tab shows all 4 topic cards', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await expect(page.getByText('Australia and Its People')).toBeVisible();
  await expect(page.getByText('Democratic Beliefs, Rights and Liberties')).toBeVisible();
  await expect(page.getByText('Government and the Law in Australia')).toBeVisible();
  await expect(page.getByText('Australian Values')).toBeVisible();
});

test('tapping a topic opens the topic detail page', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await page.getByText('Australia and Its People').first().click({ force: true });
  // Key Points is unique to expanded lesson content on TopicDetailScreen
  await expect(page.getByText('Key Points')).toBeVisible({ timeout: 5000 });
});

test('lesson expands to show key points when tapped', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await page.getByText('Australia and Its People').first().click({ force: true });
  // First lesson is already expanded by default — collapse it, then expand again
  await page.getByText('The Land of Australia').click({ force: true }); // collapse
  await page.getByText('The Land of Australia').click({ force: true }); // expand
  await expect(page.getByText('Key Points')).toBeVisible({ timeout: 3000 });
});

test('tapping lesson twice collapses it', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await page.getByText('Australia and Its People').first().click({ force: true });
  // First lesson is already expanded — Key Points visible
  await expect(page.getByText('Key Points')).toBeVisible({ timeout: 5000 });
  // Tap to collapse
  await page.getByText('The Land of Australia').click({ force: true });
  // Key Points should no longer be visible
  await expect(page.getByText('Key Points')).not.toBeVisible({ timeout: 2000 });
});

test('Quiz button from topic detail navigates to quiz', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await page.getByText('Australia and Its People').first().click({ force: true });
  await page.getByText('Quiz', { exact: true }).first().click({ force: true });
  await expect(page.getByText('1/10')).toBeVisible({ timeout: 5000 });
});

// ── Flashcards ────────────────────────────────────────────────────

test('Flashcards button from topic detail opens flashcard screen', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await page.getByText('Australian Values').first().click({ force: true });
  await page.getByTestId('topic-flashcards-btn').click({ force: true });
  await expect(page.getByText('QUESTION', { exact: true })).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Tap card to reveal answer')).toBeVisible();
});

test('tapping the flashcard flips it to show the answer', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await page.getByText('Australian Values').first().click({ force: true });
  await page.getByTestId('topic-flashcards-btn').click({ force: true });
  await page.waitForSelector('text=QUESTION');
  // Tap the card
  await page.getByText('QUESTION', { exact: true }).click({ force: true });
  await expect(page.getByText('ANSWER', { exact: true })).toBeVisible({ timeout: 3000 });
});

test('next arrow advances to the second card', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await page.getByText('Australian Values').first().click({ force: true });
  await page.getByTestId('topic-flashcards-btn').click({ force: true });
  await page.waitForSelector('text=1 /');
  // Click next button
  await page.getByTestId('flashcard-next').click({ force: true });
  await expect(page.getByText('2 /')).toBeVisible({ timeout: 3000 });
});

test('Mark as hard button toggles state', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await page.getByText('Australian Values').first().click({ force: true });
  await page.getByTestId('topic-flashcards-btn').click({ force: true });
  await page.waitForSelector('text=Mark as hard');
  // Click mark as hard
  await page.getByText('Mark as hard').click({ force: true });
  await expect(page.getByText('Marked hard')).toBeVisible({ timeout: 2000 });
  // Click again to unmark
  await page.getByText('Marked hard').click({ force: true });
  await expect(page.getByText('Mark as hard')).toBeVisible({ timeout: 2000 });
});

test('completing all flashcards shows a done screen', async ({ page }) => {
  await page.getByText('Study', { exact: true }).last().click();
  await page.getByText('Australian Values').first().click({ force: true });
  await page.getByTestId('topic-flashcards-btn').click({ force: true });
  await page.waitForSelector('text=1 /');

  // Get total cards shown in counter (e.g. "1 / 9")
  const counterText = await page.getByText(/\d+ \/ \d+/).first().textContent();
  const total = parseInt(counterText?.split('/')[1]?.trim() || '9');

  // Click through all cards
  for (let i = 0; i < total; i++) {
    await page.getByTestId('flashcard-next').click({ force: true });
    await page.waitForTimeout(200);
  }

  await expect(page.getByText('All done!')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Review Again')).toBeVisible();
});
