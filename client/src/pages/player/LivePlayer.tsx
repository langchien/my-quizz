import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useLiveRoom } from '@/hooks/useLiveRoom'
import { playSound } from '@/lib/sounds'
import { quizService } from '@/services/quizService'
import { roomService } from '@/services/roomService'
import type { AnswerOption, Quiz } from '@/types/quiz'

const getNow = () => Date.now()

export default function LivePlayer() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const [participantId, setParticipantId] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)

  const [currentQuestionId, setCurrentQuestionId] = useState<string | undefined>(undefined)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; points: number } | null>(null)

  const { session, participants, loading, error } = useLiveRoom(sessionId, currentQuestionId)

  // Determine Participant ID
  useEffect(() => {
    let pId = location.state?.participantId
    if (!pId) {
      pId = localStorage.getItem(`myquizz_participant_${sessionId}`)
    }

    if (!pId) {
      navigate('/join')
    } else {
      setParticipantId(pId)
    }
  }, [sessionId, location.state, navigate])

  const me = useMemo(() => {
    return participants.find((p) => p.id === participantId)
  }, [participants, participantId])

  // Fetch Quiz
  useEffect(() => {
    if (session?.quizId && !quiz) {
      quizService.getQuizById(session.quizId).then((q) => {
        if (q) setQuiz(q)
      })
    }
  }, [session?.quizId, quiz])

  // Reset answered state on new question
  useEffect(() => {
    if (session && quiz && session.currentQuestionIndex >= 0) {
      const q = quiz.questions[session.currentQuestionIndex]
      if (q) {
        if (q.id !== currentQuestionId) {
          setCurrentQuestionId(q.id)
          setHasAnswered(false)
          setLastResult(null)
        }
      }
    }
  }, [session?.currentQuestionIndex, quiz, currentQuestionId])

  const handleAnswer = async (option: AnswerOption) => {
    if (
      hasAnswered ||
      !session ||
      !quiz ||
      !currentQuestionId ||
      !me ||
      !sessionId ||
      !session.questionActiveUntil
    )
      return

    setHasAnswered(true)

    const timeLimitMs = (quiz.questions[session.currentQuestionIndex].timeLimit || 20) * 1000
    // Time left is activeUntil - now. So response time is timeLimit - (activeUntil - now)
    const now = getNow()
    const responseTimeMs = timeLimitMs - Math.max(0, session.questionActiveUntil - now)

    const isCorrect = option.isCorrect

    if (isCorrect) playSound('correct')
    else playSound('incorrect')

    const points = roomService.calculateScore(isCorrect, responseTimeMs, timeLimitMs)
    setLastResult({ isCorrect, points })

    await roomService.submitAnswer(
      sessionId,
      me.id,
      currentQuestionId,
      option.id,
      isCorrect,
      responseTimeMs,
      timeLimitMs,
      me.streak,
    )
  }

  if (loading || !session || !participantId) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-900 text-white'>
        <Loader2 className='h-12 w-12 animate-spin text-pink-500' />
      </div>
    )
  }

  if (error) return <div className='p-8 text-red-500'>{error}</div>

  const isLobby = session.status === 'waiting'
  const isPlaying = session.status === 'playing'
  const isLeaderboard = session.status === 'showing_leaderboard'
  const isFinished = session.status === 'finished'

  const currentQuestion =
    quiz && session.currentQuestionIndex >= 0 ? quiz.questions[session.currentQuestionIndex] : null

  return (
    <div className='flex min-h-screen flex-col bg-slate-100 font-sans'>
      {/* Header */}
      <header className='flex items-center justify-between bg-white p-4 shadow-sm'>
        <div className='font-bold text-slate-800'>{me?.name || 'Player'}</div>
        <div className='rounded-full bg-slate-900 px-4 py-1 font-black text-white'>
          {me?.score || 0}
        </div>
      </header>

      <main className='flex flex-1 flex-col items-center justify-center p-4'>
        {isLobby && (
          <div className='animate-pulse text-center'>
            <h2 className='mb-4 text-3xl font-bold text-slate-700'>Bạn đã vào phòng!</h2>
            <p className='text-xl text-slate-500'>Đang chờ Host bắt đầu...</p>
          </div>
        )}

        {isPlaying && currentQuestion && !hasAnswered && (
          <div className='flex h-full w-full flex-col justify-center'>
            <div className='mx-auto grid h-[60vh] w-full max-w-2xl grid-cols-2 gap-4'>
              {currentQuestion.options.map((opt, i) => {
                const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500']
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswer(opt)}
                    className={`${colors[i % 4]} flex items-center justify-center rounded-2xl p-4 text-3xl font-bold text-white shadow-xl transition-transform active:scale-95`}
                  >
                    {/* Optionally hide text and just show colors on mobile if desired, but let's show it for simplicity */}
                    {opt.content}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {isPlaying && currentQuestion && hasAnswered && (
          <div className='text-center'>
            <Loader2 className='mx-auto mb-6 h-16 w-16 animate-spin text-slate-400' />
            <h2 className='text-3xl font-bold text-slate-700'>Đang đợi những người khác...</h2>
          </div>
        )}

        {isLeaderboard && lastResult && (
          <div
            className={`w-full max-w-md rounded-3xl p-8 text-center text-white shadow-2xl ${lastResult.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {lastResult.isCorrect ? (
              <CheckCircle2 className='mx-auto mb-4 h-24 w-24' />
            ) : (
              <XCircle className='mx-auto mb-4 h-24 w-24' />
            )}
            <h2 className='mb-4 text-4xl font-black'>
              {lastResult.isCorrect ? 'Chính xác!' : 'Sai rồi!'}
            </h2>
            <div className='inline-block rounded-full bg-white/20 px-6 py-2 text-2xl font-bold'>
              +{lastResult.points}
            </div>
          </div>
        )}

        {isLeaderboard && !lastResult && (
          <div className='text-center text-xl font-bold text-slate-500'>
            Hết thời gian! Bạn chưa chọn đáp án.
          </div>
        )}

        {isFinished && (
          <div className='text-center'>
            <h2 className='mb-4 text-4xl font-black text-slate-800'>Game Kết Thúc</h2>
            <p className='mb-8 text-2xl text-slate-600'>Bạn đạt được {me?.score} điểm!</p>

            {(() => {
              const rank =
                participants.sort((a, b) => b.score - a.score).findIndex((p) => p.id === me?.id) + 1
              return <div className='text-3xl font-bold text-purple-600'>Thứ hạng: #{rank}</div>
            })()}
          </div>
        )}
      </main>
    </div>
  )
}
