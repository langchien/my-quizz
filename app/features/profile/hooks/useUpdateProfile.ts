import { supabase } from '@/lib/supabase'
import type { TablesUpdate } from '@/types/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export type ProfileUpdate = Omit<TablesUpdate<'User'>, 'id' | 'email' | 'createdAt' | 'updatedAt'>

/**
 * Cập nhật profile trong bảng User
 */
async function updateProfile(userId: string, data: ProfileUpdate) {
  const { data: result, error } = await supabase
    .from('User')
    .update({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return result
}

/**
 * Hook để cập nhật profile user
 *
 * @example
 * const { mutate, isPending } = useUpdateProfile()
 * mutate({ userId: 'xxx', data: { displayName: 'New Name' } })
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ProfileUpdate }) =>
      updateProfile(userId, data),
    onSuccess: (_, { userId }) => {
      // Invalidate profile query để refetch data mới
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })
}
