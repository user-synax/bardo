import type { NoteTint } from '@/constants/theme';

export type Note = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  tint: NoteTint;
  /** Set when soft-deleted (trash). Null = live. */
  deletedAt: number | null;
  createdAt: number;
  updatedAt: number;
};

export type NewNoteInput = {
  title: string;
  body?: string;
  pinned?: boolean;
  tint?: NoteTint;
};

export function newNoteId(): string {
  return `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function createNote(input: NewNoteInput): Note {
  const now = Date.now();
  return {
    id: newNoteId(),
    title: (input.title ?? '').trim(),
    body: (input.body ?? '').trim(),
    pinned: input.pinned ?? false,
    tint: input.tint ?? 'cream',
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}
