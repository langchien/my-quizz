import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useUploadAvatar } from './useUploadAvatar'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface UseAvatarUploadOptions {
  userId: string
  currentAvatarUrl?: string | null
  onSuccess?: (newUrl: string) => void
}

/**
 * Custom hook chứa logic cho AvatarUpload
 * - Validate file (size, type)
 * - Tạo preview
 * - Handle upload với mutation
 * - Toast notifications
 */
export function useAvatarUpload({ userId, currentAvatarUrl, onSuccess }: UseAvatarUploadOptions) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { mutate: uploadAvatar, isPending } = useUploadAvatar()

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File quá lớn. Giới hạn 10MB.')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh.')
      return
    }

    // Tạo preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    uploadAvatar(
      { userId, file, currentAvatarUrl },
      {
        onSuccess: (newUrl) => {
          toast.success('Cập nhật avatar thành công!')
          setPreview(null)
          onSuccess?.(newUrl)
        },
        onError: (error) => {
          toast.error(error.message)
          setPreview(null)
        },
      },
    )

    // Reset input để có thể chọn lại cùng file
    e.target.value = ''
  }

  return {
    inputRef,
    preview,
    isPending,
    openFilePicker,
    handleFileChange,
  }
}
