import type { LucideIcon } from 'lucide-react'
import { Eclipse, Focus, Palette } from 'lucide-react'

export type GameThemeId = 'classic' | 'dark' | 'focus'

export interface GameTheme {
  id: GameThemeId
  label: string
  description: string
  bgClass: string
  /** Hiện decoration orbs? */
  showOrbs: boolean
  icon: LucideIcon
}

export const GAME_THEMES: GameTheme[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Gradient tím huyền ảo — mặc định',
    bgClass: 'bg-animated-gradient',
    showOrbs: true,
    icon: Palette,
  },
  {
    id: 'dark',
    label: 'Dark Mode',
    description: 'Nền tối hoàn toàn, tập trung hơn',
    bgClass: 'bg-game-dark',
    showOrbs: false,
    icon: Eclipse,
  },
  {
    id: 'focus',
    label: 'Focus',
    description: 'Tối giản, ít animation, nền trung tính',
    bgClass: 'bg-game-focus',
    showOrbs: false,
    icon: Focus,
  },
]

const STORAGE_KEY = 'gameTheme'

export function getStoredGameTheme(): GameThemeId {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && GAME_THEMES.some((t) => t.id === stored)) {
    return stored as GameThemeId
  }
  return 'classic'
}

export function setStoredGameTheme(themeId: GameThemeId): void {
  localStorage.setItem(STORAGE_KEY, themeId)
}

export function getGameTheme(id: GameThemeId): GameTheme {
  return GAME_THEMES.find((t) => t.id === id) || GAME_THEMES[0]
}
