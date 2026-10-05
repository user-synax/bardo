import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { lockTimeoutMs, useSettingsStore } from '@/store/settings-context';

export async function authenticate(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Bardo',
      promptSubtitle: 'Confirm it’s you to open your notes',
      cancelLabel: 'Cancel',
    });
    return result.success;
  } catch {
    return false;
  }
}

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { theme } = useSettingsStore();
  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={styles.logo}
        contentFit="contain"
      />
      <Text style={[styles.title, { color: theme.text }]}>Bardo is locked</Text>
      <Text style={[styles.sub, { color: theme.textSecondary }]}>
        Unlock with your fingerprint or face to see your notes.
      </Text>
      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onUnlock();
        }}
        style={[styles.btn, { backgroundColor: theme.primary }]}>
        <MaterialIcons name="fingerprint" size={22} color={theme.primaryText} />
        <Text style={[styles.btnText, { color: theme.primaryText }]}>Unlock</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    gap: 10,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  sub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '800',
  },
});

/**
 * Wraps the app: when app lock is enabled, covers everything until the user
 * authenticates. Re-locks after the configured background timeout.
 */
export function AppLockGate({ children }: { children: ReactNode }) {
  const { settings, loaded } = useSettingsStore();
  // Start tripped: a cold start with lock enabled must authenticate.
  const [tripped, setTripped] = useState(true);
  const bgAt = useRef(0);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'background') {
        bgAt.current = Date.now();
      } else if (
        s === 'active' &&
        settings.biometricEnabled &&
        Date.now() - bgAt.current > lockTimeoutMs(settings.biometricTimeout)
      ) {
        setTripped(true);
      }
    });
    return () => sub.remove();
  }, [settings.biometricEnabled, settings.biometricTimeout]);

  const unlock = useCallback(() => {
    void authenticate().then((ok) => {
      if (ok) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTripped(false);
      }
    });
  }, []);

  // Auto-prompt as soon as the gate appears.
  useEffect(() => {
    if (loaded && settings.biometricEnabled && tripped) unlock();
  }, [loaded, settings.biometricEnabled, tripped, unlock]);

  if (!loaded) {
    // Settings still loading — hold a blank frame, never flash content.
    return <View style={{ flex: 1, backgroundColor: '#F7F1E6' }} />;
  }

  if (settings.biometricEnabled && tripped) {
    return <LockScreen onUnlock={unlock} />;
  }

  return <>{children}</>;
}
