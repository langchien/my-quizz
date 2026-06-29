import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useLiveRoom } from '@/hooks/useLiveRoom'
import { playSound } from '@/lib/sounds'
import { quizService } from '@/services/quizService'
import { roomService } from '@/services/roomService'
import type { AnswerOption, Quiz } from '@/types/quiz'

const getNow = () => Date.now()

/**
 * Custom hook quản lý toàn bộ logic game cho Player.
 * Bao gồm: participantId recovery, answer submission, question tracking, result tracking.
 *
 * @param sessionId - ID của game session từ URL params
 */
export function usePlayerGame(sessionId: string | undefined) {
  const location = useLocation()
  const navigate = useNavigate()

  const [participantId, setParticipantId] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionId, setCurrentQuestionId] = useState<string | undefined>(undefined)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; points: number } | null>(null)

  const { session, participants, loading, error } = useLiveRoom(sessionId, currentQuestionId)

  // Determine Participant ID from navigation state or localStorage
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

  // Find current participant
  const me = useMemo(
    () => participants.find((p) => p.id === participantId),
    [participants, participantId],
  )

  // Fetch Quiz (one-time)
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

  // Submit answer
  const handleAnswer = useCallback(
    async (option: AnswerOption) => {
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
    },
    [hasAnswered, session, quiz, currentQuestionId, me, sessionId],
  )

  // Derived state
  const currentQuestion =
    quiz && session && session.currentQuestionIndex >= 0
      ? quiz.questions[session.currentQuestionIndex]
      : null

  const isLobby = session?.status === 'waiting'
  const isPlaying = session?.status === 'playing'
  const isLeaderboard = session?.status === 'showing_leaderboard'
  const isFinished = session?.status === 'finished'

  return {
    // Data
    session,
    participants,
    me,
    participantId,
    loading,
    error,

    // Derived
    currentQuestion,
    hasAnswered,
    lastResult,
    isLobby,
    isPlaying,
    isLeaderboard,
    isFinished,

    // Actions
    handleAnswer,
  }
}
