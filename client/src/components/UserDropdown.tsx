import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { isEmojiAvatar } from '@/config/avatarPresets'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router'

/**
 * Avatar + Dropdown Menu cho Header.
 * Thay thế nút "Đăng xuất" cũ bằng menu dropdown premium.
 */
export function UserDropdown() {
  const { user, userProfile, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const displayName =
    userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'User'
  const avatarUrl = userProfile?.avatarUrl
  const email = user.email || ''

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 text-white backdrop-blur-md transition-all hover:bg-white/30 hover:text-white focus-visible:ring-offset-0'
        >
          {/* Avatar circle */}
          <span
            className={cn(
              'flex size-8 items-center justify-center rounded-full text-lg',
              isEmojiAvatar(avatarUrl) ? 'bg-white/20' : 'overflow-hidden',
            )}
          >
            {avatarUrl && !isEmojiAvatar(avatarUrl) ? (
              <img src={avatarUrl} alt={displayName} className='size-full object-cover' />
            ) : (
              <span>{avatarUrl || '🦊'}</span>
            )}
          </span>
          <span className='hidden max-w-[120px] truncate text-sm font-medium sm:block'>
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col gap-1'>
            <p className='text-sm leading-none font-medium'>{displayName}</p>
            <p className='text-xs leading-none text-muted-foreground'>{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings data-icon='inline-start' />
            Cài đặt
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className='text-destructive focus:text-destructive'
        >
          <LogOut data-icon='inline-start' />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
