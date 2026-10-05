import * as Haptics from 'expo-haptics';
import { memo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { PriorityColors, Radius, type Theme } from '@/constants/theme';
import { describeDueDate } from '@/lib/todo-storage';
import type { Todo } from '@/types/todo';

type Props = {
  todo: Todo;
  index: number;
  theme: Theme;
  dark: boolean;
  onToggle: (id: string) => void;
  onOpen: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

function TodoItemInner({ todo, index, theme, dark, onToggle, onOpen, onDelete }: Props) {
  const swipeRef = useRef<Swipeable>(null);
  const done = todo.completed;
  const priorityColor = dark
    ? PriorityColors[todo.priority].dark
    : PriorityColors[todo.priority].light;
  const due = describeDueDate(todo.dueDate);

  const handleToggle = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(todo.id);
  };

  const handleDelete = () => {
    swipeRef.current?.close();
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete(todo.id);
  };

  const renderRightActions = () => (
    <Pressable
      onPress={handleDelete}
      style={[styles.deleteAction, { backgroundColor: theme.danger }]}>
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  return (
    <Animated.View
      entering={FadeInDown.duration(220).delay(Math.min(index, 8) * 30)}
      exiting={FadeOut.duration(160)}
      layout={LinearTransition.duration(220)}>
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        rightThreshold={48}
        onSwipeableOpen={handleDelete}>
        <Pressable
          onPress={() => onOpen(todo)}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
              opacity: pressed ? 0.92 : 1,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            },
          ]}>
          <Pressable
            onPress={handleToggle}
            hitSlop={10}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: done }}
            style={[
              styles.check,
              {
                borderColor: done ? theme.success : theme.textSecondary,
                backgroundColor: done ? theme.success : 'transparent',
              },
            ]}>
            {done && <Text style={styles.checkMark}>✓</Text>}
          </Pressable>

          <View style={styles.body}>
            <Text
              numberOfLines={2}
              style={[
                styles.title,
                {
                  color: done ? theme.textSecondary : theme.text,
                  textDecorationLine: done ? 'line-through' : 'none',
                },
              ]}>
              {todo.title}
            </Text>
            {todo.notes ? (
              <Text numberOfLines={1} style={[styles.notes, { color: theme.textSecondary }]}>
                {todo.notes}
              </Text>
            ) : null}
            <View style={styles.metaRow}>
              <View
                style={[
                  styles.priorityPill,
                  { backgroundColor: `${priorityColor}1F`, borderColor: `${priorityColor}55` },
                ]}>
                <View style={[styles.dot, { backgroundColor: priorityColor }]} />
                <Text style={[styles.metaText, { color: priorityColor }]}>
                  {todo.priority[0]?.toUpperCase() + todo.priority.slice(1)}
                </Text>
              </View>
              {due.label && (
                <View
                  style={[
                    styles.duePill,
                    {
                      backgroundColor: due.overdue ? theme.dangerSoft : theme.backgroundSelected,
                      borderColor: due.overdue ? theme.danger : theme.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.metaText,
                      { color: due.overdue ? theme.danger : theme.textSecondary },
                    ]}>
                    {due.label}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
}

export const TodoItem = memo(TodoItemInner);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: Radius.medium,
    borderWidth: 1,
    marginBottom: 10,
    // Soft cream shadow — subtle on Android via elevation.
    elevation: 1,
    shadowColor: '#3D2C17',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkMark: {
    color: '#FFFDF7',
    fontSize: 16,
    fontWeight: '800',
    marginTop: -1,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  notes: {
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  duePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 84,
    borderRadius: Radius.medium,
    marginBottom: 10,
    marginLeft: 8,
  },
  deleteText: {
    color: '#FFF8EC',
    fontWeight: '800',
    fontSize: 14,
  },
});
