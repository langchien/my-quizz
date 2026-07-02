import { AvatarPicker } from '@/components/AvatarPicker'
import { Header } from '@/components/Header'
import { ThemeSelector } from '@/components/ThemeSelector'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { type GameThemeId, getStoredGameTheme, setStoredGameTheme } from '@/config/gameThemes'
import { useSettings } from '@/hooks/useSettings'
import type { Grade } from '@/types/user'
import { motion } from 'framer-motion'
import { ArrowLeft, Gamepad2, KeyRound, LogOut, Shield, Trash2, User } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'

const GRADE_OPTIONS: { value: Grade; label: string }[] = [
  { value: '1', label: 'Lớp 1' },
  { value: '2', label: 'Lớp 2' },
  { value: '3', label: 'Lớp 3' },
  { value: '4', label: 'Lớp 4' },
  { value: '5', label: 'Lớp 5' },
  { value: '6', label: 'Lớp 6' },
  { value: '7', label: 'Lớp 7' },
  { value: '8', label: 'Lớp 8' },
  { value: '9', label: 'Lớp 9' },
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
  { value: 'university', label: 'Đại học' },
  { value: 'other', label: 'Khác' },
]

export default function SettingsPage() {
  const {
    userProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    handleLogout,
    isSaving,
    isChangingPassword,
    isDeletingAccount,
  } = useSettings()

  // ─── Profile form state ───
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [grade, setGrade] = useState<Grade | ''>('')
  const [avatarUrl, setAvatarUrl] = useState('🦊')
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // ─── Game theme state ───
  const [gameTheme, setGameTheme] = useState<GameThemeId>(getStoredGameTheme())

  // ─── Password dialog state ───
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  // ─── Delete account state ───
  const [deletePassword, setDeletePassword] = useState('')

  // Load profile data into form
  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || '')
      setFirstName(userProfile.firstName || '')
      setLastName(userProfile.lastName || '')
      setGrade(userProfile.grade || '')
      setAvatarUrl(userProfile.avatarUrl || '🦊')
      if (userProfile.preferences?.theme) {
        setGameTheme(userProfile.preferences.theme as GameThemeId)
      }
    }
  }, [userProfile])

  // ─── Handlers ───
  const handleSaveProfile = useCallback(async () => {
    await updateProfile({
      username: username || undefined,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`.trim() || undefined,
      grade: grade || undefined,
      avatarUrl,
    })
  }, [username, firstName, lastName, grade, avatarUrl, updateProfile])

  const handleSaveGameTheme = useCallback(
    async (themeId: GameThemeId) => {
      setGameTheme(themeId)
      setStoredGameTheme(themeId)
      await updateProfile({
        preferences: { theme: themeId },
      })
    },
    [updateProfile],
  )

  const handleChangePassword = useCallback(async () => {
    const success = await changePassword(currentPassword, newPassword)
    if (success) {
      setCurrentPassword('')
      setNewPassword('')
      setPasswordDialogOpen(false)
    }
  }, [currentPassword, newPassword, changePassword])

  const handleDeleteAccount = useCallback(async () => {
    await deleteAccount(deletePassword)
  }, [deletePassword, deleteAccount])

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='mx-auto max-w-2xl px-4 py-8'
      >
        {/* Back button */}
        <Link
          to='/dashboard'
          className='mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='size-4' />
          Quay lại Dashboard
        </Link>

        <h1 className='mb-8 text-3xl font-bold tracking-tight'>Cài đặt</h1>

        <div className='flex flex-col gap-6'>
          {/* ─── 👤 Profile ─────────────────────── */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <User className='size-5 text-primary' />
                <CardTitle>Thông tin cá nhân</CardTitle>
              </div>
              <CardDescription>Cập nhật thông tin hiển thị và hồ sơ của bạn</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-5'>
              {/* Avatar */}
              <div className='flex flex-col gap-2'>
                <Label>Avatar</Label>
                <div className='flex items-center gap-4'>
                  <span className='flex size-16 items-center justify-center rounded-2xl bg-muted text-4xl'>
                    {avatarUrl}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  >
                    {showAvatarPicker ? 'Ẩn' : 'Đổi avatar'}
                  </Button>
                </div>
                {showAvatarPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='mt-2 rounded-xl border bg-muted/50 p-3'
                  >
                    <AvatarPicker
                      value={avatarUrl}
                      onChange={(emoji) => {
                        setAvatarUrl(emoji)
                        setShowAvatarPicker(false)
                      }}
                      columns={8}
                    />
                  </motion.div>
                )}
              </div>

              {/* Username */}
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='settings-username'>Tên người dùng</Label>
                <Input
                  id='settings-username'
                  placeholder='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Name fields */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='settings-lastname'>Họ</Label>
                  <Input
                    id='settings-lastname'
                    placeholder='Nguyễn'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='settings-firstname'>Tên</Label>
                  <Input
                    id='settings-firstname'
                    placeholder='Văn A'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              {/* Grade */}
              <div className='flex flex-col gap-1.5'>
                <Label>Lớp / Cấp học</Label>
                <Select value={grade || undefined} onValueChange={(val) => setGrade(val as Grade)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn lớp/cấp...' />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language (mặc định, không đổi được) */}
              <div className='flex flex-col gap-1.5'>
                <Label>Ngôn ngữ</Label>
                <Input value='Tiếng Việt' disabled className='opacity-60' />
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving} className='mt-2 self-start'>
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </CardContent>
          </Card>

          {/* ─── 🎮 Game Settings ─────────────── */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <Gamepad2 className='size-5 text-primary' />
                <CardTitle>Cài đặt trò chơi</CardTitle>
              </div>
              <CardDescription>Tùy chỉnh giao diện mặc định khi chơi game</CardDescription>
            </CardHeader>
            <CardContent>
              <Label className='mb-3 block'>Game Theme mặc định</Label>
              <ThemeSelector value={gameTheme} onChange={handleSaveGameTheme} />
            </CardContent>
          </Card>

          {/* ─── 🔒 Account ───────────────────── */}
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <Shield className='size-5 text-primary' />
                <CardTitle>Tài khoản</CardTitle>
              </div>
              <CardDescription>Quản lý bảo mật và tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              {/* Đổi mật khẩu */}
              <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant='outline' className='justify-start gap-2'>
                    <KeyRound data-icon='inline-start' />
                    Đổi mật khẩu
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                    <DialogDescription>
                      Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi
                    </DialogDescription>
                  </DialogHeader>
                  <div className='flex flex-col gap-4 py-4'>
                    <div className='flex flex-col gap-1.5'>
                      <Label htmlFor='current-password'>Mật khẩu hiện tại</Label>
                      <Input
                        id='current-password'
                        type='password'
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                      <Label htmlFor='new-password'>Mật khẩu mới</Label>
                      <Input
                        id='new-password'
                        type='password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder='Tối thiểu 6 ký tự'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword || !currentPassword || newPassword.length < 6}
                    >
                      {isChangingPassword ? 'Đang xử lý...' : 'Xác nhận đổi'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Separator />

              {/* Đăng xuất */}
              <Button variant='outline' className='justify-start gap-2' onClick={handleLogout}>
                <LogOut data-icon='inline-start' />
                Đăng xuất
              </Button>

              <Separator />

              {/* Xóa tài khoản */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='outline'
                    className='justify-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive'
                  >
                    <Trash2 data-icon='inline-start' />
                    Xóa tài khoản
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xóa tài khoản vĩnh viễn?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Tất cả dữ liệu bao gồm quiz, lịch sử chơi và
                      thông tin cá nhân sẽ bị xóa vĩnh viễn.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className='flex flex-col gap-1.5 py-4'>
                    <Label htmlFor='delete-password'>Nhập mật khẩu để xác nhận</Label>
                    <Input
                      id='delete-password'
                      type='password'
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder='Mật khẩu của bạn'
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount || !deletePassword}
                      className='text-destructive-foreground bg-destructive hover:bg-destructive/90'
                    >
                      {isDeletingAccount ? 'Đang xóa...' : 'Xóa tài khoản'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* ─── Footer ────────────────────────── */}
          <div className='py-6 text-center text-xs text-muted-foreground'>
            <div className='flex items-center justify-center gap-4'>
              <span>Liên hệ</span>
              <span>•</span>
              <span>Điều khoản sử dụng</span>
              <span>•</span>
              <span>Chính sách bảo mật</span>
            </div>
            <p className='mt-2'>© 2025 My-Quizz. All rights reserved.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
