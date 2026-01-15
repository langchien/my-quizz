import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { todoKeys, type PaginatedResult, type Todo } from '../types'

interface UsePaginatedTodosParams {
  page: number
  pageSize: number
}

/**
 * Hook lấy danh sách todos với phân trang
 * Sử dụng Supabase range() để lấy đúng số items theo trang
 */
export const usePaginatedTodos = ({ page, pageSize }: UsePaginatedTodosParams) => {
  return useQuery({
    queryKey: todoKeys.list({ page, pageSize }),
    queryFn: async (): Promise<PaginatedResult<Todo>> => {
      // Tính range cho pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      // Query với count để biết tổng số items
      const { data, error, count } = await supabase
        .from('Todo')
        .select('*', { count: 'exact' })
        .order('createdAt', { ascending: false })
        .range(from, to)

      if (error) throw error

      const totalCount = count ?? 0
      const totalPages = Math.ceil(totalCount / pageSize)

      return {
        data: data ?? [],
        totalCount,
        totalPages,
        currentPage: page,
        pageSize,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    },
  })
}
