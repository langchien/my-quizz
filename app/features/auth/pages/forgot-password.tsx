import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/features/auth/context/AuthContext'
import { sendPasswordResetEmail } from '@/features/auth/hooks/useAuthActions'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

export function meta() {
  return [
    { title: 'Quên mật khẩu | My Quiz' },
    { name: 'description', content: 'Khôi phục mật khẩu tài khoản' },
  ]
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Redirect nếu đã đăng nhập
  if (user) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Vui lòng nhập email')
      return
    }

    try {
      setLoading(true)
      await sendPasswordResetEmail(email)
      setEmailSent(true)
      toast.success('Email đặt lại mật khẩu đã được gửi!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Quên mật khẩu?</CardTitle>
          <CardDescription>
            {emailSent
              ? 'Kiểm tra email của bạn để đặt lại mật khẩu'
              : 'Nhập email để nhận link đặt lại mật khẩu'}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {emailSent ? (
            <div className='text-center space-y-4'>
              <div className='mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
                <Mail className='w-8 h-8 text-primary' />
              </div>
              <p className='text-sm text-muted-foreground'>
                Chúng tôi đã gửi email đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư (bao
                gồm cả thư rác) và click vào link để đặt lại mật khẩu.
              </p>
              <Button variant='outline' className='w-full' onClick={() => setEmailSent(false)}>
                Gửi lại email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='example@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi email đặt lại mật khẩu'
                )}
              </Button>
            </form>
          )}

          <Link
            to='/login'
            className='flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary'
          >
            <ArrowLeft className='w-4 h-4' />
            Quay lại đăng nhập
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
