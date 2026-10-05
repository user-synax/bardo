import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';
import { NotesProvider } from '@/store/notes-context';

export default function RootLayout() {
  const scheme = useColorScheme();
  const themeKey = scheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    // Paint the root view cream/cocoa so Android never flashes white.
    void SystemUI.setBackgroundColorAsync(Colors[themeKey].background);
  }, [themeKey]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors[themeKey].background }}>
      <NotesProvider>
        <StatusBar style={themeKey === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors[themeKey].background },
            animation: 'fade',
          }}
        />
      </NotesProvider>
    </GestureHandlerRootView>
  );
}
