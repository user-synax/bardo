import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { loadTodos, saveTodos } from '@/lib/todo-storage';
import { createTodo, type NewTodoInput, type Todo, type TodoFilter } from '@/types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    loadTodos().then((stored) => {
      if (mounted) {
        // Newest first.
        stored.sort((a, b) => b.createdAt - a.createdAt);
        setTodos(stored);
        setLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Debounced persist — keeps typing/toggling at 60fps on low-end Android.
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveTodos(todos);
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [todos, loaded]);

  const addTodo = useCallback((input: NewTodoInput): Todo | null => {
    const title = input.title.trim();
    if (!title) return null;
    const todo = createTodo({ ...input, title });
    setTodos((prev) => [todo, ...prev]);
    return todo;
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t,
      ),
    );
  }, []);

  const updateTodo = useCallback((id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t)),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'done':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const counts = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    return { total, done, open: total - done };
  }, [todos]);

  return {
    todos: filtered,
    allTodos: todos,
    loaded,
    filter,
    setFilter,
    counts,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  };
}
