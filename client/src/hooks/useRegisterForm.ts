import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

export const registerSchema = z.object({
  displayName: z.string().min(2, 'Tên hiển thị phải có ít nhất 2 ký tự'),
  email: z.string().min(1, 'Vui lòng nhập Email').email('Địa chỉ email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export function useRegisterForm() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const user = await authService.register(data)
      setUser(user)
      navigate('/onboarding')
    } catch (error: any) {
      toast.error(error.message || 'Đăng ký thất bại', {
        duration: 6000,
      })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const user = await authService.loginWithGoogle()
      setUser(user)
      navigate('/onboarding')
    } catch (error: any) {
      toast.error(error.message || 'Đăng ký bằng Google thất bại', {
        duration: 6000,
      })
    }
  }

  return {
    form,
    onSubmit,
    handleGoogleLogin,
  }
}
