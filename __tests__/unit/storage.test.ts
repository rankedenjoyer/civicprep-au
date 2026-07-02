/**
 * STORAGE UTILITY TESTS
 * Tests that progress is correctly recorded, streaks work,
 * and bookmarks/hard cards toggle properly.
 */

import {
  recordQuestionAttempt,
  toggleBookmark,
  toggleHardFlashcard,
  updateStreak,
} from '../../src/utils/storage';
import { UserProgress } from '../../src/types';

// Mock AsyncStorage so tests don't hit the real device storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const makeProgress = (overrides: Partial<UserProgress> = {}): UserProgress => ({
  topicProgress: {
    'australia-and-its-people': 0,
    'democratic-beliefs-rights-liberties': 0,
    'government-and-law': 0,
    'australian-values': 0,
  },
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  streak: 0,
  lastStudyDate: '',
  studyMinutesToday: 0,
  bookmarkedQuestions: [],
  hardFlashcards: [],
  mockTestResults: [],
  questionStats: {},
  ...overrides,
});

// ── recordQuestionAttempt ─────────────────────────────────────────

describe('recordQuestionAttempt', () => {
  test('increments totalQuestionsAnswered on correct answer', async () => {
    const progress = makeProgress();
    const updated = await recordQuestionAttempt(progress, 'q001', true);
    expect(updated.totalQuestionsAnswered).toBe(1);
  });

  test('increments totalCorrect on correct answer', async () => {
    const progress = makeProgress();
    const updated = await recordQuestionAttempt(progress, 'q001', true);
    expect(updated.totalCorrect).toBe(1);
  });

  test('increments totalQuestionsAnswered but NOT totalCorrect on wrong answer', async () => {
    const progress = makeProgress();
    const updated = await recordQuestionAttempt(progress, 'q001', false);
    expect(updated.totalQuestionsAnswered).toBe(1);
    expect(updated.totalCorrect).toBe(0);
  });

  test('builds questionStats entry on first attempt', async () => {
    const progress = makeProgress();
    const updated = await recordQuestionAttempt(progress, 'q001', true);
    expect(updated.questionStats['q001']).toEqual({ attempts: 1, correct: 1 });
  });

  test('accumulates questionStats across multiple attempts', async () => {
    let progress = makeProgress();
    progress = await recordQuestionAttempt(progress, 'q001', true);
    progress = await recordQuestionAttempt(progress, 'q001', false);
    progress = await recordQuestionAttempt(progress, 'q001', true);
    expect(progress.questionStats['q001']).toEqual({ attempts: 3, correct: 2 });
  });

  test('tracks multiple different questions independently', async () => {
    let progress = makeProgress();
    progress = await recordQuestionAttempt(progress, 'q001', true);
    progress = await recordQuestionAttempt(progress, 'q002', false);
    expect(progress.questionStats['q001'].correct).toBe(1);
    expect(progress.questionStats['q002'].correct).toBe(0);
    expect(progress.totalQuestionsAnswered).toBe(2);
    expect(progress.totalCorrect).toBe(1);
  });
});

// ── toggleBookmark ────────────────────────────────────────────────

describe('toggleBookmark', () => {
  test('adds a question id when not bookmarked', async () => {
    const progress = makeProgress();
    const updated = await toggleBookmark(progress, 'q001');
    expect(updated.bookmarkedQuestions).toContain('q001');
  });

  test('removes a question id when already bookmarked', async () => {
    const progress = makeProgress({ bookmarkedQuestions: ['q001'] });
    const updated = await toggleBookmark(progress, 'q001');
    expect(updated.bookmarkedQuestions).not.toContain('q001');
  });

  test('toggling twice returns to original state', async () => {
    const progress = makeProgress();
    const added = await toggleBookmark(progress, 'q001');
    const removed = await toggleBookmark(added, 'q001');
    expect(removed.bookmarkedQuestions).toHaveLength(0);
  });

  test('does not remove other bookmarks when toggling one', async () => {
    const progress = makeProgress({ bookmarkedQuestions: ['q001', 'q002'] });
    const updated = await toggleBookmark(progress, 'q001');
    expect(updated.bookmarkedQuestions).toContain('q002');
    expect(updated.bookmarkedQuestions).not.toContain('q001');
  });
});

// ── toggleHardFlashcard ───────────────────────────────────────────

describe('toggleHardFlashcard', () => {
  test('marks a flashcard as hard', async () => {
    const progress = makeProgress();
    const updated = await toggleHardFlashcard(progress, 'fc001');
    expect(updated.hardFlashcards).toContain('fc001');
  });

  test('removes a hard flashcard on second toggle', async () => {
    const progress = makeProgress({ hardFlashcards: ['fc001'] });
    const updated = await toggleHardFlashcard(progress, 'fc001');
    expect(updated.hardFlashcards).not.toContain('fc001');
  });

  test('preserves other hard flashcards when toggling one', async () => {
    const progress = makeProgress({ hardFlashcards: ['fc001', 'fc002'] });
    const updated = await toggleHardFlashcard(progress, 'fc001');
    expect(updated.hardFlashcards).toContain('fc002');
  });
});

// ── updateStreak ──────────────────────────────────────────────────

describe('updateStreak', () => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const twoDaysAgo = new Date(Date.now() - 172800000).toDateString();

  test('starts streak at 1 on first study day', async () => {
    const progress = makeProgress({ streak: 0, lastStudyDate: '' });
    const updated = await updateStreak(progress);
    expect(updated.streak).toBe(1);
  });

  test('increments streak when studying on consecutive days', async () => {
    const progress = makeProgress({ streak: 5, lastStudyDate: yesterday });
    const updated = await updateStreak(progress);
    expect(updated.streak).toBe(6);
  });

  test('resets streak to 1 after missing a day', async () => {
    const progress = makeProgress({ streak: 10, lastStudyDate: twoDaysAgo });
    const updated = await updateStreak(progress);
    expect(updated.streak).toBe(1);
  });

  test('does not change streak when studying twice on same day', async () => {
    const progress = makeProgress({ streak: 7, lastStudyDate: today });
    const updated = await updateStreak(progress);
    expect(updated.streak).toBe(7);
  });

  test('updates lastStudyDate to today', async () => {
    const progress = makeProgress({ lastStudyDate: yesterday });
    const updated = await updateStreak(progress);
    expect(updated.lastStudyDate).toBe(today);
  });
});
