import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Composer } from '@/components/todos/Composer';
import { EditSheet } from '@/components/todos/EditSheet';
import { EmptyState } from '@/components/todos/EmptyState';
import { FilterTabs } from '@/components/todos/FilterTabs';
import { TodoItem } from '@/components/todos/TodoItem';
import { useTheme } from '@/hooks/use-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTodos } from '@/hooks/use-todos';
import type { Todo } from '@/types/todo';

type Props = {
  /** Increment to focus the composer (wired to the bottom-bar + button). */
  composerFocusKey: number;
};

export function ListsHome({ composerFocusKey }: Props) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const {
    todos,
    loaded,
    filter,
    setFilter,
    counts,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  } = useTodos();

  const [editing, setEditing] = useState<Todo | null>(null);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    [],
  );

  const progress = counts.total === 0 ? 0 : counts.done / counts.total;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.date, { color: theme.textSecondary }]}>{todayLabel}</Text>
            <Text style={[styles.title, { color: theme.text }]}>Lists</Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: theme.backgroundSelected }]}>
            <Text style={[styles.countText, { color: theme.text }]}>{counts.open} open</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
          <View
            style={[
              styles.fill,
              { width: `${Math.round(progress * 100)}%`, backgroundColor: theme.accent },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
          {counts.total === 0
            ? 'Start with one small task'
            : `${counts.done} of ${counts.total} done`}
        </Text>

        <View style={styles.filters}>
          <FilterTabs filter={filter} counts={counts} theme={theme} onChange={setFilter} />
        </View>

        {/* List */}
        <FlatList
          data={todos}
          keyExtractor={(t) => t.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews
          maxToRenderPerBatch={12}
          windowSize={7}
          ListEmptyComponent={loaded ? <EmptyState theme={theme} filter={filter} /> : null}
          ListFooterComponent={
            filter === 'done' && counts.done > 0 ? (
              <Pressable
                onPress={() => {
                  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  clearCompleted();
                }}
                style={[styles.clearBtn, { borderColor: theme.border }]}>
                <Text style={[styles.clearText, { color: theme.danger }]}>
                  Clear completed ({counts.done})
                </Text>
              </Pressable>
            ) : null
          }
          renderItem={({ item, index }) => (
            <TodoItem
              todo={item}
              index={index}
              theme={theme}
              dark={dark}
              onToggle={toggleTodo}
              onOpen={setEditing}
              onDelete={deleteTodo}
            />
          )}
        />

        {/* Composer */}
        <Composer
          theme={theme}
          focusKey={composerFocusKey}
          onAdd={(title) => addTodo({ title })}
        />
      </View>

      {editing !== null && (
        <EditSheet
          key={editing.id}
          todo={editing}
          theme={theme}
          dark={dark}
          onClose={() => setEditing(null)}
          onSave={updateTodo}
          onDelete={deleteTodo}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
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
  date: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  countBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filters: {
    marginTop: 2,
    marginBottom: 2,
  },
  listContent: {
    paddingTop: 6,
    paddingBottom: 12,
    flexGrow: 1,
  },
  clearBtn: {
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
