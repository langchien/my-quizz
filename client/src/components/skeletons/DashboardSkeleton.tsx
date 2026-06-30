import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loading cho trang Dashboard.
 * Hiển thị khi lazy-load component Dashboard.
 */
export function DashboardSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header skeleton */}
      <header className='bg-linear-to-r from-red-600 via-rose-500 to-orange-500 shadow-lg'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
          <Skeleton className='h-8 w-32 bg-white/30' />
          <div className='flex items-center gap-4'>
            <Skeleton className='hidden h-5 w-36 bg-white/20 sm:block' />
            <Skeleton className='size-10 rounded-lg bg-white/20' />
            <Skeleton className='h-10 w-24 rounded-lg bg-white/20' />
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-4 py-8'>
        {/* Title section skeleton */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <Skeleton className='h-7 w-48' />
            <Skeleton className='mt-2 h-4 w-64' />
          </div>
          <Skeleton className='h-10 w-36' />
        </div>

        {/* Card grid skeleton */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='flex flex-col rounded-xl border border-border bg-card p-0 shadow-sm'
            >
              <div className='flex flex-col gap-3 p-6'>
                <div className='flex items-start justify-between'>
                  <Skeleton className='h-6 w-3/4' />
                  <Skeleton className='h-6 w-16 rounded-full' />
                </div>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-2/3' />
              </div>
              <div className='flex-1 px-6 pb-4'>
                <div className='flex items-center gap-4'>
                  <Skeleton className='h-10 w-16' />
                  <Separator orientation='vertical' className='h-8' />
                  <Skeleton className='h-10 w-24' />
                </div>
              </div>
              <div className='flex justify-between border-t border-border bg-muted/30 p-4'>
                <div className='flex gap-2'>
                  <Skeleton className='h-9 w-16' />
                  <Skeleton className='h-9 w-16' />
                </div>
                <Skeleton className='h-9 w-20' />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
