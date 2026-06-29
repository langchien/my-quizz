import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLiveRoom } from '@/hooks/useLiveRoom'
import { playSound } from '@/lib/sounds'
import { quizService } from '@/services/quizService'
import { roomService } from '@/services/roomService'
import type { Quiz } from '@/types/quiz'

/**
 * Custom hook quản lý toàn bộ logic game cho Host.
 * Bao gồm: timer, game control (start/next/finish), quiz fetching, participant sorting.
 *
 * @param sessionId - ID của game session từ URL params
 */
export function useHostGameControl(sessionId: string | undefined) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [currentQuestionId, setCurrentQuestionId] = useState<string | undefined>(undefined)

  const { session, participants, currentAnswers, loading, error } = useLiveRoom(
    sessionId,
    currentQuestionId,
  )

  // Fetch quiz data khi biết quizId từ session (one-time)
  useEffect(() => {
    if (session?.quizId && !quiz) {
      quizService.getQuizById(session.quizId).then((q) => {
        if (q) setQuiz(q)
      })
    }
  }, [session?.quizId, quiz])

  // Track current question ID dựa trên session.currentQuestionIndex
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
  const handleStart = useCallback(async () => {
    if (!sessionId || !quiz || quiz.questions.length === 0) return
    playSound('start')
    await roomService.startSession(sessionId)
    const timeLimit = quiz.questions[0].timeLimit || 20
    await roomService.nextQuestion(sessionId, 0, timeLimit)
  }, [sessionId, quiz])

  // Next question or finish game
  const handleNextQuestion = useCallback(async () => {
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
  }, [sessionId, quiz, session])

  // Skip timer
  const handleSkipTimer = useCallback(async () => {
    if (sessionId) await roomService.showLeaderboard(sessionId)
  }, [sessionId])

  // Derived state
  const currentQuestion =
    quiz && session && session.currentQuestionIndex >= 0
      ? quiz.questions[session.currentQuestionIndex]
      : null

  const sortedParticipants = useMemo(
    () => [...participants].sort((a, b) => b.score - a.score),
    [participants],
  )

  const isLobby = session?.status === 'waiting'
  const isPlaying = session?.status === 'playing'
  const isLeaderboard = session?.status === 'showing_leaderboard'
  const isFinished = session?.status === 'finished'

  return {
    // Data
    quiz,
    session,
    participants,
    currentAnswers,
    loading,
    error,

    // Derived
    timeLeft,
    currentQuestion,
    sortedParticipants,
    isLobby,
    isPlaying,
    isLeaderboard,
    isFinished,

    // Actions
    handleStart,
    handleNextQuestion,
    handleSkipTimer,
  }
}
