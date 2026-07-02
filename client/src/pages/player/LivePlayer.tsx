import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { getAvatarEmoji } from '@/config/avatarEmojis'
import { usePlayerGame } from '@/hooks/usePlayerGame'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useParams } from 'react-router'

export default function LivePlayer() {
  const { sessionId } = useParams<{ sessionId: string }>()

  // Toàn bộ logic game nằm trong custom hook
  const {
    session,
    participants,
    me,
    participantId,
    loading,
    error,
    currentQuestion,
    hasAnswered,
    lastResult,
    isLobby,
    isPlaying,
    isLeaderboard,
    isFinished,
    handleAnswer,
  } = usePlayerGame(sessionId)

  const gameOptionColors = [
    'bg-game-option-1',
    'bg-game-option-2',
    'bg-game-option-3',
    'bg-game-option-4',
    'bg-game-option-5',
    'bg-game-option-6',
  ]

  if (loading || !session || !participantId) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <Spinner className='size-12 text-primary' />
      </div>
    )
  }

  if (error)
    return (
      <div className='flex min-h-screen items-center justify-center bg-background p-8 text-destructive'>
        {error}
      </div>
    )

  return (
    <div className='flex min-h-screen flex-col bg-background font-sans'>
      {/* Header */}
      <header className='flex items-center justify-between border-b border-border bg-card p-4 shadow-sm'>
        <div className='flex items-center gap-2 font-bold text-foreground'>
          <span className='text-xl'>{me?.name ? getAvatarEmoji(me.name) : '👤'}</span>
          {me?.name || 'Player'}
        </div>
        <div className='rounded-full bg-foreground px-4 py-1 font-black text-background'>
          {me?.score || 0}
        </div>
      </header>

      <main className='flex flex-1 flex-col items-center justify-center p-4'>
        {isLobby && (
          <div className='flex animate-pulse flex-col gap-4 text-center'>
            <div className='mb-4 text-6xl'>{me?.name ? getAvatarEmoji(me.name) : '🎮'}</div>
            <h2 className='text-3xl font-bold text-foreground'>Bạn đã vào phòng!</h2>
            <p className='text-xl text-muted-foreground'>Đang chờ Host bắt đầu...</p>
          </div>
        )}

        {isPlaying && currentQuestion && !hasAnswered && (
          <div className='flex h-full w-full flex-col justify-center'>
            <div
              className={`mx-auto grid h-[60vh] w-full max-w-2xl gap-4 ${currentQuestion.options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}
            >
              {currentQuestion.options.map((opt, i) => {
                const bgColor = gameOptionColors[i % gameOptionColors.length]
                return (
                  <Button
                    key={opt.id}
                    onClick={() => handleAnswer(opt)}
                    className={cn(
                      'flex h-full items-center justify-center rounded-2xl p-4 text-3xl font-bold break-words whitespace-normal text-white shadow-xl transition-transform active:scale-95',
                      bgColor,
                    )}
                  >
                    {opt.content}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {isPlaying && currentQuestion && hasAnswered && (
          <div className='flex flex-col items-center gap-6 text-center'>
            <Spinner className='size-16 text-muted-foreground' />
            <h2 className='text-3xl font-bold text-foreground'>Đang đợi những người khác...</h2>
          </div>
        )}

        {isLeaderboard && lastResult && (
          <div
            className={cn(
              'flex w-full max-w-md flex-col items-center gap-4 rounded-3xl p-8 text-center shadow-2xl',
              lastResult.isCorrect
                ? 'bg-success text-success-foreground'
                : 'text-destructive-foreground bg-destructive',
            )}
          >
            {lastResult.isCorrect ? (
              <CheckCircle2 className='size-24' />
            ) : (
              <XCircle className='size-24' />
            )}
            <h2 className='text-4xl font-black'>
              {lastResult.isCorrect ? 'Chính xác!' : 'Sai rồi!'}
            </h2>
            <div className='inline-block rounded-full bg-background/20 px-6 py-2 text-2xl font-bold'>
              +{lastResult.points}
            </div>
          </div>
        )}

        {isLeaderboard && !lastResult && (
          <div className='text-center text-xl font-bold text-muted-foreground'>
            Hết thời gian! Bạn chưa chọn đáp án.
          </div>
        )}

        {isFinished && (
          <div className='flex flex-col items-center gap-4 text-center'>
            <h2 className='text-4xl font-black text-foreground'>Game Kết Thúc</h2>
            <p className='text-2xl text-muted-foreground'>
              Bạn đạt được <span className='font-bold text-foreground'>{me?.score}</span> điểm!
            </p>

            {(() => {
              const rank =
                [...participants]
                  .sort((a, b) => b.score - a.score)
                  .findIndex((p) => p.id === me?.id) + 1
              return <div className='mt-4 text-3xl font-bold text-primary'>Thứ hạng: #{rank}</div>
            })()}
          </div>
        )}
      </main>
    </div>
  )
}
