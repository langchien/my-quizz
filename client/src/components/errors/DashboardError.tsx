import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

/**
 * Error boundary cho trang Dashboard.
 * Hiển thị khi loader hoặc component throw error.
 */
export function DashboardError() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `Lỗi ${error.status}: ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Đã xảy ra lỗi không xác định'

  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-lg'>
        <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10'>
          <AlertTriangle className='size-8 text-destructive' />
        </div>
        <h2 className='mb-2 text-xl font-bold text-foreground'>Không thể tải Dashboard</h2>
        <p className='mb-6 text-sm text-muted-foreground'>{message}</p>
        <div className='flex justify-center gap-3'>
          <Button variant='outline' onClick={() => window.location.reload()} className='gap-2'>
            <RefreshCw data-icon='inline-start' /> Thử lại
          </Button>
          <Link to='/login' className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}>
            <ArrowLeft data-icon='inline-start' /> Đăng nhập lại
          </Link>
        </div>
      </div>
    </div>
  )
}
