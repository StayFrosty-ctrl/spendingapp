import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import { ArrowLeft, Bell, Trash2, Download, Info, Sun, Moon, Monitor } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { UserData } from '../types';
import type { AppearanceMode, Palette } from '../theme';
import { useTheme, spacing, radius, fonts } from '../theme';

interface SettingsProps {
  userData: UserData;
  onUpdate: (updates: Partial<UserData>) => void;
  onBack: () => void;
  onClearData: () => void;
}

const APPEARANCE_OPTIONS: { value: AppearanceMode; label: string; Icon: typeof Sun }[] = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

export default function Settings({ userData, onUpdate, onBack, onClearData }: SettingsProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { colors, appearance } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleExportData = async () => {
    try {
      const dataStr = JSON.stringify(userData, null, 2);
      const filename = `grove-data-${new Date().toISOString().split('T')[0]}.json`;
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) throw new Error('No cache directory');
      const path = `${cacheDir}${filename}`;
      await FileSystem.writeAsStringAsync(path, dataStr, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path, {
          mimeType: 'application/json',
          dialogTitle: 'Export Grove data',
        });
      } else {
        Alert.alert('Export', `Data saved to ${path}`);
      }
    } catch (e) {
      Alert.alert('Export failed', String(e));
    }
  };

  const handleClearConfirm = () => {
    setShowClearConfirm(false);
    onClearData();
  };

  return (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backBtn} android_ripple={{ color: colors.sand }}>
          <ArrowLeft size={24} color={colors.gray} strokeWidth={1.5} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 100 }}
        >
          <View style={styles.sectionHeader}>
            <Bell size={20} color={colors.terracotta} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>Check-in times</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Morning (9 AM)</Text>
              <Switch
                value={userData.checkInTimes.morning}
                onValueChange={(v) =>
                  onUpdate({
                    checkInTimes: { ...userData.checkInTimes, morning: v },
                  })
                }
                trackColor={{ false: colors.sand, true: colors.terracotta }}
                thumbColor={colors.cream}
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Evening (8 PM)</Text>
              <Switch
                value={userData.checkInTimes.evening}
                onValueChange={(v) =>
                  onUpdate({
                    checkInTimes: { ...userData.checkInTimes, evening: v },
                  })
                }
                trackColor={{ false: colors.sand, true: colors.terracotta }}
                thumbColor={colors.cream}
              />
            </View>
            {userData.checkInTimes.customTime && (
              <View style={[styles.row, styles.rowBorder]}>
                <Text style={styles.rowLabel}>Custom time</Text>
                <Text style={styles.rowValue}>{userData.checkInTimes.customTime}</Text>
              </View>
            )}
          </View>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 200 }}
        >
          <View style={styles.sectionHeader}>
            <Sun size={20} color={colors.terracotta} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>Theme</Text>
          </View>
          <View style={styles.card}>
            {APPEARANCE_OPTIONS.map(({ value, label, Icon }) => (
              <Pressable
                key={value}
                onPress={() => onUpdate({ appearance: value })}
                style={[styles.row, (value === 'light' || value === 'dark') && styles.rowBorder]}
                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
              >
                <Icon size={20} color={colors.gray} strokeWidth={1.5} />
                <Text style={styles.rowLabel}>{label}</Text>
                {appearance === value && (
                  <View style={[styles.radio, { backgroundColor: colors.terracotta }]} />
                )}
              </Pressable>
            ))}
          </View>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 300 }}
        >
          <View style={styles.sectionHeader}>
            <Download size={20} color={colors.terracotta} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>Data & Privacy</Text>
          </View>
          <Pressable onPress={handleExportData} style={styles.card} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
            <Text style={styles.cardTitle}>Export data</Text>
            <Text style={styles.cardSub}>Download your Grove data as JSON</Text>
          </Pressable>
          <Pressable
            onPress={() => setShowClearConfirm(true)}
            style={[styles.card, styles.destructiveCard]}
            android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
          >
            <View style={styles.destructiveRow}>
              <Trash2 size={16} color={colors.dustyRose} strokeWidth={1.5} />
              <Text style={styles.destructiveTitle}>Clear all data</Text>
            </View>
            <Text style={styles.cardSub}>This will reset everything</Text>
          </Pressable>
        </MotiView>

        <MotiView
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 400 }}
        >
          <View style={styles.sectionHeader}>
            <Info size={20} color={colors.terracotta} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>About Grove</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.aboutText}>
              Grove is a gentle companion for building awareness around spending habits.
            </Text>
            <Text style={styles.aboutQuote}>"No shame, just awareness."</Text>
            <View style={styles.versionRow}>
              <Text style={styles.version}>Version 1.0.0</Text>
            </View>
          </View>
        </MotiView>
      </ScrollView>

      <Modal
        visible={showClearConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearConfirm(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowClearConfirm(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Clear all data?</Text>
            <Text style={styles.modalMessage}>
              This will delete your streak, purchases, and all settings. This cannot be undone.
            </Text>
            <Pressable
              onPress={handleClearConfirm}
              style={[styles.modalButton, styles.modalButtonDestructive]}
              android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
            >
              <Text style={styles.modalButtonTextDestructive}>Yes, clear everything</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowClearConfirm(false)}
              style={styles.modalButton}
              android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </MotiView>
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
      gap: spacing.lg,
      padding: spacing.screenPadding,
      paddingBottom: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.muted + '20',
    },
    backBtn: {
      padding: 8,
      borderRadius: radius.full,
    },
    headerTitle: {
      fontFamily: fonts.heading,
      fontSize: 24,
      color: colors.umber,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.screenPadding,
      paddingBottom: 40,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontFamily: fonts.headingSemi,
      fontSize: 18,
      color: colors.umber,
    },
    card: {
      backgroundColor: colors.sand,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    rowBorder: {
      borderTopWidth: 1,
      borderTopColor: colors.muted + '20',
      paddingTop: spacing.sm,
      marginTop: spacing.sm,
    },
    rowLabel: {
      flex: 1,
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.umber,
    },
    rowValue: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.umber,
    },
    radio: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    cardTitle: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.umber,
      marginBottom: 4,
    },
    cardSub: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
    },
    destructiveCard: {
      backgroundColor: colors.destructive + '30',
    },
    destructiveRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: 4,
    },
    destructiveTitle: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.dustyRose,
    },
    aboutText: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.gray,
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    aboutQuote: {
      fontFamily: fonts.body,
      fontSize: 14,
      color: colors.sage,
      fontStyle: 'italic',
      marginBottom: spacing.lg,
    },
    versionRow: {
      marginTop: spacing.lg,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.muted + '20',
    },
    version: {
      fontFamily: fonts.body,
      fontSize: 12,
      color: colors.gray,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.screenPadding,
    },
    modalContent: {
      backgroundColor: colors.cream,
      borderRadius: radius.xl,
      padding: spacing.screenPaddingLg,
      width: '100%',
      maxWidth: 384,
    },
    modalTitle: {
      fontFamily: fonts.heading,
      fontSize: 20,
      color: colors.umber,
      marginBottom: spacing.md,
    },
    modalMessage: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.gray,
      marginBottom: spacing.xl,
    },
    modalButton: {
      paddingVertical: 12,
      borderRadius: radius.lg,
      marginBottom: spacing.sm,
    },
    modalButtonDestructive: {
      backgroundColor: colors.dustyRose,
      marginBottom: spacing.md,
    },
    modalButtonText: {
      fontFamily: fonts.body,
      fontSize: 16,
      color: colors.umber,
      textAlign: 'center',
    },
    modalButtonTextDestructive: {
      fontFamily: fonts.headingMedium,
      fontSize: 16,
      color: colors.cream,
      textAlign: 'center',
    },
  });
}
