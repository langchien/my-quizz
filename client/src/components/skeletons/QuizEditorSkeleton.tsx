import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loading cho trang QuizEditor.
 * Hiển thị khi lazy-load component QuizEditor.
 */
export function QuizEditorSkeleton() {
  return (
    <div className='min-h-screen bg-background pb-20'>
      {/* Header skeleton */}
      <header className='sticky top-0 z-10 border-b border-border bg-card'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-4'>
          <div className='flex items-center gap-4'>
            <Skeleton className='size-10' />
            <Skeleton className='h-7 w-40' />
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-10 w-28' />
            <Skeleton className='h-10 w-24' />
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-5xl px-4 py-8'>
        {/* General info card skeleton */}
        <div className='mb-8 rounded-xl border border-border bg-card p-6 shadow-sm'>
          <div className='mb-4'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='mt-1 h-4 w-64' />
          </div>
          <div className='flex flex-col gap-4'>
            <div>
              <Skeleton className='mb-2 h-4 w-24' />
              <Skeleton className='h-12 w-full' />
            </div>
            <div>
              <Skeleton className='mb-2 h-4 w-28' />
              <Skeleton className='h-24 w-full' />
            </div>
          </div>
        </div>

        {/* Questions skeleton */}
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-7 w-48' />
          </div>

          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className='relative overflow-hidden rounded-xl border border-border bg-card shadow-sm'
            >
              <div className='absolute top-0 left-0 h-full w-2 bg-primary/50' />
              <div className='p-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <Skeleton className='h-5 w-20' />
                  <Skeleton className='size-9' />
                </div>
                <Skeleton className='mb-6 h-16 w-full' />
                <div className='mb-6 flex gap-4'>
                  <Skeleton className='h-10 flex-1' />
                  <Skeleton className='h-10 flex-1' />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className='h-12' />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
