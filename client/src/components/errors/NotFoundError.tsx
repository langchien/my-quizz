import { Button } from '@/components/ui/button'
import { Home, SearchX } from 'lucide-react'
import { useNavigate } from 'react-router'

/**
 * Error boundary cho route fallback / 404.
 */
export function NotFoundError() {
  const navigate = useNavigate()
  console.log('=== NotFoundError rendered at ===', window.location.pathname)

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800'>
          <SearchX className='h-8 w-8 text-gray-400 dark:text-gray-500' />
        </div>
        <h2 className='mb-2 text-2xl font-bold text-gray-800 dark:text-slate-100'>404</h2>
        <p className='mb-6 text-gray-500 dark:text-gray-400'>
          Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Button onClick={() => navigate('/dashboard')} className='gap-2 bg-rose-600 text-white hover:bg-rose-700'>
          <Home size={16} /> Về trang chủ
        </Button>
      </div>
    </div>
  )
}
