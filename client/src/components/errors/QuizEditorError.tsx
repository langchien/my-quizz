import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

/**
 * Error boundary cho trang QuizEditor.
 * Hiển thị khi quiz không tồn tại hoặc lỗi khi tải.
 */
export function QuizEditorError() {
  const error = useRouteError()

  const is404 = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-warning/30 bg-card p-8 text-center shadow-lg'>
        <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-warning/10'>
          <AlertTriangle className='size-8 text-warning-foreground' />
        </div>
        <h2 className='mb-2 text-xl font-bold text-foreground'>
          {is404 ? 'Bộ câu hỏi không tồn tại' : 'Lỗi khi tải Quiz'}
        </h2>
        <p className='mb-6 text-sm text-muted-foreground'>
          {is404
            ? 'Bộ câu hỏi bạn đang tìm có thể đã bị xóa hoặc không tồn tại.'
            : error instanceof Error
              ? error.message
              : 'Đã xảy ra lỗi không xác định khi tải bộ câu hỏi.'}
        </p>
        <Link to='/dashboard' className={cn(buttonVariants(), 'gap-2')}>
          <ArrowLeft data-icon='inline-start' /> Quay về Dashboard
        </Link>
      </div>
    </div>
  )
}
