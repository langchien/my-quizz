import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard/Dashboard'
import QuizEditor from '../pages/dashboard/QuizEditor'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

// AuthGuard for public routes (redirects to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (user) return <Navigate to='/dashboard' replace />
  return <>{children}</>
}

// Root wrapper that handles initialization loading
function RootLayout() {
  const { initialized } = useAuth()

  if (!initialized) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-red-500/30 border-t-red-500'></div>
      </div>
    )
  }

  return <Outlet />
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/dashboard/quiz/new',
            element: <QuizEditor />,
          },
          {
            path: '/dashboard/quiz/:id/edit',
            element: <QuizEditor />,
          },
          // Additional protected routes will go here
        ],
      },
      {
        // Fallback route
        path: '*',
        element: <Navigate to='/dashboard' replace />,
      },
    ],
  },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
