import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { loadNotes, saveNotes } from '@/lib/note-storage';
import { createNote, type NewNoteInput, type Note } from '@/types/note';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    loadNotes().then((stored) => {
      if (mounted) {
        stored.sort((a, b) => b.updatedAt - a.updatedAt);
        setNotes(stored);
        setLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveNotes(notes);
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [notes, loaded]);

  const addNote = useCallback((input: NewNoteInput): Note => {
    const note = createNote(input);
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback((id: string, patch: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)),
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n)),
    );
  }, []);

  const sorted = useMemo(() => {
    const pinned = notes.filter((n) => n.pinned);
    const others = notes.filter((n) => !n.pinned);
    return { pinned, others };
  }, [notes]);

  return { notes, ...sorted, loaded, addNote, updateNote, deleteNote, togglePin };
}
