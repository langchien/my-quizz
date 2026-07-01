import { ThemeSelector } from '@/components/ThemeSelector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { type GameThemeId, getStoredGameTheme, setStoredGameTheme } from '@/config/gameThemes'
import type { Quiz } from '@/types/quiz'
import { generateNickname } from '@/utils/nicknameGenerator'
import {
  ArrowLeft,
  BookOpen,
  Copy,
  HelpCircle,
  Play,
  RefreshCw,
  Settings2,
  Shuffle,
  Timer,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { toast } from 'sonner'

/** Settings truyền sang SoloPlay qua navigation state */
export interface SoloGameSettings {
  playerName: string
  timerEnabled: boolean
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  gameTheme: GameThemeId
}

export default function SoloSetup() {
  const quiz = useLoaderData() as Quiz
  const navigate = useNavigate()

  const [playerName, setPlayerName] = useState('')
  const [timerEnabled, setTimerEnabled] = useState(true)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [shuffleAnswers, setShuffleAnswers] = useState(false)
  const [gameTheme, setGameTheme] = useState<GameThemeId>(getStoredGameTheme)

  const handleRandomName = useCallback(() => {
    setPlayerName(generateNickname())
  }, [])

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/solo/${quiz.id}/setup`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Đã sao chép link quiz!')
    } catch {
      toast.error('Không thể sao chép link')
    }
  }, [quiz.id])

  const handleStart = useCallback(() => {
    // Persist theme choice
    setStoredGameTheme(gameTheme)

    const settings: SoloGameSettings = {
      playerName: playerName.trim() || 'Người chơi',
      timerEnabled,
      shuffleQuestions,
      shuffleAnswers,
      gameTheme,
    }

    navigate(`/solo/${quiz.id}`, { state: { gameSettings: settings } })
  }, [navigate, quiz.id, playerName, timerEnabled, shuffleQuestions, shuffleAnswers, gameTheme])

  if (!quiz) return null

  const totalTime = quiz.questions.reduce((sum, q) => sum + q.timeLimit, 0)

  return (
    <div className='bg-animated-gradient relative flex min-h-screen flex-col overflow-hidden font-sans text-white'>
      {/* Background Decoration Elements */}
      <div className='pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-purple-600 opacity-30 mix-blend-multiply blur-[100px] filter'></div>
      <div
        className='pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-pink-600 opacity-30 mix-blend-multiply blur-[100px] filter'
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Header */}
      <header className='relative z-10 flex items-center justify-between p-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate(-1)}
          className='glass-panel text-gray-300 hover:bg-transparent hover:text-white'
        >
          <ArrowLeft className='size-5' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleShare}
          className='glass-panel gap-2 text-gray-300 hover:bg-transparent hover:text-white'
        >
          <Copy className='size-4' /> Chia sẻ
        </Button>
      </header>

      {/* Main Content */}
      <main className='relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 p-6'>
        {/* Quiz Info Card */}
        <div className='glass-panel w-full rounded-3xl p-8 text-center shadow-2xl'>
          <div className='mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-lg backdrop-blur-md'>
            <BookOpen className='size-10 text-pink-300' />
          </div>

          <h1 className='mb-2 text-3xl font-black tracking-tight text-white drop-shadow-md'>
            {quiz.title}
          </h1>
          {quiz.description && <p className='mb-4 text-gray-300'>{quiz.description}</p>}

          <div className='mx-auto flex max-w-xs justify-center gap-8'>
            <div className='text-center'>
              <div className='flex items-center justify-center gap-1.5 text-2xl font-black text-purple-300'>
                <HelpCircle className='size-5' />
                {quiz.questions.length}
              </div>
              <div className='mt-1 text-xs tracking-wider text-gray-400 uppercase'>Câu hỏi</div>
            </div>
            <div className='w-px bg-white/20' />
            <div className='text-center'>
              <div className='flex items-center justify-center gap-1.5 text-2xl font-black text-orange-300'>
                <Timer className='size-5' />
                {totalTime}s
              </div>
              <div className='mt-1 text-xs tracking-wider text-gray-400 uppercase'>
                Tổng thời gian
              </div>
            </div>
          </div>
        </div>

        {/* Player Name */}
        <div className='glass-panel w-full rounded-2xl p-6'>
          <Label className='mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-300 uppercase'>
            <Settings2 className='size-4' /> Tên người chơi
          </Label>
          <div className='flex gap-2'>
            <Input
              placeholder='Nhập tên hoặc nhấn nút random'
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className='h-12 border-white/10 bg-white/5 text-lg text-white placeholder:text-gray-500 focus:border-purple-400'
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={handleRandomName}
              className='glass-panel h-12 w-12 shrink-0 text-purple-300 hover:bg-white/10 hover:text-purple-200'
              title='Sinh nickname ngẫu nhiên'
            >
              <RefreshCw className='size-5' />
            </Button>
          </div>
        </div>

        {/* Game Settings */}
        <div className='glass-panel w-full rounded-2xl p-6'>
          <Label className='mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-300 uppercase'>
            <Shuffle className='size-4' /> Cài đặt trò chơi
          </Label>
          <div className='flex flex-col gap-4'>
            {/* Timer toggle */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Timer className='size-5 text-blue-400' />
                <div>
                  <div className='text-sm font-medium text-white'>Đếm ngược thời gian</div>
                  <div className='text-xs text-gray-400'>
                    {timerEnabled ? 'Có giới hạn thời gian mỗi câu' : 'Không giới hạn thời gian'}
                  </div>
                </div>
              </div>
              <Switch checked={timerEnabled} onCheckedChange={setTimerEnabled} />
            </div>

            <div className='h-px bg-white/10' />

            {/* Shuffle questions */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Shuffle className='size-5 text-green-400' />
                <div>
                  <div className='text-sm font-medium text-white'>Xáo trộn câu hỏi</div>
                  <div className='text-xs text-gray-400'>
                    Thứ tự câu hỏi sẽ được trộn ngẫu nhiên
                  </div>
                </div>
              </div>
              <Switch checked={shuffleQuestions} onCheckedChange={setShuffleQuestions} />
            </div>

            <div className='h-px bg-white/10' />

            {/* Shuffle answers */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Shuffle className='size-5 text-yellow-400' />
                <div>
                  <div className='text-sm font-medium text-white'>Xáo trộn đáp án</div>
                  <div className='text-xs text-gray-400'>
                    Thứ tự đáp án mỗi câu sẽ được trộn ngẫu nhiên
                  </div>
                </div>
              </div>
              <Switch checked={shuffleAnswers} onCheckedChange={setShuffleAnswers} />
            </div>
          </div>
        </div>

        {/* Game Theme */}
        <div className='glass-panel w-full rounded-2xl p-6'>
          <Label className='mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-300 uppercase'>
            🎨 Giao diện trò chơi
          </Label>
          <ThemeSelector value={gameTheme} onChange={setGameTheme} />
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          className='h-16 w-full rounded-2xl border border-pink-400/50 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-xl font-black tracking-wider text-white uppercase shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all hover:scale-[1.02] hover:from-pink-400 hover:to-fuchsia-500 active:scale-95'
        >
          <Play className='mr-2 size-6' /> Bắt đầu
        </Button>
      </main>
    </div>
  )
}
