import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { DIFFICULTY_LABELS } from '@/config/quizCategories'
import type { Quiz } from '@/types/quiz'
import { BookOpen, CalendarDays, Copy, HelpCircle, Play, Share2, Trophy } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

interface QuizPreviewModalProps {
  quiz: Quiz | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Callback khi Host Live — nếu undefined, ẩn nút Host */
  onHostLive?: (quizId: string, quizTitle: string) => void
}

export function QuizPreviewModal({ quiz, open, onOpenChange, onHostLive }: QuizPreviewModalProps) {
  const navigate = useNavigate()

  const handlePractice = useCallback(() => {
    if (!quiz) return
    onOpenChange(false)
    navigate(`/solo/${quiz.id}/setup`)
  }, [quiz, navigate, onOpenChange])

  const handleHostLive = useCallback(() => {
    if (!quiz || !onHostLive) return
    onOpenChange(false)
    onHostLive(quiz.id, quiz.title)
  }, [quiz, onHostLive, onOpenChange])

  const handleShare = useCallback(async () => {
    if (!quiz) return
    const url = `${window.location.origin}/solo/${quiz.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Đã sao chép link quiz!')
    } catch {
      toast.error('Không thể sao chép link')
    }
  }, [quiz])

  if (!quiz) return null

  const difficultyLabel = quiz.difficulty ? DIFFICULTY_LABELS[quiz.difficulty] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg gap-0 p-0'>
        {/* Thumbnail / Gradient Header */}
        <div className='relative h-36 overflow-hidden rounded-t-lg bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400'>
          <div className='absolute inset-0 bg-black/10' />
          <div className='absolute right-5 bottom-4 left-5'>
            <DialogHeader className='text-left'>
              <DialogTitle className='text-2xl font-bold text-white drop-shadow-md'>
                {quiz.title}
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        <div className='flex flex-col gap-5 p-5'>
          {/* Description */}
          {quiz.description && (
            <DialogDescription className='text-sm text-muted-foreground'>
              {quiz.description}
            </DialogDescription>
          )}

          {/* Metadata Grid */}
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            <MetaStat
              icon={<HelpCircle className='size-4' />}
              label='Câu hỏi'
              value={String(quiz.questions?.length || 0)}
            />
            <MetaStat
              icon={<Trophy className='size-4' />}
              label='Lượt chơi'
              value={String(quiz.playCount || 0)}
            />
            <MetaStat
              icon={<CalendarDays className='size-4' />}
              label='Ngày tạo'
              value={new Date(quiz.createdAt).toLocaleDateString('vi-VN')}
            />
            {difficultyLabel && (
              <MetaStat
                icon={<Trophy className='size-4' />}
                label='Độ khó'
                value={difficultyLabel}
              />
            )}
          </div>

          {/* Badges */}
          <div className='flex flex-wrap gap-2'>
            {quiz.category && <Badge variant='outline'>{quiz.category}</Badge>}
            {difficultyLabel && (
              <Badge
                variant={
                  quiz.difficulty === 'easy'
                    ? 'success'
                    : quiz.difficulty === 'hard'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {difficultyLabel}
              </Badge>
            )}
            <Badge variant={quiz.isPublished ? 'success' : 'secondary'}>
              {quiz.isPublished ? 'Công khai' : 'Bản nháp'}
            </Badge>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Button onClick={handlePractice} className='flex-1 gap-2' variant='default'>
              <BookOpen className='size-4' /> Tự luyện
            </Button>
            {onHostLive && (
              <Button onClick={handleHostLive} className='flex-1 gap-2' variant='gradient-orange'>
                <Play className='size-4' /> Host Live
              </Button>
            )}
          </div>

          {/* Share */}
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='gap-2 text-muted-foreground'
              onClick={handleShare}
            >
              <Share2 className='size-4' /> Chia sẻ
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='gap-2 text-muted-foreground'
              onClick={handleShare}
            >
              <Copy className='size-4' /> Sao chép link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Sub-component ───────────────────────────────

function MetaStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className='flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2'>
      <span className='text-muted-foreground'>{icon}</span>
      <div className='flex flex-col'>
        <span className='text-xs text-muted-foreground'>{label}</span>
        <span className='text-sm font-semibold text-foreground'>{value}</span>
      </div>
    </div>
  )
}
