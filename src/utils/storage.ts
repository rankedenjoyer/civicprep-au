import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserProgress, MockTestResult } from '../types';

const KEYS = {
  USER_PROFILE: '@civicprep_user_profile',
  USER_PROGRESS: '@civicprep_user_progress',
};

const DEFAULT_PROFILE: UserProfile = {
  testDate: null,
  englishLevel: 'intermediate',
  dailyMinutes: 15,
  studyMode: 'mixed',
  studyPlan: '14-day',
  onboardingComplete: false,
};

const DEFAULT_PROGRESS: UserProgress = {
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
};

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const json = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return json ? { ...DEFAULT_PROFILE, ...JSON.parse(json) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
}

export async function getUserProgress(): Promise<UserProgress> {
  try {
    const json = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
    if (!json) return DEFAULT_PROGRESS;
    const stored = JSON.parse(json);
    return {
      ...DEFAULT_PROGRESS,
      ...stored,
      topicProgress: {
        ...DEFAULT_PROGRESS.topicProgress,
        ...stored.topicProgress,
      },
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveUserProgress(progress: UserProgress): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(progress));
}

export async function recordQuestionAttempt(
  progress: UserProgress,
  questionId: string,
  correct: boolean
): Promise<UserProgress> {
  const stats = progress.questionStats[questionId] || { attempts: 0, correct: 0 };
  const updated: UserProgress = {
    ...progress,
    totalQuestionsAnswered: progress.totalQuestionsAnswered + 1,
    totalCorrect: progress.totalCorrect + (correct ? 1 : 0),
    questionStats: {
      ...progress.questionStats,
      [questionId]: {
        attempts: stats.attempts + 1,
        correct: stats.correct + (correct ? 1 : 0),
      },
    },
  };
  await saveUserProgress(updated);
  return updated;
}

export async function saveMockTestResult(
  progress: UserProgress,
  result: MockTestResult
): Promise<UserProgress> {
  const updated: UserProgress = {
    ...progress,
    mockTestResults: [result, ...progress.mockTestResults].slice(0, 20),
  };
  await saveUserProgress(updated);
  return updated;
}

export async function toggleBookmark(
  progress: UserProgress,
  questionId: string
): Promise<UserProgress> {
  const bookmarks = progress.bookmarkedQuestions.includes(questionId)
    ? progress.bookmarkedQuestions.filter((id) => id !== questionId)
    : [...progress.bookmarkedQuestions, questionId];

  const updated = { ...progress, bookmarkedQuestions: bookmarks };
  await saveUserProgress(updated);
  return updated;
}

export async function toggleHardFlashcard(
  progress: UserProgress,
  flashcardId: string
): Promise<UserProgress> {
  const hardCards = progress.hardFlashcards.includes(flashcardId)
    ? progress.hardFlashcards.filter((id) => id !== flashcardId)
    : [...progress.hardFlashcards, flashcardId];

  const updated = { ...progress, hardFlashcards: hardCards };
  await saveUserProgress(updated);
  return updated;
}

export async function updateStreak(progress: UserProgress): Promise<UserProgress> {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let streak = progress.streak;
  if (progress.lastStudyDate === today) {
    // Already studied today, no change
  } else if (progress.lastStudyDate === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  const updated = { ...progress, streak, lastStudyDate: today };
  await saveUserProgress(updated);
  return updated;
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.USER_PROFILE);
  await AsyncStorage.removeItem(KEYS.USER_PROGRESS);
}
