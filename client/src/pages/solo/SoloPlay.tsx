import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useSoloRoom } from '@/hooks/useSoloRoom'
import type { Quiz } from '@/types/quiz'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react'
import { useLoaderData, useNavigate } from 'react-router'

export default function SoloPlay() {
  const quiz = useLoaderData() as Quiz
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    phase,
    isIntro,
    isPlaying,
    isFeedback,
    isRedemption,
    isReview,
    isFinished,
    progress,
    hasExistingProgress,
    currentQuestion,
    timeLeft,
    hasAnswered,
    lastResult,
    redemptionQuestions,
    currentRedemptionQuestion,
    redemptionIndex,
    hasAnsweredRedemption,
    redemptionResult,
    soloResult,
    allFlashcards,
    flashcardIndex,
    handleStart,
    handleAnswer,
    handleNextQuestion,
    handlePause,
    handleRedemptionAnswer,
    handleNextRedemption,
    handleShowReview,
    handleFlashcardNext,
    handleFlashcardPrev,
    handleBackToResult,
    handleRestart,
  } = useSoloRoom(quiz, user?.uid)

  if (!quiz) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-950 text-white'>
        <Loader2 className='h-12 w-12 animate-spin text-violet-500' />
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 font-sans text-white'>
      {/* ═══ INTRO SCREEN ═══ */}
      {isIntro && (
        <div className='flex flex-1 flex-col items-center justify-center p-6'>
          <div className='w-full max-w-lg text-center'>
            {/* Decorative icon */}
            <div className='mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_40px_rgba(139,92,246,0.4)]'>
              <BookOpen className='h-12 w-12 text-white' />
            </div>

            <h1 className='mb-3 text-4xl font-black tracking-tight'>{quiz.title}</h1>
            {quiz.description && <p className='mb-6 text-lg text-slate-400'>{quiz.description}</p>}

            <div className='mx-auto mb-10 flex max-w-xs justify-center gap-8'>
              <div className='text-center'>
                <div className='text-3xl font-black text-violet-400'>{quiz.questions.length}</div>
                <div className='text-sm text-slate-500'>Câu hỏi</div>
              </div>
              <div className='h-12 w-px bg-slate-700' />
              <div className='text-center'>
                <div className='text-3xl font-black text-fuchsia-400'>
                  {quiz.questions.reduce((sum, q) => sum + q.timeLimit, 0)}s
                </div>
                <div className='text-sm text-slate-500'>Tổng thời gian</div>
              </div>
            </div>

            <div className='space-y-3'>
              <Button
                onClick={() => handleStart(false)}
                className='h-14 w-full gap-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-lg font-bold text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:from-violet-700 hover:to-fuchsia-700'
              >
                <Play className='h-5 w-5' /> Bắt đầu
              </Button>

              {hasExistingProgress && (
                <Button
                  onClick={() => handleStart(true)}
                  variant='outline'
                  className='h-14 w-full gap-3 border-violet-500/30 bg-violet-500/10 text-lg font-bold text-violet-300 hover:bg-violet-500/20 hover:text-violet-200'
                >
                  <RotateCcw className='h-5 w-5' /> Tiếp tục bài trước
                </Button>
              )}
            </div>

            <button
              onClick={() => navigate(-1)}
              className='mt-8 text-sm text-slate-500 transition-colors hover:text-slate-300'
            >
              ← Quay lại
            </button>
          </div>
        </div>
      )}

      {/* ═══ PLAYING SCREEN ═══ */}
      {isPlaying && currentQuestion && (
        <div className='flex flex-1 flex-col'>
          {/* Top bar */}
          <header className='flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur-sm'>
            <button
              onClick={handlePause}
              className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white'
            >
              <Pause className='h-4 w-4' /> Tạm dừng
            </button>

            <div className='flex items-center gap-2 text-sm text-slate-400'>
              <span className='font-bold text-white'>
                {(progress?.currentQuestionIndex || 0) + 1}
              </span>
              /{quiz.questions.length}
            </div>

            <div className='flex items-center gap-2'>
              <Zap className='h-4 w-4 text-yellow-400' />
              <span className='font-bold'>{progress?.score || 0}</span>
            </div>
          </header>

          {/* Progress bar */}
          <div className='h-1 bg-slate-800'>
            <div
              className='h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500'
              style={{
                width: `${(((progress?.currentQuestionIndex || 0) + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Timer */}
          <div className='flex justify-center pt-6'>
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full border-4 text-3xl font-black shadow-lg transition-colors ${
                timeLeft <= 5
                  ? 'animate-pulse border-red-500 text-red-400 shadow-red-500/30'
                  : 'border-violet-500 text-violet-300 shadow-violet-500/20'
              }`}
            >
              {timeLeft}
            </div>
          </div>

          {/* Question */}
          <div className='flex flex-1 flex-col items-center justify-center px-4 pb-6'>
            <Card className='mb-8 w-full max-w-3xl border-0 bg-white/95 text-slate-900 shadow-2xl backdrop-blur'>
              <CardContent className='p-8 text-center md:p-12'>
                <h2 className='text-2xl font-bold md:text-3xl'>{currentQuestion.content}</h2>
              </CardContent>
            </Card>

            {/* Options grid */}
            <div className='grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2'>
              {currentQuestion.options.map((opt, i) => {
                const colors = [
                  'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
                  'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                  'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
                  'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
                ]
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt)}
                    disabled={hasAnswered}
                    className={`flex min-h-[80px] items-center justify-center rounded-2xl bg-gradient-to-br p-5 text-xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 sm:min-h-[100px] sm:text-2xl ${colors[i % 4]}`}
                  >
                    {opt.content}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ FEEDBACK SCREEN ═══ */}
      {isFeedback && lastResult && (
        <div className='flex flex-1 flex-col items-center justify-center p-6'>
          <div
            className={`w-full max-w-md rounded-3xl p-10 text-center text-white shadow-2xl ${
              lastResult.isCorrect
                ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30'
                : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30'
            }`}
          >
            {lastResult.isCorrect ? (
              <CheckCircle2 className='mx-auto mb-4 h-20 w-20 drop-shadow-lg' />
            ) : (
              <XCircle className='mx-auto mb-4 h-20 w-20 drop-shadow-lg' />
            )}

            <h2 className='mb-3 text-4xl font-black'>
              {lastResult.isCorrect ? 'Chính xác!' : 'Sai rồi!'}
            </h2>

            <div className='mb-6 inline-block rounded-full bg-white/20 px-8 py-3 text-2xl font-bold backdrop-blur-sm'>
              +{lastResult.points}
            </div>

            {progress && (
              <div className='text-lg text-white/80'>
                Streak: {progress.streak > 0 ? `🔥 ${progress.streak}` : '—'}
              </div>
            )}
          </div>

          <Button
            onClick={handleNextQuestion}
            className='mt-8 h-14 gap-3 bg-white/10 px-10 text-lg font-bold text-white backdrop-blur-sm hover:bg-white/20'
          >
            {progress && progress.currentQuestionIndex >= quiz.questions.length
              ? 'Xem kết quả'
              : 'Câu tiếp theo'}
            <ArrowRight className='h-5 w-5' />
          </Button>
        </div>
      )}

      {/* ═══ REDEMPTION SCREEN ═══ */}
      {isRedemption && currentRedemptionQuestion && (
        <div className='flex flex-1 flex-col'>
          {/* Redemption header */}
          <header className='flex items-center justify-center border-b border-amber-500/20 bg-amber-900/30 px-4 py-4 backdrop-blur-sm'>
            <div className='flex items-center gap-3'>
              <Sparkles className='h-6 w-6 text-amber-400' />
              <span className='text-lg font-bold text-amber-200'>
                Cứu mạng — Câu {redemptionIndex + 1}/{redemptionQuestions.length}
              </span>
            </div>
          </header>

          {!hasAnsweredRedemption ? (
            <div className='flex flex-1 flex-col items-center justify-center px-4 pb-6'>
              <Card className='mb-8 w-full max-w-3xl border-amber-500/20 bg-white/95 text-slate-900 shadow-2xl'>
                <CardContent className='p-8 text-center md:p-12'>
                  <h2 className='text-2xl font-bold md:text-3xl'>
                    {currentRedemptionQuestion.content}
                  </h2>
                </CardContent>
              </Card>

              <div className='grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2'>
                {currentRedemptionQuestion.options.map((opt, i) => {
                  const colors = [
                    'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
                    'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                    'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
                    'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
                  ]
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleRedemptionAnswer(opt)}
                      className={`flex min-h-[80px] items-center justify-center rounded-2xl bg-gradient-to-br p-5 text-xl font-bold text-white shadow-lg transition-all active:scale-95 sm:min-h-[100px] sm:text-2xl ${colors[i % 4]}`}
                    >
                      {opt.content}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className='flex flex-1 flex-col items-center justify-center p-6'>
              <div
                className={`w-full max-w-md rounded-3xl p-10 text-center text-white shadow-2xl ${
                  redemptionResult?.isCorrect
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                    : 'bg-gradient-to-br from-red-500 to-rose-600'
                }`}
              >
                {redemptionResult?.isCorrect ? (
                  <CheckCircle2 className='mx-auto mb-4 h-20 w-20' />
                ) : (
                  <XCircle className='mx-auto mb-4 h-20 w-20' />
                )}
                <h2 className='mb-3 text-3xl font-black'>
                  {redemptionResult?.isCorrect ? 'Cứu thành công!' : 'Vẫn sai!'}
                </h2>
                <div className='inline-block rounded-full bg-white/20 px-6 py-2 text-xl font-bold'>
                  +{redemptionResult?.points || 0}
                </div>
              </div>

              <Button
                onClick={handleNextRedemption}
                className='mt-8 h-14 gap-3 bg-white/10 px-10 text-lg font-bold text-white hover:bg-white/20'
              >
                {redemptionIndex >= redemptionQuestions.length - 1
                  ? 'Xem kết quả'
                  : 'Câu tiếp theo'}
                <ArrowRight className='h-5 w-5' />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ═══ FINISHED SCREEN ═══ */}
      {isFinished && soloResult && (
        <div className='flex flex-1 flex-col items-center justify-center p-6'>
          <div className='w-full max-w-lg text-center'>
            {/* Trophy animation */}
            <div className='mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-[0_0_50px_rgba(251,191,36,0.4)]'>
              <Trophy className='h-14 w-14 text-white drop-shadow-lg' />
            </div>

            <h1 className='mb-2 text-4xl font-black'>Hoàn thành!</h1>
            <p className='mb-8 text-slate-400'>{quiz.title}</p>

            {/* Score card */}
            <div className='mx-auto mb-8 grid max-w-sm grid-cols-3 gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm'>
              <div className='text-center'>
                <div className='text-3xl font-black text-violet-400'>{soloResult.score}</div>
                <div className='text-xs text-slate-500'>Điểm</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-black text-emerald-400'>
                  {soloResult.correctCount}/{soloResult.totalQuestions}
                </div>
                <div className='text-xs text-slate-500'>Đúng</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-black text-fuchsia-400'>
                  {Math.round((soloResult.correctCount / soloResult.totalQuestions) * 100)}%
                </div>
                <div className='text-xs text-slate-500'>Chính xác</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className='space-y-3'>
              <Button
                onClick={handleShowReview}
                className='h-14 w-full gap-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-lg font-bold text-white shadow-lg hover:from-violet-700 hover:to-fuchsia-700'
              >
                <BookOpen className='h-5 w-5' /> Xem Flashcard
              </Button>

              <Button
                onClick={handleRestart}
                variant='outline'
                className='h-12 w-full gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white'
              >
                <RefreshCw className='h-4 w-4' /> Chơi lại
              </Button>

              <button
                onClick={() => navigate('/dashboard')}
                className='mt-2 block w-full text-sm text-slate-500 transition-colors hover:text-slate-300'
              >
                ← Về Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FLASHCARD REVIEW SCREEN ═══ */}
      {isReview && allFlashcards.length > 0 && (
        <div className='flex flex-1 flex-col'>
          {/* Header */}
          <header className='flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur-sm'>
            <button
              onClick={handleBackToResult}
              className='flex items-center gap-2 text-sm text-slate-400 hover:text-white'
            >
              <ChevronLeft className='h-4 w-4' /> Kết quả
            </button>
            <span className='text-sm text-slate-400'>
              <span className='font-bold text-white'>{flashcardIndex + 1}</span>/
              {allFlashcards.length}
            </span>
            <div className='w-20' />
          </header>

          {/* Flashcard content */}
          <div className='flex flex-1 flex-col items-center justify-center p-6'>
            {(() => {
              const card = allFlashcards[flashcardIndex]
              if (!card) return null

              const correctOption = card.question.options.find((o) => o.isCorrect)
              const selectedOption = card.question.options.find(
                (o) => o.id === card.selectedOptionId,
              )

              return (
                <div className='w-full max-w-2xl'>
                  {/* Question */}
                  <Card className='mb-6 border-0 bg-white/95 text-slate-900 shadow-2xl'>
                    <CardContent className='p-8 text-center'>
                      <div className='mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase'>
                        Câu {flashcardIndex + 1}
                      </div>
                      <h2 className='text-2xl font-bold'>{card.question.content}</h2>
                    </CardContent>
                  </Card>

                  {/* All options with visual feedback */}
                  <div className='space-y-3'>
                    {card.question.options.map((opt) => {
                      const isSelected = opt.id === card.selectedOptionId
                      const isCorrectOpt = opt.isCorrect

                      let className =
                        'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all'
                      if (isCorrectOpt) {
                        className += ' border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      } else if (isSelected && !isCorrectOpt) {
                        className += ' border-red-500 bg-red-500/10 text-red-300'
                      } else {
                        className += ' border-slate-700 bg-slate-800/50 text-slate-400'
                      }

                      return (
                        <div key={opt.id} className={className}>
                          {isCorrectOpt ? (
                            <CheckCircle2 className='h-5 w-5 shrink-0 text-emerald-400' />
                          ) : isSelected ? (
                            <XCircle className='h-5 w-5 shrink-0 text-red-400' />
                          ) : (
                            <div className='h-5 w-5 shrink-0 rounded-full border-2 border-slate-600' />
                          )}
                          <span className='font-medium'>{opt.content}</span>
                          {isSelected && (
                            <span className='ml-auto text-xs opacity-70'>Bạn đã chọn</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Result badge */}
                  <div className='mt-4 flex justify-center'>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                        card.isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {card.isCorrect ? (
                        <>
                          <CheckCircle2 className='h-4 w-4' /> Đúng — +{card.pointsEarned}
                        </>
                      ) : (
                        <>
                          <XCircle className='h-4 w-4' /> Sai — Đáp án đúng:{' '}
                          {correctOption?.content}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Navigation */}
          <div className='flex items-center justify-between border-t border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur-sm'>
            <Button
              onClick={handleFlashcardPrev}
              disabled={flashcardIndex === 0}
              variant='ghost'
              className='gap-2 text-slate-400 hover:text-white disabled:opacity-30'
            >
              <ArrowLeft className='h-4 w-4' /> Trước
            </Button>
            <Button
              onClick={handleFlashcardNext}
              disabled={flashcardIndex === allFlashcards.length - 1}
              variant='ghost'
              className='gap-2 text-slate-400 hover:text-white disabled:opacity-30'
            >
              Sau <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
