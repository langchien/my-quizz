import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <Spinner className='size-12 text-primary' />
      </div>
    )
  }

  if (!user) {
    // Redirect to login but save the attempted location
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return <Outlet />
}
