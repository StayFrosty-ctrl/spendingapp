import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Sun, Moon, Clock } from 'lucide-react-native';
import type { Palette } from '../../theme';
import { useTheme, spacing, radius, fonts } from '../../theme';

interface CheckInTimeProps {
  checkInTimes: {
    morning: boolean;
    evening: boolean;
    customTime?: string;
  };
  onUpdate: (times: { morning: boolean; evening: boolean; customTime?: string }) => void;
  onNext: () => void;
}

export default function CheckInTime({ checkInTimes, onUpdate, onNext }: CheckInTimeProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [showCustomTime, setShowCustomTime] = useState(!!checkInTimes.customTime);
  const [customTime, setCustomTime] = useState(checkInTimes.customTime || '20:00');

  const toggleMorning = () => onUpdate({ ...checkInTimes, morning: !checkInTimes.morning });
  const toggleEvening = () => onUpdate({ ...checkInTimes, evening: !checkInTimes.evening });
  const handleCustomTime = () => {
    setShowCustomTime(true);
    onUpdate({ ...checkInTimes, customTime });
  };

  const isCustomSelected = showCustomTime && customTime;
  const isAnySelected = checkInTimes.morning || checkInTimes.evening || isCustomSelected;

  const cardStyle = (selected: boolean) => [
    styles.card,
    selected && styles.cardSelected,
  ];

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
          style={styles.header}
        >
          <Text style={styles.title}>When should we check in?</Text>
          <Text style={styles.subtitle}>
            Most impulse purchases happen at night. Choose what works for you.
          </Text>
        </MotiView>

        <View style={styles.cards}>
          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 200 }}
          >
            <Pressable
              onPress={toggleMorning}
              style={cardStyle(checkInTimes.morning)}
              android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            >
              <View style={[styles.cardIcon, checkInTimes.morning && styles.cardIconSelected]}>
                <Sun size={24} color={checkInTimes.morning ? colors.cream : colors.terracotta} strokeWidth={1.5} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, checkInTimes.morning && styles.cardTitleSelected]}>Morning (9 AM)</Text>
                <Text style={[styles.cardSub, checkInTimes.morning && styles.cardSubSelected]}>Reflect on yesterday</Text>
              </View>
            </Pressable>
          </MotiView>

          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 300 }}
          >
            <Pressable
              onPress={toggleEvening}
              style={cardStyle(checkInTimes.evening)}
              android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            >
              <View style={[styles.cardIcon, checkInTimes.evening && styles.cardIconSelected]}>
                <Moon size={24} color={checkInTimes.evening ? colors.cream : colors.terracotta} strokeWidth={1.5} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, checkInTimes.evening && styles.cardTitleSelected]}>Evening (8 PM)</Text>
                <Text style={[styles.cardSub, checkInTimes.evening && styles.cardSubSelected]}>Catch yourself before checkout</Text>
              </View>
            </Pressable>
          </MotiView>

          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 400 }}
          >
            <Pressable
              onPress={handleCustomTime}
              style={cardStyle(showCustomTime)}
              android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            >
              <View style={[styles.cardIcon, showCustomTime && styles.cardIconSelected]}>
                <Clock size={24} color={showCustomTime ? colors.cream : colors.terracotta} strokeWidth={1.5} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, showCustomTime && styles.cardTitleSelected]}>Custom time</Text>
                {showCustomTime && (
                  <TextInput
                    value={customTime}
                    onChangeText={(t) => {
                      setCustomTime(t);
                      onUpdate({ ...checkInTimes, customTime: t });
                    }}
                    placeholder="20:00"
                    placeholderTextColor={colors.muted}
                    style={styles.timeInput}
                  />
                )}
              </View>
            </Pressable>
          </MotiView>
        </View>
      </View>

      <MotiView
        from={{ translateY: 20, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 300, delay: 600 }}
      >
        <Pressable
          onPress={onNext}
          disabled={!isAnySelected}
          style={[styles.button, !isAnySelected && styles.buttonDisabled]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
        >
          <Text style={[styles.buttonText, !isAnySelected && styles.buttonTextDisabled]}>
            Set my check-ins
          </Text>
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
      width: '100%',
    },
    header: {
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
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
      maxWidth: 384,
      lineHeight: 24,
    },
    cards: {
      width: '100%',
      maxWidth: 384,
      gap: spacing.lg,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.sand,
      padding: spacing.xl,
      borderRadius: radius.lg,
      marginBottom: spacing.lg,
    },
    cardSelected: {
      backgroundColor: colors.terracotta,
      shadowColor: colors.terracotta,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 4,
    },
    cardIcon: {
      backgroundColor: colors.cream,
      padding: spacing.md,
      borderRadius: radius.full,
      marginRight: spacing.lg,
    },
    cardIconSelected: {
      backgroundColor: colors.muted,
    },
    cardText: {
      flex: 1,
    },
    cardTitle: {
      fontFamily: fonts.headingSemi,
      fontSize: 16,
      color: colors.umber,
      marginBottom: 4,
    },
    cardTitleSelected: {
      color: colors.cream,
    },
    cardSub: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
    },
    cardSubSelected: {
      color: colors.cream,
    },
    timeInput: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.cream,
      backgroundColor: colors.muted,
      paddingHorizontal: spacing.md,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.gray,
      marginTop: 4,
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
    buttonDisabled: {
      backgroundColor: colors.sand,
      shadowOpacity: 0,
      elevation: 0,
    },
    buttonText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.cream,
      textAlign: 'center',
    },
    buttonTextDisabled: {
      color: colors.gray,
    },
  });
}
