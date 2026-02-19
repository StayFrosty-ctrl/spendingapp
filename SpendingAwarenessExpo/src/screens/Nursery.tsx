import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Plus, Settings as SettingsIcon, Sprout, PiggyBank, Wallet } from 'lucide-react-native';
import type { UserData, Goal } from '../types';
import { isNoSpendGoal, isSaveByDateGoal, isBudgetCapGoal } from '../types';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';
import PaperCollageBackground from '../components/PaperCollageBackground';

interface NurseryProps {
  userData: UserData;
  onSelectGoal: (goalId: string) => void;
  onCreateGoal: () => void;
  onSettings: () => void;
}

function getGoalProgressLine(goal: Goal): string {
  if (isNoSpendGoal(goal)) {
    return goal.currentStreak === 0
      ? 'No streak yet'
      : `${goal.currentStreak} day${goal.currentStreak !== 1 ? 's' : ''} no spend`;
  }
  if (isSaveByDateGoal(goal)) {
    const saved = goal.savings.reduce((s, e) => s + e.amount, 0);
    return `$${saved.toFixed(0)} / $${goal.targetAmount.toFixed(0)} saved`;
  }
  if (isBudgetCapGoal(goal)) {
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
    const inPeriod = goal.purchases.filter((p) => {
      const d = new Date(p.date);
      return d >= periodStart && d < periodEnd;
    });
    const spent = inPeriod.reduce((s, p) => s + p.amount, 0);
    const label = goal.period === 'week' ? 'this week' : 'this month';
    return `$${spent.toFixed(0)} / $${goal.limitAmount.toFixed(0)} ${label}`;
  }
  return '';
}

function GoalTypeIcon({ goal, colors }: { goal: Goal; colors: Palette }) {
  if (isNoSpendGoal(goal)) return <Sprout size={20} color={colors.sage} strokeWidth={1.5} />;
  if (isSaveByDateGoal(goal)) return <PiggyBank size={20} color={colors.golden} strokeWidth={1.5} />;
  return <Wallet size={20} color={colors.terracotta} strokeWidth={1.5} />;
}

export default function Nursery({ userData, onSelectGoal, onCreateGoal, onSettings }: NurseryProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const goals = userData.goals || [];
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  const formatDate = () =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

  return (
    <View style={styles.container}>
      <PaperCollageBackground />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {userData.userName}
            </Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
          <Pressable onPress={onSettings} style={styles.settingsBtn} android_ripple={{ color: colors.sand }}>
            <SettingsIcon size={24} color={colors.gray} strokeWidth={1.5} />
          </Pressable>
        </View>

        <MotiView
          from={{ translateY: 10, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 100 }}
          style={styles.titleWrap}
        >
          <Text style={styles.title}>Nursery</Text>
          <Text style={styles.subtitle}>Your goals and growth</Text>
        </MotiView>

        {goals.length === 0 ? (
          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 200 }}
            style={styles.emptyWrap}
          >
            <View style={styles.emptyIconWrap}>
              <Sprout size={48} color={colors.sage} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>Plant your first seed</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button below to create a spending or savings goal. We'll help you grow with gentle check-ins.
            </Text>
          </MotiView>
        ) : (
          goals.map((goal, index) => (
            <MotiView
              key={goal.id}
              from={{ translateY: 20, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 200 + index * 80 }}
              style={styles.cardWrap}
            >
              <Pressable
                onPress={() => onSelectGoal(goal.id)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                android_ripple={{ color: colors.sand }}
              >
                <View style={styles.cardRow}>
                  <View style={styles.cardIconWrap}>
                    <GoalTypeIcon goal={goal} colors={colors} />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardName}>{goal.name}</Text>
                    <Text style={styles.cardProgress}>{getGoalProgressLine(goal)}</Text>
                  </View>
                </View>
              </Pressable>
            </MotiView>
          ))
        )}

        <View style={styles.fabSpacer} />
      </ScrollView>

      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'timing', duration: 400, delay: 400 }}
        style={styles.fabWrap}
      >
        <Pressable
          onPress={onCreateGoal}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <Plus size={24} color={colors.cream} strokeWidth={2.5} />
        </Pressable>
      </MotiView>
    </View>
  );
}

function makeStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 120,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: spacing.screenPadding,
      paddingBottom: spacing.lg,
    },
    greeting: {
      fontFamily: fonts.heading,
      fontSize: 24,
      color: colors.umber,
    },
    date: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      marginTop: 4,
    },
    settingsBtn: {
      padding: 12,
      borderRadius: radius.full,
    },
    titleWrap: {
      marginHorizontal: spacing.screenPadding,
      marginBottom: spacing.xl,
    },
    title: {
      fontFamily: fonts.heading,
      fontSize: 28,
      color: colors.umber,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.gray,
      marginTop: 4,
    },
    emptyWrap: {
      marginHorizontal: spacing.screenPadding,
      alignItems: 'center',
      paddingVertical: spacing['2xl'],
    },
    emptyIconWrap: {
      backgroundColor: colors.sage + '33',
      padding: spacing.xl,
      borderRadius: radius.full,
      marginBottom: spacing.xl,
    },
    emptyTitle: {
      fontFamily: fonts.heading,
      fontSize: 22,
      color: colors.umber,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
      lineHeight: 24,
      maxWidth: 320,
    },
    cardWrap: {
      marginHorizontal: spacing.screenPadding,
      marginBottom: spacing.lg,
    },
    card: {
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      padding: spacing.xl,
      shadowColor: colors.umber,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 2,
    },
    cardPressed: {
      opacity: 0.97,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.cream,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.lg,
    },
    cardText: {
      flex: 1,
    },
    cardName: {
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.umber,
    },
    cardProgress: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      marginTop: 4,
    },
    fabSpacer: {
      height: 80,
    },
    fabWrap: {
      position: 'absolute',
      bottom: spacing.screenPaddingLg,
      right: spacing.screenPaddingLg,
    },
    fab: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.terracotta,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.terracotta,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 32,
      elevation: 8,
    },
    fabPressed: {
      opacity: 0.9,
    },
  });
}
