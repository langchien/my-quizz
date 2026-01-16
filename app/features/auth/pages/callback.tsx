import { PAGES } from '@/config/pages'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

/**
 * Auth Callback Page
 * Xử lý redirect từ OAuth providers (Google, etc.)
 */
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        navigate(PAGES.LOGIN)
        return
      }

      // Redirect về trang chủ sau khi auth thành công
      navigate(PAGES.HOME)
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4' />
        <p className='text-muted-foreground'>Đang xử lý đăng nhập...</p>
      </div>
    </div>
  )
}
