import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Settings as SettingsIcon, TrendingDown, TrendingUp } from 'lucide-react-native';
import type { UserData } from '../types';
import { getTodayLocalDateString } from '../types';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';
import StreakVisualization from '../components/StreakVisualization';

interface HomeProps {
  userData: UserData;
  onCheckIn: () => void;
  onLogPurchase: () => void;
  onSettings: () => void;
}

export default function Home({ userData, onCheckIn, onLogPurchase, onSettings }: HomeProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const today = getTodayLocalDateString();
  const hasCheckedInToday = userData.lastCheckInDate === today;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getThisWeekSpending = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return userData.purchases
      .filter((p) => new Date(p.date) >= weekAgo)
      .reduce((sum, p) => sum + p.amount, 0);
  };
  const getLastWeekSpending = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    return userData.purchases
      .filter((p) => {
        const d = new Date(p.date);
        return d >= twoWeeksAgo && d < weekAgo;
      })
      .reduce((sum, p) => sum + p.amount, 0);
  };
  const getMonthlySpending = () => {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return userData.purchases
      .filter((p) => new Date(p.date) >= firstOfMonth)
      .reduce((sum, p) => sum + p.amount, 0);
  };
  const getLastMonthSpending = () => {
    const now = new Date();
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return userData.purchases
      .filter((p) => {
        const d = new Date(p.date);
        return d >= firstOfLastMonth && d < firstOfThisMonth;
      })
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const thisWeek = getThisWeekSpending();
  const lastWeek = getLastWeekSpending();
  const thisMonth = getMonthlySpending();
  const lastMonth = getLastMonthSpending();
  const weekDifference = thisWeek - lastWeek;

  const formatDate = () =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

  const progressWidth = Math.min((thisMonth / (lastMonth || 100)) * 100, 100);

  return (
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
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 100 }}
        style={styles.streakCard}
      >
        <StreakVisualization
          currentStreak={userData.currentStreak}
          bestStreak={userData.bestStreak}
          monthlyNoSpendDays={userData.monthlyNoSpendDays}
        />
      </MotiView>

      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 200 }}
        style={styles.card}
      >
        <View style={styles.twoCol}>
          <View>
            <Text style={styles.cardLabel}>This week</Text>
            <Text style={styles.cardValue}>${thisWeek.toFixed(2)}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>Last week</Text>
            <Text style={styles.cardValue}>${lastWeek.toFixed(2)}</Text>
          </View>
        </View>
        {weekDifference !== 0 && (
          <View style={[styles.trendRow, weekDifference < 0 && styles.trendPositive]}>
            {weekDifference < 0 ? (
              <>
                <TrendingDown size={16} color={weekDifference < 0 ? colors.sage : colors.gray} strokeWidth={2} />
                <Text style={styles.trendText}>
                  You're spending ${Math.abs(weekDifference).toFixed(2)} less this week 🌿
                </Text>
              </>
            ) : (
              <>
                <TrendingUp size={16} color={colors.gray} strokeWidth={2} />
                <Text style={styles.trendText}>
                  That's ${weekDifference.toFixed(2)} more than last week - you've got this
                </Text>
              </>
            )}
          </View>
        )}
        {weekDifference === 0 && thisWeek > 0 && (
          <Text style={styles.cardLabel}>Holding steady</Text>
        )}
      </MotiView>

      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 300 }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>Monthly Overview</Text>
        <View style={styles.monthBlock}>
          <Text style={styles.cardLabel}>This month</Text>
          <Text style={styles.cardValueLarge}>${thisMonth.toFixed(2)}</Text>
        </View>
        <View style={styles.monthRow}>
          <Text style={styles.cardLabel}>vs ${lastMonth.toFixed(2)} last month</Text>
          {thisMonth < lastMonth && (
            <Text style={styles.positiveText}>-${(lastMonth - thisMonth).toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progressWidth}%` }]} />
        </View>
      </MotiView>

      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 400 }}
        style={styles.ctaWrap}
      >
        {hasCheckedInToday ? (
          <View style={styles.ctaPlaceholder}>
            <Text style={styles.ctaPlaceholderText}>See you tomorrow 🌿</Text>
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
            <Text style={styles.ctaText}>Quick check-in 🌱</Text>
          </Pressable>
        )}
      </MotiView>

      <View style={styles.fabSpacer} />

      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'timing', duration: 400, delay: 600 }}
        style={styles.fabWrap}
      >
        <Pressable
          onPress={onLogPurchase}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <Plus size={24} color={colors.cream} strokeWidth={2.5} />
        </Pressable>
      </MotiView>
    </ScrollView>
  );
}

function makeStyles(colors: Palette) {
  return StyleSheet.create({
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
    streakCard: {
      marginHorizontal: spacing.screenPadding,
      marginBottom: spacing.xl,
    },
    card: {
      marginHorizontal: spacing.screenPadding,
      marginBottom: spacing.xl,
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      padding: spacing.xl,
      shadowColor: colors.umber,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 2,
    },
    twoCol: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    cardLabel: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      marginBottom: 4,
    },
    cardValue: {
      fontFamily: fonts.heading,
      fontSize: 24,
      color: colors.umber,
    },
    cardValueLarge: {
      fontFamily: fonts.heading,
      fontSize: 30,
      color: colors.umber,
    },
    cardTitle: {
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.umber,
      marginBottom: spacing.lg,
    },
    trendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    trendPositive: {},
    trendText: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
    },
    monthBlock: {
      marginBottom: spacing.lg,
    },
    monthRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    positiveText: {
      fontFamily: fonts.headingMedium,
      fontSize: 14,
      color: colors.sage,
    },
    progressTrack: {
      marginTop: spacing.lg,
      height: 8,
      backgroundColor: colors.cream,
      borderRadius: radius.full,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.sage,
      borderRadius: radius.full,
    },
    ctaWrap: {
      marginHorizontal: spacing.screenPadding,
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
    ctaPressed: {
      opacity: 0.97,
    },
    ctaText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.cream,
      textAlign: 'center',
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
