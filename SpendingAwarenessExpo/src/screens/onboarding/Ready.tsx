import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Sparkles } from 'lucide-react-native';
import type { Palette } from '../../theme';
import { useTheme, spacing, radius, fonts } from '../../theme';

interface ReadyProps {
  checkInTimes: {
    morning: boolean;
    evening: boolean;
    customTime?: string;
  };
  onNext: () => void;
}

export default function Ready({ checkInTimes, onNext }: ReadyProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const dotColors = useMemo(
    () => [colors.terracotta, colors.sage, colors.golden, colors.dustyRose],
    [colors]
  );
  const getCheckInTimeText = () => {
    const times: string[] = [];
    if (checkInTimes.morning) times.push('9 AM');
    if (checkInTimes.evening) times.push('8 PM');
    if (checkInTimes.customTime) times.push(checkInTimes.customTime);
    if (times.length === 1) return times[0];
    if (times.length === 2) return `${times[0]} and ${times[1]}`;
    return times.join(', ');
  };

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.container}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <MotiView
          key={i}
          style={[
            styles.dot,
            {
              left: `${Math.random() * 100}%`,
              backgroundColor: dotColors[Math.floor(Math.random() * 4)],
            },
          ]}
        />
      ))}

      <View style={styles.content}>
        <MotiView
          from={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={styles.heroWrap}
        >
          <LinearGradient
            colors={[colors.sage, colors.terracotta]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Sparkles size={64} color={colors.cream} strokeWidth={1.5} fill={colors.cream} />
          </LinearGradient>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 400 }}
        >
          <Text style={styles.title}>Your grove is planted</Text>
          <Text style={styles.emoji}>🌱</Text>
          <Text style={styles.subtitle}>
            Day 1 starts now. We'll check in at {getCheckInTimeText()}.
          </Text>
        </MotiView>

        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 600 }}
          style={styles.quoteCard}
        >
          <Text style={styles.quote}>"No shame, just awareness."</Text>
        </MotiView>
      </View>

      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 800 }}
        style={styles.buttonWrap}
      >
        <Pressable
          onPress={onNext}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.buttonText}>See my grove</Text>
        </Pressable>
      </MotiView>
    </MotiView>
  );
}

function makeStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.screenPaddingLg,
      justifyContent: 'space-between',
      overflow: 'hidden',
    },
    dot: {
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    heroWrap: {
      marginBottom: spacing.screenPaddingLg,
    },
    iconCircle: {
      backgroundColor: colors.terracotta,
      padding: spacing.screenPaddingLg,
      borderRadius: radius.full,
    },
    title: {
      fontFamily: fonts.heading,
      fontSize: 36,
      color: colors.umber,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    emoji: {
      fontSize: 48,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
      maxWidth: 384,
      lineHeight: 24,
    },
    quoteCard: {
      marginTop: spacing.screenPaddingLg,
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      padding: spacing.xl,
      maxWidth: 384,
    },
    quote: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    buttonWrap: {
      zIndex: 10,
    },
    button: {
      backgroundColor: colors.terracotta,
      paddingVertical: spacing.lg,
      borderRadius: radius.lg,
      shadowColor: colors.umber,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 4,
    },
    buttonPressed: {
      opacity: 0.97,
    },
    buttonText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.cream,
      textAlign: 'center',
    },
  });
}
