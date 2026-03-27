import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, RADIUS } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { clearAllData } from '../utils/storage';
import { QUESTIONS } from '../data/questions';

const OFFICIAL_LINKS = [
  {
    label: 'Official Citizenship Test Info',
    url: 'https://immi.homeaffairs.gov.au/citizenship/test-and-interview/learn-about-citizenship-interview-and-test',
    icon: 'globe',
  },
  {
    label: 'Download "Our Common Bond" Booklet',
    url: 'https://immi.homeaffairs.gov.au/citizenship/test-and-interview/our-common-bond',
    icon: 'document',
  },
  {
    label: 'Official Practice Test',
    url: 'https://immi.homeaffairs.gov.au/citizenship/test-and-interview/prepare-for-test/practice-test-new',
    icon: 'help-circle',
  },
];

interface Props {
  navigation: any;
}

export default function ProfileScreen({ navigation }: Props) {
  const { profile, progress, getAccuracy, getReadinessScore } = useApp();
  const [showResetModal, setShowResetModal] = useState(false);

  const totalBookmarks = progress?.bookmarkedQuestions.length ?? 0;
  const totalMocks = progress?.mockTestResults?.length ?? 0;
  const passedMocks = progress?.mockTestResults?.filter((r) => r.passed).length ?? 0;
  const accuracy = getAccuracy();
  const readiness = getReadinessScore();
  const streak = progress?.streak ?? 0;
  const totalAnswered = progress?.totalQuestionsAnswered ?? 0;
  const hardCards = progress?.hardFlashcards.length ?? 0;

  const planLabel = () => {
    switch (profile?.studyPlan) {
      case '7-day': return '7-Day Cram Plan';
      case '14-day': return '14-Day Balanced Plan';
      case '30-day': return '30-Day Mastery Plan';
      default: return 'Not set';
    }
  };

  const handleReset = () => setShowResetModal(true);

  const confirmReset = async () => {
    await clearAllData();
    setShowResetModal(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={COLORS.white} />
        </View>
        <View>
          <Text style={styles.headerName}>My Profile</Text>
          <Text style={styles.headerPlan}>{planLabel()}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {[
          { icon: 'flash', label: 'Readiness', value: `${readiness}%`, color: COLORS.primary },
          { icon: 'flame', label: 'Streak', value: `${streak} days`, color: COLORS.accent },
          { icon: 'checkmark-circle', label: 'Accuracy', value: `${accuracy}%`, color: COLORS.success },
          { icon: 'help-circle', label: 'Answered', value: `${totalAnswered}`, color: COLORS.primaryLight },
          { icon: 'newspaper', label: 'Mock Tests', value: `${totalMocks}`, color: COLORS.topicGovernment },
          { icon: 'trophy', label: 'Tests Passed', value: `${passedMocks}`, color: COLORS.secondary },
        ].map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={22} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Study settings summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Settings</Text>
        <View style={styles.settingsCard}>
          {[
            { label: 'Study Plan', value: planLabel(), icon: 'calendar' },
            { label: 'Daily Goal', value: `${profile?.dailyMinutes ?? 15} minutes`, icon: 'time' },
            { label: 'English Level', value: profile?.englishLevel ?? 'intermediate', icon: 'language' },
            { label: 'Bookmarked', value: `${totalBookmarks} questions`, icon: 'bookmark' },
            { label: 'Hard Flashcards', value: `${hardCards} cards`, icon: 'flag' },
          ].map((item) => (
            <View key={item.label} style={styles.settingRow}>
              <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={styles.settingValue}>{item.value}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('Onboarding')}
        >
          <Ionicons name="create-outline" size={16} color={COLORS.primary} />
          <Text style={styles.editBtnText}>Edit preferences</Text>
        </TouchableOpacity>
      </View>

      {/* Official Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Official Resources</Text>
        <View style={styles.disclaimerBox}>
          <Ionicons name="information-circle" size={18} color={COLORS.primaryLight} />
          <Text style={styles.disclaimerText}>
            CivicPrep AU is an independent study companion and is{' '}
            <Text style={{ fontWeight: '700' }}>not affiliated with</Text> or endorsed
            by the Australian Government or the Department of Home Affairs.
          </Text>
        </View>
        {OFFICIAL_LINKS.map((link) => (
          <TouchableOpacity
            key={link.label}
            style={styles.linkCard}
            onPress={() => Linking.openURL(link.url)}
          >
            <View style={styles.linkIcon}>
              <Ionicons name={link.icon as any} size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.linkText}>{link.label}</Text>
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>
            All questions in this app are based on the official{' '}
            <Text style={{ fontWeight: '700' }}>"Australian Citizenship: Our Common Bond"</Text>{' '}
            booklet published by the Australian Government Department of Home Affairs.
          </Text>
          <Text style={[styles.aboutText, { marginTop: SPACING.sm }]}>
            Content is regularly reviewed for accuracy. If you spot an error, please
            contact us.
          </Text>
          <Text style={styles.version}>Version 1.0.0 • CivicPrep AU</Text>
        </View>
      </View>

      {/* Danger zone */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          <Text style={styles.resetBtnText}>Reset All Progress</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: SPACING.xxl }} />

      {/* Reset confirmation modal */}
      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Reset All Data?</Text>
            <Text style={styles.modalText}>
              This will erase all your progress, bookmarks, and test history. This cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowResetModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalResetBtn} onPress={confirmReset}>
                <Text style={styles.modalResetText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerName: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.white },
  headerPlan: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  statCard: {
    width: '31%',
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
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, textAlign: 'center' },
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  settingLabel: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text },
  settingValue: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.sm,
  },
  editBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: FONTS.sizes.sm },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  linkCard: {
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
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.text },
  aboutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  aboutText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  version: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
  },
  resetBtnText: { color: COLORS.error, fontWeight: '700', fontSize: FONTS.sizes.md },
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
    lineHeight: 22,
  },
  modalButtons: { flexDirection: 'row', gap: SPACING.sm },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalCancelText: { color: COLORS.text, fontWeight: '700', fontSize: FONTS.sizes.md },
  modalResetBtn: {
    flex: 1,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalResetText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.md },
});
