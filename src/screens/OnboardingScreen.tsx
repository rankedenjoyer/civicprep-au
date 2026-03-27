import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { StudyPlan, EnglishLevel, StudyMode, UserProfile } from '../types';
import { useApp } from '../context/AppContext';

const STEPS = ['welcome', 'testDate', 'english', 'dailyTime', 'studyMode', 'plan'] as const;
type Step = typeof STEPS[number];

export default function OnboardingScreen() {
  const { updateProfile, profile } = useApp();
  const [step, setStep] = useState<Step>('welcome');
  const [testDate, setTestDate] = useState<string>('');
  const [english, setEnglish] = useState<EnglishLevel>('intermediate');
  const [dailyMin, setDailyMin] = useState<number>(15);
  const [mode, setMode] = useState<StudyMode>('mixed');
  const [plan, setPlan] = useState<StudyPlan>('14-day');

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const back = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const finish = async () => {
    const newProfile: UserProfile = {
      testDate: testDate || null,
      englishLevel: english,
      dailyMinutes: dailyMin,
      studyMode: mode,
      studyPlan: plan,
      onboardingComplete: true,
    };
    await updateProfile(newProfile);
  };

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Progress bar */}
      {step !== 'welcome' && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      )}

      {/* WELCOME */}
      {step === 'welcome' && (
        <View style={styles.stepContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="earth" size={72} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>CivicPrep AU</Text>
          <Text style={styles.tagline}>
            Pass your Australian Citizenship Test with confidence
          </Text>
          <View style={styles.disclaimerBox}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.disclaimerText}>
              This is an independent study companion based on the official{' '}
              <Text style={styles.disclaimerBold}>
                "Australian Citizenship: Our Common Bond"
              </Text>{' '}
              booklet. It is not affiliated with or endorsed by the Australian Government.
            </Text>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={next}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* TEST DATE */}
      {step === 'testDate' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>When is your test?</Text>
          <Text style={styles.stepSubtitle}>
            Knowing your test date helps us build the right study plan for you.
          </Text>
          <View style={styles.optionGroup}>
            {[
              { label: 'In less than 2 weeks', value: '7' },
              { label: 'In 2–4 weeks', value: '21' },
              { label: 'In 1–2 months', value: '45' },
              { label: 'Not sure yet', value: '' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionCard, testDate === opt.value && styles.optionCardSelected]}
                onPress={() => setTestDate(opt.value)}
              >
                <Text
                  style={[
                    styles.optionCardText,
                    testDate === opt.value && styles.optionCardTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
                {testDate === opt.value && (
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backButton} onPress={back}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={next}>
              <Text style={styles.primaryButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ENGLISH LEVEL */}
      {step === 'english' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Your English level</Text>
          <Text style={styles.stepSubtitle}>
            We'll adjust how explanations are written for you.
          </Text>
          <View style={styles.optionGroup}>
            {[
              { label: 'Beginner', sub: 'Simple English, shorter sentences', value: 'beginner' as EnglishLevel },
              { label: 'Intermediate', sub: 'Standard language, some detail', value: 'intermediate' as EnglishLevel },
              { label: 'Advanced', sub: 'Full explanations with context', value: 'advanced' as EnglishLevel },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionCard, english === opt.value && styles.optionCardSelected]}
                onPress={() => setEnglish(opt.value)}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.optionCardText,
                      english === opt.value && styles.optionCardTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text style={styles.optionCardSub}>{opt.sub}</Text>
                </View>
                {english === opt.value && (
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backButton} onPress={back}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={next}>
              <Text style={styles.primaryButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* DAILY TIME */}
      {step === 'dailyTime' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Daily study time</Text>
          <Text style={styles.stepSubtitle}>
            Even 10 minutes a day makes a big difference.
          </Text>
          <View style={styles.optionGroup}>
            {[
              { label: '10 minutes', value: 10 },
              { label: '15 minutes', value: 15 },
              { label: '30 minutes', value: 30 },
              { label: '1 hour or more', value: 60 },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionCard, dailyMin === opt.value && styles.optionCardSelected]}
                onPress={() => setDailyMin(opt.value)}
              >
                <Text
                  style={[
                    styles.optionCardText,
                    dailyMin === opt.value && styles.optionCardTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
                {dailyMin === opt.value && (
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backButton} onPress={back}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={next}>
              <Text style={styles.primaryButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STUDY MODE */}
      {step === 'studyMode' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>How do you like to study?</Text>
          <Text style={styles.stepSubtitle}>
            Choose your preferred learning style.
          </Text>
          <View style={styles.optionGroup}>
            {[
              { label: 'Quiz', sub: 'Practice questions only', icon: 'help-circle', value: 'quiz' as StudyMode },
              { label: 'Reading', sub: 'Lessons and flashcards', icon: 'book', value: 'reading' as StudyMode },
              { label: 'Mixed', sub: 'A bit of everything', icon: 'grid', value: 'mixed' as StudyMode },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionCard, mode === opt.value && styles.optionCardSelected]}
                onPress={() => setMode(opt.value)}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={24}
                  color={mode === opt.value ? COLORS.primary : COLORS.textSecondary}
                  style={{ marginRight: SPACING.sm }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.optionCardText,
                      mode === opt.value && styles.optionCardTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text style={styles.optionCardSub}>{opt.sub}</Text>
                </View>
                {mode === opt.value && (
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backButton} onPress={back}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={next}>
              <Text style={styles.primaryButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STUDY PLAN */}
      {step === 'plan' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Your study plan</Text>
          <Text style={styles.stepSubtitle}>
            Pick a plan that fits your timeline.
          </Text>
          <View style={styles.optionGroup}>
            {[
              { label: '7-Day Cram', sub: 'Intensive — for upcoming tests', icon: 'flash', value: '7-day' as StudyPlan },
              { label: '14-Day Balanced', sub: 'Steady and thorough', icon: 'calendar', value: '14-day' as StudyPlan },
              { label: '30-Day Mastery', sub: 'Deep learning with full revision', icon: 'trophy', value: '30-day' as StudyPlan },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionCard, plan === opt.value && styles.optionCardSelected]}
                onPress={() => setPlan(opt.value)}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={24}
                  color={plan === opt.value ? COLORS.primary : COLORS.textSecondary}
                  style={{ marginRight: SPACING.sm }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.optionCardText,
                      plan === opt.value && styles.optionCardTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text style={styles.optionCardSub}>{opt.sub}</Text>
                </View>
                {plan === opt.value && (
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backButton} onPress={back}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: COLORS.secondary }]} onPress={finish}>
              <Text style={styles.primaryButtonText}>Start Studying</Text>
              <Ionicons name="checkmark" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  progressContainer: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  stepContainer: { flex: 1 },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  appName: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 26,
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  disclaimerBold: { fontWeight: '600', color: COLORS.text },
  stepTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  stepSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  optionGroup: { gap: SPACING.sm, marginBottom: SPACING.xl },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EBF5FB',
  },
  optionCardText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionCardTextSelected: { color: COLORS.primary },
  optionCardSub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  backButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});
