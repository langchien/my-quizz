import { supabase } from '@/lib/supabase'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

interface UseChangePasswordOptions {
  onSuccess?: () => void
}

/**
 * Hook xử lý logic đổi mật khẩu
 */
export function useChangePassword({ onSuccess }: UseChangePasswordOptions = {}) {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: ChangePasswordFormValues) => {
      // Lấy user hiện tại
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.email) {
        throw new Error('Không tìm thấy thông tin người dùng')
      }

      // Verify mật khẩu hiện tại
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: values.currentPassword,
      })

      if (signInError) {
        throw new Error('Mật khẩu hiện tại không đúng')
      }

      // Cập nhật mật khẩu mới
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      })

      if (updateError) {
        throw new Error(updateError.message)
      }
    },
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!')
      form.reset()
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    mutation.mutate(values)
  })

  return {
    form,
    isPending: mutation.isPending,
    handleSubmit,
  }
}
