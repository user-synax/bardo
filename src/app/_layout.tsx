import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

import { AppLockGate } from '@/components/AppLock';
import { NotesProvider } from '@/store/notes-context';
import { SettingsProvider, useSettingsStore } from '@/store/settings-context';

function ThemedShell() {
  const { mode, theme } = useSettingsStore();

  useEffect(() => {
    // Paint the root view cream/cocoa so Android never flashes white.
    void SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <AppLockGate>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
            animation: 'fade',
          }}
        />
      </AppLockGate>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F7F1E6' }}>
      <SettingsProvider>
        <NotesProvider>
          <ThemedShell />
        </NotesProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
