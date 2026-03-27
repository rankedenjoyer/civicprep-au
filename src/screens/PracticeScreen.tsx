import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { TOPICS } from '../data/topics';
import { useApp } from '../context/AppContext';

interface Props {
  navigation: any;
}

export default function PracticeScreen({ navigation }: Props) {
  const { progress } = useApp();
  const mockResults = progress?.mockTestResults ?? [];
  const lastResult = mockResults[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice</Text>
        <Text style={styles.headerSub}>Choose your practice mode</Text>
      </View>

      <View style={styles.content}>
        {/* Main modes */}
        <Text style={styles.sectionTitle}>Test Formats</Text>

        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('MockTest')}
        >
          <View style={styles.mainCardIcon}>
            <Ionicons name="newspaper" size={32} color={COLORS.white} />
          </View>
          <View style={styles.mainCardText}>
            <Text style={styles.mainCardTitle}>Official-Style Mock Test</Text>
            <Text style={styles.mainCardSub}>
              20 questions • Timed • Real pass/fail scoring
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: COLORS.topicValues }]}
          onPress={() => navigation.push('Quiz', { mode: 'values' })}
        >
          <View style={styles.mainCardIcon}>
            <Ionicons name="heart" size={32} color={COLORS.white} />
          </View>
          <View style={styles.mainCardText}>
            <Text style={styles.mainCardTitle}>Values Questions Only</Text>
            <Text style={styles.mainCardSub}>
              Critical pass/fail questions • Focus practice
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainCard, { backgroundColor: COLORS.secondary }]}
          onPress={() => navigation.push('Quiz', { mode: 'random10' })}
        >
          <View style={styles.mainCardIcon}>
            <Ionicons name="shuffle" size={32} color={COLORS.white} />
          </View>
          <View style={styles.mainCardText}>
            <Text style={styles.mainCardTitle}>Random 10 Questions</Text>
            <Text style={styles.mainCardSub}>Mixed topics • Quick practice</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* Topic quizzes */}
        <Text style={styles.sectionTitle}>Practice by Topic</Text>
        {TOPICS.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicCard}
            testID={`practice-topic-${topic.id}`}
            onPress={() =>
              navigation.push('Quiz', { topicId: topic.id, mode: 'topic' })
            }
          >
            <View style={[styles.topicIcon, { backgroundColor: topic.color + '22' }]}>
              <Ionicons name={topic.icon as any} size={22} color={topic.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.topicCardTitle}>{topic.shortTitle}</Text>
              <Text style={styles.topicCardSub}>10 questions</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}

        {/* All flashcards */}
        <Text style={styles.sectionTitle}>Flashcards</Text>
        <TouchableOpacity
          style={styles.topicCard}
          onPress={() => navigation.push('Flashcards', {})}
        >
          <View style={[styles.topicIcon, { backgroundColor: COLORS.primary + '22' }]}>
            <Ionicons name="layers" size={22} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.topicCardTitle}>All Flashcards</Text>
            <Text style={styles.topicCardSub}>All topics combined</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.topicCard}
          testID="practice-hard-flashcards"
          onPress={() => navigation.push('Flashcards', { hardOnly: true })}
        >
          <View style={[styles.topicIcon, { backgroundColor: COLORS.error + '22' }]}>
            <Ionicons name="flag" size={22} color={COLORS.error} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.topicCardTitle}>Hard Flashcards</Text>
            <Text style={styles.topicCardSub}>Cards you marked as hard</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Quick cram */}
        <Text style={styles.sectionTitle}>Quick Cram</Text>
        <View style={styles.cramCard}>
          <View style={styles.cramHeader}>
            <Ionicons name="flash" size={24} color={COLORS.accent} />
            <Text style={styles.cramTitle}>Last-Day Cram Mode</Text>
          </View>
          <Text style={styles.cramText}>
            Test soon? Use these for a fast, focused revision session.
          </Text>
          <View style={styles.cramRow}>
            <TouchableOpacity
              style={styles.cramBtn}
              onPress={() => navigation.push('MockTest', { cramMode: true })}
            >
              <Ionicons name="time" size={16} color={COLORS.primary} />
              <Text style={styles.cramBtnText}>10-min Mock</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cramBtn}
              onPress={() => navigation.push('Quiz', { mode: 'values' })}
            >
              <Ionicons name="heart" size={16} color={COLORS.topicValues} />
              <Text style={styles.cramBtnText}>Values Only</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Previous results */}
        {lastResult && (
          <>
            <Text style={styles.sectionTitle}>Last Mock Test</Text>
            <View
              style={[
                styles.resultCard,
                { borderColor: lastResult.passed ? COLORS.success : COLORS.error },
              ]}
            >
              <View style={styles.resultCardHeader}>
                <Ionicons
                  name={lastResult.passed ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={lastResult.passed ? COLORS.success : COLORS.error}
                />
                <Text
                  style={[
                    styles.resultCardTitle,
                    { color: lastResult.passed ? COLORS.success : COLORS.error },
                  ]}
                >
                  {lastResult.passed ? 'Passed' : 'Not Passed'}
                </Text>
                <Text style={styles.resultCardDate}>
                  {new Date(lastResult.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.resultCardScore}>
                {lastResult.score}/{lastResult.total} ({Math.round((lastResult.score / lastResult.total) * 100)}%)
              </Text>
              <Text style={styles.resultCardValues}>
                Values: {lastResult.valuesScore}/{lastResult.valuesTotal}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.white },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  content: { padding: SPACING.lg },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  mainCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  mainCardIcon: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCardText: { flex: 1 },
  mainCardTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  mainCardSub: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicCardTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  topicCardSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  cramCard: {
    backgroundColor: '#FEF9E7',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F9E79F',
    marginBottom: SPACING.sm,
  },
  cramHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  cramTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  cramText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.md, lineHeight: 20 },
  cramRow: { flexDirection: 'row', gap: SPACING.sm },
  cramBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cramBtnText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 2,
    marginBottom: SPACING.sm,
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  resultCardTitle: { flex: 1, fontWeight: '700', fontSize: FONTS.sizes.md },
  resultCardDate: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  resultCardScore: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text },
  resultCardValues: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
});
