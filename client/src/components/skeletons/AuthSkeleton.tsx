/**
 * Skeleton loading cho trang Login/Register.
 */
export function AuthSkeleton() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 via-rose-500 to-orange-500 p-4'>
      <div className='relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg'>
        <div className='absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl' />
        <div className='absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl' />

        <div className='relative z-10 space-y-6'>
          {/* Title */}
          <div className='mb-8 text-center'>
            <div className='mx-auto h-9 w-56 animate-pulse rounded bg-white/20' />
            <div className='mx-auto mt-3 h-5 w-48 animate-pulse rounded bg-white/10' />
          </div>

          {/* Form fields */}
          <div className='space-y-5'>
            <div>
              <div className='mb-2 h-4 w-12 animate-pulse rounded bg-white/20' />
              <div className='h-12 w-full animate-pulse rounded-xl bg-white/10' />
            </div>
            <div>
              <div className='mb-2 h-4 w-16 animate-pulse rounded bg-white/20' />
              <div className='h-12 w-full animate-pulse rounded-xl bg-white/10' />
            </div>
            <div className='h-14 w-full animate-pulse rounded-xl bg-white/30' />
          </div>

          {/* Divider */}
          <div className='flex items-center'>
            <div className='flex-grow border-t border-white/20' />
            <div className='mx-4 h-4 w-12 animate-pulse rounded bg-white/10' />
            <div className='flex-grow border-t border-white/20' />
          </div>

          {/* Google button */}
          <div className='h-14 w-full animate-pulse rounded-xl bg-white/10' />

          {/* Link */}
          <div className='mx-auto mt-4 h-4 w-40 animate-pulse rounded bg-white/10' />
        </div>
      </div>
    </div>
  )
}
