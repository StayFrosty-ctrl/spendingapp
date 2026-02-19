import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Sprout } from 'lucide-react-native';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';

const MESSAGES = [
  "Love it!",
  "One more day of awareness.",
  "Your grove is grateful.",
  "Nice. See you tomorrow.",
];

interface CheckInAckNoSpendProps {
  onContinue: () => void;
}

export default function CheckInAckNoSpend({ onContinue }: CheckInAckNoSpendProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const message = useMemo(
    () => MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    []
  );

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.container}
    >
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 100 }}
        style={styles.iconWrap}
      >
        <View style={styles.iconCircle}>
          <Sprout size={64} color={colors.sage} strokeWidth={1.5} />
        </View>
      </MotiView>
      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 200 }}
      >
        <Text style={styles.message}>{message}</Text>
      </MotiView>
      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 400 }}
        style={styles.buttonWrap}
      >
        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.buttonText}>See my streak</Text>
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrap: {
      marginBottom: spacing.screenPaddingLg,
    },
    iconCircle: {
      backgroundColor: colors.sage + '33',
      padding: spacing.xl,
      borderRadius: radius.full,
    },
    message: {
      fontFamily: fonts.heading,
      fontSize: 24,
      color: colors.umber,
      textAlign: 'center',
      marginBottom: spacing.xl,
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
  });
}
