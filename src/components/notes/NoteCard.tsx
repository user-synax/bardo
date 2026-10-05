import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { NoteTints, type Theme } from '@/constants/theme';
import { formatNoteDate } from '@/lib/note-storage';
import type { Note } from '@/types/note';

type Props = {
  note: Note;
  index: number;
  theme: Theme;
  dark: boolean;
  /** Grid card (flex) vs full-width list row. */
  layout: 'grid' | 'list';
  onOpen: (note: Note) => void;
  onTogglePin: (id: string) => void;
};

function NoteCardInner({ note, index, theme, dark, layout, onOpen, onTogglePin }: Props) {
  const tint = NoteTints[note.tint][dark ? 'dark' : 'light'];
  const title = note.title.trim() || 'Untitled';

  return (
    <Animated.View
      entering={FadeInDown.duration(220).delay(Math.min(index, 8) * 30)}
      exiting={FadeOut.duration(160)}
      layout={LinearTransition.duration(220)}
      style={layout === 'grid' ? styles.gridCell : styles.listCell}>
      <Pressable
        onPress={() => onOpen(note)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: tint.bg,
            borderColor: tint.border,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
        ]}>
        <View style={styles.topRow}>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {formatNoteDate(note.updatedAt)}
          </Text>
          {note.pinned && (
            <Pressable
              hitSlop={10}
              onPress={() => {
                void Haptics.selectionAsync();
                onTogglePin(note.id);
              }}>
              <MaterialIcons name="bookmark" size={18} color={theme.accent} />
            </Pressable>
          )}
        </View>
        <Text numberOfLines={2} style={[styles.title, { color: theme.text }]}>
          {title}
        </Text>
        {note.body ? (
          <Text numberOfLines={4} style={[styles.body, { color: theme.textSecondary }]}>
            {note.body}
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

export const NoteCard = memo(NoteCardInner);

const styles = StyleSheet.create({
  gridCell: {
    flex: 1,
  },
  listCell: {
    width: '100%',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 6,
    minHeight: 148,
    elevation: 1,
    shadowColor: '#3D2C17',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 25,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
});
