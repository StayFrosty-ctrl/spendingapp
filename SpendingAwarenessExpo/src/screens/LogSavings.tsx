import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MotiView } from 'moti';
import { PiggyBank } from 'lucide-react-native';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';

interface LogSavingsProps {
  goalName: string;
  onSubmit: (amount: number) => void;
  onCancel: () => void;
}

export default function LogSavings({ goalName, onSubmit, onCancel }: LogSavingsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (num > 0) onSubmit(num);
  };

  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') setAmount(value);
  };

  const isValid = amount && parseFloat(amount) > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 100 }}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <View style={styles.iconWrap}>
              <PiggyBank size={24} color={colors.golden} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Log savings</Text>
          </View>
          <Text style={styles.subtitle}>{`How much did you add to "${goalName}"?`}</Text>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 200 }}
          style={styles.amountBlock}
        >
          <Text style={styles.label}>Amount saved ($)</Text>
          <View style={styles.amountRow}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              placeholderTextColor={colors.gray}
              keyboardType="decimal-pad"
              style={styles.amountInput}
            />
          </View>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 300 }}
          style={styles.buttons}
        >
          <Pressable
            onPress={handleSubmit}
            disabled={!isValid}
            style={({ pressed }) => [styles.buttonPrimary, (!isValid || pressed) && styles.buttonDisabled]}
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <Text style={styles.buttonPrimaryText}>Save</Text>
          </Pressable>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonPressed]}
            android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
          >
            <Text style={styles.buttonSecondaryText}>Cancel</Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.screenPaddingLg,
      paddingBottom: 80,
    },
    header: {
      marginBottom: spacing.xl,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    iconWrap: {
      backgroundColor: colors.golden + '33',
      padding: spacing.md,
      borderRadius: radius.lg,
    },
    title: {
      fontFamily: fonts.heading,
      fontSize: 24,
      color: colors.umber,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
    },
    amountBlock: {
      marginBottom: spacing.xl,
    },
    label: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      marginBottom: 8,
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.lg,
    },
    dollar: {
      fontFamily: fonts.heading,
      fontSize: 24,
      color: colors.gray,
    },
    amountInput: {
      flex: 1,
      fontFamily: fonts.heading,
      fontSize: 24,
      color: colors.umber,
      paddingVertical: spacing.lg,
      paddingLeft: spacing.sm,
    },
    buttons: {
      gap: spacing.lg,
    },
    buttonPrimary: {
      backgroundColor: colors.terracotta,
      paddingVertical: spacing.lg,
      borderRadius: radius.lg,
      alignItems: 'center',
      shadowColor: colors.umber,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonPressed: {
      opacity: 0.97,
    },
    buttonPrimaryText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.cream,
    },
    buttonSecondary: {
      backgroundColor: colors.sand,
      paddingVertical: spacing.lg,
      borderRadius: radius.lg,
      alignItems: 'center',
    },
    buttonSecondaryText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.umber,
    },
  });
}
