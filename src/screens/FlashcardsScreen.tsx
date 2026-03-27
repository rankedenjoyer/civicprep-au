import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { FLASHCARDS, getFlashcardsByTopic } from '../data/flashcards';
import { TOPICS } from '../data/topics';
import { useApp } from '../context/AppContext';
import { TopicId } from '../types';

interface Props {
  navigation: any;
  route: { params?: { topicId?: TopicId; hardOnly?: boolean } };
}

const { width } = Dimensions.get('window');

export default function FlashcardsScreen({ navigation, route }: Props) {
  const { topicId, hardOnly } = route.params ?? {};
  const { toggleHardCard, isHardCard, progress } = useApp();

  const buildCards = () => {
    if (hardOnly && progress) {
      return FLASHCARDS.filter((f) => progress.hardFlashcards.includes(f.id));
    }
    if (topicId) return getFlashcardsByTopic(topicId);
    return FLASHCARDS;
  };

  const [cards] = useState(buildCards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const flipAnim = useState(new Animated.Value(0))[0];

  const topic = topicId ? TOPICS.find((t) => t.id === topicId) : null;
  const color = topic?.color ?? COLORS.primary;

  const flip = () => {
    const toValue = flipped ? 0 : 1;
    Animated.spring(flipAnim, {
      toValue,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
    setFlipped(!flipped);
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const next = () => {
    if (index < cards.length - 1) {
      setIndex((i) => i + 1);
      Animated.timing(flipAnim, { toValue: 0, duration: 0, useNativeDriver: true }).start();
      setFlipped(false);
    } else {
      setDone(true);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      Animated.timing(flipAnim, { toValue: 0, duration: 0, useNativeDriver: true }).start();
      setFlipped(false);
    }
  };

  const current = cards[index];

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="layers-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.emptyTitle}>No flashcards here</Text>
        <Text style={styles.emptyText}>
          {hardOnly ? 'No hard cards marked yet. Mark cards as hard while studying.' : 'No cards for this topic.'}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (done) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', padding: SPACING.lg }]}>
        <Ionicons name="checkmark-circle" size={72} color={COLORS.success} />
        <Text style={styles.doneTitle}>All done!</Text>
        <Text style={styles.doneSub}>You reviewed all {cards.length} flashcards.</Text>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: COLORS.primary, marginTop: SPACING.xl }]}
          onPress={() => {
            setIndex(0);
            setDone(false);
            setFlipped(false);
            Animated.timing(flipAnim, { toValue: 0, duration: 0, useNativeDriver: true }).start();
          }}
        >
          <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md }}>
            Review Again
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, { borderWidth: 2, borderColor: COLORS.primary, marginTop: SPACING.sm }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: FONTS.sizes.md }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!current) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: color }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {topic?.shortTitle ?? 'All Flashcards'}
        </Text>
        <Text style={styles.headerCount}>
          {index + 1} / {cards.length}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((index + 1) / cards.length) * 100}%`, backgroundColor: color },
          ]}
        />
      </View>

      <View style={styles.cardContainer}>
        {/* Hint */}
        <Text style={styles.hint}>Tap card to reveal answer</Text>

        {/* Flip card */}
        <TouchableOpacity onPress={flip} activeOpacity={0.95} style={styles.cardWrapper}>
          {/* Front */}
          <Animated.View
            style={[
              styles.card,
              { borderColor: color },
              { transform: [{ rotateY: frontRotate }], backfaceVisibility: 'hidden' },
              flipped && { position: 'absolute' },
            ]}
          >
            <View style={[styles.cardLabel, { backgroundColor: color + '22' }]}>
              <Text style={[styles.cardLabelText, { color }]}>QUESTION</Text>
            </View>
            <Text style={styles.cardText}>{current.front}</Text>
          </Animated.View>

          {/* Back */}
          <Animated.View
            style={[
              styles.card,
              { borderColor: color, backgroundColor: color + '11' },
              {
                transform: [{ rotateY: backRotate }],
                backfaceVisibility: 'hidden',
              },
              !flipped && { position: 'absolute', opacity: 0 },
            ]}
          >
            <View style={[styles.cardLabel, { backgroundColor: color }]}>
              <Text style={[styles.cardLabelText, { color: COLORS.white }]}>ANSWER</Text>
            </View>
            <Text style={[styles.cardText, { color }]}>{current.back}</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.prevBtn} onPress={prev} disabled={index === 0}>
            <Ionicons
              name="arrow-back-circle"
              size={40}
              color={index === 0 ? COLORS.border : COLORS.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.hardBtn, isHardCard(current.id) && { backgroundColor: COLORS.error + '22' }]}
            onPress={() => toggleHardCard(current.id)}
            testID="flashcard-hard-btn"
          >
            <Ionicons
              name={isHardCard(current.id) ? 'flag' : 'flag-outline'}
              size={18}
              color={isHardCard(current.id) ? COLORS.error : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.hardBtnText,
                { color: isHardCard(current.id) ? COLORS.error : COLORS.textSecondary },
              ]}
            >
              {isHardCard(current.id) ? 'Marked hard' : 'Mark as hard'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={next} testID="flashcard-next">
            <Ionicons name="arrow-forward-circle" size={40} color={color} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const CARD_WIDTH = width - SPACING.lg * 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 8,
  },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },
  headerCount: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  progressBar: { height: 3, backgroundColor: COLORS.border, overflow: 'hidden' },
  progressFill: { height: '100%' },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  hint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: 280,
    marginBottom: SPACING.xl,
  },
  card: {
    width: CARD_WIDTH,
    height: 280,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  cardLabel: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
    marginBottom: SPACING.md,
  },
  cardLabelText: { fontSize: FONTS.sizes.xs, fontWeight: '800', letterSpacing: 1 },
  cardText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  prevBtn: { padding: 4 },
  hardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hardBtnText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.text, marginTop: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 22 },
  backButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  backButtonText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
  doneTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text, marginTop: SPACING.md },
  doneSub: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: SPACING.sm },
  navBtn: {
    width: '100%',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
});
