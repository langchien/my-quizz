import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useJoinRoom } from '@/hooks/useJoinRoom'

export default function JoinRoom() {
  const { roomCode, playerName, loading, error, handleJoin, handleRoomCodeChange, setPlayerName } =
    useJoinRoom()

  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md border bg-card shadow-lg'>
        <CardHeader className='pb-2 text-center'>
          <CardTitle className='text-3xl font-extrabold text-foreground'>
            Tham gia Quiz
          </CardTitle>
          <CardDescription className='text-lg'>Nhập mã phòng để bắt đầu cuộc chơi!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin}>
            <div className='flex flex-col gap-4'>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor='roomCode'>
                  Mã phòng (PIN)
                </FieldLabel>
                <Input
                  id='roomCode'
                  placeholder='Nhập mã phòng 6 ký tự'
                  className='h-14 text-center text-2xl font-bold uppercase'
                  value={roomCode}
                  onChange={(e) => handleRoomCodeChange(e.target.value)}
                  maxLength={6}
                  aria-invalid={!!error}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='playerName'>
                  Tên hiển thị
                </FieldLabel>
                <Input
                  id='playerName'
                  placeholder='Biệt danh của bạn'
                  className='h-12 text-lg'
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={20}
                />
              </Field>

              {error && (
                <FieldError>
                  {error}
                </FieldError>
              )}

              <Button
                type='submit'
                className='h-14 w-full text-xl font-bold transition-transform active:scale-95'
                disabled={loading}
              >
                {loading ? 'Đang vào...' : 'Vào Chơi'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
