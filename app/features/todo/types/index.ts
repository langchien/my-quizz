import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase'

// Types cho Todo
export type Todo = Tables<'Todo'>
export type CreateTodo = TablesInsert<'Todo'>
export type UpdateTodo = TablesUpdate<'Todo'>

// Query keys cho React Query
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...todoKeys.lists(), filters] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}
