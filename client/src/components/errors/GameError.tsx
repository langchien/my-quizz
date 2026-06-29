import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useNavigate, useRouteError } from 'react-router'

/**
 * Error boundary cho trang LiveHost / LivePlayer.
 */
export function GameError() {
  const error = useRouteError()
  const navigate = useNavigate()

  const message = error instanceof Error
    ? error.message
    : 'Đã xảy ra lỗi khi tải trò chơi'

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-800 p-8 text-center shadow-xl'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20'>
          <AlertTriangle className='h-8 w-8 text-red-400' />
        </div>
        <h2 className='mb-2 text-xl font-bold'>Lỗi khi tải trò chơi</h2>
        <p className='mb-6 text-sm text-slate-400'>{message}</p>
        <div className='flex justify-center gap-3'>
          <Button
            variant='outline'
            onClick={() => window.location.reload()}
            className='gap-2 border-slate-600 text-slate-200 hover:bg-slate-700'
          >
            <RefreshCw size={16} /> Thử lại
          </Button>
          <Button
            variant='outline'
            onClick={() => navigate('/dashboard')}
            className='gap-2 border-slate-600 text-slate-200 hover:bg-slate-700'
          >
            <ArrowLeft size={16} /> Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
