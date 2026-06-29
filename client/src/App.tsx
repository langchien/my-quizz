import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import AppRoutes from '@/routes/AppRoutes'

export function App() {
  const { initialize } = useAuth()

  useEffect(() => {
    // Start listening to Firebase Auth state on mount
    const unsubscribe = initialize()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [initialize])

  return <AppRoutes />
}

export default App
