import React, { useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';

interface CelebrationProps {
  streak: number;
  onContinue: () => void;
}

export default function Celebration({ streak, onContinue }: CelebrationProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  useEffect(() => {
    if (streak <= 2) {
      const t = setTimeout(onContinue, 3000);
      return () => clearTimeout(t);
    }
  }, [streak, onContinue]);

  const getMessage = () => {
    if (streak === 1) return "Another day in the grove!";
    if (streak === 3) return "Three days! You're a sapling now!";
    if (streak === 7) return "A whole week! Taking root!";
    if (streak === 14) return "Two weeks! Flourishing!";
    if (streak === 30) return "30 days! You're a mighty oak!";
    return "Another day in the grove!";
  };

  const getEmoji = () => {
    if (streak >= 30) return '🌳';
    if (streak >= 14) return '🌿';
    if (streak >= 7) return '🌱';
    if (streak >= 3) return '🌿';
    return '🍃';
  };

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <MotiView
          from={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={styles.iconWrap}
        >
          <LinearGradient
            colors={[colors.sage, colors.terracotta]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Sparkles size={80} color={colors.cream} strokeWidth={1.5} fill={colors.cream} />
          </LinearGradient>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 400 }}
        >
          <Text style={styles.title}>{getMessage()}</Text>
          <Text style={styles.emoji}>{getEmoji()}</Text>
        </MotiView>

        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 600 }}
          style={styles.streakCard}
        >
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 800 }}
        >
          <Text style={styles.message}>
            You're building awareness and making progress. Keep growing! 🌿
          </Text>
        </MotiView>
      </View>

      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 1000 }}
        style={styles.buttonWrap}
      >
        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.buttonText}>Back to my grove</Text>
        </Pressable>
      </MotiView>

      {streak <= 2 && (
        <Text style={styles.hint}>Tap anywhere or wait to continue</Text>
      )}
    </MotiView>
  );
}

function makeStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.screenPaddingLg,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    iconWrap: {
      marginBottom: spacing.screenPaddingLg,
    },
    iconCircle: {
      overflow: 'hidden',
      borderRadius: radius.full,
    },
    iconCircleInner: {},
    title: {
      fontFamily: fonts.heading,
      fontSize: 36,
      color: colors.umber,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    emoji: {
      fontSize: 60,
      textAlign: 'center',
      marginBottom: spacing.screenPaddingLg,
    },
    streakCard: {
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      padding: spacing.xl,
      marginBottom: spacing.screenPaddingLg,
      alignItems: 'center',
    },
    streakNumber: {
      fontFamily: fonts.heading,
      fontSize: 48,
      color: colors.sage,
      marginBottom: spacing.sm,
    },
    streakLabel: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
    },
    message: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
      maxWidth: 384,
    },
    buttonWrap: {
      width: '100%',
      maxWidth: 384,
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
    hint: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.gray,
      marginTop: spacing.lg,
    },
  });
}
