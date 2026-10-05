import AsyncStorage from '@react-native-async-storage/async-storage';

import { NoteTintOrder } from '@/constants/theme';
import type { Note } from '@/types/note';

const STORAGE_KEY = 'bardo.notes.v1';
const TRASH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function repair(raw: unknown): Note | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const n = raw as Partial<Note>;
  if (typeof n.id !== 'string' || typeof n.title !== 'string') return null;
  const now = Date.now();
  return {
    id: n.id,
    title: n.title,
    body: typeof n.body === 'string' ? n.body : '',
    pinned: n.pinned === true,
    tint: NoteTintOrder.includes(n.tint as Note['tint']) ? (n.tint as Note['tint']) : 'cream',
    deletedAt: typeof n.deletedAt === 'number' ? n.deletedAt : null,
    createdAt: typeof n.createdAt === 'number' ? n.createdAt : now,
    updatedAt: typeof n.updatedAt === 'number' ? n.updatedAt : now,
  };
}

export async function loadNotes(): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed
      .map(repair)
      .filter((n): n is Note => n !== null)
      // Permanently drop trash older than 30 days.
      .filter((n) => !(n.deletedAt !== null && now - n.deletedAt > TRASH_TTL_MS));
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
