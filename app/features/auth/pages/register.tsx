import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PAGES } from '@/config/pages'
import { useAuth } from '@/features/auth/context/AuthContext'
import { registerWithEmail } from '@/features/auth/hooks/useAuthActions'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Redirect nếu đã đăng nhập
  if (user) {
    navigate(PAGES.HOME)
    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    try {
      setLoading(true)
      const { user } = await registerWithEmail(email, password, displayName)

      if (user?.identities?.length === 0) {
        toast.error('Email này đã được đăng ký')
        return
      }

      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.')
      navigate(PAGES.LOGIN)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản mới để bắt đầu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='displayName'>Tên hiển thị</Label>
              <Input
                id='displayName'
                type='text'
                placeholder='Nguyễn Văn A'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='example@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Mật khẩu</Label>
              <Input
                id='password'
                type='password'
                placeholder='Tối thiểu 6 ký tự'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
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
                required
              />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
          </form>

          <p className='text-center text-sm text-muted-foreground mt-6'>
            Đã có tài khoản?{' '}
            <Link to='/login' className='text-primary hover:underline font-medium'>
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
