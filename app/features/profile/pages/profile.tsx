import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProtectedContext } from '@/hooks/useProtectedContext'
import { CalendarDays, Mail } from 'lucide-react'
import { AvatarUpload } from '../components/AvatarUpload'
import { ProfileForm } from '../components/ProfileForm'
import { useProfile } from '../hooks/useProfile'

export function meta() {
  return [
    { title: 'Hồ sơ cá nhân | My Quiz' },
    { name: 'description', content: 'Quản lý thông tin cá nhân của bạn' },
  ]
}

export default function ProfilePage() {
  const { user } = useProtectedContext()
  const { data: profile, isLoading } = useProfile(user.id)

  // Loading skeleton
  if (isLoading) {
    return (
      <div className='container mx-auto max-w-4xl py-8'>
        <div className='grid gap-8 md:grid-cols-[300px_1fr]'>
          <Card>
            <CardContent className='flex flex-col items-center gap-4 pt-6'>
              <Skeleton className='h-32 w-32 rounded-full' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-48' />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-40' />
              <Skeleton className='h-4 w-60' />
            </CardHeader>
            <CardContent className='space-y-6'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-24 w-full' />
              <Skeleton className='h-10 w-full' />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const displayName =
    profile?.displayName ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User'

  const avatarUrl =
    profile?.avatarUrl || user.user_metadata?.avatar_url || user.user_metadata?.picture

  const createdAt = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className='container mx-auto max-w-4xl py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Hồ sơ cá nhân</h1>
        <p className='text-muted-foreground'>
          Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
        </p>
      </div>

      <div className='grid gap-8 md:grid-cols-[300px_1fr]'>
        {/* Left Column - Avatar & Quick Info */}
        <div className='space-y-6'>
          <Card>
            <CardContent className='pt-6'>
              <AvatarUpload
                userId={user.id}
                currentAvatarUrl={avatarUrl}
                displayName={displayName}
              />
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3 text-sm'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span className='truncate text-muted-foreground'>{user.email}</span>
              </div>
              {createdAt && (
                <div className='flex items-center gap-3 text-sm'>
                  <CalendarDays className='h-4 w-4 text-muted-foreground' />
                  <span className='text-muted-foreground'>Tham gia: {createdAt}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa hồ sơ</CardTitle>
            <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm key={profile?.updatedAt} userId={user.id} profile={profile ?? null} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
