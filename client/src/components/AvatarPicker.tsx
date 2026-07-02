import { AVATAR_PRESETS, type AvatarPreset } from '@/config/avatarPresets'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface AvatarPickerProps {
  value: string
  onChange: (emoji: string) => void
  /** Số cột grid (mặc định 6) */
  columns?: number
  className?: string
}

/**
 * Grid chọn avatar emoji preset.
 * Dùng trong Onboarding (bước 4) và Settings.
 */
export function AvatarPicker({ value, onChange, columns = 6, className }: AvatarPickerProps) {
  return (
    <div
      className={cn('grid gap-2', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {AVATAR_PRESETS.map((preset: AvatarPreset) => {
        const isSelected = value === preset.emoji
        return (
          <motion.button
            key={preset.id}
            type='button'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(preset.emoji)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl p-2 transition-all',
              'hover:bg-white/20',
              isSelected ? 'bg-white/25 shadow-lg ring-2 ring-white' : 'bg-white/5',
            )}
            title={preset.label}
          >
            <span
              className={cn('text-2xl transition-transform sm:text-3xl', isSelected && 'scale-110')}
            >
              {preset.emoji}
            </span>
            <span
              className={cn(
                'text-[10px] leading-tight opacity-70 sm:text-xs',
                isSelected && 'font-medium opacity-100',
              )}
            >
              {preset.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
