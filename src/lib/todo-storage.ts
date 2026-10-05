import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Todo } from '@/types/todo';

const STORAGE_KEY = 'bardo.todos.v1';

export async function loadTodos(): Promise<Todo[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is Todo =>
        typeof t === 'object' &&
        t !== null &&
        typeof (t as Todo).id === 'string' &&
        typeof (t as Todo).title === 'string',
    );
  } catch {
    return [];
  }
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage full / unavailable — keep app usable, skip silently.
  }
}

export function toDayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDaysKey(base: string | null, days: number): string {
  const d = base ? parseDayKey(base) : new Date();
  d.setDate(d.getDate() + days);
  return toDayKey(d);
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function describeDueDate(dueDate: string | null): {
  label: string | null;
  overdue: boolean;
  today: boolean;
} {
  if (!dueDate) return { label: null, overdue: false, today: false };
  const today = toDayKey();
  if (dueDate === today) return { label: 'Today', overdue: false, today: true };
  if (dueDate === addDaysKey(today, 1)) return { label: 'Tomorrow', overdue: false, today: false };
  if (dueDate < today) return { label: 'Overdue', overdue: true, today: false };
  const d = parseDayKey(dueDate);
  const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return { label, overdue: false, today: false };
}
