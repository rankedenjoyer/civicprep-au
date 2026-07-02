/**
 * SCORE LOGIC TESTS
 * Tests the pass/fail logic for mock tests, including the
 * critical values-question threshold.
 */

import { QUESTIONS } from '../../src/data/questions';
import { MockTestResult, QuestionAttempt } from '../../src/types';

// ── Helpers that mirror MockTestScreen logic ──────────────────────

const PASS_SCORE = 15;        // 75% of 20
const VALUES_PASS_SCORE = 3;  // min 3 of 5 values questions

function computeResult(
  questions: typeof QUESTIONS,
  selectedIndexes: number[]
): Pick<MockTestResult, 'score' | 'passed' | 'valuesScore' | 'valuesPassed'> {
  const attempts: QuestionAttempt[] = questions.map((q, i) => ({
    questionId: q.id,
    selectedIndex: selectedIndexes[i],
    correct: selectedIndexes[i] === q.correctIndex,
    timestamp: Date.now(),
  }));

  const score = attempts.filter((a) => a.correct).length;
  const valuesQs = questions.filter((q) => q.isValuesQuestion);
  const valuesAttempts = attempts.filter((a) =>
    valuesQs.some((q) => q.id === a.questionId)
  );
  const valuesScore = valuesAttempts.filter((a) => a.correct).length;
  const valuesPassed = valuesScore >= VALUES_PASS_SCORE;
  const passed = score >= PASS_SCORE && valuesPassed;

  return { score, passed, valuesScore, valuesPassed };
}

function buildFakeTest(
  totalCorrect: number,
  valuesCorrect: number
): { questions: typeof QUESTIONS; answers: number[] } {
  const valuesQs = QUESTIONS.filter((q) => q.isValuesQuestion).slice(0, 5);
  const nonValuesQs = QUESTIONS.filter((q) => !q.isValuesQuestion).slice(0, 15);
  const allQs = [...valuesQs, ...nonValuesQs];

  // Build answers: first get values answers right/wrong, then fill non-values
  const answers = allQs.map((q, i) => {
    const isValues = i < 5;
    if (isValues) {
      return i < valuesCorrect ? q.correctIndex : (q.correctIndex + 1) % 4;
    }
    const nonValuesIndex = i - 5;
    const nonValuesCorrectNeeded = totalCorrect - valuesCorrect;
    return nonValuesIndex < nonValuesCorrectNeeded
      ? q.correctIndex
      : (q.correctIndex + 1) % 4;
  });

  return { questions: allQs, answers };
}

// ── Pass conditions ───────────────────────────────────────────────

describe('Mock test — pass conditions', () => {
  test('passes when score >= 15 and values >= 3', () => {
    const { questions, answers } = buildFakeTest(15, 3);
    const { passed } = computeResult(questions, answers);
    expect(passed).toBe(true);
  });

  test('passes with perfect score (20/20, 5/5 values)', () => {
    const { questions, answers } = buildFakeTest(20, 5);
    const { passed, score, valuesScore } = computeResult(questions, answers);
    expect(passed).toBe(true);
    expect(score).toBe(20);
    expect(valuesScore).toBe(5);
  });

  test('passes at minimum threshold: 15 overall, 3 values', () => {
    const { questions, answers } = buildFakeTest(15, 3);
    const { passed, score, valuesScore } = computeResult(questions, answers);
    expect(passed).toBe(true);
    expect(score).toBe(15);
    expect(valuesScore).toBe(3);
  });
});

// ── Fail conditions ───────────────────────────────────────────────

