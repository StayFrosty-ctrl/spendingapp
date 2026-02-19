import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Svg, { Path } from 'react-native-svg';
import { Sprout } from 'lucide-react-native';
import type { Palette } from '../../theme';
import { useTheme, spacing, radius, fonts } from '../../theme';

interface WelcomeProps {
  onNext: () => void;
}

function BlobSvg({ fill }: { fill: string }) {
  return (
  <Svg viewBox="0 0 200 200" width={256} height={256}>
    <Path
      fill={fill}
      d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.8,76.4C25.8,83.8,8.8,86,-7.8,83.2C-24.4,80.4,-40.6,72.6,-54.2,62.4C-67.8,52.2,-78.8,39.6,-84.4,24.8C-90,10,-90.2,-7,-85.2,-22.8C-80.2,-38.6,-70,-53.2,-56.8,-60.8C-43.6,-68.4,-27.4,-69,-11.8,-69.8C3.8,-70.6,30.6,-83.6,44.7,-76.4Z"
      transform="translate(100 100)"
    />
  </Svg>
  );
}

export default function Welcome({ onNext }: WelcomeProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={styles.heroWrap}
        >
          <View style={styles.blobBg}>
            <BlobSvg fill={colors.sage} />
          </View>
          <View style={styles.iconCircle}>
            <Sprout size={96} color={colors.cream} strokeWidth={1.5} />
          </View>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 400 }}
          style={styles.textBlock}
        >
          <Text style={styles.title}>
            Spend less.{'\n'}Notice more.
          </Text>
          <Text style={styles.subtitle}>
            Grove helps you build awareness around your expenditure — no judgment, just gentle check-ins.
          </Text>
        </MotiView>
      </View>

      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 600 }}
        style={styles.buttonWrap}
      >
        <Pressable
          onPress={onNext}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={styles.buttonText}>Let's grow together</Text>
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
    },
    heroWrap: {
      marginBottom: spacing.xl,
      alignItems: 'center',
    },
    blobBg: {
      position: 'absolute',
      opacity: 0.2,
      transform: [{ scale: 1.5 }],
    },
    iconCircle: {
      backgroundColor: colors.sage,
      padding: spacing.screenPaddingLg,
      borderRadius: radius.full,
    },
    textBlock: {
      alignItems: 'center',
      maxWidth: 384,
    },
    title: {
      fontFamily: fonts.heading,
      fontSize: 36,
      color: colors.umber,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 18,
      color: colors.gray,
      textAlign: 'center',
      lineHeight: 26,
    },
    buttonWrap: {
      width: '100%',
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
