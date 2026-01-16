import { supabase } from '@/lib/supabase'

/**
 * Đăng nhập bằng Google OAuth
 */
export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Đăng nhập bằng Email/Password
 */
export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Đăng ký tài khoản mới bằng Email/Password
 */
export async function registerWithEmail(email: string, password: string, displayName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName || email.split('@')[0],
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Đăng xuất
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Đổi mật khẩu (khi đã đăng nhập)
 * Supabase yêu cầu verify mật khẩu cũ bằng cách re-authenticate
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  // Lấy email user hiện tại
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    throw new Error('Không tìm thấy thông tin người dùng')
  }

  // Verify mật khẩu hiện tại bằng cách đăng nhập lại
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })

  if (signInError) {
    throw new Error('Mật khẩu hiện tại không đúng')
  }

  // Cập nhật mật khẩu mới
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    throw new Error(updateError.message)
  }
}

/**
 * Gửi email reset password
 */
export async function sendPasswordResetEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Cập nhật password từ link reset (user click link trong email)
 * Lưu ý: User đã được authenticate qua link email trước đó
 */
export async function updatePasswordFromReset(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Xóa tài khoản hiện tại
 * Lưu ý: Cần có Edge Function hoặc Service Role để xóa user
 * Tạm thời sử dụng soft delete bằng cách signOut
 */
export async function deleteAccount() {
  // Gọi Edge Function để xóa user (cần service_role key)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Không tìm thấy phiên đăng nhập')
  }

  // Gọi RPC function để xóa user
  // Note: 'delete_user' cần được tạo trong database (xem migration)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)('delete_user')

  if (error) {
    throw new Error(error.message)
  }

  // Đăng xuất sau khi xóa
  await supabase.auth.signOut()
}
