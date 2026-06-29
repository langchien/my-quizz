import { useAuth } from '@/hooks/useAuth'
import React from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard/Dashboard'
import QuizEditor from '@/pages/dashboard/QuizEditor'
import LiveHost from '@/pages/host/LiveHost'
import JoinRoom from '@/pages/player/JoinRoom'
import LivePlayer from '@/pages/player/LivePlayer'
import ProtectedRoute from '@/routes/ProtectedRoute'

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
          {
            path: '/host/:sessionId',
            element: <LiveHost />,
          },
          // Additional protected routes will go here
        ],
      },
      {
        path: '/join',
        element: <JoinRoom />,
      },
      {
        path: '/play/:sessionId',
        element: <LivePlayer />,
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
