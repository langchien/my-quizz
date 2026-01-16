import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save } from 'lucide-react'
import type { Profile } from '../hooks/useProfile'
import { useProfileForm } from '../hooks/useProfileForm'

interface ProfileFormProps {
  userId: string
  profile: Profile | null
  onSuccess?: () => void
}

/**
 * Form chỉnh sửa profile sử dụng react-hook-form + zod validation
 * Logic được tách vào useProfileForm hook
 */
export function ProfileForm({ userId, profile, onSuccess }: ProfileFormProps) {
  const { form, isPending, handleSubmit } = useProfileForm({ userId, profile, onSuccess })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Display Name */}
        <FormField
          control={form.control}
          name='displayName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên hiển thị *</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên hiển thị' disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới thiệu bản thân</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Viết vài dòng về bạn...'
                  disabled={isPending}
                  rows={4}
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>{(field.value || '').length}/500 ký tự</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  type='tel'
                  placeholder='Nhập số điện thoại (VD: 0912345678)'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email (read-only) */}
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input value={profile?.email || ''} disabled className='bg-muted' />
          </FormControl>
          <FormDescription>Email không thể thay đổi</FormDescription>
        </FormItem>

        {/* Submit Button */}
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className='mr-2 h-4 w-4' />
              Lưu thay đổi
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
