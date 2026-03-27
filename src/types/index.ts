export type TopicId =
  | 'australia-and-its-people'
  | 'democratic-beliefs-rights-liberties'
  | 'government-and-law'
  | 'australian-values';

export interface Topic {
  id: TopicId;
  title: string;
  shortTitle: string;
  icon: string;
  color: string;
  description: string;
  lessonCount: number;
}

export interface Lesson {
  id: string;
  topicId: TopicId;
  title: string;
  summary: string;
  keyPoints: string[];
  order: number;
}

export interface Question {
  id: string;
  topicId: TopicId;
  lessonId?: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceRef: string;
  isValuesQuestion: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Flashcard {
  id: string;
  topicId: TopicId;
  front: string;
  back: string;
}

export type StudyPlan = '7-day' | '14-day' | '30-day';
export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';
export type StudyMode = 'quiz' | 'reading' | 'mixed';

export interface UserProfile {
  testDate: string | null;
  englishLevel: EnglishLevel;
  dailyMinutes: number;
  studyMode: StudyMode;
  studyPlan: StudyPlan;
  onboardingComplete: boolean;
}

export interface QuestionAttempt {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  timestamp: number;
}

export interface MockTestResult {
  id: string;
  date: number;
  score: number;
  total: number;
  passed: boolean;
  valuesScore: number;
  valuesTotal: number;
  valuesPassed: boolean;
  attempts: QuestionAttempt[];
  durationSeconds: number;
}

export interface UserProgress {
  topicProgress: Record<TopicId, number>; // 0-100
  totalQuestionsAnswered: number;
  totalCorrect: number;
  streak: number;
  lastStudyDate: string;
  studyMinutesToday: number;
  bookmarkedQuestions: string[];
  hardFlashcards: string[];
  mockTestResults: MockTestResult[];
  questionStats: Record<string, { attempts: number; correct: number }>;
}
