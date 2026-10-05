import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NoteTints } from '@/constants/theme';
import { useTheme, useResolvedScheme } from '@/hooks/use-theme';
import { formatNoteDate } from '@/lib/note-storage';
import { useNotesStore } from '@/store/notes-context';

export default function TrashScreen() {
  const router = useRouter();
  const theme = useTheme();
  const dark = useResolvedScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { trashed, restoreNote, deleteForever, emptyTrash } = useNotesStore();

  const confirmEmpty = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Empty trash?', 'All trashed notes will be permanently removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Empty trash', style: 'destructive', onPress: () => emptyTrash() },
    ]);
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
          <Text style={[styles.title, { color: theme.text }]}>Trash</Text>
          {trashed.length > 0 ? (
            <Pressable hitSlop={12} onPress={confirmEmpty}>
              <Text style={[styles.emptyBtn, { color: theme.danger }]}>Empty</Text>
            </Pressable>
          ) : (
            <View style={styles.backBtn} />
          )}
        </View>

        <Text style={[styles.sub, { color: theme.textSecondary }]}>
          Notes are permanently deleted 30 days after trashing.
        </Text>

        {trashed.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialIcons name="delete-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Trash is empty.
            </Text>
          </View>
        ) : (
          <View style={styles.rows}>
            {trashed.map((n) => {
              const tint = NoteTints[n.tint][dark ? 'dark' : 'light'];
              return (
                <View
                  key={n.id}
                  style={[
                    styles.row,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  ]}>
                  <View style={[styles.dot, { backgroundColor: tint.border }]} />
                  <View style={styles.rowText}>
                    <Text numberOfLines={1} style={[styles.rowTitle, { color: theme.text }]}>
                      {n.title.trim() || 'Untitled'}
                    </Text>
                    <Text style={[styles.rowSub, { color: theme.textSecondary }]}>
                      Deleted {n.deletedAt ? formatNoteDate(n.deletedAt) : ''}
                    </Text>
                  </View>
                  <Pressable
                    hitSlop={10}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      restoreNote(n.id);
                    }}
                    style={[styles.restoreBtn, { backgroundColor: theme.accentSoft }]}>
                    <Text style={[styles.restoreText, { color: theme.accent }]}>Restore</Text>
                  </Pressable>
                  <Pressable
                    hitSlop={10}
                    onPress={() =>
                      Alert.alert('Delete forever?', 'This cannot be undone.', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => deleteForever(n.id),
                        },
                      ])
                    }>
                    <MaterialIcons name="delete-forever" size={22} color={theme.danger} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
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
    minWidth: 34,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  emptyBtn: {
    fontSize: 15,
    fontWeight: '800',
  },
  sub: {
    fontSize: 13,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
  },
  rows: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowSub: {
    fontSize: 12,
  },
  restoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  restoreText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
