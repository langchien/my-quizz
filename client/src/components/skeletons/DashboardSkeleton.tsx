/**
 * Skeleton loading cho trang Dashboard.
 * Hiển thị khi lazy-load component Dashboard.
 */
export function DashboardSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950'>
      {/* Header skeleton */}
      <header className='bg-linear-to-r from-red-600 via-rose-500 to-orange-500 shadow-lg'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
          <div className='h-8 w-32 animate-pulse rounded-md bg-white/30' />
          <div className='flex items-center gap-4'>
            <div className='hidden h-5 w-36 animate-pulse rounded bg-white/20 sm:block' />
            <div className='h-10 w-10 animate-pulse rounded-lg bg-white/20' />
            <div className='h-10 w-24 animate-pulse rounded-lg bg-white/20' />
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-4 py-8'>
        {/* Title section skeleton */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <div className='h-7 w-48 animate-pulse rounded bg-gray-200 dark:bg-slate-800' />
            <div className='mt-2 h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-slate-800' />
          </div>
          <div className='h-10 w-36 animate-pulse rounded-md bg-gray-200 dark:bg-slate-800' />
        </div>

        {/* Card grid skeleton */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='flex flex-col rounded-xl border border-gray-200 bg-white p-0 shadow-sm dark:border-slate-800 dark:bg-slate-900'
            >
              <div className='space-y-3 p-6'>
                <div className='flex items-start justify-between'>
                  <div className='h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-slate-700' />
                  <div className='h-6 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-slate-800' />
                </div>
                <div className='h-4 w-full animate-pulse rounded bg-gray-100 dark:bg-slate-800' />
                <div className='h-4 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-slate-800' />
              </div>
              <div className='flex-1 px-6 pb-4'>
                <div className='flex items-center gap-4'>
                  <div className='h-10 w-16 animate-pulse rounded bg-gray-100 dark:bg-slate-800' />
                  <div className='h-8 w-px bg-gray-200 dark:bg-slate-700' />
                  <div className='h-10 w-24 animate-pulse rounded bg-gray-100 dark:bg-slate-800' />
                </div>
              </div>
              <div className='flex justify-between border-t border-gray-100 bg-gray-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30'>
                <div className='flex gap-2'>
                  <div className='h-9 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700' />
                  <div className='h-9 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700' />
                </div>
                <div className='h-9 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700' />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
