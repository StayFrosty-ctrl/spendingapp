import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MotiView } from 'moti';
import { ChevronLeft, Sprout, PiggyBank, Wallet } from 'lucide-react-native';
import type { GoalType, NoSpendGoal, SaveByDateGoal, BudgetCapGoal } from '../types';
import { generateGoalId, getTodayLocalDateString } from '../types';
import type { Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';

interface CreateGoalProps {
  onSubmit: (goal: NoSpendGoal | SaveByDateGoal | BudgetCapGoal) => void;
  onBack: () => void;
}

const GOAL_TYPES: { type: GoalType; label: string; description: string; Icon: typeof Sprout }[] = [
  { type: 'no_spend', label: 'No-spend', description: "Don't spend on something (e.g. online shopping)", Icon: Sprout },
  { type: 'save_by_date', label: 'Save by date', description: 'Save $X by a target date', Icon: PiggyBank },
  { type: 'budget_cap', label: 'Budget cap', description: "Don't exceed $X per week or month", Icon: Wallet },
];

function getPeriodStart(period: 'week' | 'month'): string {
  const now = new Date();
  if (period === 'month') {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
  }
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(now.getFullYear(), now.getMonth(), diff);
  const y = start.getFullYear();
  const m = String(start.getMonth() + 1).padStart(2, '0');
  const d = String(start.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function CreateGoal({ onSubmit, onBack }: CreateGoalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [step, setStep] = useState<0 | 1>(0);
  const [selectedType, setSelectedType] = useState<GoalType | null>(null);
  const [name, setName] = useState('');
  const [categoryLabel, setCategoryLabel] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [period, setPeriod] = useState<'week' | 'month'>('month');

  const handleSelectType = (type: GoalType) => {
    setSelectedType(type);
    setStep(1);
  };

  const handleAmountChange = (value: string, setter: (v: string) => void) => {
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') setter(value);
  };

  const handleSubmit = () => {
    const id = generateGoalId();
    const createdAt = new Date().toISOString();
    const trimmedName = name.trim() || 'My goal';
    if (selectedType === 'no_spend') {
      const goal: NoSpendGoal = {
        id,
        name: trimmedName,
        type: 'no_spend',
        createdAt,
        categoryLabel: categoryLabel.trim() || undefined,
        currentStreak: 0,
        bestStreak: 0,
        lastCheckInDate: null,
        purchases: [],
      };
      onSubmit(goal);
      return;
    }
    if (selectedType === 'save_by_date') {
      const amount = parseFloat(targetAmount);
      if (!(amount > 0)) return;
      const goal: SaveByDateGoal = {
        id,
        name: trimmedName,
        type: 'save_by_date',
        createdAt,
        targetAmount: amount,
        endDate: endDate.trim() || getTodayLocalDateString(),
        savings: [],
      };
      onSubmit(goal);
      return;
    }
    if (selectedType === 'budget_cap') {
      const limit = parseFloat(limitAmount);
      if (!(limit > 0)) return;
      const goal: BudgetCapGoal = {
        id,
        name: trimmedName,
        type: 'budget_cap',
        createdAt,
        limitAmount: limit,
        period,
        periodStartDate: getPeriodStart(period),
        purchases: [],
      };
      onSubmit(goal);
    }
  };

  const canSubmit =
    name.trim().length > 0 &&
    (selectedType === 'no_spend' ||
      (selectedType === 'save_by_date' && parseFloat(targetAmount) > 0) ||
      (selectedType === 'budget_cap' && parseFloat(limitAmount) > 0));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.header}>
        <Pressable onPress={() => (step === 1 ? setStep(0) : onBack())} style={styles.backBtn} android_ripple={{ color: colors.sand }}>
          <ChevronLeft size={24} color={colors.umber} strokeWidth={2} />
          <Text style={styles.backText}>{step === 0 ? 'Cancel' : 'Back'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{step === 0 ? 'New goal' : 'Details'}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 0 && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.stepContent}>
            <Text style={styles.stepLabel}>What kind of goal?</Text>
            {GOAL_TYPES.map(({ type, label, description, Icon }) => (
              <Pressable
                key={type}
                onPress={() => handleSelectType(type)}
                style={({ pressed }) => [styles.typeCard, pressed && styles.typeCardPressed]}
                android_ripple={{ color: colors.sand }}
              >
                <View style={styles.typeIconWrap}>
                  <Icon size={28} color={colors.terracotta} strokeWidth={1.5} />
                </View>
                <View style={styles.typeText}>
                  <Text style={styles.typeLabel}>{label}</Text>
                  <Text style={styles.typeDesc}>{description}</Text>
                </View>
              </Pressable>
            ))}
          </MotiView>
        )}

        {step === 1 && selectedType && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.stepContent}>
            <Text style={styles.label}>Goal name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Online shopping, Emergency fund"
              placeholderTextColor={colors.gray}
              style={styles.input}
              autoCapitalize="words"
            />

            {selectedType === 'no_spend' && (
              <>
                <Text style={[styles.label, styles.labelOptional]}>Category (optional)</Text>
                <TextInput
                  value={categoryLabel}
                  onChangeText={setCategoryLabel}
                  placeholder="e.g. Online shopping"
                  placeholderTextColor={colors.gray}
                  style={styles.input}
                />
              </>
            )}

            {selectedType === 'save_by_date' && (
              <>
                <Text style={styles.label}>Target amount ($)</Text>
                <TextInput
                  value={targetAmount}
                  onChangeText={(v) => handleAmountChange(v, setTargetAmount)}
                  placeholder="0.00"
                  placeholderTextColor={colors.gray}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
                <Text style={styles.label}>End date (YYYY-MM-DD)</Text>
                <TextInput
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder={getTodayLocalDateString()}
                  placeholderTextColor={colors.gray}
                  style={styles.input}
                />
              </>
            )}

            {selectedType === 'budget_cap' && (
              <>
                <Text style={styles.label}>Spending limit ($)</Text>
                <TextInput
                  value={limitAmount}
                  onChangeText={(v) => handleAmountChange(v, setLimitAmount)}
                  placeholder="0.00"
                  placeholderTextColor={colors.gray}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
                <Text style={styles.label}>Period</Text>
                <View style={styles.periodRow}>
                  <Pressable
                    onPress={() => setPeriod('week')}
                    style={[styles.periodBtn, period === 'week' && styles.periodBtnSelected]}
                  >
                    <Text style={[styles.periodBtnText, period === 'week' && styles.periodBtnTextSelected]}>Week</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setPeriod('month')}
                    style={[styles.periodBtn, period === 'month' && styles.periodBtnSelected]}
                  >
                    <Text style={[styles.periodBtnText, period === 'month' && styles.periodBtnTextSelected]}>Month</Text>
                  </Pressable>
                </View>
              </>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={({ pressed }) => [styles.submitBtn, (!canSubmit || pressed) && styles.submitBtnDisabled]}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
            >
              <Text style={styles.submitBtnText}>Create goal</Text>
            </Pressable>
          </MotiView>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: Palette) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.screenPadding,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.sand,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
      marginLeft: -4,
    },
    backText: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.umber,
      marginLeft: 4,
    },
    headerTitle: {
      flex: 1,
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.umber,
      textAlign: 'center',
      marginRight: 80,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.screenPaddingLg,
      paddingBottom: 80,
    },
    stepContent: {
      paddingTop: spacing.lg,
    },
    stepLabel: {
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.umber,
      marginBottom: spacing.xl,
    },
    typeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      padding: spacing.xl,
      marginBottom: spacing.lg,
      shadowColor: colors.umber,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    typeCardPressed: {
      opacity: 0.97,
    },
    typeIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.cream,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.lg,
    },
    typeText: {
      flex: 1,
    },
    typeLabel: {
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.umber,
    },
    typeDesc: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      marginTop: 4,
    },
    label: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      marginBottom: 8,
    },
    labelOptional: {
      marginTop: spacing.xl,
    },
    input: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.umber,
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: 14,
      marginBottom: spacing.lg,
    },
    periodRow: {
      flexDirection: 'row',
      gap: spacing.lg,
      marginBottom: spacing.xl,
    },
    periodBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: radius.lg,
      backgroundColor: colors.sand,
      alignItems: 'center',
    },
    periodBtnSelected: {
      backgroundColor: colors.terracotta,
    },
    periodBtnText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.umber,
    },
    periodBtnTextSelected: {
      color: colors.cream,
    },
    submitBtn: {
      backgroundColor: colors.terracotta,
      paddingVertical: spacing.lg,
      borderRadius: radius.lg,
      alignItems: 'center',
      marginTop: spacing.xl,
      shadowColor: colors.umber,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    submitBtnDisabled: {
      opacity: 0.5,
    },
    submitBtnText: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.cream,
    },
  });
}
