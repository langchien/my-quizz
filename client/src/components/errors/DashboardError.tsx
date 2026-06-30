import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'

/**
 * Error boundary cho trang Dashboard.
 * Hiển thị khi loader hoặc component throw error.
 */
export function DashboardError() {
  const error = useRouteError()
  const navigate = useNavigate()

  const message = isRouteErrorResponse(error)
    ? `Lỗi ${error.status}: ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Đã xảy ra lỗi không xác định'

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg dark:border-red-900/50 dark:bg-slate-900'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50'>
          <AlertTriangle className='h-8 w-8 text-red-500' />
        </div>
        <h2 className='mb-2 text-xl font-bold text-gray-800 dark:text-slate-100'>
          Không thể tải Dashboard
        </h2>
        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>{message}</p>
        <div className='flex justify-center gap-3'>
          <Button variant='outline' onClick={() => navigate('/dashboard')} className='gap-2'>
            <RefreshCw size={16} /> Thử lại
          </Button>
          <Button variant='outline' onClick={() => navigate('/login')} className='gap-2'>
            <ArrowLeft size={16} /> Đăng nhập lại
          </Button>
        </div>
      </div>
    </div>
  )
}
