import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/useAuth'
import { dashboardLoader, quizEditorLoader, soloLoader } from '@/routes/loaders'
import ProtectedRoute from '@/routes/ProtectedRoute'
import React, { Suspense, useState } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useNavigation } from 'react-router'

// Error boundaries (small, no need to lazy load)
import { DashboardError } from '@/components/errors/DashboardError'
import { GameError } from '@/components/errors/GameError'
import { NotFoundError } from '@/components/errors/NotFoundError'
import { QuizEditorError } from '@/components/errors/QuizEditorError'

// Skeletons (small, no need to lazy load)
import { AuthSkeleton } from '@/components/skeletons/AuthSkeleton'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'
import {
  HostSkeleton,
  JoinRoomSkeleton,
  PlayerSkeleton,
  SoloSetupSkeleton,
  SoloSkeleton,
} from '@/components/skeletons/GameSkeleton'
import { QuizEditorSkeleton } from '@/components/skeletons/QuizEditorSkeleton'

// Lazy load route components (code splitting)
const LazyLogin = React.lazy(() => import('@/pages/auth/Login'))
const LazyRegister = React.lazy(() => import('@/pages/auth/Register'))
const LazyDashboard = React.lazy(() => import('@/pages/dashboard/Dashboard'))
const LazyQuizEditor = React.lazy(() => import('@/pages/dashboard/QuizEditor'))
const LazyLiveHost = React.lazy(() => import('@/pages/host/LiveHost'))
const LazyJoinRoom = React.lazy(() => import('@/pages/player/JoinRoom'))
const LazyLivePlayer = React.lazy(() => import('@/pages/player/LivePlayer'))
const LazySoloPlay = React.lazy(() => import('@/pages/solo/SoloPlay'))
const LazySoloSetup = React.lazy(() => import('@/pages/solo/SoloSetup'))
const LazyChallengeSetup = React.lazy(() => import('@/pages/player/ChallengeSetup'))
const LazyOnboarding = React.lazy(() => import('@/pages/auth/Onboarding'))
const LazySettingsPage = React.lazy(() => import('@/pages/profile/SettingsPage'))

// AuthGuard for public routes (redirects to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (user) return <Navigate to='/dashboard' replace />
  return <>{children}</>
}

// Root layout — renders child routes
function RootLayout() {
  const navigation = useNavigation()

  if (navigation.state === 'loading') {
    const nextPath = navigation.location?.pathname || ''

    if (nextPath === '/dashboard') {
      return <DashboardSkeleton />
    }
    if (nextPath.startsWith('/dashboard/quiz')) {
      return <QuizEditorSkeleton />
    }
    if (nextPath.startsWith('/challenge/')) {
      return <HostSkeleton />
    }
    if (nextPath.startsWith('/host/')) {
      return <HostSkeleton />
    }
    if (nextPath.startsWith('/play/')) {
      return <PlayerSkeleton />
    }
    if (nextPath.match(/\/solo\/[^/]+\/setup$/)) {
      return <SoloSetupSkeleton />
    }
    if (nextPath.startsWith('/solo/')) {
      return <SoloSkeleton />
    }
    if (nextPath === '/join') {
      return <JoinRoomSkeleton />
    }
    if (nextPath === '/login' || nextPath === '/register' || nextPath === '/onboarding') {
      return <AuthSkeleton />
    }
    if (nextPath === '/settings') {
      return <DashboardSkeleton />
    }

    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <Spinner className='size-12 text-primary' />
      </div>
    )
  }

  return <Outlet />
}

