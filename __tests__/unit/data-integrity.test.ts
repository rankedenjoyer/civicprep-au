/**
 * DATA INTEGRITY TESTS
 * Verifies every question, lesson and flashcard in the question bank
 * is correctly formed — no wrong answers, no missing fields, etc.
 */

import { QUESTIONS, getValuesQuestions, getMockTestQuestions } from '../../src/data/questions';
import { LESSONS } from '../../src/data/lessons';
import { FLASHCARDS } from '../../src/data/flashcards';
import { TOPICS } from '../../src/data/topics';
import { TopicId } from '../../src/types';

const VALID_TOPIC_IDS: TopicId[] = [
  'australia-and-its-people',
  'democratic-beliefs-rights-liberties',
  'government-and-law',
  'australian-values',
];

// ── Questions ──────────────────────────────────────────────────────

describe('Question bank — data integrity', () => {
  test('contains at least 200 questions', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(200);
  });

  test('every question has a unique id', () => {
    const ids = QUESTIONS.map((q) => q.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('every question has exactly 4 options', () => {
    const bad = QUESTIONS.filter((q) => q.options.length !== 4);
    expect(bad).toHaveLength(0);
  });

  test('every question has a valid correctIndex (0–3)', () => {
    const bad = QUESTIONS.filter(
      (q) => q.correctIndex < 0 || q.correctIndex > 3
    );
    expect(bad).toHaveLength(0);
  });

  test('every question correctIndex points to a non-empty option', () => {
    const bad = QUESTIONS.filter(
      (q) => !q.options[q.correctIndex] || q.options[q.correctIndex].trim() === ''
    );
    expect(bad).toHaveLength(0);
  });

  test('every question has a non-empty text', () => {
    const bad = QUESTIONS.filter((q) => !q.text || q.text.trim() === '');
    expect(bad).toHaveLength(0);
  });

  test('every question has a non-empty explanation', () => {
    const bad = QUESTIONS.filter((q) => !q.explanation || q.explanation.trim() === '');
    expect(bad).toHaveLength(0);
  });

  test('every question has a valid topicId', () => {
    const bad = QUESTIONS.filter((q) => !VALID_TOPIC_IDS.includes(q.topicId));
    expect(bad).toHaveLength(0);
  });

  test('every question has a valid difficulty level', () => {
    const bad = QUESTIONS.filter(
      (q) => !['easy', 'medium', 'hard'].includes(q.difficulty)
    );
    expect(bad).toHaveLength(0);
  });

  test('no question has all 4 identical options', () => {
    const bad = QUESTIONS.filter((q) => {
      const unique = new Set(q.options);
      return unique.size === 1;
    });
    expect(bad).toHaveLength(0);
  });

  test('every question has a sourceRef', () => {
    const bad = QUESTIONS.filter((q) => !q.sourceRef || q.sourceRef.trim() === '');
    expect(bad).toHaveLength(0);
  });
});

// ── Values questions ──────────────────────────────────────────────

describe('Values questions', () => {
  test('there are at least 10 values questions', () => {
    const vq = getValuesQuestions();
    expect(vq.length).toBeGreaterThanOrEqual(10);
  });

  test('all values questions belong to a valid topic', () => {
    const vq = getValuesQuestions();
    const bad = vq.filter((q) => !VALID_TOPIC_IDS.includes(q.topicId));
    expect(bad).toHaveLength(0);
  });

  test('values questions are spread across topics (not all in one topic)', () => {
    const vq = getValuesQuestions();
    const topicsUsed = new Set(vq.map((q) => q.topicId));
    expect(topicsUsed.size).toBeGreaterThan(1);
  });
});

// ── Mock test builder ─────────────────────────────────────────────

describe('getMockTestQuestions', () => {
  test('returns exactly 20 questions', () => {
    const qs = getMockTestQuestions();
    expect(qs).toHaveLength(20);
  });

  test('includes exactly 5 values questions', () => {
    const qs = getMockTestQuestions();
    const valuesCount = qs.filter((q) => q.isValuesQuestion).length;
    expect(valuesCount).toBe(5);
  });

  test('includes exactly 15 non-values questions', () => {
    const qs = getMockTestQuestions();
    const nonValues = qs.filter((q) => !q.isValuesQuestion).length;
    expect(nonValues).toBe(15);
  });

  test('returns unique questions (no duplicates)', () => {
    const qs = getMockTestQuestions();
    const ids = qs.map((q) => q.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(20);
  });

  test('produces different orderings on repeated calls (shuffled)', () => {
    const run1 = getMockTestQuestions().map((q) => q.id);
    const run2 = getMockTestQuestions().map((q) => q.id);
    // There is a tiny chance they match by coincidence — check at least once in 5 runs
    const allSame = [
      getMockTestQuestions(),
      getMockTestQuestions(),
      getMockTestQuestions(),
      getMockTestQuestions(),
      getMockTestQuestions(),
    ]
      .map((qs) => qs.map((q) => q.id).join(','))
      .every((order) => order === run1.join(','));
    expect(allSame).toBe(false);
  });
});

// ── Lessons ───────────────────────────────────────────────────────

describe('Lessons — data integrity', () => {
  test('there is at least one lesson per topic', () => {
    VALID_TOPIC_IDS.forEach((topicId) => {
      const topicLessons = LESSONS.filter((l) => l.topicId === topicId);
      expect(topicLessons.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('every lesson has a unique id', () => {
    const ids = LESSONS.map((l) => l.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('every lesson has a non-empty title and summary', () => {
    const bad = LESSONS.filter(
      (l) => !l.title || !l.summary || l.title.trim() === '' || l.summary.trim() === ''
    );
    expect(bad).toHaveLength(0);
  });

  test('every lesson has at least 3 key points', () => {
    const bad = LESSONS.filter((l) => l.keyPoints.length < 3);
    expect(bad).toHaveLength(0);
  });

  test('every lesson has a valid topicId', () => {
    const bad = LESSONS.filter((l) => !VALID_TOPIC_IDS.includes(l.topicId));
    expect(bad).toHaveLength(0);
  });
});

// ── Flashcards ────────────────────────────────────────────────────

describe('Flashcards — data integrity', () => {
  test('there is at least one flashcard per topic', () => {
    VALID_TOPIC_IDS.forEach((topicId) => {
      const cards = FLASHCARDS.filter((f) => f.topicId === topicId);
      expect(cards.length).toBeGreaterThanOrEqual(1);
    });
  });

  test('every flashcard has a unique id', () => {
    const ids = FLASHCARDS.map((f) => f.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('every flashcard has non-empty front and back', () => {
    const bad = FLASHCARDS.filter(
      (f) => !f.front || !f.back || f.front.trim() === '' || f.back.trim() === ''
    );
    expect(bad).toHaveLength(0);
  });

  test('every flashcard has a valid topicId', () => {
    const bad = FLASHCARDS.filter((f) => !VALID_TOPIC_IDS.includes(f.topicId as TopicId));
    expect(bad).toHaveLength(0);
  });
});

// ── Topics ────────────────────────────────────────────────────────

describe('Topics — data integrity', () => {
  test('there are exactly 4 topics', () => {
    expect(TOPICS).toHaveLength(4);
  });

  test('topic ids match the expected set', () => {
    const ids = TOPICS.map((t) => t.id).sort();
    expect(ids).toEqual([...VALID_TOPIC_IDS].sort());
  });

  test('every topic has a title, icon, color, and description', () => {
    const bad = TOPICS.filter(
      (t) => !t.title || !t.icon || !t.color || !t.description
    );
    expect(bad).toHaveLength(0);
  });
});
