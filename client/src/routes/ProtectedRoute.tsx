import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-red-500/30 border-t-red-500'></div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login but save the attempted location
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <Outlet />
}
