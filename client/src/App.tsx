import { useAuth } from '@/hooks/useAuth'
import AppRoutes from '@/routes/AppRoutes'
import { useEffect } from 'react'

/**
 * App root component.
 * Khởi tạo Firebase Auth listener và chỉ render router SAU khi auth đã initialized.
 * Điều này đảm bảo loaders trong router có thể truy cập auth state an toàn.
 */
export function App() {
  const { initialize, initialized } = useAuth()

  useEffect(() => {
    const unsubscribe = initialize()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [initialize])

  // Show loading screen while auth initializes.
  // This GATES the router creation — loaders won't run until auth is ready.
  if (!initialized) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-red-500/30 border-t-red-500' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>Đang khởi tạo...</p>
        </div>
      </div>
    )
  }

  // Render AppRoutes directly — router is created inside AppRoutes only after initialized is true
  return <AppRoutes />
}

export default App
