import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Link, useRouteError } from 'react-router'

/**
 * Error boundary cho trang LiveHost / LivePlayer.
 */
export function GameError() {
  const error = useRouteError()

  const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải trò chơi'

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background text-foreground'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-xl'>
        <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10'>
          <AlertTriangle className='size-8 text-destructive' />
        </div>
        <h2 className='mb-2 text-xl font-bold text-foreground'>Lỗi khi tải trò chơi</h2>
        <p className='mb-6 text-sm text-muted-foreground'>{message}</p>
        <div className='flex justify-center gap-3'>
          <Button variant='outline' onClick={() => window.location.reload()} className='gap-2'>
            <RefreshCw data-icon='inline-start' /> Thử lại
          </Button>
          <Link to='/dashboard' className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}>
            <ArrowLeft data-icon='inline-start' /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
