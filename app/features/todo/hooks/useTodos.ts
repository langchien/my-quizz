import { supabase } from '@/lib/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateTodo, UpdateTodo } from '../types'
import { todoKeys } from '../types'

/**
 * Hook lấy danh sách todos
 * Sử dụng React Query cho caching và auto-refetch
 */
export const useTodos = () => {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Todo')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

/**
 * Hook tạo todo mới
 * Tự động invalidate cache sau khi tạo thành công
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newTodo: CreateTodo) => {
      const { data, error } = await supabase.from('Todo').insert(newTodo).select().single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Invalidate và refetch danh sách todos
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

/**
 * Hook cập nhật todo
 * Hỗ trợ optimistic update cho UX mượt mà
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTodo & { id: string }) => {
      const { data, error } = await supabase
        .from('Todo')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

/**
 * Hook xóa todo
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('Todo').delete().eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

/**
 * Hook toggle trạng thái completed với Optimistic Update
 * Cập nhật UI ngay lập tức, rollback nếu lỗi
 */
export const useToggleTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from('Todo')
        .update({ completed })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    // Optimistic update
    onMutate: async ({ id, completed }) => {
      // Cancel bất kỳ refetch nào đang chạy
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() })

      // Lưu snapshot trước đó
      const previousTodos = queryClient.getQueryData(todoKeys.lists())

      // Optimistic update
      queryClient.setQueryData(
        todoKeys.lists(),
        (old: { id: string; completed: boolean }[] | undefined) =>
          old?.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
      )

      return { previousTodos }
    },
    // Rollback nếu lỗi
    onError: (_err, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}
