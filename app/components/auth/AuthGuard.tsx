import { PAGES } from '@/config/pages'
import { useAuth } from '@/features/auth/context/AuthContext'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

interface AuthGuardProps {
  children: ReactNode
}

/**
 * AuthGuard Component
 * Bảo vệ route, redirect về /login nếu chưa đăng nhập
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Đang kiểm tra auth state
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
      </div>
    )
  }

  // Chưa đăng nhập -> redirect về login
  if (!user) {
    return <Navigate to={PAGES.LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</>
}
