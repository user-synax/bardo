export type Priority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  title: string;
  notes: string;
  completed: boolean;
  priority: Priority;
  /** YYYY-MM-DD or null */
  dueDate: string | null;
  createdAt: number;
  updatedAt: number;
};

export type TodoFilter = 'all' | 'active' | 'done';

export type NewTodoInput = {
  title: string;
  notes?: string;
  priority?: Priority;
  dueDate?: string | null;
};

export function newTodoId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function createTodo(input: NewTodoInput): Todo {
  const now = Date.now();
  return {
    id: newTodoId(),
    title: input.title.trim(),
    notes: (input.notes ?? '').trim(),
    completed: false,
    priority: input.priority ?? 'medium',
    dueDate: input.dueDate ?? null,
    createdAt: now,
    updatedAt: now,
  };
}
