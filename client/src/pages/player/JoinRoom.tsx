import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { roomService } from '@/services/roomService'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleJoin = async (e: React.FormEvent) => {
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

      navigate(`/play/${sessionId}`, { state: { participantId } })
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tham gia phòng. Vui lòng kiểm tra lại mã.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4'>
      <Card className='w-full max-w-md border-0 bg-white/90 shadow-2xl backdrop-blur'>
        <CardHeader className='pb-2 text-center'>
          <CardTitle className='bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent'>
            Tham gia Quiz
          </CardTitle>
          <CardDescription className='text-lg'>Nhập mã phòng để bắt đầu cuộc chơi!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='roomCode' className='font-bold text-gray-700'>
                Mã phòng (PIN)
              </Label>
              <Input
                id='roomCode'
                placeholder='Nhập mã phòng 6 ký tự'
                className='h-14 text-center text-2xl font-bold uppercase'
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='playerName' className='font-bold text-gray-700'>
                Tên hiển thị
              </Label>
              <Input
                id='playerName'
                placeholder='Biệt danh của bạn'
                className='h-12 text-lg'
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
              />
            </div>

            {error && (
              <div className='rounded bg-red-100 p-3 text-sm font-medium text-red-600'>{error}</div>
            )}

            <Button
              type='submit'
              className='h-14 w-full bg-linear-to-r from-purple-600 to-pink-600 text-xl font-bold shadow-lg transition-transform hover:scale-105 hover:from-purple-700 hover:to-pink-700'
              disabled={loading}
            >
              {loading ? 'Đang vào...' : 'Vào Chơi'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
