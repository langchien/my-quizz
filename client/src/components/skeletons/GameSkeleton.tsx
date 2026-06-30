import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loading cho trang LiveHost.
 */
export function HostSkeleton() {
  return (
    <div className='flex min-h-screen flex-col bg-background text-foreground'>
      {/* Header */}
      <header className='flex items-center justify-between border-b border-border bg-card p-4'>
        <Skeleton className='h-8 w-48 bg-muted' />
        <Skeleton className='h-10 w-32 rounded-lg bg-muted' />
      </header>

      {/* Main content */}
      <main className='flex flex-1 flex-col items-center justify-center p-6'>
        <div className='flex w-full max-w-4xl flex-col items-center'>
          <Skeleton className='mb-8 h-12 w-3/4 bg-muted' />
          <Skeleton className='mb-12 h-24 w-64 rounded-xl bg-muted' />
          <div className='w-full rounded-2xl border border-border bg-card p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Skeleton className='h-8 w-40 bg-muted' />
              <Skeleton className='h-14 w-36 bg-muted' />
            </div>
            <div className='mt-6 flex flex-wrap gap-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-24 rounded-full bg-muted' />
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
    <div className='flex min-h-screen flex-col bg-background'>
      <header className='flex items-center justify-between bg-card p-4 shadow-sm'>
        <Skeleton className='h-6 w-24' />
        <Skeleton className='h-8 w-16 rounded-full' />
      </header>
      <main className='flex flex-1 flex-col items-center justify-center p-4'>
        <Skeleton className='h-10 w-48' />
        <Skeleton className='mt-4 h-6 w-64' />
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
          <Skeleton className='mx-auto h-9 w-40' />
          <Skeleton className='mx-auto mt-2 h-5 w-56' />
        </div>
        <div className='flex flex-col gap-4'>
          <Skeleton className='h-14 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-14 w-full rounded-lg' />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton loading cho trang SoloPlay.
 */
export function SoloSkeleton() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950'>
      <div className='w-full max-w-lg text-center'>
        <Skeleton className='mx-auto mb-8 size-24 rounded-full bg-muted' />
        <Skeleton className='mx-auto mb-4 h-10 w-3/4 bg-muted' />
        <Skeleton className='mx-auto mb-8 h-6 w-1/2 bg-muted/60' />
        <div className='mx-auto mb-10 flex max-w-xs justify-center gap-8'>
          <Skeleton className='h-16 w-20 bg-muted' />
          <Skeleton className='h-16 w-20 bg-muted' />
        </div>
        <Skeleton className='mx-auto h-14 w-full max-w-sm rounded-lg bg-muted' />
      </div>
    </div>
  )
}
