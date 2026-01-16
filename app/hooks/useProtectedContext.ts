import type { User } from '@supabase/supabase-js'
import { useOutletContext } from 'react-router'

interface ProtectedContext {
  user: User
}

/**
 * Hook để lấy thông tin user từ Protected Layout
 *
 * @example
 * function DashboardPage() {
 *   const { user } = useProtectedContext()
 *   return <div>Xin chào, {user.email}</div>
 * }
 */
export function useProtectedContext() {
  return useOutletContext<ProtectedContext>()
}
