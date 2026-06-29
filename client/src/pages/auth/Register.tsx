import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/authService'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

const registerSchema = z.object({
  displayName: z.string().min(2, 'Tên hiển thị phải có ít nhất 2 ký tự'),
  email: z.string().min(1, 'Vui lòng nhập Email').email('Địa chỉ email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const user = await authService.register(data)
      setUser(user)
      navigate('/dashboard')
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
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Đăng ký bằng Google thất bại', {
        duration: 6000,
      })
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 via-rose-500 to-orange-500 p-4'>
      <div className='relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg'>
        {/* Decorative elements */}
        <div className='absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl'></div>
        <div className='absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl'></div>

        <div className='relative z-10'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-3xl font-bold tracking-tight text-white'>Tạo tài khoản</h1>
            <p className='text-white/70'>Tham gia My-Quizz ngay hôm nay</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <div>
              <label
                className='mb-1.5 block text-sm font-medium text-white/90'
                htmlFor='displayName'
              >
                Tên hiển thị
              </label>
              <input
                id='displayName'
                type='text'
                placeholder='Nguyễn Văn A'
                {...register('displayName')}
                className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:ring-2 focus:ring-white/50 focus:outline-none'
              />
              {errors.displayName && (
                <p className='mt-1.5 text-sm text-red-200'>{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-white/90' htmlFor='email'>
                Email
              </label>
              <input
                id='email'
                type='email'
                placeholder='ban@vidu.com'
                {...register('email')}
                className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:ring-2 focus:ring-white/50 focus:outline-none'
              />
              {errors.email && (
                <p className='mt-1.5 text-sm text-red-200'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium text-white/90' htmlFor='password'>
                Mật khẩu
              </label>
              <input
                id='password'
                type='password'
                placeholder='••••••••'
                {...register('password')}
                className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:ring-2 focus:ring-white/50 focus:outline-none'
              />
              {errors.password && (
                <p className='mt-1.5 text-sm text-red-200'>{errors.password.message}</p>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='mt-2 w-full transform rounded-xl bg-white py-3.5 font-semibold text-red-600 shadow-lg transition-all hover:bg-white/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70'
            >
              {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className='my-6 flex items-center'>
            <div className='flex-grow border-t border-white/20'></div>
            <span className='px-4 text-sm text-white/60'>Hoặc</span>
            <div className='flex-grow border-t border-white/20'></div>
          </div>

          <button
            type='button'
            onClick={handleGoogleLogin}
            className='flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-3.5 font-medium text-white shadow-sm transition-all hover:bg-white/20'
          >
            <svg className='h-5 w-5' viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='currentColor'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='currentColor'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='currentColor'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
            Đăng ký bằng Google
          </button>

          <div className='mt-8 text-center text-sm text-white/70'>
            Đã có tài khoản?{' '}
            <Link to='/login' className='font-semibold text-white hover:underline'>
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
