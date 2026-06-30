import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Home, SearchX } from 'lucide-react'
import { Link } from 'react-router'

/**
 * Error boundary cho route fallback / 404.
 */
export function NotFoundError() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg'>
        <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted'>
          <SearchX className='size-8 text-muted-foreground' />
        </div>
        <h2 className='mb-2 text-2xl font-bold text-foreground'>404</h2>
        <p className='mb-6 text-muted-foreground'>
          Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link to='/dashboard' className={cn(buttonVariants(), 'gap-2')}>
          <Home data-icon='inline-start' /> Về trang chủ
        </Link>
      </div>
    </div>
  )
}
