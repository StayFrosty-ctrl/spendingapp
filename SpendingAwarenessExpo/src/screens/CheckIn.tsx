import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Leaf } from 'lucide-react-native';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';

interface CheckInProps {
  onYes: () => void;
  onNo: () => void;
  /** e.g. "Did you stick to your goal today?" */
  question?: string;
}

export default function CheckIn({ onYes, onNo, question = 'Did you stick to your goal today?' }: CheckInProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
          <Leaf size={64} color={colors.sage} strokeWidth={1.5} />
        </View>
      </MotiView>

      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 200 }}
        style={styles.textBlock}
      >
        <Text style={styles.title}>Quick check-in 🌱</Text>
        <Text style={styles.subtitle}>{question}</Text>
      </MotiView>

      <View style={styles.buttons}>
        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 300 }}
        >
          <Pressable
            onPress={onNo}
            style={({ pressed }) => [styles.buttonPrimary, pressed && styles.buttonPressed]}
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <Text style={styles.buttonPrimaryText}>Nope! 🌿</Text>
          </Pressable>
        </MotiView>
        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 400 }}
        >
          <Pressable
            onPress={onYes}
            style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonPressed]}
            android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
          >
            <Text style={styles.buttonSecondaryText}>Yes</Text>
          </Pressable>
        </MotiView>
      </View>
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
    textBlock: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      fontFamily: fonts.heading,
      fontSize: 30,
      color: colors.umber,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 18,
      color: colors.gray,
      textAlign: 'center',
    },
    buttons: {
      width: '100%',
      maxWidth: 384,
      gap: spacing.lg,
    },
    buttonPrimary: {
      backgroundColor: colors.sage,
      paddingVertical: 20,
      borderRadius: radius.lg,
      shadowColor: colors.sage,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 4,
    },
    buttonSecondary: {
      backgroundColor: colors.sand,
      paddingVertical: 20,
      borderRadius: radius.lg,
    },
    buttonPressed: {
      opacity: 0.97,
    },
    buttonPrimaryText: {
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.cream,
      textAlign: 'center',
    },
    buttonSecondaryText: {
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.umber,
      textAlign: 'center',
    },
  });
}
