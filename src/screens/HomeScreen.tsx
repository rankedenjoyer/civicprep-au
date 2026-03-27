import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';

interface Props {
  navigation: any;
}

export default function HomeScreen({ navigation }: Props) {
  const { profile, progress, getAccuracy, getReadinessScore } = useApp();

  const readiness = getReadinessScore();
  const accuracy = getAccuracy();
  const streak = progress?.streak ?? 0;
  const totalAnswered = progress?.totalQuestionsAnswered ?? 0;
  const mockCount = progress?.mockTestResults?.length ?? 0;

  const weekTopics = TOPICS.slice(0, 3);

  const getWeakestTopic = () => {
    if (!progress) return null;
    const entries = Object.entries(progress.topicProgress);
    if (entries.every(([, v]) => v === 0)) return null;
    return entries.reduce((a, b) => (a[1] < b[1] ? a : b))[0];
  };

  const weakestTopicId = getWeakestTopic();
  const weakestTopic = TOPICS.find((t) => t.id === weakestTopicId);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day!</Text>
          <Text style={styles.headerSub}>Ready to practise?</Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={18} color="#F39C12" />
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>

      {/* Readiness Score */}
      <View style={styles.readinessCard}>
        <View style={styles.readinessLeft}>
          <Text style={styles.readinessLabel}>Readiness Score</Text>
          <Text style={styles.readinessScore}>{readiness}%</Text>
          <Text style={styles.readinessHint}>
            {readiness < 40
              ? 'Keep studying — you\'re building momentum'
              : readiness < 70
              ? 'Good progress! Keep practising'
              : 'Great work! Almost test-ready'}
          </Text>
        </View>
        <View style={styles.readinessCircle}>
          <Text style={styles.readinessCircleText}>{readiness}</Text>
          <Text style={styles.readinessCircleSub}>/ 100</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          <Text style={styles.statValue}>{accuracy}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="help-circle" size={24} color={COLORS.primaryLight} />
          <Text style={styles.statValue}>{totalAnswered}</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={24} color={COLORS.accent} />
          <Text style={styles.statValue}>{mockCount}</Text>
          <Text style={styles.statLabel}>Mock Tests</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Practice</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('Practice', { screen: 'MockTest' })}
        >
          <Ionicons name="newspaper" size={28} color={COLORS.white} />
          <Text style={styles.quickCardText}>Full Mock Test</Text>
          <Text style={styles.quickCardSub}>20 questions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: COLORS.topicValues }]}
          onPress={() => navigation.navigate('Practice', { screen: 'Quiz', params: { mode: 'values' } })}
          testID="home-quick-values-focus"
        >
          <Ionicons name="heart" size={28} color={COLORS.white} />
          <Text style={styles.quickCardText}>Values Focus</Text>
          <Text style={styles.quickCardSub}>Critical questions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: COLORS.secondary }]}
          onPress={() => navigation.navigate('Study')}
        >
          <Ionicons name="book" size={28} color={COLORS.white} />
          <Text style={styles.quickCardText}>Study Topics</Text>
          <Text style={styles.quickCardSub}>4 topics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: COLORS.topicGovernment }]}
          onPress={() => navigation.navigate('Review')}
        >
          <Ionicons name="star" size={28} color={COLORS.white} />
          <Text style={styles.quickCardText}>Review</Text>
          <Text style={styles.quickCardSub}>Bookmarks & mistakes</Text>
        </TouchableOpacity>
      </View>

      {/* Weak area alert */}
      {weakestTopic && totalAnswered > 5 && (
        <TouchableOpacity
          style={styles.alertCard}
          onPress={() =>
            navigation.navigate('Study', {
              screen: 'TopicDetail',
              params: { topicId: weakestTopicId },
            })
          }
        >
          <View style={styles.alertIcon}>
            <Ionicons name="warning" size={20} color={COLORS.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Weak Area Detected</Text>
            <Text style={styles.alertText}>
              Focus on <Text style={styles.alertBold}>{weakestTopic.shortTitle}</Text> to
              improve your score
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}

      {/* Today's topics */}
      <Text style={styles.sectionTitle}>Topics to Study</Text>
      {TOPICS.map((topic) => {
        const topicProgress = progress?.topicProgress[topic.id] ?? 0;
        return (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicRow}
            onPress={() =>
              navigation.navigate('Study', {
                screen: 'TopicDetail',
                params: { topicId: topic.id },
              })
            }
          >
            <View style={[styles.topicIcon, { backgroundColor: topic.color + '22' }]}>
              <Ionicons name={topic.icon as any} size={22} color={topic.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.topicRowTitle}>{topic.shortTitle}</Text>
              <View style={styles.miniProgressBar}>
                <View
                  style={[
                    styles.miniProgressFill,
                    { width: `${topicProgress}%`, backgroundColor: topic.color },
                  ]}
                />
              </View>
            </View>
            <Text style={[styles.topicPercent, { color: topic.color }]}>
              {topicProgress}%
            </Text>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.white },
  headerSub: { fontSize: FONTS.sizes.md, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    gap: 4,
  },
  streakText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  readinessCard: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    marginTop: -1,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  readinessLeft: { flex: 1 },
  readinessLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm },
  readinessScore: { color: COLORS.white, fontSize: 40, fontWeight: '800', marginVertical: 2 },
  readinessHint: { color: 'rgba(255,255,255,0.75)', fontSize: FONTS.sizes.sm, lineHeight: 18 },
  readinessCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readinessCircleText: { color: COLORS.white, fontSize: FONTS.sizes.xl, fontWeight: '800' },
  readinessCircleSub: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
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
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickCard: {
    width: '48%',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: 4,
  },
  quickCardText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  quickCardSub: { color: 'rgba(255,255,255,0.75)', fontSize: FONTS.sizes.xs },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F9E79F',
    gap: SPACING.sm,
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF9E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text },
  alertText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  alertBold: { fontWeight: '700', color: COLORS.text },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
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
  topicRowTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  miniProgressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  miniProgressFill: { height: '100%', borderRadius: RADIUS.full },
  topicPercent: { fontSize: FONTS.sizes.sm, fontWeight: '700', minWidth: 36, textAlign: 'right' },
});
