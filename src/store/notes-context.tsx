import { createContext, useContext, type ReactNode } from 'react';

import { useNotes } from '@/hooks/use-notes';

type NotesStore = ReturnType<typeof useNotes>;

const NotesContext = createContext<NotesStore | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const store = useNotes();
  return <NotesContext.Provider value={store}>{children}</NotesContext.Provider>;
}

export function useNotesStore(): NotesStore {
  const store = useContext(NotesContext);
  if (!store) throw new Error('useNotesStore must be used inside NotesProvider');
  return store;
}
