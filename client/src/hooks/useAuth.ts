import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import type { User, UserProfile } from '@/types/user'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => () => void
  logout: () => Promise<void>
  /** Reload user profile từ Firestore (gọi sau khi update profile) */
  refreshProfile: () => Promise<void>
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  initialize: () => {
    set({ loading: true })
    // Listen to auth state changes from the service layer
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        // Load user profile from Firestore
        try {
          const profile = await userService.getUserProfile(user.uid)
          set({ user, userProfile: profile, loading: false, initialized: true })
        } catch {
          // Profile may not exist yet (new user before onboarding)
          set({ user, userProfile: null, loading: false, initialized: true })
        }
      } else {
        set({ user: null, userProfile: null, loading: false, initialized: true })
      }
    })

    return unsubscribe
  },
  logout: async () => {
    set({ loading: true })
    try {
      await authService.logout()
      set({ user: null, userProfile: null, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  refreshProfile: async () => {
    const { user } = get()
    if (!user) return

    try {
      const profile = await userService.getUserProfile(user.uid)
      set({ userProfile: profile })
    } catch {
      // Silently fail — profile might not exist yet
    }
  },
}))