function createRouter() {
  return createBrowserRouter([
    {
      element: <RootLayout />,
      hydrateFallbackElement: <GlobalInitialLoader />,
      children: [
        // ─── Public auth routes ─────────────────────────
        {
          path: '/login',
          element: (
            <PublicRoute>
              <Suspense fallback={<AuthSkeleton />}>
                <LazyLogin />
              </Suspense>
            </PublicRoute>
          ),
        },
        {
          path: '/register',
          element: (
            <PublicRoute>
              <Suspense fallback={<AuthSkeleton />}>
                <LazyRegister />
              </Suspense>
            </PublicRoute>
          ),
        },

        // ─── Protected routes ───────────────────────────
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: '/dashboard',
              loader: dashboardLoader,
              element: (
                <Suspense fallback={<DashboardSkeleton />}>
                  <LazyDashboard />
                </Suspense>
              ),
              errorElement: <DashboardError />,
            },
            {
              path: '/dashboard/quiz/new',
              element: (
                <Suspense fallback={<QuizEditorSkeleton />}>
                  <LazyQuizEditor />
                </Suspense>
              ),
            },
            {
              path: '/dashboard/quiz/:id/edit',
              loader: quizEditorLoader,
              element: (
                <Suspense fallback={<QuizEditorSkeleton />}>
                  <LazyQuizEditor />
                </Suspense>
              ),
              errorElement: <QuizEditorError />,
            },
            {
              path: '/host/:sessionId',
              element: (
                <Suspense fallback={<HostSkeleton />}>
                  <LazyLiveHost />
                </Suspense>
              ),
              errorElement: <GameError />,
            },
            {
              path: '/challenge/:quizId/setup',
              element: (
                <Suspense fallback={<HostSkeleton />}>
                  <LazyChallengeSetup />
                </Suspense>
              ),
              errorElement: <GameError />,
            },
            {
              path: '/settings',
              element: (
                <Suspense fallback={<DashboardSkeleton />}>
                  <LazySettingsPage />
                </Suspense>
              ),
            },
          ],
        },

        // ─── Onboarding (protected, separate from main layout) ─
        {
          path: '/onboarding',
          element: <ProtectedRoute />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<AuthSkeleton />}>
                  <LazyOnboarding />
                </Suspense>
              ),
            },
          ],
        },

        // ─── Public game routes ─────────────────────────
        {
          path: '/join',
          element: (
            <Suspense fallback={<JoinRoomSkeleton />}>
              <LazyJoinRoom />
            </Suspense>
          ),
        },
        {
          path: '/play/:sessionId',
          element: (
            <Suspense fallback={<PlayerSkeleton />}>
              <LazyLivePlayer />
            </Suspense>
          ),
          errorElement: <GameError />,
        },
        {
          path: '/solo/:quizId/setup',
          loader: soloLoader,
          element: (
            <Suspense fallback={<SoloSetupSkeleton />}>
              <LazySoloSetup />
            </Suspense>
          ),
          errorElement: <GameError />,
        },
        {
          path: '/solo/:quizId',
          loader: soloLoader,
          element: (
            <Suspense fallback={<SoloSkeleton />}>
              <LazySoloPlay />
            </Suspense>
          ),
          errorElement: <GameError />,
        },

        // ─── Fallback ───────────────────────────────────
        {
          path: '*',
          element: <NotFoundError />,
        },
      ],
    },
  ])
}

/**
 * Loader ban đầu cho toàn bộ ứng dụng trước khi Router được khởi tạo hoàn tất.
 * Kiểm tra pathname hiện tại để hiển thị Skeleton tương ứng ngay lập tức.
 */
function GlobalInitialLoader() {
  const path = window.location.pathname

  if (path === '/dashboard') {
    return <DashboardSkeleton />
  }
  if (path.startsWith('/dashboard/quiz')) {
    return <QuizEditorSkeleton />
  }
  if (path.startsWith('/challenge/')) {
    return <HostSkeleton />
  }
  if (path.startsWith('/host/')) {
    return <HostSkeleton />
  }
  if (path.startsWith('/play/')) {
    return <PlayerSkeleton />
  }
  if (path.match(/\/solo\/[^/]+\/setup$/)) {
    return <SoloSetupSkeleton />
  }
  if (path.startsWith('/solo/')) {
    return <SoloSkeleton />
  }
  if (path === '/join') {
    return <JoinRoomSkeleton />
  }
  if (path === '/login' || path === '/register' || path === '/onboarding') {
    return <AuthSkeleton />
  }
  if (path === '/settings') {
    return <DashboardSkeleton />
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <Spinner className='size-12 text-primary' />
    </div>
  )
}

/**
 * Router provider component.
 * Router được tạo 1 lần duy nhất bên trong useState initializer.
 * Component này chỉ render SAU khi auth đã initialized (đảm bảo bởi App.tsx).
 */
export default function AppRoutes() {
  const [router] = useState(createRouter)
  return <RouterProvider router={router} />
}
