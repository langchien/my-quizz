import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { UserDropdown } from '@/components/UserDropdown'
import { useAuth } from '@/hooks/useAuth'
import { Moon, Plus, Sun } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'react-router'

export function Header() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return (
    <header className='bg-linear-to-r from-red-600 via-rose-500 to-orange-500 text-white shadow-lg'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
        <Link to='/dashboard' className='text-2xl font-bold tracking-tight'>
          My-Quizz
        </Link>
        <div className='flex items-center gap-3'>
          {/* Nút Tạo Quiz */}
          {user && (
            <Button
              asChild
              variant='ghost'
              className='hidden gap-2 bg-white/20 font-medium text-white backdrop-blur-md transition-all hover:bg-white/30 hover:text-white sm:inline-flex'
            >
              <Link to='/dashboard/quiz/new'>
                <Plus data-icon='inline-start' />
                Tạo Quiz
              </Link>
            </Button>
          )}

          {/* Toggle Dark/Light mode */}
          <Button
            onClick={toggleTheme}
            variant='ghost'
            size='icon'
            className='bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 hover:text-white'
            aria-label='Toggle Dark Mode'
          >
            {theme === 'dark' ? (
              <Sun data-icon='inline-start' />
            ) : (
              <Moon data-icon='inline-start' />
            )}
          </Button>

          {/* Avatar + Dropdown thay cho nút Đăng xuất */}
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
