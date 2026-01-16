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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { useDeleteAccount } from '../hooks/useDeleteAccount'

/**
 * Dialog xác nhận xóa tài khoản với confirm text
 */
export function DeleteAccountDialog() {
  const { confirmText, setConfirmText, canDelete, isPending, handleDelete, reset, CONFIRM_PHRASE } =
    useDeleteAccount()

  return (
    <AlertDialog onOpenChange={(open) => !open && reset()}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' className='w-full'>
          <Trash2 className='mr-2 h-4 w-4' />
          Xóa tài khoản
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className='mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center'>
            <AlertTriangle className='w-6 h-6 text-destructive' />
          </div>
          <AlertDialogTitle className='text-center'>Xóa tài khoản vĩnh viễn?</AlertDialogTitle>
          <AlertDialogDescription className='text-center space-y-2'>
            <p>
              Hành động này <strong>không thể hoàn tác</strong>. Tất cả dữ liệu của bạn sẽ bị xóa
              vĩnh viễn bao gồm:
            </p>
            <ul className='text-left list-disc list-inside text-sm mt-2 space-y-1'>
              <li>Thông tin hồ sơ cá nhân</li>
              <li>Lịch sử làm bài quiz</li>
              <li>Các quiz đã tạo</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='space-y-2 py-4'>
          <Label htmlFor='confirm-delete'>
            Gõ <strong className='text-destructive'>{CONFIRM_PHRASE}</strong> để xác nhận
          </Label>
          <Input
            id='confirm-delete'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            disabled={isPending}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!canDelete || isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang xóa...
              </>
            ) : (
              'Xóa tài khoản'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
