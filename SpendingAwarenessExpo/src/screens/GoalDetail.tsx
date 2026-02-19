import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, PiggyBank, Wallet } from 'lucide-react-native';
import type { Goal, NoSpendGoal, SaveByDateGoal, BudgetCapGoal } from '../types';
import { isNoSpendGoal, isSaveByDateGoal, isBudgetCapGoal } from '../types';
import { getTodayLocalDateString } from '../types';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';
import StreakVisualization from '../components/StreakVisualization';
import PaperCollageBackground from '../components/PaperCollageBackground';

interface GoalDetailProps {
  goal: Goal;
  onBack: () => void;
  onCheckIn: () => void;
  onLogPurchase: () => void;
  onLogSavings: () => void;
}

function getBudgetSpentInCurrentPeriod(goal: BudgetCapGoal): number {
  const now = new Date();
  let periodStart: Date;
  let periodEnd: Date;
  if (goal.period === 'week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    periodStart = new Date(now.getFullYear(), now.getMonth(), diff);
    periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + 7);
  } else {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  return goal.purchases
    .filter((p) => {
      const d = new Date(p.date);
      return d >= periodStart && d < periodEnd;
    })
    .reduce((s, p) => s + p.amount, 0);
}

export default function GoalDetail({ goal, onBack, onCheckIn, onLogPurchase, onLogSavings }: GoalDetailProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const today = getTodayLocalDateString();
  const hasCheckedInToday = isNoSpendGoal(goal) && goal.lastCheckInDate === today;

  return (
    <View style={styles.container}>
      <PaperCollageBackground />
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn} android_ripple={{ color: colors.sand }}>
          <ChevronLeft size={24} color={colors.umber} strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {goal.name}
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isNoSpendGoal(goal) && (
          <>
            <MotiView
              from={{ translateY: 10, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 100 }}
              style={styles.streakCard}
            >
              <StreakVisualization
                currentStreak={goal.currentStreak}
                bestStreak={goal.bestStreak}
                monthlyNoSpendDays={0}
                streakLabel={`days without ${goal.categoryLabel || goal.name} spending`}
              />
            </MotiView>
            <MotiView
              from={{ translateY: 20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 200 }}
              style={styles.ctaWrap}
            >
              {hasCheckedInToday ? (
                <View style={styles.ctaPlaceholder}>
                  <Text style={styles.ctaPlaceholderText}>See you tomorrow</Text>
                </View>
              ) : (
                <Pressable
                  onPress={onCheckIn}
                  style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]}
                  android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  <LinearGradient
                    colors={[colors.terracotta, colors.sage]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.ctaText}>Quick check-in</Text>
                </Pressable>
              )}
              <Pressable
                onPress={onLogPurchase}
                style={({ pressed }) => [styles.ctaSecondary, pressed && styles.ctaPressed]}
                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
              >
                <Text style={styles.ctaSecondaryText}>I spent — log it</Text>
              </Pressable>
            </MotiView>
          </>
        )}

        {isSaveByDateGoal(goal) && (
          <>
            <MotiView
              from={{ translateY: 10, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 100 }}
              style={styles.progressCard}
            >
              <View style={styles.progressHeader}>
                <PiggyBank size={28} color={colors.golden} strokeWidth={1.5} />
                <Text style={styles.progressTitle}>Savings progress</Text>
              </View>
              <Text style={styles.progressValue}>
                ${goal.savings.reduce((s, e) => s + e.amount, 0).toFixed(2)} / ${goal.targetAmount.toFixed(2)}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(
                        100,
                        (goal.savings.reduce((s, e) => s + e.amount, 0) / goal.targetAmount) * 100
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>By {goal.endDate}</Text>
            </MotiView>
            <MotiView
              from={{ translateY: 20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 200 }}
              style={styles.ctaWrap}
            >
              <Pressable
                onPress={onLogSavings}
                style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                <LinearGradient
                  colors={[colors.terracotta, colors.sage]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.ctaText}>Log savings</Text>
              </Pressable>
            </MotiView>
          </>
        )}

        {isBudgetCapGoal(goal) && (() => {
          const spent = getBudgetSpentInCurrentPeriod(goal);
          return (
          <>
            <MotiView
              from={{ translateY: 10, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 100 }}
              style={styles.progressCard}
            >
              <View style={styles.progressHeader}>
                <Wallet size={28} color={colors.terracotta} strokeWidth={1.5} />
                <Text style={styles.progressTitle}>
                  Spending {goal.period === 'week' ? 'this week' : 'this month'}
                </Text>
              </View>
              <Text style={styles.progressValue}>
                ${spent.toFixed(2)} / ${goal.limitAmount.toFixed(2)}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${Math.min(100, (spent / goal.limitAmount) * 100)}%` },
                  ]}
                />
              </View>
            </MotiView>
            <MotiView
              from={{ translateY: 20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 200 }}
              style={styles.ctaWrap}
            >
              <Pressable
                onPress={onLogPurchase}
                style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                <LinearGradient
                  colors={[colors.terracotta, colors.sage]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.ctaText}>Log purchase</Text>
              </Pressable>
            </MotiView>
          </>
          );
        })()}
      </ScrollView>
    </View>
  );
}

function makeStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.screenPadding,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.sand,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
      marginLeft: -4,
    },
    backText: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.umber,
      marginLeft: 4,
    },
    headerTitle: {
      flex: 1,
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.umber,
      textAlign: 'center',
      marginHorizontal: spacing.lg,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.screenPadding,
      paddingBottom: 80,
    },
    streakCard: {
      marginBottom: spacing.xl,
    },
    ctaWrap: {
      gap: spacing.lg,
    },
    ctaPlaceholder: {
      paddingVertical: spacing.lg,
      alignItems: 'center',
    },
    ctaPlaceholderText: {
      fontFamily: fonts.body,
      fontSize: 15,
      color: colors.gray,
    },
    ctaButton: {
      overflow: 'hidden',
      borderRadius: radius.lg,
      paddingVertical: spacing.lg,
      shadowColor: colors.umber,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 4,
    },
    ctaSecondary: {
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      paddingVertical: spacing.lg,
      alignItems: 'center',
    },
    ctaPressed: {
      opacity: 0.97,
    },
    ctaText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.cream,
      textAlign: 'center',
    },
    ctaSecondaryText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.umber,
    },
    progressCard: {
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      shadowColor: colors.umber,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 2,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    progressTitle: {
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.umber,
    },
    progressValue: {
      fontFamily: fonts.heading,
      fontSize: 28,
      color: colors.umber,
      marginBottom: spacing.md,
    },
    progressTrack: {
      height: 8,
      backgroundColor: colors.cream,
      borderRadius: radius.full,
      overflow: 'hidden',
      marginBottom: spacing.sm,
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.sage,
      borderRadius: radius.full,
    },
    progressLabel: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
    },
  });
}
