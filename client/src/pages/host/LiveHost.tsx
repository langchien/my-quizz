import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLiveRoom } from '@/hooks/useLiveRoom'
import { playSound } from '@/lib/sounds'
import { quizService } from '@/services/quizService'
import { roomService } from '@/services/roomService'
import type { Quiz } from '@/types/quiz'
import { Trophy, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function LiveHost() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // We need to know current question to listen to answers.
  // We calculate currentQuestionId dynamically based on session.currentQuestionIndex
  const [currentQuestionId, setCurrentQuestionId] = useState<string | undefined>(undefined)

  const { session, participants, currentAnswers, loading, error } = useLiveRoom(
    sessionId,
    currentQuestionId,
  )

  useEffect(() => {
    if (session?.quizId && !quiz) {
      quizService.getQuizById(session.quizId).then((q) => {
        if (q) setQuiz(q)
      })
    }
  }, [session?.quizId, quiz])

  useEffect(() => {
    if (session && quiz && session.currentQuestionIndex >= 0) {
      const q = quiz.questions[session.currentQuestionIndex]
      if (q) setCurrentQuestionId(q.id)
    } else {
      setCurrentQuestionId(undefined)
    }
  }, [session?.currentQuestionIndex, quiz])

  // Timer countdown
  useEffect(() => {
    if (session?.status === 'playing' && session.questionActiveUntil) {
      const interval = setInterval(() => {
        const now = Date.now()
        const diff = Math.max(0, session.questionActiveUntil! - now)
        const seconds = Math.ceil(diff / 1000)
        setTimeLeft(seconds)

        if (diff <= 0) {
          clearInterval(interval)
          playSound('incorrect') // Time up
          if (sessionId) roomService.showLeaderboard(sessionId)
        }
      }, 500)
      return () => clearInterval(interval)
    }
  }, [session?.status, session?.questionActiveUntil, sessionId])

  // Start the game
  const handleStart = async () => {
    if (!sessionId || !quiz || quiz.questions.length === 0) return
    playSound('start')
    await roomService.startSession(sessionId)
    // Then immediately jump to first question
    const timeLimit = quiz.questions[0].timeLimit || 20
    await roomService.nextQuestion(sessionId, 0, timeLimit)
  }

  const handleNextQuestion = async () => {
    if (!sessionId || !quiz || !session) return
    const nextIdx = session.currentQuestionIndex + 1
    if (nextIdx >= quiz.questions.length) {
      await roomService.finishSession(sessionId)
      playSound('correct')
    } else {
      const timeLimit = quiz.questions[nextIdx].timeLimit || 20
      await roomService.nextQuestion(sessionId, nextIdx, timeLimit)
      playSound('countdown')
    }
  }

  if (loading || !session) return <div className='p-8 text-center text-xl'>Đang tải phòng...</div>
  if (error) return <div className='p-8 text-red-500'>{error}</div>

  const isLobby = session.status === 'waiting'
  const isPlaying = session.status === 'playing'
  const isLeaderboard = session.status === 'showing_leaderboard'
  const isFinished = session.status === 'finished'

  const currentQuestion =
    quiz && session.currentQuestionIndex >= 0 ? quiz.questions[session.currentQuestionIndex] : null

  // Sort participants by score
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score)

  return (
    <div className='flex min-h-screen flex-col bg-slate-900 font-sans text-white'>
      {/* Header */}
      <header className='flex items-center justify-between border-b border-slate-700 bg-slate-800 p-4'>
        <h1 className='bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-bold text-transparent'>
          {quiz?.title || 'Đang tải Quiz...'}
        </h1>
        <div className='rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 font-mono text-xl shadow-inner'>
          PIN: <span className='font-bold text-white'>{session.roomCode}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex flex-1 flex-col items-center justify-center p-6'>
        {isLobby && (
          <div className='flex w-full max-w-4xl flex-col items-center'>
            <h2 className='mb-8 text-center text-5xl font-black'>Vào myquizz.com và nhập PIN</h2>
            <div className='mb-12 font-mono text-8xl font-black text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]'>
              {session.roomCode}
            </div>

            <div className='mb-8 w-full rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='flex items-center text-2xl font-bold'>
                  <Users className='mr-2 h-6 w-6 text-purple-400' />
                  Người chơi ({participants.length})
                </h3>
                <Button
                  onClick={handleStart}
                  disabled={participants.length === 0}
                  className='h-auto bg-green-500 px-8 py-6 text-lg font-bold text-white hover:bg-green-600'
                >
                  Bắt đầu Game
                </Button>
              </div>

              <div className='mt-6 flex flex-wrap gap-4'>
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className='animate-bounce-in rounded-full bg-slate-700 px-4 py-2 font-bold'
                  >
                    {p.name}
                  </div>
                ))}
                {participants.length === 0 && (
                  <div className='text-slate-400 italic'>Chưa có ai tham gia...</div>
                )}
              </div>
            </div>
          </div>
        )}

        {isPlaying && currentQuestion && (
          <div className='flex w-full max-w-5xl flex-col items-center'>
            <div className='mb-8 flex w-full items-center justify-between'>
              <div className='flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-pink-500 bg-slate-800 shadow-[0_0_20px_rgba(236,72,153,0.5)]'>
                <span className='text-4xl font-black'>{timeLeft}</span>
              </div>
              <div className='flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-purple-500 bg-slate-800'>
                <span className='text-xl text-slate-400'>Trả lời</span>
                <span className='text-3xl font-black'>{currentAnswers.length}</span>
              </div>
            </div>

            <Card className='mb-8 w-full border-0 bg-white text-slate-900 shadow-2xl'>
              <CardContent className='p-12 text-center'>
                <h2 className='text-4xl font-bold'>{currentQuestion.content}</h2>
              </CardContent>
            </Card>

            <div className='grid w-full grid-cols-2 gap-4'>
              {currentQuestion.options.map((opt, i) => {
                const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500']
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center rounded-xl p-6 shadow-lg ${colors[i % 4]} min-h-[120px] text-2xl font-bold text-white`}
                  >
                    {opt.content}
                  </div>
                )
              })}
            </div>

            <div className='mt-8'>
              <Button onClick={() => roomService.showLeaderboard(sessionId!)} variant='secondary'>
                Bỏ qua thời gian
              </Button>
            </div>
          </div>
        )}

        {isLeaderboard && (
          <div className='flex w-full max-w-3xl flex-col items-center'>
            <h2 className='mb-8 flex items-center text-4xl font-bold text-yellow-400 drop-shadow-md'>
              <Trophy className='mr-4 h-10 w-10' /> Leaderboard
            </h2>

            <div className='mb-8 w-full space-y-4'>
              {sortedParticipants.slice(0, 5).map((p, index) => (
                <div
                  key={p.id}
                  className='flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-md'
                >
                  <div className='flex items-center'>
                    <span className='mr-4 w-8 text-center text-2xl font-black text-slate-400'>
                      #{index + 1}
                    </span>
                    <span className='text-xl font-bold'>{p.name}</span>
                  </div>
                  <div className='text-2xl font-black text-pink-400'>{p.score}</div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleNextQuestion}
              className='h-auto bg-blue-600 px-10 py-6 text-xl font-bold text-white hover:bg-blue-700'
            >
              {session.currentQuestionIndex >= (quiz?.questions.length || 0) - 1
                ? 'Kết thúc Game'
                : 'Câu hỏi tiếp theo'}
            </Button>
          </div>
        )}

        {isFinished && (
          <div className='flex w-full max-w-4xl flex-col items-center'>
            <h2 className='mb-12 text-center text-5xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]'>
              PODIUM
            </h2>

            <div className='mb-12 flex h-64 w-full items-end justify-center gap-4'>
              {/* Rank 2 */}
              {sortedParticipants[1] && (
                <div className='flex w-1/3 flex-col items-center'>
                  <div className='mb-2 text-2xl font-bold'>{sortedParticipants[1].name}</div>
                  <div className='mb-2 font-bold text-yellow-400'>
                    {sortedParticipants[1].score}
                  </div>
                  <div className='flex h-32 w-full justify-center rounded-t-lg bg-slate-400 pt-4 text-3xl font-black text-white'>
                    2
                  </div>
                </div>
              )}
              {/* Rank 1 */}
              {sortedParticipants[0] && (
                <div className='flex w-1/3 flex-col items-center'>
                  <div className='mb-2 text-3xl font-black text-yellow-400'>
                    {sortedParticipants[0].name}
                  </div>
                  <div className='mb-2 font-bold text-yellow-400'>
                    {sortedParticipants[0].score}
                  </div>
                  <div className='flex h-48 w-full justify-center rounded-t-lg bg-yellow-500 pt-4 text-4xl font-black text-white'>
                    1
                  </div>
                </div>
              )}
              {/* Rank 3 */}
              {sortedParticipants[2] && (
                <div className='flex w-1/3 flex-col items-center'>
                  <div className='mb-2 text-xl font-bold'>{sortedParticipants[2].name}</div>
                  <div className='mb-2 font-bold text-yellow-400'>
                    {sortedParticipants[2].score}
                  </div>
                  <div className='flex h-24 w-full justify-center rounded-t-lg bg-amber-700 pt-4 text-2xl font-black text-white'>
                    3
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => navigate('/dashboard')}
              variant='outline'
              className='text-slate-900'
            >
              Quay về Dashboard
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
