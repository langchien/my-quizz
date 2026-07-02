import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'
import type { UpdateUserProfileDto } from '@/types/user'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

/**
 * Hook quản lý logic cho trang Settings.
 */
export function useSettings() {
  const { user, userProfile, logout, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  /** Cập nhật profile */
  const updateProfile = useCallback(
    async (data: UpdateUserProfileDto) => {
      if (!user) return

      setIsSaving(true)
      try {
        await userService.updateUserProfile(user.uid, data)
        await refreshProfile()
        toast.success('Cập nhật thông tin thành công!')
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.'
        toast.error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [user, refreshProfile],
  )

  /** Đổi mật khẩu */
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsChangingPassword(true)
    try {
      await userService.changePassword(currentPassword, newPassword)
      toast.success('Đổi mật khẩu thành công!')
      return true
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.'
      toast.error(message)
      return false
    } finally {
      setIsChangingPassword(false)
    }
  }, [])

  /** Xóa tài khoản */
  const deleteAccount = useCallback(
    async (password: string) => {
      if (!user) return

      setIsDeletingAccount(true)
      try {
        await userService.deleteAccount(user.uid, password)
        toast.success('Tài khoản đã được xóa.')
        navigate('/login')
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.'
        toast.error(message)
      } finally {
        setIsDeletingAccount(false)
      }
    },
    [user, navigate],
  )

  /** Đăng xuất */
  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/login')
  }, [logout, navigate])

  return {
    user,
    userProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    handleLogout,
    isSaving,
    isChangingPassword,
    isDeletingAccount,
  }
}
