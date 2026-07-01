import { type GameThemeId, GAME_THEMES } from '@/config/gameThemes'
import { cn } from '@/lib/utils'

interface ThemeSelectorProps {
  value: GameThemeId
  onChange: (themeId: GameThemeId) => void
}

const THEME_PREVIEW_BG: Record<GameThemeId, string> = {
  classic: 'bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500',
  dark: 'bg-zinc-900',
  focus: 'bg-gradient-to-br from-slate-800 to-indigo-900',
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className='grid grid-cols-3 gap-3'>
      {GAME_THEMES.map((theme) => {
        const isActive = value === theme.id
        const Icon = theme.icon

        return (
          <button
            key={theme.id}
            type='button'
            onClick={() => onChange(theme.id)}
            className={cn(
              'group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200',
              isActive
                ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
            )}
          >
            {/* Preview */}
            <div
              className={cn(
                'flex h-16 w-full items-center justify-center rounded-lg',
                THEME_PREVIEW_BG[theme.id],
              )}
            >
              <Icon className='size-6 text-white drop-shadow-md' />
            </div>

            {/* Label */}
            <span
              className={cn(
                'text-sm font-semibold',
                isActive ? 'text-purple-300' : 'text-gray-300',
              )}
            >
              {theme.label}
            </span>

            {/* Description */}
            <span className='text-center text-xs leading-tight text-gray-400'>
              {theme.description}
            </span>

            {/* Active indicator */}
            {isActive && (
              <div className='absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white shadow-md'>
                ✓
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
