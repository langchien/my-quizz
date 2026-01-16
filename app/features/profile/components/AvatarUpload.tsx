import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Camera, Loader2 } from 'lucide-react'
import { useAvatarUpload } from '../hooks/useAvatarUpload'

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string | null
  displayName: string
  onSuccess?: (newUrl: string) => void
}

/**
 * Component upload avatar
 * Logic được tách vào useAvatarUpload hook
 */
export function AvatarUpload({
  userId,
  currentAvatarUrl,
  displayName,
  onSuccess,
}: AvatarUploadProps) {
  const { inputRef, preview, isPending, openFilePicker, handleFileChange } = useAvatarUpload({
    userId,
    currentAvatarUrl,
    onSuccess,
  })

  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='relative'>
        <Avatar className='h-32 w-32 border-4 border-background shadow-xl'>
          <AvatarImage src={preview || currentAvatarUrl || ''} alt={displayName} />
          <AvatarFallback className='text-4xl'>{initials}</AvatarFallback>
        </Avatar>

        {/* Overlay button */}
        <Button
          type='button'
          size='icon'
          variant='secondary'
          className='absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg'
          onClick={openFilePicker}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className='h-5 w-5 animate-spin' />
          ) : (
            <Camera className='h-5 w-5' />
          )}
        </Button>

        {/* Hidden input */}
        <Input
          ref={inputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleFileChange}
          disabled={isPending}
        />
      </div>

      <div className='text-center'>
        <p className='text-sm text-muted-foreground'>
          Click vào biểu tượng camera để thay đổi avatar
        </p>
        <p className='text-xs text-muted-foreground'>Định dạng: JPG, PNG, GIF. Tối đa 10MB</p>
      </div>

      {isPending && (
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Loader2 className='h-4 w-4 animate-spin' />
          Đang tải lên...
        </div>
      )}
    </div>
  )
}
