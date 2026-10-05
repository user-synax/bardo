import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useImperativeHandle, useMemo, useState } from 'react';
import type { Ref } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, type Theme } from '@/constants/theme';
import { useNotes } from '@/hooks/use-notes';
import { createNote, type Note } from '@/types/note';

import { NoteCard } from './NoteCard';
import { NoteEditorSheet } from './NoteEditorSheet';

export type NotesHomeHandle = {
  createNew: () => void;
};

type Props = {
  ref: Ref<NotesHomeHandle>;
  theme: Theme;
  dark: boolean;
};

type Draft = { note: Note; isNew: boolean } | null;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function NotesHome({ ref, theme, dark }: Props) {
  const insets = useSafeAreaInsets();
  const { pinned, others, loaded, addNote, updateNote, deleteNote, togglePin } = useNotes();
  const [query, setQuery] = useState('');
  const [grid, setGrid] = useState(true);
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [othersOpen, setOthersOpen] = useState(true);
  const [draft, setDraft] = useState<Draft>(null);

  useImperativeHandle(ref, () => ({
    createNew: () => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setDraft({ note: createNote({ title: '', body: '' }), isNew: true });
    },
  }));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const all = [...pinned, ...others];
    return all.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
    );
  }, [query, pinned, others]);

  const openNote = (note: Note) => setDraft({ note, isNew: false });

  const saveDraft = (note: Note, patch: { title: string; body: string; pinned: boolean; tint: Note['tint'] }) => {
    if (draft?.isNew) {
      if (!patch.title.trim() && !patch.body.trim()) return;
      addNote(patch);
    } else {
      updateNote(note.id, patch);
    }
    setDraft(null);
  };

  const renderSection = (
    label: string,
    items: Note[],
    open: boolean,
    onToggle: () => void,
    startIndex: number,
  ) => {
    if (items.length === 0) return null;
    return (
      <View>
        <Pressable onPress={onToggle} style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { color: theme.accent }]}>{label}</Text>
          <MaterialIcons
            name={open ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
            size={22}
            color={theme.accent}
          />
        </Pressable>
        {open && (
          <View style={styles.cards}>
            {grid
              ? chunk(items, 2).map((row, ri) => (
                  <View key={ri} style={styles.row}>
                    {row.map((n, ci) => (
                      <NoteCard
                        key={n.id}
                        note={n}
                        index={startIndex + ri * 2 + ci}
                        theme={theme}
                        dark={dark}
                        layout="grid"
                        onOpen={openNote}
                        onTogglePin={togglePin}
                      />
                    ))}
                    {row.length === 1 && <View style={styles.gridCell} />}
                  </View>
                ))
              : items.map((n, i) => (
                  <NoteCard
                    key={n.id}
                    note={n}
                    index={startIndex + i}
                    theme={theme}
                    dark={dark}
                    layout="list"
                    onOpen={openNote}
                    onTogglePin={togglePin}
                  />
                ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>Notes</Text>
            <MaterialIcons name="arrow-drop-down" size={28} color={theme.text} />
          </View>
          <View style={styles.icons}>
            <Pressable
              hitSlop={12}
              onPress={() => void Haptics.selectionAsync()}
              style={styles.iconBtn}>
              <MaterialIcons name="sort" size={26} color={theme.text} />
            </Pressable>
            <Pressable
              hitSlop={12}
              onPress={() => {
                void Haptics.selectionAsync();
                setGrid((g) => !g);
              }}
              style={styles.iconBtn}>
              <MaterialIcons
                name={grid ? 'view-agenda' : 'dashboard'}
                size={24}
                color={theme.text}
              />
            </Pressable>
            <Pressable
              hitSlop={12}
              onPress={() => void Haptics.selectionAsync()}
              style={styles.iconBtn}>
              <MaterialIcons name="settings" size={24} color={theme.text} />
            </Pressable>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.search, { backgroundColor: theme.backgroundSelected }]}>
          <MaterialIcons name="search" size={22} color={theme.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
          />
          {query ? (
            <Pressable hitSlop={10} onPress={() => setQuery('')}>
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        {/* Sections */}
        {results ? (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, { color: theme.accent }]}>
                RESULTS ({results.length})
              </Text>
            </View>
            <View style={styles.cards}>
              {results.length === 0 ? (
                <Text style={[styles.empty, { color: theme.textSecondary }]}>
                  No notes match “{query.trim()}”.
                </Text>
              ) : grid ? (
                chunk(results, 2).map((row, ri) => (
                  <View key={ri} style={styles.row}>
                    {row.map((n, ci) => (
                      <NoteCard
                        key={n.id}
                        note={n}
                        index={ri * 2 + ci}
                        theme={theme}
                        dark={dark}
                        layout="grid"
                        onOpen={openNote}
                        onTogglePin={togglePin}
                      />
                    ))}
                    {row.length === 1 && <View style={styles.gridCell} />}
                  </View>
                ))
              ) : (
                results.map((n, i) => (
                  <NoteCard
                    key={n.id}
                    note={n}
                    index={i}
                    theme={theme}
                    dark={dark}
                    layout="list"
                    onOpen={openNote}
                    onTogglePin={togglePin}
                  />
                ))
              )}
            </View>
          </View>
        ) : (
          <View style={styles.sections}>
            {renderSection('PINNED', pinned, pinnedOpen, () => setPinnedOpen((o) => !o), 0)}
            {renderSection('OTHERS', others, othersOpen, () => setOthersOpen((o) => !o), pinned.length)}
            {loaded && pinned.length === 0 && others.length === 0 && (
              <View style={styles.emptyWrap}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>A blank page</Text>
                <Text style={[styles.empty, { color: theme.textSecondary }]}>
                  Tap + below to write your first note. Pin it to keep it on top.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {draft && (
        <NoteEditorSheet
          key={draft.note.id}
          note={draft.note}
          isNew={draft.isNew}
          theme={theme}
          dark={dark}
          onClose={() => setDraft(null)}
          onSave={saveDraft}
          onDelete={(id) => {
            deleteNote(id);
            setDraft(null);
          }}
          onTogglePin={togglePin}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  iconBtn: {
    padding: 2,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: Radius.large,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sections: {
    gap: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  cards: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCell: {
    flex: 1,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 56,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  empty: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
