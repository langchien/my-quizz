import type { CreateUserProfileDto, UpdateUserProfileDto, UserProfile } from '@/types/user'

export interface IUserRepository {
  /** Lấy user profile từ Firestore */
  getUserProfile(uid: string): Promise<UserProfile | null>

  /** Tạo user profile mới (onboarding) */
  createUserProfile(uid: string, data: CreateUserProfileDto): Promise<UserProfile>

  /** Cập nhật user profile (settings) */
  updateUserProfile(uid: string, data: UpdateUserProfileDto): Promise<UserProfile>

  /** Kiểm tra username đã tồn tại chưa */
  isUsernameAvailable(username: string): Promise<boolean>

  /** Xóa user profile khỏi Firestore */
  deleteUserProfile(uid: string): Promise<void>
}
