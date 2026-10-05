import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NoteTintOrder, NoteTints, Radius, type Theme } from '@/constants/theme';
import type { Note } from '@/types/note';

export type NoteDraft = {
  title: string;
  body: string;
  pinned: boolean;
  tint: Note['tint'];
};

type Props = {
  note: Note;
  isNew: boolean;
  theme: Theme;
  dark: boolean;
  onClose: () => void;
  onSave: (note: Note, patch: NoteDraft) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
};

export function NoteEditorSheet({ note, isNew, theme, dark, onClose, onSave, onDelete, onTogglePin }: Props) {
  const insets = useSafeAreaInsets();
  // Fresh mount per note (parent uses key), so initial state is the draft.
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [tint, setTint] = useState<Note['tint']>(note.tint);
  const [pinned, setPinned] = useState(note.pinned);

  const save = () => {
    if (!title.trim() && !body.trim()) {
      onClose();
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(note, { title: title.trim(), body: body.trim(), pinned, tint });
  };

  const togglePinned = () => {
    void Haptics.selectionAsync();
    if (isNew) {
      setPinned((p) => !p);
    } else {
      // Persist immediately so the card updates behind the sheet.
      onTogglePin(note.id);
      setPinned((p) => !p);
    }
  };

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <Animated.View entering={FadeIn.duration(160)} style={styles.backdrop}>
          <Pressable style={styles.flex} onPress={onClose} />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.duration(260).dampingRatio(1)}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          <View style={styles.topRow}>
            <View style={styles.tints}>
              {NoteTintOrder.map((t) => {
                const c = NoteTints[t][dark ? 'dark' : 'light'];
                const active = tint === t;
                return (
                  <Pressable
                    key={t}
                    hitSlop={8}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      setTint(t);
                    }}
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
            <Pressable
              hitSlop={10}
              onPress={togglePinned}
              style={styles.pinBtn}>
              <MaterialIcons
                name={pinned ? 'bookmark' : 'bookmark-border'}
                size={24}
                color={pinned ? theme.accent : theme.textSecondary}
              />
            </Pressable>
          </View>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={theme.textSecondary}
            style={[styles.titleInput, { color: theme.text }]}
            maxLength={120}
            autoFocus
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

          <View style={styles.actions}>
            <Pressable
              onPress={() => {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                onDelete(note.id);
              }}
              style={[styles.deleteBtn, { backgroundColor: theme.dangerSoft }]}>
              <Text style={[styles.deleteText, { color: theme.danger }]}>Delete</Text>
            </Pressable>
            <Pressable
              onPress={save}
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
              <Text style={[styles.saveText, { color: theme.primaryText }]}>Save</Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(43,33,24,0.45)',
  },
  sheet: {
    borderTopLeftRadius: Radius.large,
    borderTopRightRadius: Radius.large,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 20,
    gap: 12,
    maxHeight: '88%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tints: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  pinBtn: {
    padding: 4,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '800',
    paddingVertical: 4,
  },
  bodyInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 180,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  deleteBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: Radius.medium,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '800',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.medium,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
