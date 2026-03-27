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
import { TOPICS } from '../data/topics';
import { LESSONS } from '../data/lessons';
import { FLASHCARDS } from '../data/flashcards';
import { QUESTIONS } from '../data/questions';
import { TopicId } from '../types';

interface Props {
  navigation: any;
  route: { params: { topicId: TopicId } };
}

export default function TopicDetailScreen({ navigation, route }: Props) {
  const { topicId } = route.params;
  const topic = TOPICS.find((t) => t.id === topicId)!;
  const lessons = LESSONS.filter((l) => l.topicId === topicId).sort((a, b) => a.order - b.order);
  const flashcards = FLASHCARDS.filter((f) => f.topicId === topicId);
  const questions = QUESTIONS.filter((q) => q.topicId === topicId);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(lessons[0]?.id ?? null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: topic.color }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Ionicons name={topic.icon as any} size={48} color="rgba(255,255,255,0.9)" />
        <Text style={styles.heroTitle}>{topic.title}</Text>
        <Text style={styles.heroSub}>{topic.description}</Text>

        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{lessons.length}</Text>
            <Text style={styles.heroStatLabel}>Lessons</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{questions.length}</Text>
            <Text style={styles.heroStatLabel}>Questions</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{flashcards.length}</Text>
            <Text style={styles.heroStatLabel}>Flashcards</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: topic.color }]}
            onPress={() =>
              navigation.navigate('Quiz', { topicId, mode: 'topic' })
            }
          >
            <Ionicons name="help-circle" size={20} color={topic.color} />
            <Text style={[styles.actionBtnText, { color: topic.color }]}>Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: topic.color }]}
            onPress={() => navigation.navigate('Flashcards', { topicId })}
            testID="topic-flashcards-btn"
          >
            <Ionicons name="layers" size={20} color={topic.color} />
            <Text style={[styles.actionBtnText, { color: topic.color }]}>Flashcards</Text>
          </TouchableOpacity>
        </View>

        {/* Lessons */}
        <Text style={styles.sectionTitle}>Lessons</Text>
        {lessons.map((lesson) => (
          <View key={lesson.id} style={styles.lessonCard}>
            <TouchableOpacity
              style={styles.lessonHeader}
              onPress={() =>
                setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)
              }
            >
              <View style={[styles.lessonNumberBadge, { backgroundColor: topic.color }]}>
                <Text style={styles.lessonNumberText}>{lesson.order}</Text>
              </View>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Ionicons
                name={expandedLesson === lesson.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>

            {expandedLesson === lesson.id && (
              <View style={styles.lessonBody}>
                <Text style={styles.lessonSummary}>{lesson.summary}</Text>
                <Text style={styles.keyPointsTitle}>Key Points</Text>
                {lesson.keyPoints.map((point, i) => (
                  <View key={i} style={styles.keyPointRow}>
                    <View style={[styles.bullet, { backgroundColor: topic.color }]} />
                    <Text style={styles.keyPointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Flashcard preview */}
        {flashcards.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Flashcards ({flashcards.length})</Text>
            <TouchableOpacity
              style={[styles.previewCard, { borderColor: topic.color }]}
              onPress={() => navigation.navigate('Flashcards', { topicId })}
            >
              <View style={[styles.previewIcon, { backgroundColor: topic.color + '22' }]}>
                <Ionicons name="layers" size={24} color={topic.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewTitle}>Practise with Flashcards</Text>
                <Text style={styles.previewSub}>
                  {flashcards.length} cards • Swipe to review
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </>
        )}

        {/* Values notice */}
        {topicId === 'australian-values' && (
          <View style={styles.valuesNotice}>
            <Ionicons name="warning" size={18} color={COLORS.warning} />
            <Text style={styles.valuesNoticeText}>
              <Text style={{ fontWeight: '700' }}>Important: </Text>
              Values questions are critical in the real test. You must answer at least 3 of 5 values
              questions correctly to pass. Failing this threshold means failing the whole test.
            </Text>
          </View>
        )}
      </View>

      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 8,
    paddingBottom: SPACING.xl,
    alignItems: 'flex-start',
  },
  backBtn: {
    marginBottom: SPACING.md,
    padding: 4,
  },
  heroTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  heroSub: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: '100%',
    justifyContent: 'space-around',
  },
  heroStat: { alignItems: 'center' },
  heroStatValue: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.white },
  heroStatLabel: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)' },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  content: { padding: SPACING.lg },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.xs,
  },
  actionBtnText: { fontWeight: '700', fontSize: FONTS.sizes.md },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  lessonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  lessonNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },
  lessonTitle: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  lessonBody: {
    padding: SPACING.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  lessonSummary: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  keyPointsTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  keyPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xs + 2,
  },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  keyPointText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text },
  previewSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  valuesNotice: {
    flexDirection: 'row',
    backgroundColor: '#FEF9E7',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#F9E79F',
    gap: SPACING.sm,
    alignItems: 'flex-start',
    marginTop: SPACING.sm,
  },
  valuesNoticeText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
});
