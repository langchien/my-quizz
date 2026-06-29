/**
 * Skeleton loading cho trang LiveHost.
 */
export function HostSkeleton() {
  return (
    <div className='flex min-h-screen flex-col bg-slate-900 text-white'>
      {/* Header */}
      <header className='flex items-center justify-between border-b border-slate-700 bg-slate-800 p-4'>
        <div className='h-8 w-48 animate-pulse rounded bg-slate-700' />
        <div className='h-10 w-32 animate-pulse rounded-lg bg-slate-700' />
      </header>

      {/* Main content */}
      <main className='flex flex-1 flex-col items-center justify-center p-6'>
        <div className='flex w-full max-w-4xl flex-col items-center'>
          <div className='mb-8 h-12 w-3/4 animate-pulse rounded bg-slate-700' />
          <div className='mb-12 h-24 w-64 animate-pulse rounded-xl bg-slate-700' />
          <div className='w-full rounded-2xl border border-slate-700 bg-slate-800 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='h-8 w-40 animate-pulse rounded bg-slate-700' />
              <div className='h-14 w-36 animate-pulse rounded-md bg-slate-700' />
            </div>
            <div className='mt-6 flex flex-wrap gap-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='h-10 w-24 animate-pulse rounded-full bg-slate-700' />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * Skeleton loading cho trang LivePlayer.
 */
export function PlayerSkeleton() {
  return (
    <div className='flex min-h-screen flex-col bg-slate-100'>
      <header className='flex items-center justify-between bg-white p-4 shadow-sm'>
        <div className='h-6 w-24 animate-pulse rounded bg-gray-200' />
        <div className='h-8 w-16 animate-pulse rounded-full bg-gray-200' />
      </header>
      <main className='flex flex-1 flex-col items-center justify-center p-4'>
        <div className='h-10 w-48 animate-pulse rounded bg-gray-200' />
        <div className='mt-4 h-6 w-64 animate-pulse rounded bg-gray-200' />
      </main>
    </div>
  )
}

/**
 * Skeleton loading cho trang JoinRoom.
 */
export function JoinRoomSkeleton() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4'>
      <div className='w-full max-w-md rounded-xl bg-white/90 p-6 shadow-2xl backdrop-blur'>
        <div className='mb-4 text-center'>
          <div className='mx-auto h-9 w-40 animate-pulse rounded bg-gray-200' />
          <div className='mx-auto mt-2 h-5 w-56 animate-pulse rounded bg-gray-100' />
        </div>
        <div className='space-y-4'>
          <div className='h-14 w-full animate-pulse rounded-md bg-gray-100' />
          <div className='h-12 w-full animate-pulse rounded-md bg-gray-100' />
          <div className='h-14 w-full animate-pulse rounded-lg bg-gray-200' />
        </div>
      </div>
    </div>
  )
}
