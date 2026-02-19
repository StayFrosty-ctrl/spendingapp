import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { BellRing } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import type { Palette } from '../../theme';
import { useTheme, spacing, radius, fonts } from '../../theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldSetBadge: false,
  }),
});

interface NotificationPermissionProps {
  onNext: () => void;
}

export default function NotificationPermission({ onNext }: NotificationPermissionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const handleEnable = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        // Could schedule local reminders here based on check-in times
      }
    } catch (_) {}
    onNext();
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 200 }}
          style={styles.heroWrap}
        >
          <LinearGradient
            colors={[colors.terracotta, colors.sage]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <MotiView
              from={{ opacity: 0.3, scale: 1 }}
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
              transition={{ type: 'timing', duration: 2000, loop: true }}
              style={StyleSheet.absoluteFill}
            >
              <View style={styles.glow} />
            </MotiView>
            <BellRing size={80} color={colors.cream} strokeWidth={1.5} style={styles.heroIcon} />
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ type: 'timing', duration: 500, delay: 500 }}
              style={styles.badge}
            />
          </LinearGradient>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 400 }}
        >
          <Text style={styles.title}>
            Stay on track with{'\n'}gentle nudges
          </Text>
          <Text style={styles.subtitle}>
            We'll only send your check-in reminders. Nothing else. Ever.
          </Text>
        </MotiView>
      </View>

      <View style={styles.buttons}>
        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 600 }}
        >
          <Pressable
            onPress={handleEnable}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <Text style={styles.buttonText}>Enable notifications</Text>
          </Pressable>
        </MotiView>
        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 700 }}
        >
          <Pressable onPress={onNext} style={styles.buttonSecondary}>
            <Text style={styles.buttonSecondaryText}>Maybe later</Text>
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
      justifyContent: 'space-between',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroWrap: {
      marginBottom: spacing.xl,
    },
    heroGradient: {
      padding: 48,
      borderRadius: radius.xl,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    glow: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.golden,
      borderRadius: radius.xl,
    },
    heroIcon: {
      zIndex: 1,
    },
    badge: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.dustyRose,
      borderWidth: 4,
      borderColor: colors.cream,
    },
    title: {
      fontFamily: fonts.heading,
      fontSize: 30,
      color: colors.umber,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
      maxWidth: 384,
      lineHeight: 24,
    },
    buttons: {
      gap: spacing.md,
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
    buttonSecondary: {
      paddingVertical: 12,
      borderRadius: radius.lg,
    },
    buttonSecondaryText: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
    },
  });
}
