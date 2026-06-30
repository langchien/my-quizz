import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập Email').email('Địa chỉ email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function useLoginForm() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const user = await authService.login(data)
      setUser(user)
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Đăng nhập thất bại', {
        duration: 6000,
      })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const user = await authService.loginWithGoogle()
      setUser(user)
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Đăng nhập bằng Google thất bại', {
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
