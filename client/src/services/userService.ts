import { auth } from '@/lib/firebase'
import { FirebaseUserRepository } from '@/repositories/FirebaseUserRepository'
import type { IUserRepository } from '@/repositories/IUserRepository'
import type { CreateUserProfileDto, UpdateUserProfileDto, UserProfile } from '@/types/user'
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'

class UserService {
  constructor(private readonly repository: IUserRepository) {}

  /** Lấy user profile từ Firestore */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    return this.repository.getUserProfile(uid)
  }

  /** Tạo user profile mới (gọi khi hoàn thành onboarding) */
  async createUserProfile(uid: string, data: CreateUserProfileDto): Promise<UserProfile> {
    return this.repository.createUserProfile(uid, data)
  }

  /** Cập nhật user profile (gọi từ Settings) */
  async updateUserProfile(uid: string, data: UpdateUserProfileDto): Promise<UserProfile> {
    // Nếu update username, kiểm tra unique trước
    if (data.username) {
      const available = await this.repository.isUsernameAvailable(data.username)
      if (!available) {
        throw new Error('Tên người dùng đã được sử dụng. Vui lòng chọn tên khác.')
      }
    }

    return this.repository.updateUserProfile(uid, data)
  }

  /** Kiểm tra username khả dụng */
  async isUsernameAvailable(username: string): Promise<boolean> {
    return this.repository.isUsernameAvailable(username)
  }

  /**
   * Đổi mật khẩu người dùng.
   * Yêu cầu re-authenticate trước khi đổi (Firebase security requirement).
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser
    if (!user || !user.email) {
      throw new Error('Không tìm thấy phiên đăng nhập. Vui lòng đăng nhập lại.')
    }

    // Re-authenticate
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    try {
      await reauthenticateWithCredential(user, credential)
    } catch {
      throw new Error('Mật khẩu hiện tại không chính xác.')
    }

    // Update password
    await updatePassword(user, newPassword)
  }

  /**
   * Xóa tài khoản hoàn toàn.
   * Xóa Firestore profile trước, rồi xóa Firebase Auth user.
   */
  async deleteAccount(uid: string, password: string): Promise<void> {
    const user = auth.currentUser
    if (!user || !user.email) {
      throw new Error('Không tìm thấy phiên đăng nhập. Vui lòng đăng nhập lại.')
    }

    // Re-authenticate trước khi xóa
    const credential = EmailAuthProvider.credential(user.email, password)
    try {
      await reauthenticateWithCredential(user, credential)
    } catch {
      throw new Error('Mật khẩu không chính xác. Không thể xóa tài khoản.')
    }

    // Xóa Firestore data trước
    await this.repository.deleteUserProfile(uid)

    // Xóa Firebase Auth user
    await deleteUser(user)
  }
}

// Singleton instance
export const userService = new UserService(new FirebaseUserRepository())
