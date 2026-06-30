import { Spinner } from '@/components/ui/spinner'
import { useHistory } from '@/hooks/useHistory'
import type { GameSession, Participant, SoloResult } from '@/types/room'
import { BookOpen, ChevronDown, ChevronRight, Clock, Trophy, Users } from 'lucide-react'

/**
 * Component hiển thị lịch sử chơi.
 * Gồm 2 section: Phiên Live (Host) và Tự luyện Solo.
 */
export function HistoryTab() {
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
      <div className='rounded-2xl border border-dashed border-border bg-card py-16 text-center shadow-sm'>
        <div className='mb-4 inline-flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
          <Clock className='size-8' />
        </div>
        <h3 className='mb-2 text-xl font-medium text-foreground'>Chưa có lịch sử nào</h3>
        <p className='text-muted-foreground'>
          Hãy tổ chức một phiên Live hoặc tự luyện để xem lịch sử tại đây.
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-10'>
      {/* ─── Section: Phiên Live ─── */}
      {liveSessions.length > 0 && (
        <section>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400'>
              <Users className='size-5' />
            </div>
            <h3 className='text-lg font-semibold text-foreground'>Phiên Live đã tổ chức</h3>
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

      {/* ─── Section: Tự luyện Solo ─── */}
      {soloResults.length > 0 && (
        <section>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'>
              <BookOpen className='size-5' />
            </div>
            <h3 className='text-lg font-semibold text-foreground'>Lịch sử tự luyện</h3>
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

// ─── Live Session Card (Accordion) ──────────────

function LiveSessionCard({
  session,
  isExpanded,
  participants,
  loadingParticipants,
  onToggle,
}: {
  session: GameSession
  isExpanded: boolean
  participants?: Participant[]
  loadingParticipants: boolean
  onToggle: () => void
}) {
  const dateStr = new Date(session.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className='overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md'>
      {/* Header — clickable */}
      <button
        onClick={onToggle}
        className='flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/50'
      >
        <div className='flex-1'>
          <div className='flex items-center gap-3'>
            <h4 className='font-semibold text-foreground'>{session.quizTitle || 'Bài quiz'}</h4>
            <span className='rounded-md bg-orange-50 px-2 py-0.5 font-mono text-xs font-bold text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'>
              {session.roomCode}
            </span>
          </div>
          <div className='mt-1 flex items-center gap-4 text-sm text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <Clock className='size-3.5' /> {dateStr}
            </span>
          </div>
        </div>

        <div className='ml-4 text-muted-foreground transition-transform'>
          {isExpanded ? <ChevronDown className='size-5' /> : <ChevronRight className='size-5' />}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className='border-t border-border bg-muted/30 px-5 py-4'>
          {loadingParticipants ? (
            <div className='flex items-center justify-center py-6'>
              <Spinner className='size-6 text-muted-foreground' />
            </div>
          ) : participants && participants.length > 0 ? (
            <div className='overflow-hidden rounded-lg border border-border'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-border bg-muted/50'>
                    <th className='px-4 py-2.5 text-left font-medium text-muted-foreground'>#</th>
                    <th className='px-4 py-2.5 text-left font-medium text-muted-foreground'>Tên</th>
                    <th className='px-4 py-2.5 text-right font-medium text-muted-foreground'>
                      Điểm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, idx) => (
                    <tr key={p.id} className='border-b border-border last:border-b-0'>
                      <td className='px-4 py-2.5'>
                        {idx < 3 ? (
                          <span
                            className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                              idx === 0
                                ? 'bg-yellow-500'
                                : idx === 1
                                  ? 'bg-slate-400'
                                  : 'bg-amber-700'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        ) : (
                          <span className='text-muted-foreground'>{idx + 1}</span>
                        )}
                      </td>
                      <td className='px-4 py-2.5 font-medium text-foreground'>{p.name}</td>
                      <td className='px-4 py-2.5 text-right font-bold text-foreground'>
                        {p.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='py-4 text-center text-sm text-muted-foreground italic'>
              Không có người chơi trong phiên này.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Solo Result Card ────────────────────────────

function SoloResultCard({ result }: { result: SoloResult }) {
  const dateStr = new Date(result.completedAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const accuracy = Math.round((result.correctCount / result.totalQuestions) * 100)

  return (
    <div className='flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm'>
      {/* Icon */}
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
          accuracy >= 80
            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
            : accuracy >= 50
              ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400'
              : 'bg-red-100 text-red-500 dark:bg-red-950/50 dark:text-red-400'
        }`}
      >
        <Trophy className='size-5' />
      </div>

      {/* Info */}
      <div className='min-w-0 flex-1'>
        <h4 className='truncate font-semibold text-foreground'>{result.quizTitle}</h4>
        <div className='mt-0.5 flex items-center gap-3 text-sm text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <Clock className='size-3.5' /> {dateStr}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className='flex shrink-0 items-center gap-4 text-center'>
        <div className='flex flex-col'>
          <div className='text-lg font-black text-foreground'>{result.score}</div>
          <div className='text-xs text-muted-foreground'>Điểm</div>
        </div>
        <div className='h-8 w-px bg-border' />
        <div className='flex flex-col'>
          <div className='text-lg font-black text-foreground'>
            {result.correctCount}/{result.totalQuestions}
          </div>
          <div className='text-xs text-muted-foreground'>Đúng</div>
        </div>
        <div className='h-8 w-px bg-border' />
        <div className='flex flex-col'>
          <div
            className={`text-lg font-black ${
              accuracy >= 80
                ? 'text-emerald-600 dark:text-emerald-400'
                : accuracy >= 50
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-500 dark:text-red-400'
            }`}
          >
            {accuracy}%
          </div>
          <div className='text-xs text-muted-foreground'>Chính xác</div>
        </div>
      </div>
    </div>
  )
}
