import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { roomService } from '@/services/roomService'
import { soloService } from '@/services/soloService'
import type { GameSession, Participant, SoloResult } from '@/types/room'

/**
 * Custom hook quản lý data loading cho tab Lịch sử.
 * Bao gồm: phiên Live (host) + kết quả Solo (user).
 * Participants được lazy-load khi expand accordion.
 */
export function useHistory() {
  const { user } = useAuth()

  const [liveSessions, setLiveSessions] = useState<GameSession[]>([])
  const [soloResults, setSoloResults] = useState<SoloResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Accordion state
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)
  const [sessionParticipants, setSessionParticipants] = useState<Record<string, Participant[]>>({})
  const [loadingParticipants, setLoadingParticipants] = useState(false)

  // Load history data
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchHistory = async () => {
      setLoading(true)
      setError(null)

      try {
        const [sessions, results] = await Promise.all([
          roomService.getSessionsByHost(user.uid),
          soloService.getResultsByUser(user.uid),
        ])

        if (!cancelled) {
          setLiveSessions(sessions)
          setSoloResults(results)
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('Error loading history:', err)
          setError(err.message || 'Không thể tải lịch sử')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchHistory()
    return () => {
      cancelled = true
    }
  }, [user])

  // Toggle accordion — lazy-load participants khi mở
  const toggleSession = useCallback(
    async (sessionId: string) => {
      if (expandedSessionId === sessionId) {
        setExpandedSessionId(null)
        return
      }

      setExpandedSessionId(sessionId)

      // Nếu đã load rồi thì dùng cache
      if (sessionParticipants[sessionId]) return

      setLoadingParticipants(true)
      try {
        const participants = await roomService.getParticipants(sessionId)
        setSessionParticipants((prev) => ({
          ...prev,
          [sessionId]: participants,
        }))
      } catch (err) {
        console.error('Error loading participants:', err)
      } finally {
        setLoadingParticipants(false)
      }
    },
    [expandedSessionId, sessionParticipants],
  )

  return {
    liveSessions,
    soloResults,
    loading,
    error,
    expandedSessionId,
    sessionParticipants,
    loadingParticipants,
    toggleSession,
  }
}
