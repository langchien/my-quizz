import { supabase } from '@/lib/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const AVATAR_BUCKET = 'avatars'
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

/**
 * Upload avatar lên Supabase Storage
 */
async function uploadAvatar(userId: string, file: File, currentAvatarUrl?: string | null) {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File quá lớn. Giới hạn 2MB.')
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Vui lòng chọn file ảnh.')
  }

  // Tạo unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  // Upload file mới
  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (uploadError) {
    throw new Error(`Upload thất bại: ${uploadError.message}`)
  }

  // Lấy public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath)

  // Cập nhật avatarUrl trong bảng User
  const { error: updateError } = await supabase
    .from('User')
    .update({
      avatarUrl: publicUrl,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', userId)

  if (updateError) {
    // Rollback: xóa file vừa upload nếu update DB thất bại
    await supabase.storage.from(AVATAR_BUCKET).remove([filePath])
    throw new Error(`Cập nhật thất bại: ${updateError.message}`)
  }

  // Xóa avatar cũ nếu có (và khác URL mới)
  if (currentAvatarUrl && currentAvatarUrl.includes(AVATAR_BUCKET)) {
    try {
      const oldPath = currentAvatarUrl.split(`${AVATAR_BUCKET}/`)[1]
      if (oldPath && oldPath !== filePath) {
        await supabase.storage.from(AVATAR_BUCKET).remove([oldPath])
      }
    } catch {
      // Ignore error khi xóa file cũ
    }
  }

  return publicUrl
}

/**
 * Hook để upload avatar
 *
 * @example
 * const { mutate, isPending } = useUploadAvatar()
 * mutate({ userId: 'xxx', file: selectedFile, currentAvatarUrl: profile.avatarUrl })
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      file,
      currentAvatarUrl,
    }: {
      userId: string
      file: File
      currentAvatarUrl?: string | null
    }) => uploadAvatar(userId, file, currentAvatarUrl),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })
}
