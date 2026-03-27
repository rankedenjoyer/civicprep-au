import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { QUESTIONS } from '../data/questions';
import { FLASHCARDS } from '../data/flashcards';
import { TOPICS } from '../data/topics';

interface Props {
  navigation: any;
}

type Tab = 'mistakes' | 'bookmarks' | 'history';

export default function ReviewScreen({ navigation }: Props) {
  const { progress, toggleBookmarkQuestion } = useApp();
  const [tab, setTab] = useState<Tab>('mistakes');

  const bookmarkedQs = QUESTIONS.filter((q) =>
    progress?.bookmarkedQuestions.includes(q.id)
  );

  const mistakeQs = QUESTIONS.filter((q) => {
    const stats = progress?.questionStats[q.id];
    if (!stats || stats.attempts === 0) return false;
    return stats.correct / stats.attempts < 0.6;
  });

  const mockResults = progress?.mockTestResults ?? [];

  const renderQuestion = (q: typeof QUESTIONS[0]) => {
    const stats = progress?.questionStats[q.id];
    const accuracy = stats ? Math.round((stats.correct / stats.attempts) * 100) : null;
    const topic = TOPICS.find((t) => t.id === q.topicId);

    return (
      <View key={q.id} style={styles.questionCard}>
        <View style={styles.questionMeta}>
          {q.isValuesQuestion && (
            <View style={styles.valuesBadge}>
              <Ionicons name="heart" size={10} color={COLORS.topicValues} />
              <Text style={styles.valuesBadgeText}>Values</Text>
            </View>
          )}
          {topic && (
            <View style={[styles.topicBadge, { backgroundColor: topic.color + '22' }]}>
              <Text style={[styles.topicBadgeText, { color: topic.color }]}>
                {topic.shortTitle}
              </Text>
            </View>
          )}
          {accuracy !== null && (
            <Text
              style={[
                styles.accuracyText,
                { color: accuracy >= 70 ? COLORS.success : COLORS.error },
              ]}
            >
              {accuracy}% correct
            </Text>
          )}
          <TouchableOpacity
            style={styles.bookmarkBtn}
            onPress={() => toggleBookmarkQuestion(q.id)}
          >
            <Ionicons name="bookmark" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.questionText}>{q.text}</Text>
        <Text style={styles.correctAnswer}>
          ✓ {q.options[q.correctIndex]}
        </Text>
        <Text style={styles.explanationText}>{q.explanation}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review</Text>
        <Text style={styles.headerSub}>Mistakes, bookmarks, and history</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {([['mistakes', 'Mistakes'], ['bookmarks', 'Bookmarks'], ['history', 'History']] as const).map(
          ([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.tab, tab === key && styles.tabActive]}
              onPress={() => setTab(key)}
            >
              <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
                {label}
              </Text>
              {key === 'mistakes' && mistakeQs.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{mistakeQs.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          )
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* MISTAKES */}
        {tab === 'mistakes' && (
          <>
            {mistakeQs.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
                <Text style={styles.emptyTitle}>No mistakes yet</Text>
                <Text style={styles.emptyText}>
                  Answer some questions first. Questions with less than 60% accuracy will appear here.
                </Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => navigation.navigate('Practice')}
                >
                  <Text style={styles.emptyBtnText}>Start Practising</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.sectionInfo}>
                  {mistakeQs.length} questions with low accuracy — focus here to improve
                </Text>
                <TouchableOpacity
                  style={styles.practiceAllBtn}
                  onPress={() =>
                    navigation.navigate('Quiz', { mode: 'random10' })
                  }
                >
                  <Ionicons name="refresh" size={18} color={COLORS.primary} />
                  <Text style={styles.practiceAllBtnText}>Practice These Questions</Text>
                </TouchableOpacity>
                {mistakeQs.map(renderQuestion)}
              </>
            )}
          </>
        )}

        {/* BOOKMARKS */}
        {tab === 'bookmarks' && (
          <>
            {bookmarkedQs.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bookmark-outline" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyTitle}>No bookmarks yet</Text>
                <Text style={styles.emptyText}>
                  Tap the bookmark icon on any question to save it for later review.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionInfo}>
                  {bookmarkedQs.length} bookmarked question{bookmarkedQs.length !== 1 ? 's' : ''}
                </Text>
                {bookmarkedQs.map(renderQuestion)}
              </>
            )}
          </>
        )}

        {/* HISTORY */}
        {tab === 'history' && (
          <>
            {mockResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color={COLORS.textMuted} />
                <Text style={styles.emptyTitle}>No tests taken yet</Text>
                <Text style={styles.emptyText}>
                  Complete a mock test to see your history here.
                </Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => navigation.navigate('Practice')}
                >
                  <Text style={styles.emptyBtnText}>Take a Mock Test</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.sectionInfo}>
                  {mockResults.length} mock test{mockResults.length !== 1 ? 's' : ''} completed
                </Text>
                {mockResults.map((result) => (
                  <View
                    key={result.id}
                    style={[
                      styles.historyCard,
                      { borderColor: result.passed ? COLORS.success : COLORS.error },
                    ]}
                  >
                    <View style={styles.historyHeader}>
                      <Ionicons
                        name={result.passed ? 'checkmark-circle' : 'close-circle'}
                        size={22}
                        color={result.passed ? COLORS.success : COLORS.error}
                      />
                      <Text
                        style={[
                          styles.historyStatus,
                          { color: result.passed ? COLORS.success : COLORS.error },
                        ]}
                      >
                        {result.passed ? 'Passed' : 'Not Passed'}
                      </Text>
                      <Text style={styles.historyDate}>
                        {new Date(result.date).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                    <View style={styles.historyStats}>
                      <View style={styles.historyStat}>
                        <Text style={styles.historyStatValue}>
                          {result.score}/{result.total}
                        </Text>
                        <Text style={styles.historyStatLabel}>Score</Text>
                      </View>
                      <View style={styles.historyStat}>
                        <Text style={styles.historyStatValue}>
                          {Math.round((result.score / result.total) * 100)}%
                        </Text>
                        <Text style={styles.historyStatLabel}>Accuracy</Text>
                      </View>
                      <View style={styles.historyStat}>
                        <Text style={styles.historyStatValue}>
                          {result.valuesScore}/{result.valuesTotal}
                        </Text>
                        <Text style={styles.historyStatLabel}>Values</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary },
  tabBadge: {
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  content: { flex: 1, padding: SPACING.lg },
  sectionInfo: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  practiceAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '44',
  },
  practiceAllBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: FONTS.sizes.sm },
  questionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  valuesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EEF8',
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  valuesBadgeText: { fontSize: 10, fontWeight: '600', color: COLORS.topicValues },
  topicBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  topicBadgeText: { fontSize: 10, fontWeight: '600' },
  accuracyText: { fontSize: FONTS.sizes.xs, fontWeight: '700', marginLeft: 'auto' as any },
  bookmarkBtn: { padding: 2 },
  questionText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  correctAnswer: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  explanationText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxl, gap: SPACING.sm },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  emptyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    marginTop: SPACING.sm,
  },
  emptyBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  historyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  historyStatus: { flex: 1, fontWeight: '700', fontSize: FONTS.sizes.md },
  historyDate: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  historyStats: { flexDirection: 'row', justifyContent: 'space-around' },
  historyStat: { alignItems: 'center' },
  historyStatValue: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text },
  historyStatLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
});
