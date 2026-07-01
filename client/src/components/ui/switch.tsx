import { cn } from '@/lib/utils'
import * as React from 'react'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className='relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'>
        <input
          type='checkbox'
          className='sr-only'
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <div
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-400',
          )}
        />
        <div
          className={cn(
            'absolute inset-0 -z-10 rounded-full transition-colors duration-200',
            checked ? 'bg-purple-600' : 'border border-white/15 bg-white/10',
          )}
        />
      </label>
    )
  },
)
Switch.displayName = 'Switch'

export { Switch }
