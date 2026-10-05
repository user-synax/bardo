import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomBar } from '@/components/BottomBar';
import { NotesHome } from '@/components/notes/NotesHome';
import { useTheme } from '@/hooks/use-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + 4 }]}>
        <NotesHome theme={theme} dark={dark} />
      </View>
      <View style={[styles.barWrap, { paddingBottom: insets.bottom + 10 }]}>
        <BottomBar
          theme={theme}
          onPlus={() => router.push({ pathname: '/note/[id]', params: { id: 'new' } })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  barWrap: {
    paddingTop: 8,
  },
});
