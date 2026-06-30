import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loading cho trang Login/Register.
 */
export function AuthSkeleton() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-red-600 via-rose-500 to-orange-500 p-4'>
      <div className='relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg'>
        <div className='absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-2xl' />
        <div className='absolute -bottom-10 -left-10 size-40 rounded-full bg-white/10 blur-2xl' />

        <div className='relative z-10 flex flex-col gap-6'>
          {/* Title */}
          <div className='mb-8 text-center'>
            <Skeleton className='mx-auto h-9 w-56 bg-white/20' />
            <Skeleton className='mx-auto mt-3 h-5 w-48 bg-white/10' />
          </div>

          {/* Form fields */}
          <div className='flex flex-col gap-5'>
            <div>
              <Skeleton className='mb-2 h-4 w-12 bg-white/20' />
              <Skeleton className='h-12 w-full rounded-xl bg-white/10' />
            </div>
            <div>
              <Skeleton className='mb-2 h-4 w-16 bg-white/20' />
              <Skeleton className='h-12 w-full rounded-xl bg-white/10' />
            </div>
            <Skeleton className='h-14 w-full rounded-xl bg-white/30' />
          </div>

          {/* Divider */}
          <div className='flex items-center'>
            <div className='grow border-t border-white/20' />
            <Skeleton className='mx-4 h-4 w-12 bg-white/10' />
            <div className='grow border-t border-white/20' />
          </div>

          {/* Google button */}
          <Skeleton className='h-14 w-full rounded-xl bg-white/10' />

          {/* Link */}
          <Skeleton className='mx-auto mt-4 h-4 w-40 bg-white/10' />
        </div>
      </div>
    </div>
  )
}
