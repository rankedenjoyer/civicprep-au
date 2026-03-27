import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, UserProgress, MockTestResult, TopicId } from '../types';
import {
  getUserProfile,
  saveUserProfile,
  getUserProgress,
  saveUserProgress,
  recordQuestionAttempt,
  saveMockTestResult,
  toggleBookmark,
  toggleHardFlashcard,
  updateStreak,
} from '../utils/storage';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';

/** Recompute each topic's progress (0–100) from per-question attempt stats. */
function computeTopicProgress(
  questionStats: UserProgress['questionStats']
): Record<TopicId, number> {
  const result = {} as Record<TopicId, number>;
  for (const topic of TOPICS) {
    const topicQs = QUESTIONS.filter((q) => q.topicId === topic.id);
    const total = topicQs.length;
    if (total === 0) { result[topic.id as TopicId] = 0; continue; }
    let attempted = 0;
    let accuracySum = 0;
    for (const q of topicQs) {
      const s = questionStats[q.id];
      if (s && s.attempts > 0) {
        attempted++;
        accuracySum += s.correct / s.attempts;
      }
    }
    if (attempted === 0) { result[topic.id as TopicId] = 0; continue; }
    // coverage × average-accuracy → 0–100
    result[topic.id as TopicId] = Math.round((attempted / total) * (accuracySum / attempted) * 100);
  }
  return result;
}

interface AppContextType {
  profile: UserProfile | null;
  progress: UserProgress | null;
  loading: boolean;
  updateProfile: (profile: UserProfile) => Promise<void>;
  recordAttempt: (questionId: string, correct: boolean) => Promise<void>;
  saveTestResult: (result: MockTestResult) => Promise<void>;
  toggleBookmarkQuestion: (questionId: string) => Promise<void>;
  toggleHardCard: (flashcardId: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
  isBookmarked: (questionId: string) => boolean;
  isHardCard: (flashcardId: string) => boolean;
  getAccuracy: () => number;
  getReadinessScore: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, pr] = await Promise.all([getUserProfile(), getUserProgress()]);
      setProfile(p);
      const updated = await updateStreak(pr);
      setProgress(updated);
      setLoading(false);
    })();
  }, []);

  const updateProfile = useCallback(async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await saveUserProfile(newProfile);
  }, []);

  const recordAttempt = useCallback(
    async (questionId: string, correct: boolean) => {
      if (!progress) return;
      const updated = await recordQuestionAttempt(progress, questionId, correct);
      const topicProgress = computeTopicProgress(updated.questionStats);
      const withTopics = { ...updated, topicProgress };
      await saveUserProgress(withTopics);
      setProgress(withTopics);
    },
    [progress]
  );

  const saveTestResult = useCallback(
    async (result: MockTestResult) => {
      if (!progress) return;
      const updated = await saveMockTestResult(progress, result);
      const topicProgress = computeTopicProgress(updated.questionStats);
      const withTopics = { ...updated, topicProgress };
      await saveUserProgress(withTopics);
      setProgress(withTopics);
    },
    [progress]
  );

  const toggleBookmarkQuestion = useCallback(
    async (questionId: string) => {
      if (!progress) return;
      const updated = await toggleBookmark(progress, questionId);
      setProgress(updated);
    },
    [progress]
  );

  const toggleHardCard = useCallback(
    async (flashcardId: string) => {
      if (!progress) return;
      const updated = await toggleHardFlashcard(progress, flashcardId);
      setProgress(updated);
    },
    [progress]
  );

  const refreshProgress = useCallback(async () => {
    const pr = await getUserProgress();
    setProgress(pr);
  }, []);

  const isBookmarked = useCallback(
    (questionId: string) => progress?.bookmarkedQuestions.includes(questionId) ?? false,
    [progress]
  );

  const isHardCard = useCallback(
    (flashcardId: string) => progress?.hardFlashcards.includes(flashcardId) ?? false,
    [progress]
  );

  const getAccuracy = useCallback(() => {
    if (!progress || progress.totalQuestionsAnswered === 0) return 0;
    return Math.round((progress.totalCorrect / progress.totalQuestionsAnswered) * 100);
  }, [progress]);

  const getReadinessScore = useCallback(() => {
    if (!progress) return 0;
    const accuracy = getAccuracy();
    const mocksPassed = progress.mockTestResults.filter((r) => r.passed).length;
    const questionsBonus = Math.min(progress.totalQuestionsAnswered / 2, 20);
    const score = Math.min(100, Math.round(accuracy * 0.6 + mocksPassed * 5 + questionsBonus));
    return score;
  }, [progress, getAccuracy]);

  return (
    <AppContext.Provider
      value={{
        profile,
        progress,
        loading,
        updateProfile,
        recordAttempt,
        saveTestResult,
        toggleBookmarkQuestion,
        toggleHardCard,
        refreshProgress,
        isBookmarked,
        isHardCard,
        getAccuracy,
        getReadinessScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
