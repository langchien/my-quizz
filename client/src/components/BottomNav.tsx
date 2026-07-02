import { cn } from '@/lib/utils'
import { BookOpen, Compass, Settings2, SquareActivity } from 'lucide-react'
import { Link, useLocation, useSearchParams } from 'react-router'

/**
 * Mobile-only Bottom Navigation Bar component.
 * Appears only on viewports smaller than 'sm' (sm:hidden).
 * Persists statically across pages with viewTransitionName: 'bottom-nav'.
 */
export function BottomNav() {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const currentTab = searchParams.get('tab') || 'quizzes'
  const isSettings = location.pathname === '/settings'
  const isDashboard = location.pathname === '/dashboard'

  const navItems = [
    {
      label: 'Bộ câu hỏi',
      icon: BookOpen,
      to: '/dashboard?tab=quizzes',
      active: isDashboard && currentTab === 'quizzes',
    },
    {
      label: 'Hoạt động',
      icon: SquareActivity,
      to: '/dashboard?tab=history',
      active: isDashboard && currentTab === 'history',
    },
    {
      label: 'Khám phá',
      icon: Compass,
      to: '/dashboard?tab=explore',
      active: isDashboard && currentTab === 'explore',
    },
    {
      label: 'Cài đặt',
      icon: Settings2,
      to: '/settings',
      active: isSettings,
    },
  ]

  return (
    <nav
      className='fixed right-0 bottom-0 left-0 z-40 border-t border-border bg-background/80 pt-2 pb-[calc(var(--safe-area-bottom)+4px)] backdrop-blur-lg transition-colors duration-300 sm:hidden'
      style={{ viewTransitionName: 'bottom-nav' }}
    >
      <div className='flex items-center justify-around px-2'>
        {navItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={index}
              to={item.to}
              viewTransition
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 text-muted-foreground transition-all duration-200 active:scale-95',
                item.active && 'scale-105 font-medium text-primary',
              )}
            >
              <Icon
                className={cn('size-5 transition-transform', item.active && 'stroke-[2.5px]')}
              />
              <span className='text-[10px] tracking-wide'>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
