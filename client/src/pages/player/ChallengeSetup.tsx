import { PageTransition } from '@/components/PageTransition'
import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { DIFFICULTY_LABELS } from '@/config/quizCategories'
import { useAuth } from '@/hooks/useAuth'
import { quizService } from '@/services/quizService'
import { roomService } from '@/services/roomService'
import type { Quiz } from '@/types/quiz'
import { HelpCircle, Link2, Play, Share2, Trophy, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

/**
 * Trang setup trước khi tạo phòng Challenge (Thách đấu bạn bè).
 * User đăng nhập → chọn quiz → tạo phòng Live → trở thành Host.
 *
 * Route: /challenge/:quizId/setup
 */
export default function ChallengeSetup() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch quiz data
  useEffect(() => {
    if (!quizId) return
    setLoading(true)
    quizService
      .getQuizById(quizId)
      .then((q) => {
        if (!q) {
          setError('Không tìm thấy bộ câu hỏi')
          return
        }
        setQuiz(q)
      })
      .catch(() => setError('Lỗi khi tải bộ câu hỏi'))
      .finally(() => setLoading(false))
  }, [quizId])

  // Tạo phòng Live và navigate đến Host page
  const handleCreateRoom = useCallback(async () => {
    if (!quiz || !user || !quizId) return
    setCreating(true)
    try {
      const { sessionId } = await roomService.createLiveSession(quizId, user.uid, quiz.title)
      toast.success('Đã tạo phòng thành công!')
      navigate(`/host/${sessionId}`, { viewTransition: true })
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Không thể tạo phòng lúc này')
    } finally {
      setCreating(false)
    }
  }, [quiz, user, quizId, navigate])

  const handleShareQuiz = useCallback(() => {
    if (!quizId) return
    const url = `${window.location.origin}/solo/${quizId}/setup`
    navigator.clipboard.writeText(url).then(
      () => toast.success('Đã sao chép link quiz!'),
      () => toast.error('Không thể sao chép'),
    )
  }, [quizId])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <Spinner className='size-12 text-primary' />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8'>
        <p className='text-xl font-bold text-destructive'>{error || 'Không tìm thấy quiz'}</p>
        <Button variant='outline' onClick={() => navigate('/dashboard', { viewTransition: true })}>
          Quay về Dashboard
        </Button>
      </div>
    )
  }

  const difficultyLabel = quiz.difficulty ? DIFFICULTY_LABELS[quiz.difficulty] : null
  const quizLink = `${window.location.origin}/solo/${quiz.id}/setup`

  return (
    <PageTransition>
      <div
        className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4'
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}
      >
        {/* Background orbs */}
        <div className='bg-orb orb-1' />
        <div className='bg-orb orb-2' />
        <div className='bg-orb orb-3' />

        <div className='z-10 w-full max-w-lg'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-300'>
              <Users className='size-4' />
              Thách đấu bạn bè
            </div>
            <h1 className='text-3xl font-black text-white md:text-4xl'>Tạo phòng thi đấu</h1>
            <p className='mt-2 text-gray-400'>
              Mời bạn bè tham gia và cùng chiến đấu trong thời gian thực!
            </p>
          </div>

          {/* Quiz Info Card */}
          <Card className='mb-6 border-white/10 bg-white/5 text-white backdrop-blur-md'>
            <CardHeader className='pb-3'>
              <div className='relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 p-6'>
                <div className='absolute inset-0 bg-black/10' />
                <CardTitle className='relative text-2xl font-bold text-white drop-shadow-md'>
                  {quiz.title}
                </CardTitle>
                {quiz.description && (
                  <p className='relative mt-2 text-sm text-white/80'>{quiz.description}</p>
                )}
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Meta stats */}
              <div className='grid grid-cols-3 gap-3'>
                <div className='flex flex-col items-center rounded-lg bg-white/5 p-3'>
                  <HelpCircle className='mb-1 size-5 text-blue-400' />
                  <span className='text-xs text-gray-400'>Câu hỏi</span>
                  <span className='text-lg font-bold'>{quiz.questions?.length || 0}</span>
                </div>
                <div className='flex flex-col items-center rounded-lg bg-white/5 p-3'>
                  <Trophy className='mb-1 size-5 text-yellow-400' />
                  <span className='text-xs text-gray-400'>Lượt chơi</span>
                  <span className='text-lg font-bold'>{quiz.playCount || 0}</span>
                </div>
                <div className='flex flex-col items-center rounded-lg bg-white/5 p-3'>
                  <Play className='mb-1 size-5 text-green-400' />
                  <span className='text-xs text-gray-400'>Độ khó</span>
                  <span className='text-lg font-bold'>{difficultyLabel || 'N/A'}</span>
                </div>
              </div>

              <Separator className='bg-white/10' />

              {/* Share link */}
              <div className='flex items-center justify-between rounded-lg bg-white/5 p-3'>
                <div className='flex items-center gap-2 text-sm text-gray-300'>
                  <Link2 className='size-4' />
                  <span className='truncate'>{quizLink}</span>
                </div>
                <ShareButton
                  value={quizLink}
                  icon='copy'
                  variant='ghost'
                  size='icon'
                  toastMessage='Đã sao chép link quiz!'
                  className='text-gray-300 hover:text-white'
                />
              </div>
            </CardContent>
          </Card>

          {/* Create Room Button */}
          <Button
            onClick={handleCreateRoom}
            disabled={creating}
            className='h-16 w-full rounded-2xl border border-pink-400/50 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-xl font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all hover:from-pink-400 hover:to-fuchsia-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] active:scale-[0.98]'
          >
            {creating ? (
              <>
                <Spinner className='mr-2 size-5' /> Đang tạo phòng...
              </>
            ) : (
              <>
                <Users className='mr-2 size-5' /> Tạo phòng & Mời bạn bè
              </>
            )}
          </Button>

          {/* Secondary actions */}
          <div className='mt-4 flex justify-center gap-4'>
            <Button
              variant='ghost'
              className='gap-2 text-gray-400 hover:text-white'
              onClick={handleShareQuiz}
            >
              <Share2 className='size-4' /> Chia sẻ quiz
            </Button>
            <Button
              variant='ghost'
              className='text-gray-400 hover:text-white'
              onClick={() => navigate('/dashboard', { viewTransition: true })}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
