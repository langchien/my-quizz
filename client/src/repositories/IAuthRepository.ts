import type { User } from '@/types/user'

export interface LoginCredentials {
  email: string
  password?: string
}

export interface RegisterCredentials {
  email: string
  password?: string
  displayName: string
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<User>
  register(credentials: RegisterCredentials): Promise<User>
  loginWithGoogle(): Promise<User>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  onAuthStateChanged(callback: (user: User | null) => void): () => void
}
