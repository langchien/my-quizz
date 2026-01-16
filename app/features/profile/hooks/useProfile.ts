import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/supabase'
import { useQuery } from '@tanstack/react-query'

export type Profile = Tables<'User'>

/**
 * Fetch profile từ bảng User theo userId
 */
async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('User').select('*').eq('id', userId).single()
  if (error) {
    // Nếu không tìm thấy profile, return null thay vì throw
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(error.message)
  }

  return data
}

/**
 * Hook để lấy profile của user hiện tại
 *
 * @param userId - ID của user cần lấy profile
 * @returns Query result với profile data
 *
 * @example
 * const { profile, isLoading } = useProfile(user.id)
 */
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 phút
  })
}
