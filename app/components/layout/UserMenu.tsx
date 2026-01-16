import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PAGES } from '@/config/pages'
import { useAuth } from '@/features/auth/context/AuthContext'
import { logout } from '@/features/auth/hooks/useAuthActions'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

export function UserMenu() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // Fetch profile từ bảng User
  const { data: profile } = useProfile(user?.id)

  // Đang loading
  if (loading) {
    return <div className='h-8 w-8 animate-pulse rounded-full bg-muted' />
  }

  // Chưa đăng nhập -> hiển thị nút đăng nhập
  if (!user) {
    return (
      <Button size='sm' asChild>
        <Link to={PAGES.LOGIN}>Đăng nhập</Link>
      </Button>
    )
  }

  // Ưu tiên lấy từ bảng User, fallback sang user_metadata
  const displayName =
    profile?.displayName ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User'

  const email = user.email || ''

  const avatarUrl =
    profile?.avatarUrl || user.user_metadata?.avatar_url || user.user_metadata?.picture || ''

  const initials = displayName.charAt(0).toUpperCase()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Đăng xuất thành công!')
      navigate(PAGES.LOGIN)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đăng xuất thất bại')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-9 w-9 rounded-full'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{displayName}</p>
            <p className='text-xs leading-none text-muted-foreground'>{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={PAGES.PROFILE} className='cursor-pointer'>
            <User className='mr-2 h-4 w-4' />
            Hồ sơ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className='cursor-pointer text-destructive focus:text-destructive'
        >
          <LogOut className='mr-2 h-4 w-4' />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