describe('Mock test — fail conditions', () => {
  test('fails when overall score < 15 even if values pass', () => {
    const { questions, answers } = buildFakeTest(14, 5);
    const { passed, score, valuesPassed } = computeResult(questions, answers);
    expect(passed).toBe(false);
    expect(score).toBe(14);
    expect(valuesPassed).toBe(true);
  });

  test('fails when values score < 3 even if overall score passes', () => {
    const { questions, answers } = buildFakeTest(18, 2);
    const { passed, valuesScore, valuesPassed } = computeResult(questions, answers);
    expect(passed).toBe(false);
    expect(valuesScore).toBe(2);
    expect(valuesPassed).toBe(false);
  });

  test('fails when both score and values are below threshold', () => {
    const { questions, answers } = buildFakeTest(10, 1);
    const { passed } = computeResult(questions, answers);
    expect(passed).toBe(false);
  });

  test('fails with 0 correct answers', () => {
    const { questions, answers } = buildFakeTest(0, 0);
    const { passed, score } = computeResult(questions, answers);
    expect(passed).toBe(false);
    expect(score).toBe(0);
  });

  test('critical edge: values = 2 is a fail regardless of overall', () => {
    // 2 values correct = fail; 3 = pass
    const { questions: qs1, answers: a1 } = buildFakeTest(20, 2);
    const { passed: fail } = computeResult(qs1, a1);
    expect(fail).toBe(false);

    const { questions: qs2, answers: a2 } = buildFakeTest(20, 3);
    const { passed: pass } = computeResult(qs2, a2);
    expect(pass).toBe(true);
  });

  test('critical edge: overall = 14 is a fail regardless of values', () => {
    const { questions: qs1, answers: a1 } = buildFakeTest(14, 5);
    const { passed: fail } = computeResult(qs1, a1);
    expect(fail).toBe(false);

    const { questions: qs2, answers: a2 } = buildFakeTest(15, 5);
    const { passed: pass } = computeResult(qs2, a2);
    expect(pass).toBe(true);
  });
});

// ── Percentage calculation ────────────────────────────────────────

describe('Score percentage calculation', () => {
  test('0/20 = 0%', () => {
    expect(Math.round((0 / 20) * 100)).toBe(0);
  });

  test('15/20 = 75%', () => {
    expect(Math.round((15 / 20) * 100)).toBe(75);
  });

  test('20/20 = 100%', () => {
    expect(Math.round((20 / 20) * 100)).toBe(100);
  });

  test('10/20 = 50%', () => {
    expect(Math.round((10 / 20) * 100)).toBe(50);
  });
});

// ── Quiz result messages (QuizScreen logic) ───────────────────────

const quizMessage = (score: number, total: number) => {
  const percent = Math.round((score / total) * 100);
  return percent >= 75 ? 'Well done!' : 'Keep practising!';
};

describe('Quiz result messages', () => {
  test('8/10 (80%) → "Well done!"', () => {
    expect(quizMessage(8, 10)).toBe('Well done!');
  });

  test('7/10 (70%) → "Keep practising!"', () => {
    expect(quizMessage(7, 10)).toBe('Keep practising!');
  });

  test('exactly 75% (e.g. 75/100) → "Well done!"', () => {
    expect(quizMessage(75, 100)).toBe('Well done!');
  });

  test('74% → "Keep practising!"', () => {
    expect(quizMessage(74, 100)).toBe('Keep practising!');
  });

  test('10/10 → "Well done!"', () => {
    expect(quizMessage(10, 10)).toBe('Well done!');
  });

  test('0/10 → "Keep practising!"', () => {
    expect(quizMessage(0, 10)).toBe('Keep practising!');
  });
});

// ── Mistake threshold (ReviewScreen logic) ────────────────────────

const isMistake = (correct: number, attempts: number) => {
  if (attempts === 0) return false;
  return correct / attempts < 0.6;
};

describe('Mistake threshold', () => {
  test('0 correct out of 1 → mistake (0% < 60%)', () => {
    expect(isMistake(0, 1)).toBe(true);
  });

  test('1 correct out of 3 → mistake (33% < 60%)', () => {
    expect(isMistake(1, 3)).toBe(true);
  });

  test('2 correct out of 3 → NOT mistake (67% ≥ 60%)', () => {
    expect(isMistake(2, 3)).toBe(false);
  });

  test('4 correct out of 5 → NOT mistake (80% ≥ 60%)', () => {
    expect(isMistake(4, 5)).toBe(false);
  });

  test('3 correct out of 5 → NOT mistake (60% = threshold)', () => {
    expect(isMistake(3, 5)).toBe(false);
  });

  test('0 attempts → not a mistake (no data)', () => {
    expect(isMistake(0, 0)).toBe(false);
  });
});

