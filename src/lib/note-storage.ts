import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Note } from '@/types/note';

const STORAGE_KEY = 'bardo.notes.v1';

export async function loadNotes(): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (n): n is Note =>
        typeof n === 'object' &&
        n !== null &&
        typeof (n as Note).id === 'string' &&
        typeof (n as Note).title === 'string',
    );
  } catch {
    return [];
  }
}

export async function saveNotes(notes: Note[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Storage full / unavailable — keep app usable, skip silently.
  }
}

/** "16 Jul • 1:31 PM" */
export function formatNoteDate(ts: number): string {
  const d = new Date(ts);
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date} • ${time}`;
}
