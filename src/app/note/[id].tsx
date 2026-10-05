import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NoteTintOrder, NoteTints } from '@/constants/theme';
import { useTheme, useResolvedScheme } from '@/hooks/use-theme';
import { formatNoteDate } from '@/lib/note-storage';
import { useNotesStore } from '@/store/notes-context';
import type { Note } from '@/types/note';

const AUTOSAVE_MS = 400;

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const dark = useResolvedScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();

  const isNew = id === 'new';
  const existing = isNew ? undefined : notes.find((n) => n.id === id);

  // Draft state — initialized once per mount (route remounts per note).
  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [tint, setTint] = useState<Note['tint']>(existing?.tint ?? 'cream');
  const [pinned, setPinned] = useState(existing?.pinned ?? false);
  // Id of the store row once it exists (existing notes start saved).
  // Set from the autosave timer callback, so the caption flips live on first save.
  const [savedId, setSavedId] = useState<string | null>(existing?.id ?? null);
  const liveNote = savedId ? notes.find((n) => n.id === savedId) : undefined;

  // Debounced auto-save: create on first content, update after.
  // The store write happens in the timer callback (external sync), not the effect body.
  useEffect(() => {
    const empty = !title.trim() && !body.trim();
    if (!savedId && empty) return;
    const timer = setTimeout(() => {
      const patch = { title: title.trim(), body: body.trim(), pinned, tint };
      if (savedId) {
        updateNote(savedId, patch);
      } else {
        setSavedId(addNote(patch).id);
      }
    }, AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [title, body, pinned, tint, savedId, addNote, updateNote]);

  if (!isNew && !existing) {
    return <Redirect href="/" />;
  }

  const goBack = () => router.back();

  const confirmDelete = () => {
    if (!savedId) {
      // Never persisted — just leave.
      goBack();
      return;
    }
    Alert.alert('Move to Trash?', 'You can restore it within 30 days from Settings → Trash.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Move to trash',
        style: 'destructive',
        onPress: () => {
          deleteNote(savedId);
          goBack();
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable hitSlop={12} onPress={goBack} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={26} color={theme.text} />
            </Pressable>
            <View style={styles.headerActions}>
              <Pressable
                hitSlop={12}
                onPress={() => setPinned((p) => !p)}
                style={styles.iconBtn}>
                <MaterialIcons
                  name={pinned ? 'bookmark' : 'bookmark-border'}
                  size={24}
                  color={pinned ? theme.accent : theme.textSecondary}
                />
              </Pressable>
              <Pressable hitSlop={12} onPress={confirmDelete} style={styles.iconBtn}>
                <MaterialIcons name="delete-outline" size={24} color={theme.textSecondary} />
              </Pressable>
            </View>
          </View>

          <Text style={[styles.edited, { color: theme.textSecondary }]}>
            {liveNote ? `Edited ${formatNoteDate(liveNote.updatedAt)}` : 'New note'}
          </Text>

          {/* Tint picker */}
          <View style={styles.tints}>
            {NoteTintOrder.map((t) => {
              const c = NoteTints[t][dark ? 'dark' : 'light'];
              const active = tint === t;
              return (
                <Pressable
                  key={t}
                  hitSlop={8}
                  onPress={() => setTint(t)}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: c.bg,
                      borderColor: active ? theme.accent : theme.border,
                    },
                  ]}
                />
              );
            })}
          </View>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={theme.textSecondary}
            style={[styles.titleInput, { color: theme.text }]}
            maxLength={120}
            autoFocus={isNew}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Start writing..."
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
            style={[styles.bodyInput, { color: theme.text }]}
          />
        </View>
        <View style={{ height: insets.bottom }} />
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
    paddingHorizontal: 20,
    gap: 10,
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
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    padding: 4,
  },
  edited: {
    fontSize: 12,
    fontWeight: '600',
  },
  tints: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 2,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '800',
    paddingVertical: 4,
  },
  bodyInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    paddingBottom: 16,
  },
});
