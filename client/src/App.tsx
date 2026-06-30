import { Spinner } from '@/components/ui/spinner'
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
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <div className='flex flex-col items-center gap-4'>
          <Spinner className='size-12 text-primary' />
          <p className='text-sm text-muted-foreground'>Đang khởi tạo...</p>
        </div>
      </div>
    )
  }

  // Render AppRoutes directly — router is created inside AppRoutes only after initialized is true
  return <AppRoutes />
}

export default App
