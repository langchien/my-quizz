import { LiveSessionCard, SoloResultCard } from '@/components/HistoryTab'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useHistory } from '@/hooks/useHistory'
import { soloService } from '@/services/soloService'
import type { Quiz } from '@/types/quiz'
import type { SoloProgress } from '@/types/room'
import { BookOpen, CheckCircle2, Clock, Gamepad2, LayoutList, Play, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

interface ActivityTabsProps {
  quizzes: Quiz[]
}

/**
 * Component hiển thị 3 sub-tabs hoạt động:
 * - Đang chơi (Running): Solo đang dở dang
 * - Đã hoàn thành (Completed): Lịch sử đã xong
 * - Đã tạo (Created): Quiz do user tạo
 */
export function ActivityTabs({ quizzes }: ActivityTabsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'running' | 'completed' | 'created'>('running')

  return (
    <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as typeof activeSubTab)}>
      <TabsList variant='line' className='border-b border-border'>
        <TabsTrigger value='running' className='gap-2'>
          <Play className='size-4' /> Đang chơi
        </TabsTrigger>
        <TabsTrigger value='completed' className='gap-2'>
          <CheckCircle2 className='size-4' /> Đã hoàn thành
        </TabsTrigger>
        <TabsTrigger value='created' className='gap-2'>
          <LayoutList className='size-4' /> Đã tạo
        </TabsTrigger>
      </TabsList>

      <TabsContent value='running' className='mt-6'>
        <RunningTab quizzes={quizzes} />
      </TabsContent>
      <TabsContent value='completed' className='mt-6'>
        <CompletedTab />
      </TabsContent>
      <TabsContent value='created' className='mt-6'>
        <CreatedTab quizzes={quizzes} />
      </TabsContent>
    </Tabs>
  )
}

// ─── Sub-tab: Đang chơi ──────────────────────────

function RunningTab({ quizzes }: { quizzes: Quiz[] }) {
  const [soloInProgress, setSoloInProgress] = useState<
    { quizId: string; quizTitle: string; progress: SoloProgress }[]
  >([])

  useEffect(() => {
    // Scan localStorage for in-progress solo sessions
    const running: typeof soloInProgress = []
    for (const quiz of quizzes) {
      const progress = soloService.resumeSolo(quiz.id)
      if (progress && !progress.isPaused) {
        // Still active — questions remaining
        if (progress.currentQuestionIndex < quiz.questions.length) {
          running.push({ quizId: quiz.id, quizTitle: quiz.title, progress })
        }
      }
    }
    setSoloInProgress(running)
  }, [quizzes])

  if (soloInProgress.length === 0) {
    return (
      <EmptyState
        icon={<Gamepad2 className='size-8' />}
        title='Không có game nào đang chơi'
        description='Bắt đầu chơi Solo hoặc tham gia game Live để thấy tiến trình tại đây.'
        ctaLabel='Tham gia game'
        ctaTo='/join'
      />
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      {soloInProgress.map((item) => (
        <Link
          key={item.quizId}
          to={`/solo/${item.quizId}`}
          className='flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-shadow hover:shadow-md'
        >
          <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'>
            <Play className='size-5' />
          </div>
          <div className='min-w-0 flex-1'>
            <h4 className='truncate font-semibold text-foreground'>{item.quizTitle}</h4>
            <p className='mt-0.5 text-sm text-muted-foreground'>
              Câu {item.progress.currentQuestionIndex + 1} • Điểm: {item.progress.score}
            </p>
          </div>
          <Badge variant='outline' className='shrink-0'>
            Tiếp tục
          </Badge>
        </Link>
      ))}
    </div>
  )
}

// ─── Sub-tab: Đã hoàn thành ──────────────────────

function CompletedTab() {
  const {
    liveSessions,
    soloResults,
    loading,
    error,
    expandedSessionId,
    sessionParticipants,
    loadingParticipants,
    toggleSession,
  } = useHistory()

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Spinner className='size-10 text-primary' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-12 text-center'>
        <p className='text-destructive'>{error}</p>
      </div>
    )
  }

  const hasNoHistory = liveSessions.length === 0 && soloResults.length === 0

  if (hasNoHistory) {
    return (
      <EmptyState
        icon={<CheckCircle2 className='size-8' />}
        title='Chưa có lịch sử nào'
        description='Hãy tổ chức một phiên Live hoặc tự luyện để xem lịch sử tại đây.'
        ctaLabel='Tham gia game'
        ctaTo='/join'
      />
    )
  }

  return (
    <div className='flex flex-col gap-10'>
      {/* Live Sessions */}
      {liveSessions.length > 0 && (
        <section>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400'>
              <BookOpen className='size-5' />
            </div>
            <h3 className='text-lg font-semibold text-foreground'>Phiên Live</h3>
            <span className='rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'>
              {liveSessions.length}
            </span>
          </div>
          <div className='flex flex-col gap-3'>
            {liveSessions.map((session) => (
              <LiveSessionCard
                key={session.id}
                session={session}
                isExpanded={expandedSessionId === session.id}
                participants={sessionParticipants[session.id]}
                loadingParticipants={loadingParticipants && expandedSessionId === session.id}
                onToggle={() => toggleSession(session.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Solo Results */}
      {soloResults.length > 0 && (
        <section>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'>
              <BookOpen className='size-5' />
            </div>
            <h3 className='text-lg font-semibold text-foreground'>Tự luyện Solo</h3>
            <span className='rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'>
              {soloResults.length}
            </span>
          </div>
          <div className='flex flex-col gap-3'>
            {soloResults.map((result, i) => (
              <SoloResultCard key={result.id || i} result={result} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ─── Sub-tab: Đã tạo ────────────────────────────

function CreatedTab({ quizzes }: { quizzes: Quiz[] }) {
  if (quizzes.length === 0) {
    return (
      <EmptyState
        icon={<Plus className='size-8' />}
        title='Chưa tạo quiz nào'
        description='Tạo bộ câu hỏi đầu tiên của bạn để bắt đầu trò chơi!'
        ctaLabel='Tạo Quiz mới'
        ctaTo='/dashboard/quiz/new'
      />
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      {quizzes.map((quiz) => (
        <Link
          key={quiz.id}
          to={`/dashboard/quiz/${quiz.id}/edit`}
          className='flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-shadow hover:shadow-md'
        >
          <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'>
            <LayoutList className='size-5' />
          </div>
          <div className='min-w-0 flex-1'>
            <h4 className='truncate font-semibold text-foreground'>{quiz.title}</h4>
            <div className='mt-0.5 flex items-center gap-3 text-sm text-muted-foreground'>
              <span>{quiz.questions?.length || 0} câu hỏi</span>
              <span className='flex items-center gap-1'>
                <Clock className='size-3.5' />
                {new Date(quiz.updatedAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
          <Badge variant={quiz.isPublished ? 'success' : 'secondary'}>
            {quiz.isPublished ? 'Công khai' : 'Nháp'}
          </Badge>
        </Link>
      ))}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────

function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaTo,
}: {
  icon: React.ReactNode
  title: string
  description: string
  ctaLabel: string
  ctaTo: string
}) {
  return (
    <div className='rounded-2xl border border-dashed border-border bg-card py-16 text-center shadow-sm'>
      <div className='mb-4 inline-flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        {icon}
      </div>
      <h3 className='mb-2 text-xl font-medium text-foreground'>{title}</h3>
      <p className='mb-6 text-muted-foreground'>{description}</p>
      <Link to={ctaTo}>
        <Button>{ctaLabel}</Button>
      </Link>
    </div>
  )
}