// ── Hard flashcard filter (FlashcardsScreen logic) ────────────────

import { FLASHCARDS } from '../../src/data/flashcards';

describe('Hard flashcard filter', () => {
  test('returns only flashcards whose id is in hardFlashcards list', () => {
    const hardIds = [FLASHCARDS[0].id, FLASHCARDS[2].id];
    const result = FLASHCARDS.filter((f) => hardIds.includes(f.id));
    expect(result).toHaveLength(2);
    expect(result.map((f) => f.id)).toEqual(hardIds);
  });

  test('returns empty array when hardFlashcards list is empty', () => {
    const result = FLASHCARDS.filter((f) => [].includes(f.id));
    expect(result).toHaveLength(0);
  });

  test('returns all flashcards when all ids are in hardFlashcards list', () => {
    const allIds = FLASHCARDS.map((f) => f.id);
    const result = FLASHCARDS.filter((f) => allIds.includes(f.id));
    expect(result).toHaveLength(FLASHCARDS.length);
  });
});

// ── Readiness score calculation (AppContext logic) ────────────────

/**
 * Mirrors getReadinessScore() in AppContext:
 *   accuracy        = round(totalCorrect / totalAnswered * 100)
 *   questionsBonus  = min(totalAnswered / 2, 20)   ← caps at 20
 *   mockBonus       = mocksPassed * 5
 *   score           = min(100, round(accuracy * 0.6 + mockBonus + questionsBonus))
 */
const getReadinessScore = (
  totalAnswered: number,
  totalCorrect: number,
  mockTestsPassed: number
): number => {
  if (totalAnswered === 0) return 0;
  const accuracy = Math.round((totalCorrect / totalAnswered) * 100);
  const questionsBonus = Math.min(totalAnswered / 2, 20);
  const mockBonus = mockTestsPassed * 5;
  return Math.min(100, Math.round(accuracy * 0.6 + mockBonus + questionsBonus));
};

describe('Readiness score', () => {
  test('returns 0 when no questions answered', () => {
    expect(getReadinessScore(0, 0, 0)).toBe(0);
  });

  test('increases as accuracy improves', () => {
    const low = getReadinessScore(10, 5, 0);   // 50% accuracy
    const high = getReadinessScore(10, 10, 0); // 100% accuracy
    expect(high).toBeGreaterThan(low);
  });

  test('increases as more questions are answered', () => {
    const few = getReadinessScore(5, 5, 0);
    const many = getReadinessScore(50, 50, 0);
    expect(many).toBeGreaterThan(few);
  });

  test('mock test passes add a bonus', () => {
    const noPasses = getReadinessScore(30, 25, 0);
    const withPass = getReadinessScore(30, 25, 1);
    expect(withPass).toBeGreaterThanOrEqual(noPasses);
  });

  test('does not exceed 100', () => {
    expect(getReadinessScore(100, 100, 10)).toBeLessThanOrEqual(100);
  });
});

// ── Cram mode logic (MockTestScreen) ─────────────────────────────

/**
 * Mirrors MockTestScreen: const [timed, setTimed] = useState(!cramMode)
 * cramMode=false (normal) → timed=true (45-min countdown on by default)
 * cramMode=true  (cram)   → timed=false (no timer by default)
 */
const defaultTimedState = (cramMode: boolean) => !cramMode;

describe('Cram mode — timed default', () => {
  test('normal mode (cramMode=false) → timed defaults ON', () => {
    expect(defaultTimedState(false)).toBe(true);
  });

  test('cram mode (cramMode=true) → timed defaults OFF', () => {
    expect(defaultTimedState(true)).toBe(false);
  });

  test('cramMode missing (undefined treated as false) → timed ON', () => {
    const cramMode = undefined ?? false;
    expect(defaultTimedState(cramMode)).toBe(true);
  });
});
