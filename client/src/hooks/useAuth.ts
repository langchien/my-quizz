import { create } from 'zustand'
import { authService } from '@/services/authService'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => () => void
  logout: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  initialize: () => {
    set({ loading: true })
    // Listen to auth state changes from the service layer
    const unsubscribe = authService.onAuthStateChanged((user) => {
      set({ user, loading: false, initialized: true })
    })

    // We don't typically unsubscribe in a global store unless the app unmounts,
    // but in a typical SPA, this store lives for the lifetime of the tab.
    return unsubscribe
  },
  logout: async () => {
    set({ loading: true })
    try {
      await authService.logout()
      set({ user: null, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
}))
