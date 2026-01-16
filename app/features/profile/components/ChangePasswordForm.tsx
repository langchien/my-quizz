import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { KeyRound, Loader2 } from 'lucide-react'
import { useChangePassword } from '../hooks/useChangePassword'

/**
 * Form đổi mật khẩu với validation
 */
export function ChangePasswordForm() {
  const { form, isPending, handleSubmit } = useChangePassword()

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <FormField
          control={form.control}
          name='currentPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu hiện tại</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Nhập mật khẩu hiện tại'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu mới</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Tối thiểu 8 ký tự'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Nhập lại mật khẩu mới'
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang xử lý...
            </>
          ) : (
            <>
              <KeyRound className='mr-2 h-4 w-4' />
              Đổi mật khẩu
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
