import { Button } from '@/components/ui/button'
import { useHostGameControl } from '@/hooks/useHostGameControl'
import { cn } from '@/lib/utils'
import { Trophy, Users, Settings2, Wand2, Volume2, Maximize, Copy, MoreHorizontal } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router'

export default function LiveHost() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  // Toàn bộ logic game nằm trong custom hook
  const {
    quiz,
    session,
    participants,
    currentAnswers,
    loading,
    error,
    timeLeft,
    currentQuestion,
    sortedParticipants,
    isLobby,
    isPlaying,
    isLeaderboard,
    isFinished,
    handleStart,
    handleNextQuestion,
    handleSkipTimer,
  } = useHostGameControl(sessionId)

  const gameOptionColors = [
    'bg-game-option-1',
    'bg-game-option-2',
    'bg-game-option-3',
    'bg-game-option-4',
  ]

  if (loading || !session)
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#0f0c29] p-8 text-center text-xl text-white'>
        Đang tải phòng...
      </div>
    )
  if (error)
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#0f0c29] p-8 text-destructive'>
        {error}
      </div>
    )

  return (
    <div className='relative flex min-h-screen flex-col text-white font-sans overflow-hidden'
         style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      {/* Background Elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      {/* Header Section */}
      <header className="flex justify-between items-center p-4 lg:p-6 z-10 w-full">
        {/* Logo Area */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h4v18H3V3zm7 7h4v11h-4V10zm7-5h4v16h-4V5z"></path>
            </svg>
            <span className="text-2xl font-black tracking-tighter uppercase italic">{quiz?.title || 'Wayground'}</span>
          </div>
          <span className="text-xs text-gray-400 ml-8 -mt-1 font-medium">formerly Quizizz</span>
        </div>
        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <button className="glass-button px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
            <Settings2 className="w-4 h-4" /> Chủ đề
          </button>
          <button aria-label="Magic Wand" className="glass-button p-2 rounded-lg">
            <Wand2 className="w-5 h-5" />
          </button>
          <button aria-label="Sound Toggle" className="glass-button p-2 rounded-lg">
            <Volume2 className="w-5 h-5" />
          </button>
          <button aria-label="Fullscreen" className="glass-button p-2 rounded-lg">
            <Maximize className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors ml-2 shadow-lg shadow-red-900/50">
            Kết thúc
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center p-4 z-10 w-full max-w-5xl mx-auto">
        {isLobby && (
          <>
            <div className="flex flex-col md:flex-row gap-6 w-full mb-6">
              {/* Join Details Panel */}
              <section className="glass-panel rounded-3xl p-8 flex-1 flex flex-col justify-center">
                {/* Step 1: URL */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20 shadow-inner">1</div>
                    <div>
                      <p className="text-gray-300 text-sm mb-1 uppercase tracking-wider font-semibold">Tham gia bằng mọi thiết bị</p>
                      <h2 className="text-3xl md:text-4xl font-bold">myquizz.com</h2>
                    </div>
                  </div>
                  <button aria-label="Copy Link" className="glass-button p-3 rounded-xl text-gray-300 hover:text-white"
                          onClick={() => navigator.clipboard.writeText(`http://myquizz.com/join?code=${session.roomCode}`)}>
                    <Copy className="w-6 h-6" />
                  </button>
                </div>
                <hr className="border-white/10 mb-8" />
                {/* Step 2: Code */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20 shadow-inner">2</div>
                    <div>
                      <p className="text-gray-300 text-sm mb-1 uppercase tracking-wider font-semibold">Nhập mã tham gia</p>
                      <h1 className="text-6xl md:text-7xl font-bold font-code tracking-widest drop-shadow-md">{session.roomCode}</h1>
                    </div>
                  </div>
                  <button aria-label="Copy Code" className="glass-button p-3 rounded-xl text-gray-300 hover:text-white"
                          onClick={() => navigator.clipboard.writeText(session.roomCode)}>
                    <Copy className="w-6 h-6" />
                  </button>
                </div>
              </section>
              {/* Share Panel */}
              <section className="glass-panel rounded-3xl p-8 w-full md:w-64 flex flex-col items-center justify-center shrink-0">
                <div className="w-32 h-32 bg-white p-2 rounded-xl mb-6 shadow-lg">
                  <img alt="Mã QR tham gia" className="w-full h-full object-cover" src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://myquizz.com/join?code=${session.roomCode}`} />
                </div>
                <p className="text-gray-300 text-sm mb-4 font-medium uppercase tracking-wider">Chia sẻ qua</p>
                <div className="flex items-center gap-3">
                  <button aria-label="Copy Link" className="glass-button p-2.5 rounded-full hover:bg-white/20 transition-colors">
                    <Copy className="w-5 h-5 text-blue-300" />
                  </button>
                  <button aria-label="Google Classroom" className="glass-button p-2.5 rounded-full hover:bg-white/20 transition-colors">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"></path></svg>
                  </button>
                  <button aria-label="More Options" className="glass-button p-2.5 rounded-full hover:bg-white/20 transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </section>
            </div>

            {/* User list */}
            <div className='mb-8 w-full rounded-2xl glass-panel p-6'>
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='flex items-center gap-2 text-2xl font-bold'>
                  <Users className='size-6 text-pink-400' />
                  Người chơi ({participants.length})
                </h3>
              </div>
              <div className='mt-6 flex flex-wrap gap-4'>
                {participants.map((p) => (
                  <div key={p.id} className='animate-bounce-in rounded-full glass-button px-4 py-2 font-bold text-white'>
                    {p.name}
                  </div>
                ))}
                {participants.length === 0 && (
                  <div className='text-gray-400 italic'>Chưa có ai tham gia...</div>
                )}
              </div>
            </div>

            {/* Bottom Action Bar */}
            <section className="w-full flex flex-col md:flex-row justify-center items-center gap-4 relative">
              <div className="glass-panel rounded-xl flex items-center p-2 absolute left-0 md:relative">
                <span className="px-4 text-sm font-medium">Tự động bắt đầu bài ...</span>
                <button aria-label="Enable Auto Start" className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors ml-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                </button>
              </div>
              <button 
                onClick={handleStart}
                disabled={participants.length === 0}
                className={cn(
                  "bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-black text-xl py-4 px-16 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.5)] transform transition-transform border border-pink-400/50 uppercase tracking-widest w-full md:w-auto",
                  participants.length > 0 ? "hover:scale-105 active:scale-95 cursor-pointer" : "opacity-50 cursor-not-allowed"
                )}>
                BẮT ĐẦU
              </button>
              <div className="glass-panel rounded-xl flex items-center gap-3 px-6 py-4 absolute right-0 md:relative">
                <Users className="w-6 h-6 text-gray-300" />
                <span className="text-2xl font-bold">{participants.length}</span>
              </div>
            </section>
          </>
        )}

        {isPlaying && currentQuestion && (
          <div className='flex w-full max-w-5xl flex-col items-center z-10'>
            <div className='mb-8 flex w-full items-center justify-between'>
              <div className='flex size-24 flex-col items-center justify-center rounded-full border-4 border-pink-500 glass-panel shadow-lg'>
                <span className='text-4xl font-black text-white'>{timeLeft}</span>
              </div>
              <div className='flex size-24 flex-col items-center justify-center rounded-full border-4 border-blue-500 glass-panel'>
                <span className='text-xl text-gray-300'>Trả lời</span>
                <span className='text-3xl font-black text-white'>{currentAnswers.length}</span>
              </div>
            </div>

            <div className='mb-8 w-full glass-panel rounded-2xl text-white shadow-2xl'>
              <div className='p-12 text-center'>
                <h2 className='text-4xl font-bold'>{currentQuestion.content}</h2>
              </div>
            </div>

            <div className='grid w-full grid-cols-2 gap-4'>
              {currentQuestion.options.map((opt, i) => {
                const bgColor = gameOptionColors[i % gameOptionColors.length]
                return (
                  <div
                    key={opt.id}
                    className={cn(
                      'flex min-h-[120px] items-center rounded-xl p-6 text-2xl font-bold text-white shadow-lg cursor-default',
                      bgColor,
                    )}
                  >
                    {opt.content}
                  </div>
                )
              })}
            </div>

            <div className='mt-8'>
              <Button onClick={handleSkipTimer} className="glass-button text-white hover:text-white">
                Bỏ qua thời gian
              </Button>
            </div>
          </div>
        )}

        {isLeaderboard && (
          <div className='flex w-full max-w-3xl flex-col items-center z-10'>
            <h2 className='mb-8 flex items-center gap-4 text-4xl font-bold text-yellow-400 drop-shadow-md'>
              <Trophy className='size-10' /> Bảng xếp hạng
            </h2>

            <div className='mb-8 flex w-full flex-col gap-4'>
              {sortedParticipants.slice(0, 5).map((p, index) => (
                <div
                  key={p.id}
                  className='flex items-center justify-between rounded-xl glass-panel p-4 shadow-md'
                >
                  <div className='flex items-center gap-4'>
                    <span className='w-8 text-center text-2xl font-black text-gray-400'>
                      #{index + 1}
                    </span>
                    <span className='text-xl font-bold text-white'>{p.name}</span>
                  </div>
                  <div className='text-2xl font-black text-pink-400'>{p.score}</div>
                </div>
              ))}
            </div>

            <Button onClick={handleNextQuestion} className='h-auto px-10 py-6 text-xl font-bold glass-button bg-pink-500/20 hover:bg-pink-500/40 text-white hover:text-white border-pink-500/50'>
              {session.currentQuestionIndex >= (quiz?.questions.length || 0) - 1
                ? 'Kết thúc Game'
                : 'Câu hỏi tiếp theo'}
            </Button>
          </div>
        )}

        {isFinished && (
          <div className='flex w-full max-w-4xl flex-col items-center z-10'>
            <h2 className='mb-12 text-center text-5xl font-black text-yellow-400 drop-shadow-lg'>
              BỤC VINH QUANG
            </h2>

            <div className='mb-12 flex h-64 w-full items-end justify-center gap-4'>
              {/* Rank 2 */}
              {sortedParticipants[1] && (
                <div className='flex w-1/3 flex-col items-center'>
                  <div className='mb-2 text-2xl font-bold'>{sortedParticipants[1].name}</div>
                  <div className='mb-2 font-bold text-yellow-400'>{sortedParticipants[1].score}</div>
                  <div className='flex h-32 w-full justify-center rounded-t-lg bg-gray-400/50 backdrop-blur-md pt-4 text-3xl font-black text-white'>
                    2
                  </div>
                </div>
              )}
              {/* Rank 1 */}
              {sortedParticipants[0] && (
                <div className='flex w-1/3 flex-col items-center'>
                  <div className='mb-2 text-3xl font-black text-yellow-400'>
                    {sortedParticipants[0].name}
                  </div>
                  <div className='mb-2 font-bold text-yellow-400'>{sortedParticipants[0].score}</div>
                  <div className='flex h-48 w-full justify-center rounded-t-lg bg-yellow-500/80 backdrop-blur-md pt-4 text-4xl font-black text-white'>
                    1
                  </div>
                </div>
              )}
              {/* Rank 3 */}
              {sortedParticipants[2] && (
                <div className='flex w-1/3 flex-col items-center'>
                  <div className='mb-2 text-xl font-bold'>{sortedParticipants[2].name}</div>
                  <div className='mb-2 font-bold text-yellow-400'>{sortedParticipants[2].score}</div>
                  <div className='flex h-24 w-full justify-center rounded-t-lg bg-amber-700/80 backdrop-blur-md pt-4 text-2xl font-black text-white'>
                    3
                  </div>
                </div>
              )}
            </div>

            <Link to='/dashboard' className="glass-button px-8 py-4 rounded-xl font-bold hover:text-white">
              Quay về Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
