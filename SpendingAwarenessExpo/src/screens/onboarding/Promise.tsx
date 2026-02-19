import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Bell, Eye, TrendingDown } from 'lucide-react-native';
import type { Palette } from '../../theme';
import { useTheme, spacing, radius, fonts } from '../../theme';

interface PromiseProps {
  onNext: () => void;
}

const steps = [
  { icon: Bell, label: 'Gentle notification' },
  { icon: Eye, label: 'Quick check-in' },
  { icon: TrendingDown, label: 'Build awareness' },
];

export default function PromiseScreen({ onNext }: PromiseProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 100 }}
        >
          <Text style={styles.title}>
            One question.{'\n'}Once or twice a day.
          </Text>
        </MotiView>
        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 200 }}
        >
          <Text style={styles.subtitle}>
            We'll gently check in on the goals you set. You'll build awareness without tracking every penny.
          </Text>
        </MotiView>

        <View style={styles.stepsRow}>
          {steps.map((step, index) => (
            <MotiView
              key={step.label}
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 300 + index * 150 }}
              style={styles.step}
            >
              <View style={styles.stepIconWrap}>
                <step.icon size={32} color={colors.terracotta} strokeWidth={1.5} />
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </MotiView>
          ))}
        </View>
      </View>

      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 800 }}
      >
        <Pressable
          onPress={onNext}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.buttonText}>Sounds good</Text>
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
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
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
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
      marginBottom: spacing.xl,
      maxWidth: 384,
      lineHeight: 24,
    },
    stepsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xl,
      marginBottom: spacing.screenPaddingLg,
    },
    step: {
      alignItems: 'center',
    },
    stepIconWrap: {
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    stepLabel: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      textAlign: 'center',
      maxWidth: 80,
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
