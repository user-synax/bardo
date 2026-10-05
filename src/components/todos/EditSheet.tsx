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

import { PriorityColors, Radius, type Theme } from '@/constants/theme';
import { addDaysKey, toDayKey } from '@/lib/todo-storage';
import type { Priority, Todo } from '@/types/todo';

type Props = {
  todo: Todo;
  theme: Theme;
  dark: boolean;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
};

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const DUE_OPTIONS = [
  { key: 'none', label: 'None' },
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'week', label: 'Next wk' },
] as const;

export function EditSheet({ todo, theme, dark, onClose, onSave, onDelete }: Props) {
  const insets = useSafeAreaInsets();
  // Fresh mount per task (parent uses key={todo.id}), so initial state is the draft.
  const [title, setTitle] = useState(todo.title);
  const [notes, setNotes] = useState(todo.notes);
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [dueKey, setDueKey] = useState<string | null>(todo.dueDate);

  const pickDue = (opt: (typeof DUE_OPTIONS)[number]['key']) => {
    void Haptics.selectionAsync();
    if (opt === 'none') setDueKey(null);
    else if (opt === 'today') setDueKey(toDayKey());
    else if (opt === 'tomorrow') setDueKey(addDaysKey(toDayKey(), 1));
    else setDueKey(addDaysKey(toDayKey(), 7));
  };

  const activeDueOpt = (opt: (typeof DUE_OPTIONS)[number]['key']) => {
    const today = toDayKey();
    if (opt === 'none') return dueKey === null;
    if (opt === 'today') return dueKey === today;
    if (opt === 'tomorrow') return dueKey === addDaysKey(today, 1);
    return dueKey === addDaysKey(today, 7);
  };

  const save = () => {
    const t = title.trim();
    if (!t) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(todo.id, { title: t, notes: notes.trim(), priority, dueDate: dueKey });
    onClose();
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

          <Text style={[styles.heading, { color: theme.text }]}>Edit task</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.titleInput,
              { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
            ]}
            maxLength={200}
            autoFocus
          />
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={[
              styles.notesInput,
              { color: theme.text, backgroundColor: theme.background, borderColor: theme.border },
            ]}
            maxLength={1000}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Priority</Text>
          <View style={styles.chips}>
            {PRIORITIES.map((p) => {
              const c = dark ? PriorityColors[p].dark : PriorityColors[p].light;
              const active = priority === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setPriority(p);
                  }}
                  style={[
                    styles.chip,
                    {
                      borderColor: active ? c : theme.border,
                      backgroundColor: active ? `${c}22` : 'transparent',
                    },
                  ]}>
                  <View style={[styles.dot, { backgroundColor: c }]} />
                  <Text style={[styles.chipText, { color: active ? c : theme.textSecondary }]}>
                    {p[0]?.toUpperCase() + p.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Due date</Text>
          <View style={styles.chips}>
            {DUE_OPTIONS.map((o) => {
              const active = activeDueOpt(o.key);
              return (
                <Pressable
                  key={o.key}
                  onPress={() => pickDue(o.key)}
                  style={[
                    styles.chip,
                    {
                      borderColor: active ? theme.accent : theme.border,
                      backgroundColor: active ? theme.accentSoft : 'transparent',
                    },
                  ]}>
                  <Text
                    style={[styles.chipText, { color: active ? theme.accent : theme.textSecondary }]}>
                    {o.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={() => {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                onDelete(todo.id);
                onClose();
              }}
              style={[styles.deleteBtn, { backgroundColor: theme.dangerSoft }]}>
              <Text style={[styles.deleteText, { color: theme.danger }]}>Delete</Text>
            </Pressable>
            <Pressable
              onPress={save}
              disabled={!title.trim()}
              style={[
                styles.saveBtn,
                { backgroundColor: title.trim() ? theme.primary : theme.backgroundSelected },
              ]}>
              <Text
                style={[
                  styles.saveText,
                  { color: title.trim() ? theme.primaryText : theme.textSecondary },
                ]}>
                Save
              </Text>
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
    gap: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  notesInput: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: Radius.medium,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 76,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 6,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
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
