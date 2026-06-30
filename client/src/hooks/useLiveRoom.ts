import { roomService } from '@/services/roomService'
import type { GameSession, Participant, PlayerAnswer } from '@/types/room'
import { useEffect, useState } from 'react'

export function useLiveRoom(sessionId: string | undefined, currentQuestionId?: string) {
  const [session, setSession] = useState<GameSession | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentAnswers, setCurrentAnswers] = useState<PlayerAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Listen to Session & Participants
  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribeSession = roomService.onSessionChange(sessionId, (newSession) => {
      setSession(newSession)
      setLoading(false)
    })

    const unsubscribeParticipants = roomService.onParticipantsChange(
      sessionId,
      (newParticipants) => {
        setParticipants(newParticipants)
      },
    )

    return () => {
      unsubscribeSession()
      unsubscribeParticipants()
    }
  }, [sessionId])

  // Listen to Answers for current question
  useEffect(() => {
    if (!sessionId || !currentQuestionId) {
      setCurrentAnswers([])
      return
    }

    const unsubscribeAnswers = roomService.onAnswersChange(
      sessionId,
      currentQuestionId,
      (newAnswers) => {
        setCurrentAnswers(newAnswers)
      },
    )

    return () => {
      unsubscribeAnswers()
    }
  }, [sessionId, currentQuestionId])

  return {
    session,
    participants,
    currentAnswers,
    loading,
    error,
  }
}
