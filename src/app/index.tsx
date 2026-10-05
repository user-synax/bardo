import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomBar, type HomeTab } from '@/components/BottomBar';
import { ListsHome } from '@/components/lists/ListsHome';
import { NotesHome, type NotesHomeHandle } from '@/components/notes/NotesHome';
import { useTheme } from '@/hooks/use-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<HomeTab>('notes');
  const [composerFocusKey, setComposerFocusKey] = useState(0);
  const notesRef = useRef<NotesHomeHandle>(null);

  const handlePlus = () => {
    if (tab === 'notes') {
      notesRef.current?.createNew();
    } else {
      setComposerFocusKey((k) => k + 1);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={[styles.content, { paddingTop: insets.top + 4 }]}>
          {tab === 'notes' ? (
            <NotesHome ref={notesRef} theme={theme} dark={dark} />
          ) : (
            <ListsHome composerFocusKey={composerFocusKey} />
          )}
        </View>
        <View style={[styles.barWrap, { paddingBottom: insets.bottom + 10 }]}>
          <BottomBar tab={tab} theme={theme} onTab={setTab} onPlus={handlePlus} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  barWrap: {
    paddingTop: 8,
  },
});
