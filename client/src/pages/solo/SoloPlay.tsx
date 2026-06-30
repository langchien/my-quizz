import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/useAuth'
import { useSoloRoom } from '@/hooks/useSoloRoom'
import { cn } from '@/lib/utils'
import type { Quiz } from '@/types/quiz'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react'
import { Link, useLoaderData, useNavigate } from 'react-router'

export default function SoloPlay() {
  const quiz = useLoaderData() as Quiz
  const { user } = useAuth()
  const navigate = useNavigate()

  const {
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

  const glowClasses = [
    'glow-1 border-lime-400/30 hover:shadow-[0_10px_40px_rgba(163,230,53,0.3)]',
    'glow-2 border-purple-400/30 hover:shadow-[0_10px_40px_rgba(168,85,247,0.3)]',
    'glow-3 border-orange-400/30 hover:shadow-[0_10px_40px_rgba(249,115,22,0.3)]',
    'glow-4 border-teal-400/30 hover:shadow-[0_10px_40px_rgba(45,212,191,0.3)]',
  ]

  const glowGradients = [
    'from-lime-400/40 via-yellow-400/20',
    'from-purple-500/40 via-pink-500/20',
    'from-orange-500/40 via-red-500/20',
    'from-teal-400/40 via-cyan-400/20',
  ]

  const optionTextColors = [
    'text-lime-50',
    'text-purple-50',
    'text-orange-50',
    'text-teal-50'
  ]

  if (!quiz) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-animated-gradient'>
        <Spinner className='size-12 text-white' />
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col bg-animated-gradient text-white font-sans overflow-hidden relative'>
      {/* Background Decoration Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* ═══ INTRO SCREEN ═══ */}
      {isIntro && (
        <div className='flex flex-1 flex-col items-center justify-center p-6 z-10'>
          <div className='w-full max-w-lg text-center glass-panel p-10 rounded-3xl shadow-2xl'>
            <div className='mx-auto mb-8 flex size-24 items-center justify-center rounded-full bg-white/10 border border-white/20 shadow-lg backdrop-blur-md'>
              <BookOpen className='size-12 text-pink-300' />
            </div>

            <h1 className='mb-3 text-4xl font-black tracking-tight text-white drop-shadow-md'>{quiz.title}</h1>
            {quiz.description && (
              <p className='mb-6 text-lg text-gray-300'>{quiz.description}</p>
            )}

            <div className='mx-auto mb-10 flex max-w-xs justify-center gap-8'>
              <div className='text-center'>
                <div className='text-3xl font-black text-purple-300'>{quiz.questions.length}</div>
                <div className='text-sm text-gray-400 uppercase tracking-wider mt-1'>Câu hỏi</div>
              </div>
              <div className='w-px bg-white/20' />
              <div className='text-center'>
                <div className='text-3xl font-black text-orange-300'>
                  {quiz.questions.reduce((sum, q) => sum + q.timeLimit, 0)}s
                </div>
                <div className='text-sm text-gray-400 uppercase tracking-wider mt-1'>Tổng thời gian</div>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <Button
                onClick={() => handleStart(false)}
                className='h-14 w-full bg-white/10 hover:bg-white/20 text-lg font-bold text-white'
              >
                <Play data-icon="inline-start" /> Bắt đầu
              </Button>

              {hasExistingProgress && (
                <Button
                  onClick={() => handleStart(true)}
                  className='h-14 w-full border border-blue-500/50 bg-blue-500/20 hover:bg-blue-500/30 text-lg font-bold text-blue-200'
                >
                  <RotateCcw data-icon="inline-start" /> Tiếp tục bài trước
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className='mt-8 flex text-sm text-gray-400 hover:text-white mx-auto hover:bg-transparent'
            >
              <ArrowLeft data-icon="inline-start" /> Quay lại
            </Button>
          </div>
        </div>
      )}

      {/* ═══ PLAYING SCREEN ═══ */}
      {isPlaying && currentQuestion && (
        <div className='flex flex-1 flex-col z-10'>
          {/* Top Bar */}
          <header className="w-full flex justify-between items-center p-4 relative z-10">
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" onClick={handlePause} className="glass-panel hover:bg-transparent text-gray-300 hover:text-white">
                <Pause className="size-5" />
              </Button>
              <div className="glass-panel flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>{progress?.score || 0}</span>
              </div>
              <div className="glass-panel px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <span className="text-pink-400">Streak</span>
                <span>{progress?.streak || 0}</span>
              </div>
            </div>
            {/* Right side Timer */}
            <div className="flex items-center gap-3">
              <div className={cn("glass-panel px-4 py-2 rounded-lg text-lg font-bold flex items-center justify-center", timeLeft <= 5 ? "text-red-400 animate-pulse border-red-500/50" : "text-white")}>
                {timeLeft}s
              </div>
            </div>
          </header>

          <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-12 gap-8 w-full max-w-7xl mx-auto relative z-10">
            {/* Question Progress Badge */}
            <div className="absolute top-0 transform -translate-y-1/2 glass-panel px-4 py-1.5 rounded-full text-sm font-semibold text-yellow-300 z-20" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}>
              {(progress?.currentQuestionIndex || 0) + 1} / {quiz.questions.length}
            </div>

            {/* Question Card */}
            <section className="glass-panel w-full rounded-2xl p-8 md:p-12 shadow-2xl relative">
              <h1 className="text-xl md:text-3xl font-medium leading-relaxed text-center tracking-wide text-white/90 drop-shadow-md">
                {currentQuestion.content}
              </h1>
            </section>

            {/* Options Grid */}
            <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
              {currentQuestion.options.map((opt, i) => {
                const glow = glowClasses[i % glowClasses.length]
                const gradient = glowGradients[i % glowGradients.length]
                const textColor = optionTextColors[i % optionTextColors.length]
                
                return (
                  <Button
                    key={opt.id}
                    onClick={() => handleAnswer(opt)}
                    disabled={hasAnswered}
                    className={cn(
                      "glass-panel group relative flex flex-col items-center justify-center min-h-[250px] p-6 rounded-2xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed whitespace-normal h-auto",
                      !hasAnswered && "hover:-translate-y-2",
                      glow
                    )}
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300", !hasAnswered && "group-hover:opacity-100", gradient)}></div>
                    <span className="absolute top-4 right-4 text-xs font-bold size-6 flex items-center justify-center rounded-md border border-white/20 bg-white/10">{i + 1}</span>
                    <span className={cn("text-xl md:text-2xl font-semibold drop-shadow-sm text-center relative z-10", textColor)}>
                      {opt.content}
                    </span>
                  </Button>
                )
              })}
            </section>
          </main>

          {/* Bottom Footer */}
          <footer className="w-full p-6 flex justify-between items-end relative z-10">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-gray-800 flex items-center justify-center">
                <img alt="User Avatar" className="size-full object-cover" src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} />
              </div>
              <span className="font-semibold text-sm tracking-wide text-white/80">{user?.displayName || 'Người chơi'}</span>
            </div>
            <div className="flex gap-2">
              <div className="glass-panel size-10 rounded-lg flex items-center justify-center border-orange-500/50">
                <Sparkles className="size-5 text-orange-400" />
              </div>
              <div className="glass-panel size-10 rounded-lg flex items-center justify-center border-blue-500/50">
                <span className="text-blue-400 font-bold text-sm tracking-tighter">2x</span>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* ═══ FEEDBACK SCREEN ═══ */}
      {isFeedback && lastResult && (
        <div className='flex flex-1 flex-col items-center justify-center p-6 z-10'>
          <div
            className={cn(
              'flex w-full max-w-md flex-col items-center rounded-3xl p-10 text-center shadow-2xl glass-panel',
              lastResult.isCorrect
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : 'bg-red-500/20 border-red-500/50 text-red-300',
            )}
          >
            {lastResult.isCorrect ? (
              <CheckCircle2 className='mb-4 size-20 drop-shadow-lg text-green-400' />
            ) : (
              <XCircle className='mb-4 size-20 drop-shadow-lg text-red-400' />
            )}

            <h2 className='mb-3 text-4xl font-black text-white'>
              {lastResult.isCorrect ? 'Chính xác!' : 'Sai rồi!'}
            </h2>

            <div className='mb-6 inline-block rounded-full bg-black/30 px-8 py-3 text-2xl font-bold backdrop-blur-sm text-white'>
              +{lastResult.points}
            </div>

            {progress && (
              <div className='text-lg opacity-80 text-white'>
                Streak: {progress.streak > 0 ? `🔥 ${progress.streak}` : '—'}
              </div>
            )}
          </div>

          <Button onClick={handleNextQuestion} className='glass-button mt-8 h-14 px-10 rounded-xl text-lg font-bold text-white hover:bg-white/20'>
            {progress && progress.currentQuestionIndex >= quiz.questions.length
              ? 'Xem kết quả'
              : 'Câu tiếp theo'}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      )}

      {/* ═══ REDEMPTION SCREEN ═══ */}
      {isRedemption && currentRedemptionQuestion && (
        <div className='flex flex-1 flex-col z-10'>
          {/* Redemption header */}
          <header className='flex items-center justify-center border-b border-orange-500/30 bg-orange-500/10 px-4 py-4 backdrop-blur-md'>
            <div className='flex items-center gap-3'>
              <Sparkles className='size-6 text-orange-400' />
              <span className='text-lg font-bold text-orange-300'>
                Cứu mạng — Câu {redemptionIndex + 1}/{redemptionQuestions.length}
              </span>
            </div>
          </header>

          {!hasAnsweredRedemption ? (
            <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-12 gap-8 w-full max-w-7xl mx-auto relative z-10">
              <section className="glass-panel w-full rounded-2xl p-8 md:p-12 shadow-2xl relative border-orange-500/30">
                <h1 className="text-xl md:text-3xl font-medium leading-relaxed text-center tracking-wide text-white/90 drop-shadow-md">
                  {currentRedemptionQuestion.content}
                </h1>
              </section>

              <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
                {currentRedemptionQuestion.options.map((opt, i) => {
                  const glow = glowClasses[i % glowClasses.length]
                  const gradient = glowGradients[i % glowGradients.length]
                  const textColor = optionTextColors[i % optionTextColors.length]
                  
                  return (
                    <Button
                      key={opt.id}
                      onClick={() => handleRedemptionAnswer(opt)}
                      className={cn(
                        "glass-panel group relative flex flex-col items-center justify-center min-h-[250px] p-6 rounded-2xl transition-all duration-300 overflow-hidden whitespace-normal h-auto",
                        "hover:-translate-y-2",
                        glow
                      )}
                    >
                      <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300", gradient)}></div>
                      <span className="absolute top-4 right-4 text-xs font-bold size-6 flex items-center justify-center rounded-md border border-white/20 bg-white/10">{i + 1}</span>
                      <span className={cn("text-xl md:text-2xl font-semibold drop-shadow-sm text-center relative z-10", textColor)}>
                        {opt.content}
                      </span>
                    </Button>
                  )
                })}
              </section>
            </main>
          ) : (
            <div className='flex flex-1 flex-col items-center justify-center p-6'>
              <div
                className={cn(
                  'flex w-full max-w-md flex-col items-center rounded-3xl p-10 text-center shadow-2xl glass-panel',
                  redemptionResult?.isCorrect
                    ? 'bg-green-500/20 border-green-500/50 text-green-300'
                    : 'bg-red-500/20 border-red-500/50 text-red-300',
                )}
              >
                {redemptionResult?.isCorrect ? (
                  <CheckCircle2 className='mb-4 size-20 text-green-400' />
                ) : (
                  <XCircle className='mb-4 size-20 text-red-400' />
                )}
                <h2 className='mb-3 text-3xl font-black text-white'>
                  {redemptionResult?.isCorrect ? 'Cứu thành công!' : 'Vẫn sai!'}
                </h2>
                <div className='inline-block rounded-full bg-black/30 px-6 py-2 text-xl font-bold text-white'>
                  +{redemptionResult?.points || 0}
                </div>
              </div>

              <Button
                onClick={handleNextRedemption}
                className='glass-button mt-8 h-14 px-10 rounded-xl text-lg font-bold text-white hover:bg-white/20'
              >
                {redemptionIndex >= redemptionQuestions.length - 1
                  ? 'Xem kết quả'
                  : 'Câu tiếp theo'}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ═══ FINISHED SCREEN ═══ */}
      {isFinished && soloResult && (
        <div className='flex flex-1 flex-col items-center justify-center p-6 z-10'>
          <div className='flex w-full max-w-lg flex-col items-center text-center glass-panel p-10 rounded-3xl shadow-2xl'>
            {/* Trophy animation */}
            <div className='mb-6 flex size-28 items-center justify-center rounded-full bg-yellow-500/20 border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]'>
              <Trophy className='size-14 text-yellow-400 drop-shadow-lg' />
            </div>

            <h1 className='mb-2 text-4xl font-black text-white'>Hoàn thành!</h1>
            <p className='mb-8 text-gray-300'>{quiz.title}</p>

            {/* Score card */}
            <div className='mb-8 grid w-full max-w-sm grid-cols-3 gap-4 rounded-2xl glass-panel p-6 shadow-sm border-white/20'>
              <div className='flex flex-col items-center text-center'>
                <div className='text-3xl font-black text-purple-400'>{soloResult.score}</div>
                <div className='text-xs text-gray-400 mt-1 uppercase'>Điểm</div>
              </div>
              <div className='flex flex-col items-center text-center'>
                <div className='text-3xl font-black text-green-400'>
                  {soloResult.correctCount}/{soloResult.totalQuestions}
                </div>
                <div className='text-xs text-gray-400 mt-1 uppercase'>Đúng</div>
              </div>
              <div className='flex flex-col items-center text-center'>
                <div className='text-3xl font-black text-blue-400'>
                  {Math.round((soloResult.correctCount / soloResult.totalQuestions) * 100)}%
                </div>
                <div className='text-xs text-gray-400 mt-1 uppercase'>Chính xác</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex w-full flex-col gap-3'>
              <Button onClick={handleShowReview} className='glass-button h-14 flex items-center justify-center gap-3 rounded-xl text-lg font-bold text-white hover:bg-white/20'>
                <BookOpen data-icon="inline-start" /> Xem Flashcard
              </Button>

              <Button variant="ghost" onClick={handleRestart} className='glass-button h-12 flex items-center justify-center gap-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 border border-white/10'>
                <RefreshCw data-icon="inline-start" /> Chơi lại
              </Button>

              <Button variant="link" asChild className="mt-4 text-sm text-gray-400 hover:text-white transition-colors">
                <Link to='/dashboard'>
                  <ArrowLeft data-icon="inline-start" /> Về Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FLASHCARD REVIEW SCREEN ═══ */}
      {isReview && allFlashcards.length > 0 && (
        <div className='flex flex-1 flex-col z-10'>
          {/* Header */}
          <header className='flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md px-4 py-3'>
            <Button
              variant="ghost"
              onClick={handleBackToResult}
              className='text-gray-300 hover:text-white transition-colors hover:bg-transparent px-0'
            >
              <ChevronLeft data-icon="inline-start" /> Kết quả
            </Button>
            <span className='text-sm text-gray-300 glass-panel px-3 py-1 rounded-full'>
              <span className='font-bold text-white'>{flashcardIndex + 1}</span> / {allFlashcards.length}
            </span>
            <div className='w-20' />
          </header>

          {/* Flashcard content */}
          <div className='flex flex-1 flex-col items-center justify-center p-6'>
            {(() => {
              const card = allFlashcards[flashcardIndex]
              if (!card) return null

              const correctOption = card.question.options.find((o) => o.isCorrect)

              return (
                <div className='w-full max-w-2xl'>
                  {/* Question */}
                  <div className='mb-6 glass-panel rounded-2xl p-8 text-center shadow-2xl'>
                    <div className='mb-3 text-xs font-medium tracking-widest text-pink-300 uppercase'>
                      Câu {flashcardIndex + 1}
                    </div>
                    <h2 className='text-2xl font-bold text-white'>
                      {card.question.content}
                    </h2>
                  </div>

                  {/* All options with visual feedback */}
                  <div className='flex flex-col gap-3'>
                    {card.question.options.map((opt) => {
                      const isSelected = opt.id === card.selectedOptionId
                      const isCorrectOpt = opt.isCorrect

                      let className = 'flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all backdrop-blur-md '
                      if (isCorrectOpt) {
                        className += 'border-green-500/50 bg-green-500/20 text-green-300'
                      } else if (isSelected && !isCorrectOpt) {
                        className += 'border-red-500/50 bg-red-500/20 text-red-300'
                      } else {
                        className += 'border-white/10 bg-white/5 text-gray-400'
                      }

                      return (
                        <div key={opt.id} className={className}>
                          {isCorrectOpt ? (
                            <CheckCircle2 className='size-5 shrink-0 text-green-400' />
                          ) : isSelected ? (
                            <XCircle className='size-5 shrink-0 text-red-400' />
                          ) : (
                            <div className='size-5 shrink-0 rounded-full border-2 border-white/20' />
                          )}
                          <span className='font-medium text-lg'>{opt.content}</span>
                          {isSelected && (
                            <span className='ml-auto text-xs opacity-70 bg-black/30 px-2 py-1 rounded'>Bạn đã chọn</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Result badge */}
                  <div className='mt-6 flex justify-center'>
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold shadow-lg border',
                        card.isCorrect
                          ? 'bg-green-500/20 text-green-300 border-green-500/50'
                          : 'bg-red-500/20 text-red-300 border-red-500/50',
                      )}
                    >
                      {card.isCorrect ? (
                        <>
                          <CheckCircle2 className='size-5 text-green-400' /> Đúng — +{card.pointsEarned} điểm
                        </>
                      ) : (
                        <>
                          <XCircle className='size-5 text-red-400' /> Sai — Đáp án đúng: {correctOption?.content}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Navigation */}
          <div className='flex items-center justify-between border-t border-white/10 bg-black/20 backdrop-blur-md px-6 py-4'>
            <Button
              variant="ghost"
              onClick={handleFlashcardPrev}
              disabled={flashcardIndex === 0}
              className='text-gray-300 hover:text-white transition-colors disabled:opacity-50 hover:bg-white/10'
            >
              <ArrowLeft data-icon="inline-start" /> Trước
            </Button>
            <Button
              variant="ghost"
              onClick={handleFlashcardNext}
              disabled={flashcardIndex === allFlashcards.length - 1}
              className='text-gray-300 hover:text-white transition-colors disabled:opacity-50 hover:bg-white/10'
            >
              Sau <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
