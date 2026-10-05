import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { Colors, type Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemeMode = 'system' | 'light' | 'dark';
export type LockTimeout = 'immediate' | '1min' | '5min';

export type Settings = {
  themeMode: ThemeMode;
  biometricEnabled: boolean;
  biometricTimeout: LockTimeout;
};

export const DEFAULT_SETTINGS: Settings = {
  themeMode: 'system',
  biometricEnabled: false,
  biometricTimeout: '1min',
};

const STORAGE_KEY = 'bardo.settings.v1';

export function lockTimeoutMs(t: LockTimeout): number {
  switch (t) {
    case 'immediate':
      return 0;
    case '5min':
      return 5 * 60 * 1000;
    default:
      return 60 * 1000;
  }
}

async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      themeMode:
        parsed.themeMode === 'light' || parsed.themeMode === 'dark' ? parsed.themeMode : 'system',
      biometricEnabled: parsed.biometricEnabled === true,
      biometricTimeout:
        parsed.biometricTimeout === 'immediate' || parsed.biometricTimeout === '5min'
          ? parsed.biometricTimeout
          : '1min',
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

type SettingsStore = {
  settings: Settings;
  loaded: boolean;
  updateSettings: (patch: Partial<Settings>) => void;
  /** Resolved light/dark after applying the theme-mode override. */
  mode: 'light' | 'dark';
  theme: Theme;
};

const SettingsContext = createContext<SettingsStore | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const system = useColorScheme();

  useEffect(() => {
    let mounted = true;
    loadSettings().then((s) => {
      if (mounted) {
        setSettings(s);
        setLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => {});
  }, [settings, loaded]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const mode: 'light' | 'dark' = useMemo(() => {
    if (settings.themeMode === 'light') return 'light';
    if (settings.themeMode === 'dark') return 'dark';
    return system === 'dark' ? 'dark' : 'light';
  }, [settings.themeMode, system]);

  const value = useMemo<SettingsStore>(
    () => ({ settings, loaded, updateSettings, mode, theme: Colors[mode] }),
    [settings, loaded, updateSettings, mode],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettingsStore(): SettingsStore {
  const store = useContext(SettingsContext);
  if (!store) throw new Error('useSettingsStore must be used inside SettingsProvider');
  return store;
}
