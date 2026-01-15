import { supabase } from '@/lib/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoKeys, type ImportResult, type ImportTodoItem } from '../types'

/**
 * Hook import nhiều todos cùng lúc
 * Hỗ trợ truyền id tùy chọn, bỏ qua nếu trùng với id đã có
 */
export const useImportTodos = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (items: ImportTodoItem[]): Promise<ImportResult> => {
      // Lấy danh sách todos hiện có để check trùng ID
      const { data: existingTodos, error: fetchError } = await supabase.from('Todo').select('id')

      if (fetchError) throw fetchError

      const existingIds = new Set(existingTodos?.map((t) => t.id) ?? [])

      // Phân loại items: có ID trùng vs không trùng
      const skippedItems: ImportTodoItem[] = []
      const itemsToInsert: ImportTodoItem[] = []

      for (const item of items) {
        if (item.id && existingIds.has(item.id)) {
          skippedItems.push(item)
        } else {
          itemsToInsert.push(item)
        }
      }

      // Insert các items hợp lệ
      let insertedItems: ImportTodoItem[] = []

      if (itemsToInsert.length > 0) {
        const todosToInsert = itemsToInsert.map((item) => ({
          ...(item.id && { id: item.id }),
          title: item.title,
          completed: item.completed ?? false,
        }))

        const { data: inserted, error: insertError } = await supabase
          .from('Todo')
          .insert(todosToInsert)
          .select()

        if (insertError) throw insertError
        insertedItems = inserted ?? []
      }

      return {
        success: true,
        insertedCount: insertedItems.length,
        skippedCount: skippedItems.length,
        skippedItems: skippedItems.map((item) => ({
          id: item.id!,
          title: item.title,
          reason: 'ID đã tồn tại trong database',
        })),
      }
    },
    onSuccess: () => {
      // Invalidate all todo queries để refresh data
      queryClient.invalidateQueries({ queryKey: todoKeys.all })
    },
  })
}
