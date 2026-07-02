import { roomService } from '@/services/roomService'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'

/**
 * Custom hook cho logic trang JoinRoom.
 * Quản lý state form và xử lý tham gia phòng chơi.
 */
export function useJoinRoom() {
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleJoin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!roomCode.trim() || !playerName.trim()) {
        setError('Vui lòng nhập mã phòng và tên của bạn')
        return
      }

      setLoading(true)
      setError('')
      try {
        const { sessionId, participantId } = await roomService.joinSession(roomCode, playerName)

        // Save participantId to localStorage so player can refresh page
        localStorage.setItem(`myquizz_participant_${sessionId}`, participantId)

        navigate(`/play/${sessionId}`, { state: { participantId }, viewTransition: true })
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tham gia phòng. Vui lòng kiểm tra lại mã.')
      } finally {
        setLoading(false)
      }
    },
    [roomCode, playerName, navigate],
  )

  const handleRoomCodeChange = useCallback((value: string) => {
    setRoomCode(value.toUpperCase())
  }, [])

  return {
    roomCode,
    playerName,
    loading,
    error,
    handleJoin,
    handleRoomCodeChange,
    setPlayerName,
  }
}
