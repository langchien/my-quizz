import { supabase } from '@/lib/supabase'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

interface UseDeleteAccountOptions {
  onSuccess?: () => void
}

/**
 * Hook xử lý logic xóa tài khoản
 */
export function useDeleteAccount({ onSuccess }: UseDeleteAccountOptions = {}) {
  const [confirmText, setConfirmText] = useState('')
  const navigate = useNavigate()

  const CONFIRM_PHRASE = 'XÓA TÀI KHOẢN'

  const mutation = useMutation({
    mutationFn: async () => {
      // Gọi RPC function để xóa user (cần tạo trong Supabase)
      const { error } = await supabase.rpc('delete_user' as never)

      if (error) {
        throw new Error(error.message)
      }

      // Đăng xuất sau khi xóa
      await supabase.auth.signOut()
    },
    onSuccess: () => {
      toast.success('Tài khoản đã được xóa')
      onSuccess?.()
      navigate('/login')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa tài khoản')
    },
  })

  const canDelete = confirmText === CONFIRM_PHRASE

  const handleDelete = () => {
    if (canDelete) {
      mutation.mutate()
    }
  }

  const reset = () => {
    setConfirmText('')
  }

  return {
    confirmText,
    setConfirmText,
    canDelete,
    isPending: mutation.isPending,
    handleDelete,
    reset,
    CONFIRM_PHRASE,
  }
}
