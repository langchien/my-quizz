import { FirebaseAuthRepository } from '@/repositories/FirebaseAuthRepository'
import type { IAuthRepository } from '@/repositories/IAuthRepository'

// Singleton instance of the auth repository
// This allows us to swap out the implementation later (e.g., MockAuthRepository) without changing UI hooks.
export const authService: IAuthRepository = new FirebaseAuthRepository()
