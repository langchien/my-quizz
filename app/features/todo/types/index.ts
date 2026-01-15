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

// Types cho Pagination
export interface PaginatedResult<T> {
  data: T[]
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Types cho Import
export interface ImportTodoItem {
  id?: string
  title: string
  completed?: boolean
}

export interface SkippedItem {
  id: string
  title: string
  reason: string
}

export interface ImportResult {
  success: boolean
  insertedCount: number
  skippedCount: number
  skippedItems: SkippedItem[]
}
