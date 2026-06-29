import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router'

/**
 * Error boundary cho trang QuizEditor.
 * Hiển thị khi quiz không tồn tại hoặc lỗi khi tải.
 */
export function QuizEditorError() {
  const error = useRouteError()
  const navigate = useNavigate()

  const is404 = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-lg dark:border-orange-900/50 dark:bg-slate-900'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/50'>
          <AlertTriangle className='h-8 w-8 text-orange-500' />
        </div>
        <h2 className='mb-2 text-xl font-bold text-gray-800 dark:text-slate-100'>
          {is404 ? 'Bộ câu hỏi không tồn tại' : 'Lỗi khi tải Quiz'}
        </h2>
        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>
          {is404
            ? 'Bộ câu hỏi bạn đang tìm có thể đã bị xóa hoặc không tồn tại.'
            : error instanceof Error
              ? error.message
              : 'Đã xảy ra lỗi không xác định khi tải bộ câu hỏi.'}
        </p>
        <Button onClick={() => navigate('/dashboard')} className='gap-2 bg-rose-600 text-white hover:bg-rose-700'>
          <ArrowLeft size={16} /> Quay về Dashboard
        </Button>
      </div>
    </div>
  )
}
