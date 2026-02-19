import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import Svg, { Path } from 'react-native-svg';
import { Sprout, TreeDeciduous } from 'lucide-react-native';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';

interface StreakVisualizationProps {
  currentStreak: number;
  bestStreak: number;
  monthlyNoSpendDays: number;
  /** Optional label, e.g. "days on track" or "days without [goal name] spending" */
  streakLabel?: string;
}

function BlobSvg({ fill }: { fill: string }) {
  return (
    <Svg viewBox="0 0 200 200" width={256} height={256}>
      <Path
        fill={fill}
        d="M47.1,-78.5C60.1,-71.5,69.3,-56.8,75.8,-41.3C82.3,-25.8,86.1,-9.5,84.8,6.3C83.5,22.1,77.1,37.4,67.8,49.8C58.5,62.2,46.3,71.7,32.4,76.8C18.5,81.9,2.9,82.6,-13.2,80.8C-29.3,79,-45.9,74.7,-58.8,65.2C-71.7,55.7,-80.9,41,-84.5,25.2C-88.1,9.4,-86.1,-7.5,-79.8,-21.9C-73.5,-36.3,-62.9,-48.2,-49.9,-55.1C-36.9,-62,-21.5,-63.9,-5.8,-64.9C9.9,-65.9,34.1,-85.5,47.1,-78.5Z"
        transform="translate(100 100)"
      />
    </Svg>
  );
}

const DEFAULT_STREAK_LABEL = 'days on track';

export default function StreakVisualization({
  currentStreak,
  bestStreak,
  monthlyNoSpendDays,
  streakLabel = DEFAULT_STREAK_LABEL,
}: StreakVisualizationProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const maxRings = 5;
  // Growth graphic (rings, icon, milestone) uses currentStreak so tree resets to leaf when user slips.
  const ringsToShow = Math.min(Math.max(currentStreak, 1), maxRings);
  const rings = Array.from({ length: ringsToShow }, (_, i) => ({
    id: i,
    size: 100 - i * 14,
    opacity: 0.06 + i * 0.06,
  }));

  const getMilestoneMessage = (streak: number) => {
    if (streak >= 30) return "Mighty oak! 🌳";
    if (streak >= 14) return "Flourishing! 🌿";
    if (streak >= 7) return "Taking root! 🌱";
    if (streak >= 3) return "Sapling! 🌿";
    if (streak === 0) return "Ready to grow";
    return "Growing strong! 🌱";
  };

  return (
    <View style={styles.card}>
      <View style={styles.blobBg}>
        <BlobSvg fill={colors.sage} />
      </View>
      <LinearGradient
        colors={[colors.sand, colors.cream]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.inner}>
          {currentStreak === 0 ? (
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'timing', duration: 300 }}
              style={styles.sproutWrap}
            >
              <View style={styles.sproutCircle}>
                <Sprout size={80} color={colors.sage} strokeWidth={1.5} />
              </View>
            </MotiView>
          ) : (
            <View style={styles.ringsWrap}>
              {rings.map((ring, index) => (
                <MotiView
                  key={ring.id}
                  from={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: ring.opacity }}
                  transition={{ type: 'timing', duration: 200, delay: index * 50 }}
                  style={[
                    styles.ring,
                    {
                      width: `${ring.size}%`,
                      height: `${ring.size}%`,
                    },
                  ]}
                />
              ))}
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'timing', duration: 300, delay: 300 }}
                style={styles.centerIcon}
              >
                {currentStreak >= 7 ? (
                  <TreeDeciduous size={64} color={colors.sage} strokeWidth={1.5} />
                ) : (
                  <Sprout size={64} color={colors.sage} strokeWidth={1.5} />
                )}
              </MotiView>
            </View>
          )}

          <MotiView
            from={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 200 }}
            style={styles.streakBlock}
          >
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>{streakLabel}</Text>
          </MotiView>

          <MotiView
            from={{ translateY: 10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 400 }}
            style={styles.milestoneWrap}
          >
            <Text style={styles.milestoneText}>{getMilestoneMessage(currentStreak)}</Text>
          </MotiView>

          <MotiView
            from={{ translateY: 10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 500 }}
            style={styles.statsRow}
          >
            <View style={styles.stat}>
              <Text style={styles.statValue}>{bestStreak}</Text>
              <Text style={styles.statLabel}>Best streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{monthlyNoSpendDays}</Text>
              <Text style={styles.statLabel}>This month</Text>
            </View>
          </MotiView>
        </View>
      </LinearGradient>
    </View>
  );
}

function makeStyles(colors: Palette) {
  return StyleSheet.create({
    card: {
      borderRadius: radius.xl,
      overflow: 'hidden',
      shadowColor: colors.umber,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 32,
      elevation: 4,
    },
    blobBg: {
      position: 'absolute',
      top: 0,
      right: 0,
      opacity: 0.1,
      zIndex: 0,
    },
    gradient: {
      padding: spacing.screenPaddingLg,
      position: 'relative',
      zIndex: 1,
    },
    inner: {
      alignItems: 'center',
    },
    sproutWrap: {
      marginBottom: spacing.xl,
    },
    sproutCircle: {
      backgroundColor: colors.sage + '33',
      padding: spacing.screenPaddingLg,
      borderRadius: radius.full,
    },
    ringsWrap: {
      width: 192,
      height: 192,
      marginBottom: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ring: {
      position: 'absolute',
      borderRadius: radius.full,
      borderWidth: 4,
      borderColor: colors.sage,
    },
    centerIcon: {
      position: 'absolute',
    },
    streakBlock: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    streakNumber: {
      fontFamily: fonts.heading,
      fontSize: 60,
      color: colors.umber,
      marginBottom: spacing.sm,
    },
    streakLabel: {
      fontFamily: fonts.body,
      fontSize: 18,
      color: colors.gray,
    },
    milestoneWrap: {
      backgroundColor: colors.sand,
      paddingHorizontal: spacing.xl,
      paddingVertical: 10,
      borderRadius: radius.full,
      marginBottom: spacing.xl,
    },
    milestoneText: {
      fontFamily: fonts.headingMedium,
      fontSize: 14,
      color: colors.sage,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xl,
    },
    stat: {
      alignItems: 'center',
    },
    statValue: {
      fontFamily: fonts.heading,
      fontSize: 24,
      color: colors.umber,
    },
    statLabel: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.gray,
    },
    statDivider: {
      width: 1,
      height: 24,
      backgroundColor: colors.gray,
      opacity: 0.2,
    },
  });
}
