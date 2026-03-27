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
import { LESSONS } from '../data/lessons';
import { useApp } from '../context/AppContext';

interface Props {
  navigation: any;
  route: any;
}

export default function StudyScreen({ navigation }: Props) {
  const { progress } = useApp();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Topics</Text>
        <Text style={styles.headerSub}>
          Based on the official "Our Common Bond" booklet
        </Text>
      </View>

      <View style={styles.content}>
        {TOPICS.map((topic) => {
          const topicLessons = LESSONS.filter((l) => l.topicId === topic.id);
          const topicProgress = progress?.topicProgress[topic.id] ?? 0;

          return (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicCard}
              onPress={() =>
                navigation.navigate('TopicDetail', { topicId: topic.id })
              }
            >
              {/* Header row */}
              <View style={[styles.topicCardHeader, { backgroundColor: topic.color }]}>
                <Ionicons name={topic.icon as any} size={28} color={COLORS.white} />
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.topicCardTitle}>{topic.title}</Text>
                </View>
                <View style={styles.progressChip}>
                  <Text style={[styles.progressChipText, { color: topic.color }]}>
                    {topicProgress}%
                  </Text>
                </View>
              </View>

              {/* Body */}
              <View style={styles.topicCardBody}>
                <Text style={styles.topicDescription}>{topic.description}</Text>

                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${topicProgress}%`, backgroundColor: topic.color },
                    ]}
                  />
                </View>

                {/* Lesson count */}
                <View style={styles.topicMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="book-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.metaText}>{topicLessons.length} lessons</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="help-circle-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.metaText}>
                      {topic.id === 'australian-values' ? 'Values questions' : 'Practice quiz'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.studyBtn, { backgroundColor: topic.color }]}
                  onPress={() =>
                    navigation.navigate('TopicDetail', { topicId: topic.id })
                  }
                >
                  <Text style={styles.studyBtnText}>
                    {topicProgress === 0 ? 'Start Studying' : 'Continue'}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
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
  headerSub: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  content: { padding: SPACING.lg, gap: SPACING.md },
  topicCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  topicCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  topicCardTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  progressChip: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  progressChipText: { fontSize: FONTS.sizes.sm, fontWeight: '700' },
  topicCardBody: { padding: SPACING.md },
  topicDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressBarFill: { height: '100%', borderRadius: RADIUS.full },
  topicMeta: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  studyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.xs,
  },
  studyBtnText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
});
