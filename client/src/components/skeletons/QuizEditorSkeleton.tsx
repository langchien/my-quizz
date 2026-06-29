/**
 * Skeleton loading cho trang QuizEditor.
 * Hiển thị khi lazy-load component QuizEditor.
 */
export function QuizEditorSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50 pb-20 dark:bg-slate-950'>
      {/* Header skeleton */}
      <header className='sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-4'>
          <div className='flex items-center gap-4'>
            <div className='h-10 w-10 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700' />
            <div className='h-7 w-40 animate-pulse rounded bg-gray-200 dark:bg-slate-700' />
          </div>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-28 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700' />
            <div className='h-10 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700' />
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-5xl px-4 py-8'>
        {/* General info card skeleton */}
        <div className='mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
          <div className='mb-4'>
            <div className='h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700' />
            <div className='mt-1 h-4 w-64 animate-pulse rounded bg-gray-100 dark:bg-slate-800' />
          </div>
          <div className='space-y-4'>
            <div>
              <div className='mb-2 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700' />
              <div className='h-12 w-full animate-pulse rounded-md bg-gray-100 dark:bg-slate-800' />
            </div>
            <div>
              <div className='mb-2 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-slate-700' />
              <div className='h-24 w-full animate-pulse rounded-md bg-gray-100 dark:bg-slate-800' />
            </div>
          </div>
        </div>

        {/* Questions skeleton */}
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='h-7 w-48 animate-pulse rounded bg-gray-200 dark:bg-slate-700' />
          </div>

          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className='relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'
            >
              <div className='absolute top-0 left-0 h-full w-2 bg-blue-500/50' />
              <div className='p-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <div className='h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-slate-700' />
                  <div className='h-9 w-9 animate-pulse rounded-md bg-gray-200 dark:bg-slate-700' />
                </div>
                <div className='mb-6 h-16 w-full animate-pulse rounded-md bg-gray-100 dark:bg-slate-800' />
                <div className='mb-6 flex gap-4'>
                  <div className='h-10 flex-1 animate-pulse rounded-md bg-gray-100 dark:bg-slate-800' />
                  <div className='h-10 flex-1 animate-pulse rounded-md bg-gray-100 dark:bg-slate-800' />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className='h-12 animate-pulse rounded-md bg-gray-100 dark:bg-slate-800'
                    />
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
