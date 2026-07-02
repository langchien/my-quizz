/** Vai trò người dùng trong hệ thống */
export type UserRole = 'student' | 'teacher' | 'admin'

/** Mục đích sử dụng */
export type UseCase = 'k12' | 'business' | 'university' | 'tutoring'

/** Lớp/cấp học */
export type Grade =
  '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'university' | 'other'

/** Preferences người dùng */
export interface UserPreferences {
  theme: 'classic' | 'dark' | 'focus'
  language: string
}

/**
 * User cơ bản — mapping từ Firebase Auth.
 * Dùng trong auth state (useAuth store).
 */
export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt?: string // stored as ISO string or timestamp
}

/**
 * User Profile mở rộng — lưu trong Firestore `users` collection.
 * Bao gồm tất cả thông tin cá nhân, settings, onboarding.
 */
export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt?: string

  // Thông tin cá nhân (Onboarding)
  username?: string
  firstName?: string
  lastName?: string
  grade?: Grade
  role?: UserRole
  age?: number
  avatarUrl?: string // emoji string hoặc URL ảnh
  useCase?: UseCase

  // Settings
  preferences: UserPreferences

  // Onboarding state
  onboardingCompleted: boolean
}

/** DTO tạo profile mới (Onboarding) */
export interface CreateUserProfileDto {
  firstName: string
  lastName: string
  useCase: UseCase
  role: UserRole
  grade?: Grade
  age?: number
  avatarUrl: string
}

/** DTO cập nhật profile (Settings) */
export interface UpdateUserProfileDto {
  username?: string
  firstName?: string
  lastName?: string
  displayName?: string
  grade?: Grade
  role?: UserRole
  age?: number
  avatarUrl?: string
  useCase?: UseCase
  preferences?: Partial<UserPreferences>
}
