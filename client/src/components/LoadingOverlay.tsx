interface LoadingOverlayProps {
  message?: string
  subMessage?: string
}

export function LoadingOverlay({
  message = 'Đang xử lý...',
  subMessage = 'Vui lòng không đóng trình duyệt hoặc tải lại trang',
}: LoadingOverlayProps) {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground/60 backdrop-blur-sm transition-all duration-300'>
      <div className='flex animate-in flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 shadow-2xl duration-200 zoom-in-95 fade-in'>
        <div className='relative flex size-16 items-center justify-center'>
          <div className='absolute inset-0 animate-spin rounded-full border-4 border-primary/20 border-t-primary' />
          <div className='absolute size-10 animate-spin rounded-full border-4 border-primary/10 border-b-primary [animation-direction:reverse] [animation-duration:1.5s]' />
          <div className='size-4 animate-pulse rounded-full bg-primary' />
        </div>
        <div className='flex flex-col gap-1.5 text-center'>
          {message && <p className='text-base font-semibold text-card-foreground'>{message}</p>}
          {subMessage && <p className='text-xs text-muted-foreground'>{subMessage}</p>}
        </div>
      </div>
    </div>
  )
}
