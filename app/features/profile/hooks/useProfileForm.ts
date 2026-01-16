import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import type { Profile } from './useProfile'
import { useUpdateProfile } from './useUpdateProfile'

// Schema validation với Zod
export const profileFormSchema = z.object({
  displayName: z
    .string()
    .min(2, { message: 'Tên hiển thị phải có ít nhất 2 ký tự' })
    .max(50, { message: 'Tên hiển thị không được quá 50 ký tự' }),
  bio: z
    .string()
    .max(500, { message: 'Giới thiệu không được quá 500 ký tự' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^(\+84|0)?[0-9]{9,10}$/, { message: 'Số điện thoại không hợp lệ' })
    .optional()
    .or(z.literal('')),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

interface UseProfileFormOptions {
  userId: string
  profile: Profile | null
  onSuccess?: () => void
}

/**
 * Custom hook chứa logic cho ProfileForm
 * - Khởi tạo react-hook-form với zod validation
 * - Handle submit với mutation
 * - Toast notifications
 */
export function useProfileForm({ userId, profile, onSuccess }: UseProfileFormOptions) {
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: profile?.displayName || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
    },
  })

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile(
      { userId, data: values },
      {
        onSuccess: () => {
          toast.success('Cập nhật thông tin thành công!')
          onSuccess?.()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  return {
    form,
    isPending,
    onSubmit,
    handleSubmit: form.handleSubmit(onSubmit),
  }
}
