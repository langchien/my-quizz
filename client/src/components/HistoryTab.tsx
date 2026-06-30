import { useHistory } from '@/hooks/useHistory'
import type { GameSession, Participant, SoloResult } from '@/types/room'
import { BookOpen, ChevronDown, ChevronRight, Clock, Loader2, Trophy, Users } from 'lucide-react'

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
        <Loader2 className='h-10 w-10 animate-spin text-rose-500' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900/50 dark:bg-red-950/30'>
        <p className='text-red-600 dark:text-red-400'>{error}</p>
      </div>
    )
  }

  const hasNoHistory = liveSessions.length === 0 && soloResults.length === 0

  if (hasNoHistory) {
    return (
      <div className='rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900'>
        <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800'>
          <Clock size={32} />
        </div>
        <h3 className='mb-2 text-xl font-medium text-gray-800 dark:text-slate-200'>
          Chưa có lịch sử nào
        </h3>
        <p className='text-gray-500 dark:text-gray-400'>
          Hãy tổ chức một phiên Live hoặc tự luyện để xem lịch sử tại đây.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-10'>
      {/* ─── Section: Phiên Live ─── */}
      {liveSessions.length > 0 && (
        <section>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400'>
              <Users size={18} />
            </div>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-slate-100'>
              Phiên Live đã tổ chức
            </h3>
            <span className='rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-400'>
              {liveSessions.length}
            </span>
          </div>

          <div className='space-y-3'>
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
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'>
              <BookOpen size={18} />
            </div>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-slate-100'>
              Lịch sử tự luyện
            </h3>
            <span className='rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-400'>
              {soloResults.length}
            </span>
          </div>

          <div className='space-y-3'>
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
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
      {/* Header — clickable */}
      <button
        onClick={onToggle}
        className='flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50'
      >
        <div className='flex-1'>
          <div className='flex items-center gap-3'>
            <h4 className='font-semibold text-gray-900 dark:text-white'>
              {session.quizTitle || 'Bài quiz'}
            </h4>
            <span className='rounded-md bg-orange-50 px-2 py-0.5 font-mono text-xs font-bold text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'>
              {session.roomCode}
            </span>
          </div>
          <div className='mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400'>
            <span className='flex items-center gap-1'>
              <Clock size={14} /> {dateStr}
            </span>
          </div>
        </div>

        <div className='ml-4 text-gray-400 transition-transform dark:text-slate-500'>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className='border-t border-gray-100 bg-gray-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/30'>
          {loadingParticipants ? (
            <div className='flex items-center justify-center py-6'>
              <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
            </div>
          ) : participants && participants.length > 0 ? (
            <div className='overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-gray-200 bg-gray-100/80 dark:border-slate-700 dark:bg-slate-800'>
                    <th className='px-4 py-2.5 text-left font-medium text-gray-600 dark:text-slate-300'>
                      #
                    </th>
                    <th className='px-4 py-2.5 text-left font-medium text-gray-600 dark:text-slate-300'>
                      Tên
                    </th>
                    <th className='px-4 py-2.5 text-right font-medium text-gray-600 dark:text-slate-300'>
                      Điểm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, idx) => (
                    <tr
                      key={p.id}
                      className='border-b border-gray-100 last:border-b-0 dark:border-slate-700/50'
                    >
                      <td className='px-4 py-2.5'>
                        {idx < 3 ? (
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
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
                          <span className='text-gray-400 dark:text-slate-500'>{idx + 1}</span>
                        )}
                      </td>
                      <td className='px-4 py-2.5 font-medium text-gray-900 dark:text-white'>
                        {p.name}
                      </td>
                      <td className='px-4 py-2.5 text-right font-bold text-gray-900 dark:text-white'>
                        {p.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='py-4 text-center text-sm text-gray-400 italic dark:text-slate-500'>
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
    <div className='flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
      {/* Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          accuracy >= 80
            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
            : accuracy >= 50
              ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400'
              : 'bg-red-100 text-red-500 dark:bg-red-950/50 dark:text-red-400'
        }`}
      >
        <Trophy size={20} />
      </div>

      {/* Info */}
      <div className='min-w-0 flex-1'>
        <h4 className='truncate font-semibold text-gray-900 dark:text-white'>{result.quizTitle}</h4>
        <div className='mt-0.5 flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400'>
          <span className='flex items-center gap-1'>
            <Clock size={14} /> {dateStr}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className='flex shrink-0 items-center gap-4 text-center'>
        <div>
          <div className='text-lg font-black text-gray-900 dark:text-white'>{result.score}</div>
          <div className='text-xs text-gray-500 dark:text-slate-400'>Điểm</div>
        </div>
        <div className='h-8 w-px bg-gray-200 dark:bg-slate-700' />
        <div>
          <div className='text-lg font-black text-gray-900 dark:text-white'>
            {result.correctCount}/{result.totalQuestions}
          </div>
          <div className='text-xs text-gray-500 dark:text-slate-400'>Đúng</div>
        </div>
        <div className='h-8 w-px bg-gray-200 dark:bg-slate-700' />
        <div>
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
          <div className='text-xs text-gray-500 dark:text-slate-400'>Chính xác</div>
        </div>
      </div>
    </div>
  )
}
