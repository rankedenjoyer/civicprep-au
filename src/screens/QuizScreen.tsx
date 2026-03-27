import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { QUESTIONS, getQuestionsByTopic, getValuesQuestions } from '../data/questions';
import { Question } from '../types';
import { useApp } from '../context/AppContext';

interface Props {
  navigation: any;
  route: { params: { topicId?: string; mode: 'topic' | 'values' | 'random10' | 'bookmarks' } };
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export default function QuizScreen({ navigation, route }: Props) {
  const { topicId, mode } = route.params;
  const { recordAttempt, toggleBookmarkQuestion, isBookmarked } = useApp();

  const buildQuestions = useCallback((): Question[] => {
    if (mode === 'topic' && topicId) return shuffle(getQuestionsByTopic(topicId)).slice(0, 10);
    if (mode === 'values') return shuffle(getValuesQuestions()).slice(0, 10);
    if (mode === 'random10') return shuffle(QUESTIONS).slice(0, 10);
    return shuffle(QUESTIONS).slice(0, 10);
  }, [mode, topicId]);

  const [questions] = useState<Question[]>(buildQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const isCorrect = selectedOption === current?.correctIndex;

  const handleSelect = async (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
    const correct = idx === current.correctIndex;
    setResults((prev) => [...prev, correct]);
    await recordAttempt(current.id, correct);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const score = results.filter(Boolean).length;
  const total = questions.length;
  const percent = Math.round((score / total) * 100);

  const modeLabel = () => {
    if (mode === 'values') return 'Values Focus';
    if (mode === 'topic') return 'Topic Quiz';
    return 'Quick Quiz';
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <View style={[styles.scoreCircle, { borderColor: percent >= 75 ? COLORS.success : COLORS.error }]}>
            <Text style={[styles.scoreCircleText, { color: percent >= 75 ? COLORS.success : COLORS.error }]}>
              {percent}%
            </Text>
            <Text style={styles.scoreCircleSub}>{score}/{total}</Text>
          </View>
          <Text style={styles.resultTitle}>
            {percent >= 75 ? 'Well done!' : 'Keep practising!'}
          </Text>
          <Text style={styles.resultSub}>
            {percent >= 75
              ? 'You\'re making great progress.'
              : 'Review the explanations and try again.'}
          </Text>

          <View style={styles.resultReview}>
            {questions.map((q, i) => (
              <View key={q.id} style={styles.resultRow}>
                <Ionicons
                  name={results[i] ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={results[i] ? COLORS.success : COLORS.error}
                />
                <Text style={styles.resultRowText} numberOfLines={2}>{q.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryButtonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setCurrentIndex(0);
              setSelectedOption(null);
              setAnswered(false);
              setResults([]);
              setFinished(false);
            }}
          >
            <Text style={styles.secondaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (!current) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.quizHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.progressPills}>
          {questions.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressPill,
                i < results.length
                  ? { backgroundColor: results[i] ? '#A9DFBF' : '#F1948A' }
                  : i === currentIndex
                  ? { backgroundColor: COLORS.white }
                  : { backgroundColor: 'rgba(255,255,255,0.3)' },
              ]}
            />
          ))}
        </View>
        <Text style={styles.quizCounter}>
          {currentIndex + 1}/{questions.length}
        </Text>
      </View>

      <ScrollView style={styles.quizBody} showsVerticalScrollIndicator={false}>
        {/* Values badge */}
        {current.isValuesQuestion && (
          <View style={styles.valuesBadge}>
            <Ionicons name="warning" size={14} color={COLORS.warning} />
            <Text style={styles.valuesBadgeText}>Values Question — Critical</Text>
          </View>
        )}

        <Text style={styles.questionText}>{current.text}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {current.options.map((option, idx) => {
            let cardStyle = styles.optionCard;
            let textStyle = styles.optionText;
            let icon: any = null;

            if (answered) {
              if (idx === current.correctIndex) {
                cardStyle = { ...styles.optionCard, ...styles.optionCorrect };
                textStyle = { ...styles.optionText, ...styles.optionTextCorrect };
                icon = 'checkmark-circle';
              } else if (idx === selectedOption) {
                cardStyle = { ...styles.optionCard, ...styles.optionWrong };
                textStyle = { ...styles.optionText, ...styles.optionTextWrong };
                icon = 'close-circle';
              }
            }

            return (
              <TouchableOpacity
                key={idx}
                style={cardStyle}
                onPress={() => handleSelect(idx)}
                activeOpacity={answered ? 1 : 0.7}
              >
                <View style={styles.optionLetter}>
                  <Text style={styles.optionLetterText}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                </View>
                <Text style={[textStyle, { flex: 1 }]}>{option}</Text>
                {icon && answered && (
                  <Ionicons
                    name={icon}
                    size={20}
                    color={idx === current.correctIndex ? COLORS.success : COLORS.error}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {answered && (
          <View style={[styles.explanationBox, { borderColor: isCorrect ? COLORS.success : COLORS.error }]}>
            <View style={styles.explanationHeader}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={isCorrect ? COLORS.success : COLORS.error}
              />
              <Text style={[styles.explanationTitle, { color: isCorrect ? COLORS.success : COLORS.error }]}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </Text>
              <TouchableOpacity
                style={styles.bookmarkBtn}
                onPress={() => toggleBookmarkQuestion(current.id)}
                testID="bookmark-btn"
              >
                <Ionicons
                  name={isBookmarked(current.id) ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.explanationText}>{current.explanation}</Text>
            <Text style={styles.sourceRef}>Source: {current.sourceRef}</Text>
          </View>
        )}

        {answered && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  quizHeader: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressPills: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  progressPill: {
    flex: 1,
    height: 4,
    borderRadius: RADIUS.full,
  },
  quizCounter: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },
  quizBody: { flex: 1, padding: SPACING.lg },
  valuesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  valuesBadgeText: { fontSize: FONTS.sizes.xs, fontWeight: '600', color: COLORS.warning },
  questionText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: SPACING.lg,
  },
  optionsContainer: { gap: SPACING.sm, marginBottom: SPACING.md },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  optionCorrect: { borderColor: COLORS.success, backgroundColor: '#EAFAF1' },
  optionWrong: { borderColor: COLORS.error, backgroundColor: '#FDEDEC' },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text },
  optionText: { fontSize: FONTS.sizes.md, color: COLORS.text },
  optionTextCorrect: { color: COLORS.success, fontWeight: '600' },
  optionTextWrong: { color: COLORS.error },
  explanationBox: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  explanationTitle: { fontWeight: '700', fontSize: FONTS.sizes.md, flex: 1 },
  bookmarkBtn: { padding: 4 },
  explanationText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.xs,
  },
  sourceRef: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, fontStyle: 'italic' },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  nextButtonText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  resultContainer: { padding: SPACING.lg, alignItems: 'center' },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xl,
  },
  scoreCircleText: { fontSize: 40, fontWeight: '800' },
  scoreCircleSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  resultTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  resultSub: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  resultReview: { width: '100%', marginBottom: SPACING.xl },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  resultRowText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    lineHeight: 18,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  primaryButtonText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  secondaryButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  secondaryButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.md },
});
