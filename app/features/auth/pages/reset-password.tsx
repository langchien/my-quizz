import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/features/auth/context/AuthContext'
import { updatePasswordFromReset } from '@/features/auth/hooks/useAuthActions'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

export function meta() {
  return [
    { title: 'Đặt lại mật khẩu | My Quiz' },
    { name: 'description', content: 'Đặt lại mật khẩu tài khoản' },
  ]
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { session } = useAuth()

  // Kiểm tra có access token từ URL không (Supabase auto-detect)
  useEffect(() => {
    // Nếu không có session sau khi parse URL, có thể link đã hết hạn
    const checkSession = async () => {
      const hash = window.location.hash
      if (!hash && !session) {
        setError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
      }
    }

    // Đợi một chút để Supabase parse URL
    const timer = setTimeout(checkSession, 1000)
    return () => clearTimeout(timer)
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    try {
      setLoading(true)
      await updatePasswordFromReset(password)
      setSuccess(true)
      toast.success('Đặt lại mật khẩu thành công!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold text-destructive'>Link không hợp lệ</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to='/forgot-password'>
              <Button className='w-full'>Yêu cầu link mới</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4'>
              <CheckCircle className='w-8 h-8 text-green-600' />
            </div>
            <CardTitle className='text-2xl font-bold'>Đặt lại mật khẩu thành công!</CardTitle>
            <CardDescription>Bạn có thể đăng nhập bằng mật khẩu mới</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className='w-full' onClick={() => navigate('/login')}>
              Đăng nhập ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Đặt lại mật khẩu</CardTitle>
          <CardDescription>Nhập mật khẩu mới cho tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='password'>Mật khẩu mới</Label>
              <Input
                id='password'
                type='password'
                placeholder='Tối thiểu 8 ký tự'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Xác nhận mật khẩu</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Nhập lại mật khẩu'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang xử lý...
                </>
              ) : (
                'Đặt lại mật khẩu'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
