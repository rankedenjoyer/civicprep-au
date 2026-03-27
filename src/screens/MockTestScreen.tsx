import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { getMockTestQuestions } from '../data/questions';
import { Question, MockTestResult, QuestionAttempt } from '../types';
import { useApp } from '../context/AppContext';

interface Props {
  navigation: any;
  route: { params?: { cramMode?: boolean } };
}

const PASS_SCORE = 15; // 75% of 20
const VALUES_PASS_SCORE = 3; // min 3 of 5 values questions

export default function MockTestScreen({ navigation, route }: Props) {
  const cramMode = route.params?.cramMode ?? false;
  const { recordAttempt, saveTestResult } = useApp();

  const [phase, setPhase] = useState<'intro' | 'test' | 'results'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [timed, setTimed] = useState(!cramMode);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [startTime, setStartTime] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [result, setResult] = useState<MockTestResult | null>(null);
  const [showQuitModal, setShowQuitModal] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTest = () => {
    const qs = getMockTestQuestions();
    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setAttempts([]);
    setStartTime(Date.now());

    if (timed) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            finishTest(qs, attempts);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    setPhase('test');
  };

  const handleSelect = async (idx: number) => {
    if (answered) return;
    const current = questions[currentIndex];
    setSelectedOption(idx);
    setAnswered(true);
    const correct = idx === current.correctIndex;
    const attempt: QuestionAttempt = {
      questionId: current.id,
      selectedIndex: idx,
      correct,
      timestamp: Date.now(),
    };
    setAttempts((prev) => [...prev, attempt]);
    await recordAttempt(current.id, correct);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      finishTest(questions, [...attempts]);
    }
  };

  const finishTest = async (qs: Question[], allAttempts: QuestionAttempt[]) => {
    const correctAttempts = allAttempts.filter((a) => a.correct);
    const score = correctAttempts.length;
    const valuesQs = qs.filter((q) => q.isValuesQuestion);
    const valuesAttempts = allAttempts.filter((a) =>
      valuesQs.some((q) => q.id === a.questionId)
    );
    const valuesScore = valuesAttempts.filter((a) => a.correct).length;
    const valuesTotal = valuesQs.length;
    const valuesPassed = valuesScore >= VALUES_PASS_SCORE;
    const passed = score >= PASS_SCORE && valuesPassed;
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    const testResult: MockTestResult = {
      id: `mock_${Date.now()}`,
      date: Date.now(),
      score,
      total: qs.length,
      passed,
      valuesScore,
      valuesTotal,
      valuesPassed,
      attempts: allAttempts,
      durationSeconds,
    };

    setResult(testResult);
    await saveTestResult(testResult);
    setPhase('results');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // INTRO
  if (phase === 'intro') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.introContent}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.introIcon}>
          <Ionicons name="newspaper" size={48} color={COLORS.primary} />
        </View>
        <Text style={styles.introTitle}>Official-Style Mock Test</Text>
        <Text style={styles.introSub}>
          Simulate the real Australian Citizenship Test with 20 questions.
        </Text>

        <View style={styles.infoGrid}>
          {[
            { icon: 'help-circle', label: '20 Questions', sub: 'Multiple choice' },
            { icon: 'heart', label: '5 Values Questions', sub: 'Critical — min 3 correct to pass' },
            { icon: 'checkmark-circle', label: 'Pass Mark', sub: '15 of 20 (75%)' },
            { icon: 'time', label: '45 Minutes', sub: 'Timed (optional)' },
          ].map((item) => (
            <View key={item.label} style={styles.infoCard}>
              <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoSub}>{item.sub}</Text>
            </View>
          ))}
        </View>

        <View style={styles.timedRow}>
          <View>
            <Text style={styles.timedLabel}>Timed mode</Text>
            <Text style={styles.timedSub}>45 minute countdown</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, timed && styles.toggleOn]}
            onPress={() => setTimed((t) => !t)}
            testID="timed-toggle"
          >
            <View style={[styles.toggleThumb, timed && styles.toggleThumbOn]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startTest}>
          <Text style={styles.startButtonText}>Start Test</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // TEST
  if (phase === 'test') {
    const current = questions[currentIndex];
    if (!current) return null;
    const isCorrect = selectedOption === current.correctIndex;

    return (
      <View style={styles.container}>
        {/* Quit confirmation modal */}
        <Modal
          visible={showQuitModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowQuitModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Quit Test?</Text>
              <Text style={styles.modalText}>Your progress will be lost.</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowQuitModal(false)}
                >
                  <Text style={styles.modalCancelText}>Keep Going</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalQuitBtn}
                  onPress={() => {
                    if (timerRef.current) clearInterval(timerRef.current);
                    // Reset all state so if React Navigation caches this screen,
                    // the user sees the intro page — not a mid-session test.
                    setPhase('intro');
                    setCurrentIndex(0);
                    setSelectedOption(null);
                    setAnswered(false);
                    setAttempts([]);
                    setTimeLeft(45 * 60);
                    setResult(null);
                    setShowQuitModal(false);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.modalQuitText}>Quit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Header */}
        <View style={styles.testHeader}>
          <TouchableOpacity onPress={() => setShowQuitModal(true)} testID="quit-btn" accessibilityLabel="quit test">
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.testHeaderCenter}>
            <Text style={styles.testHeaderQ}>
              {currentIndex + 1} / {questions.length}
            </Text>
            {timed && (
              <View style={styles.timerBadge}>
                <Ionicons name="time" size={14} color={timeLeft < 300 ? COLORS.error : COLORS.white} />
                <Text style={[styles.timerText, timeLeft < 300 && { color: COLORS.error }]}>
                  {formatTime(timeLeft)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.testHeaderScore}>
            {attempts.filter((a) => a.correct).length} correct
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.testProgress}>
          <View
            style={[
              styles.testProgressFill,
              { width: `${((currentIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>

        <ScrollView style={styles.testBody} showsVerticalScrollIndicator={false}>
          {current.isValuesQuestion && (
            <View style={styles.valuesBadge}>
              <Ionicons name="heart" size={14} color={COLORS.topicValues} />
              <Text style={styles.valuesBadgeText}>Values Question</Text>
            </View>
          )}

          <Text style={styles.questionText}>{current.text}</Text>

          <View style={styles.optionsContainer}>
            {current.options.map((option, idx) => {
              let cardStyle = [styles.optionCard];
              let textStyle = [styles.optionText];

              if (answered) {
                if (idx === current.correctIndex) {
                  cardStyle = [styles.optionCard, styles.optionCorrect] as any;
                  textStyle = [styles.optionText, styles.optionTextCorrect] as any;
                } else if (idx === selectedOption) {
                  cardStyle = [styles.optionCard, styles.optionWrong] as any;
                  textStyle = [styles.optionText, styles.optionTextWrong] as any;
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
                  <Text style={[...textStyle, { flex: 1 }]}>{option}</Text>
                  {answered && idx === current.correctIndex && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  )}
                  {answered && idx === selectedOption && idx !== current.correctIndex && (
                    <Ionicons name="close-circle" size={20} color={COLORS.error} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {answered && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>{current.explanation}</Text>
            </View>
          )}

          {answered && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          )}

          <View style={{ height: SPACING.xxl }} />
        </ScrollView>
      </View>
    );
  }

  // RESULTS
  if (phase === 'results' && result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultsContent}>
        {/* Pass/Fail banner */}
        <View
          style={[
            styles.resultBanner,
            { backgroundColor: result.passed ? COLORS.success : COLORS.error },
          ]}
        >
          <Ionicons
            name={result.passed ? 'checkmark-circle' : 'close-circle'}
            size={48}
            color={COLORS.white}
          />
          <Text style={styles.resultBannerTitle}>
            {result.passed ? 'Test Passed!' : 'Test Not Passed'}
          </Text>
          <Text style={styles.resultBannerSub}>
            {result.passed
              ? 'Great work! You met the pass requirements.'
              : result.valuesPassed
              ? `Score too low (${pct}%). Need 75% to pass.`
              : `Values questions failed (${result.valuesScore}/${result.valuesTotal}). Need at least 3.`}
          </Text>
        </View>

        {/* Score breakdown */}
        <View style={styles.scoreBreakdown}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreItemValue}>{result.score}/{result.total}</Text>
            <Text style={styles.scoreItemLabel}>Overall Score</Text>
            <Text style={[styles.scoreItemStatus, { color: result.score >= PASS_SCORE ? COLORS.success : COLORS.error }]}>
              {result.score >= PASS_SCORE ? '✓ Passed' : `✗ Need ${PASS_SCORE}`}
            </Text>
          </View>
          <View style={styles.scoreItemDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreItemValue}>{result.valuesScore}/{result.valuesTotal}</Text>
            <Text style={styles.scoreItemLabel}>Values Score</Text>
            <Text style={[styles.scoreItemStatus, { color: result.valuesPassed ? COLORS.success : COLORS.error }]}>
              {result.valuesPassed ? '✓ Passed' : `✗ Need ${VALUES_PASS_SCORE}`}
            </Text>
          </View>
          <View style={styles.scoreItemDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreItemValue}>{pct}%</Text>
            <Text style={styles.scoreItemLabel}>Accuracy</Text>
            <Text style={styles.scoreItemStatus}>
              {formatTime(result.durationSeconds)}
            </Text>
          </View>
        </View>

        {/* Retry / review */}
        <TouchableOpacity
          style={[styles.startButton, { marginHorizontal: SPACING.lg }]}
          onPress={() => {
            setPhase('intro');
            setTimeLeft(45 * 60);
            setAttempts([]);
            setResult(null);
          }}
        >
          <Text style={styles.startButtonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { margin: SPACING.lg, marginTop: SPACING.sm }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  backBtn: { padding: SPACING.sm, marginBottom: SPACING.sm },
  introContent: { padding: SPACING.lg },
  introIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  introTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  introSub: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  infoCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  infoLabel: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  infoSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, textAlign: 'center' },
  timedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  timedLabel: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  timedSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    padding: 3,
  },
  toggleOn: { backgroundColor: COLORS.primary },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.white,
  },
  toggleThumbOn: { alignSelf: 'flex-end' },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  startButtonText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.lg },
  testHeader: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testHeaderCenter: { alignItems: 'center', gap: 2 },
  testHeaderQ: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  timerText: { color: COLORS.white, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  testHeaderScore: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.sm },
  testProgress: {
    height: 3,
    backgroundColor: 'rgba(27,79,114,0.2)',
    overflow: 'hidden',
  },
  testProgressFill: { height: '100%', backgroundColor: COLORS.primaryLight },
  testBody: { flex: 1, padding: SPACING.lg },
  valuesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EEF8',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  valuesBadgeText: { fontSize: FONTS.sizes.xs, fontWeight: '600', color: COLORS.topicValues },
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
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  explanationText: { fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 20 },
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
  resultsContent: { padding: 0 },
  resultBanner: {
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.xxl,
  },
  resultBannerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.white },
  resultBannerSub: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  scoreBreakdown: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  scoreItem: { alignItems: 'center', gap: 4 },
  scoreItemValue: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text },
  scoreItemLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  scoreItemStatus: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
  scoreItemDivider: { width: 1, backgroundColor: COLORS.border },
  secondaryButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  secondaryButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.md },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  modalText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalCancelText: { color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.md },
  modalQuitBtn: {
    flex: 1,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalQuitText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
});
