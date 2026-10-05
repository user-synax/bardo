import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNotesStore } from '@/store/notes-context';
import {
  useSettingsStore,
  type LockTimeout,
  type ThemeMode,
} from '@/store/settings-context';

const THEME_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Cream' },
  { key: 'dark', label: 'Cocoa' },
];

const TIMEOUT_OPTIONS: { key: LockTimeout; label: string }[] = [
  { key: 'immediate', label: 'Immediately' },
  { key: '1min', label: 'After 1 min' },
  { key: '5min', label: 'After 5 min' },
];

const version = Constants.expoConfig?.version ?? '';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useSettingsStore();
  const { trashCount } = useNotesStore();
  const [bioSupport, setBioSupport] = useState<'checking' | 'ok' | 'none'>('checking');

  useEffect(() => {
    let mounted = true;
    Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ])
      .then(([hardware, enrolled]) => {
        if (!mounted) return;
        const ok = hardware && enrolled;
        setBioSupport(ok ? 'ok' : 'none');
        if (!ok && settings.biometricEnabled) {
          // Biometrics went away (fingerprints removed) — fail closed by disabling.
          updateSettings({ biometricEnabled: false });
        }
      })
      .catch(() => {
        if (mounted) setBioSupport('none');
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLock = (on: boolean) => {
    if (on && bioSupport !== 'ok') {
      Alert.alert(
        'Biometrics not set up',
        'Add a fingerprint or face unlock in your device Settings first, then come back here.',
      );
      return;
    }
    void Haptics.selectionAsync();
    updateSettings({ biometricEnabled: on });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}>
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={26} color={theme.text} />
          </Pressable>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Appearance */}
        <Text style={[styles.section, { color: theme.accent }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Text style={[styles.rowTitle, { color: theme.text }]}>Theme</Text>
          <View style={[styles.segment, { backgroundColor: theme.backgroundSelected }]}>
            {THEME_OPTIONS.map((o) => {
              const active = settings.themeMode === o.key;
              return (
                <Pressable
                  key={o.key}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    updateSettings({ themeMode: o.key });
                  }}
                  style={[
                    styles.segmentBtn,
                    active && { backgroundColor: theme.backgroundElement },
                  ]}>
                  <Text
                    style={[
                      styles.segmentText,
                      { color: active ? theme.text : theme.textSecondary },
                    ]}>
                    {o.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Security */}
        <Text style={[styles.section, { color: theme.accent }]}>SECURITY</Text>
        <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: theme.text }]}>App lock</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>
                {bioSupport === 'checking'
                  ? 'Checking biometrics…'
                  : bioSupport === 'ok'
                    ? 'Unlock with fingerprint or face'
                    : 'No biometrics enrolled on this device'}
              </Text>
            </View>
            <Switch
              value={settings.biometricEnabled}
              onValueChange={toggleLock}
              trackColor={{ true: theme.accent, false: theme.backgroundSelected }}
              thumbColor={theme.backgroundElement}
            />
          </View>
          {settings.biometricEnabled && (
            <View style={styles.timeoutRow}>
              {TIMEOUT_OPTIONS.map((o) => {
                const active = settings.biometricTimeout === o.key;
                return (
                  <Pressable
                    key={o.key}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      updateSettings({ biometricTimeout: o.key });
                    }}
                    style={[
                      styles.chip,
                      {
                        borderColor: active ? theme.accent : theme.border,
                        backgroundColor: active ? theme.accentSoft : 'transparent',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        { color: active ? theme.accent : theme.textSecondary },
                      ]}>
                      {o.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Data */}
        <Text style={[styles.section, { color: theme.accent }]}>DATA</Text>
        <Pressable
          onPress={() => router.push('/trash')}
          style={[styles.card, styles.row, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Trash</Text>
            <Text style={[styles.rowSub, { color: theme.textSecondary }]}>
              {trashCount === 0 ? 'Empty' : `${trashCount} note${trashCount === 1 ? '' : 's'}`}
              {' • auto-deletes after 30 days'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
        </Pressable>

        {/* About */}
        <Text style={[styles.section, { color: theme.accent }]}>ABOUT</Text>
        <View style={[styles.card, styles.row, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Bardo</Text>
            <Text style={[styles.rowSub, { color: theme.textSecondary }]}>
              {version ? `Version ${version} • ` : ''}Private by default — notes never leave your device.
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
    width: 34,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  section: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 8,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  rowSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: Radius.pill,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  timeoutRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
