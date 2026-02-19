import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MotiView } from 'moti';
import { ShoppingBag } from 'lucide-react-native';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';

interface LogPurchaseProps {
  onSubmit: (amount: number, category?: string) => void;
  onCancel: () => void;
  hadStreak?: number;
}

const CATEGORIES = ['Household', 'Electronics', 'Clothes', 'Food', 'Entertainment', 'Other'];

export default function LogPurchase({ onSubmit, onCancel, hadStreak }: LogPurchaseProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (num > 0) onSubmit(num, selectedCategory);
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
              <ShoppingBag size={24} color={colors.dustyRose} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>No worries - let's log it</Text>
          </View>
          <Text style={styles.subtitle}>
            Awareness is the first step. You're doing great.
          </Text>
          <Text style={styles.groveNote}>Your grove is still growing.</Text>
          {hadStreak != null && hadStreak >= 3 && (
            <MotiView
              from={{ translateY: 10, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 300 }}
              style={styles.streakNote}
            >
              <Text style={styles.streakNoteText}>
                One day doesn't erase your {hadStreak}-day awareness streak. You're building something meaningful.
              </Text>
            </MotiView>
          )}
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: hadStreak && hadStreak >= 3 ? 400 : 200 }}
          style={styles.amountBlock}
        >
          <Text style={styles.label}>How much did you spend?</Text>
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
        >
          <Text style={styles.label}>
            What was it for? <Text style={styles.optional}>(optional)</Text>
          </Text>
          <View style={styles.pills}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(selectedCategory === category ? undefined : category)}
                style={[
                  styles.pill,
                  selectedCategory === category && styles.pillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedCategory === category && styles.pillTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </MotiView>

        <View style={styles.actions}>
          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 600 }}
          >
            <Pressable
              onPress={handleSubmit}
              disabled={!isValid}
              style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
            >
              <Text style={[styles.submitBtnText, !isValid && styles.submitBtnTextDisabled]}>
                Log it
              </Text>
            </Pressable>
          </MotiView>
          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 700 }}
          >
            <Pressable onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </MotiView>
        </View>
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
      paddingBottom: 40,
    },
    header: {
      marginBottom: spacing.screenPaddingLg,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    iconWrap: {
      backgroundColor: colors.dustyRose + '4D',
      padding: 12,
      borderRadius: radius.full,
    },
    title: {
      fontFamily: fonts.heading,
      fontSize: 24,
      color: colors.umber,
      flex: 1,
    },
    subtitle: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
    },
    groveNote: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.sage,
      marginTop: spacing.sm,
    },
    streakNote: {
      marginTop: spacing.lg,
      backgroundColor: colors.sage + '1A',
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.sage,
    },
    streakNoteText: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.sage,
    },
    amountBlock: {
      marginBottom: spacing.screenPaddingLg,
    },
    label: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      marginBottom: spacing.md,
    },
    optional: {
      opacity: 0.6,
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      paddingLeft: spacing.xl,
    },
    dollar: {
      fontFamily: fonts.heading,
      fontSize: 36,
      color: colors.gray,
    },
    amountInput: {
      flex: 1,
      fontFamily: fonts.heading,
      fontSize: 48,
      color: colors.umber,
      paddingVertical: spacing.xl,
      paddingRight: spacing.xl,
    },
    pills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    pill: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      backgroundColor: colors.sand,
    },
    pillSelected: {
      backgroundColor: colors.terracotta,
      shadowColor: colors.terracotta,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    pillText: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
    },
    pillTextSelected: {
      color: colors.cream,
    },
    actions: {
      marginTop: spacing.screenPaddingLg,
      gap: spacing.md,
    },
    submitBtn: {
      backgroundColor: colors.terracotta,
      paddingVertical: spacing.lg,
      borderRadius: radius.lg,
      shadowColor: colors.terracotta,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 4,
    },
    submitBtnDisabled: {
      backgroundColor: colors.sand,
      opacity: 0.5,
      shadowOpacity: 0,
      elevation: 0,
    },
    submitBtnText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.cream,
      textAlign: 'center',
    },
    submitBtnTextDisabled: {
      color: colors.gray,
    },
    cancelBtn: {
      paddingVertical: 12,
      borderRadius: radius.lg,
    },
    cancelBtnText: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.gray,
      textAlign: 'center',
    },
  });
}
