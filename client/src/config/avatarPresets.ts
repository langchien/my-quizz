/**
 * Danh sách avatar preset cho user chọn.
 * Dùng trong Onboarding (bước 4) và Settings.
 */
export interface AvatarPreset {
  id: string
  emoji: string
  label: string
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'fox', emoji: '🦊', label: 'Cáo' },
  { id: 'panda', emoji: '🐼', label: 'Gấu trúc' },
  { id: 'lion', emoji: '🦁', label: 'Sư tử' },
  { id: 'tiger', emoji: '🐯', label: 'Hổ' },
  { id: 'frog', emoji: '🐸', label: 'Ếch' },
  { id: 'monkey', emoji: '🐵', label: 'Khỉ' },
  { id: 'unicorn', emoji: '🦄', label: 'Kỳ lân' },
  { id: 'penguin', emoji: '🐧', label: 'Chim cánh cụt' },
  { id: 'bear', emoji: '🐻', label: 'Gấu' },
  { id: 'butterfly', emoji: '🦋', label: 'Bướm' },
  { id: 'cat', emoji: '🐱', label: 'Mèo' },
  { id: 'dog', emoji: '🐶', label: 'Chó' },
  { id: 'rabbit', emoji: '🐰', label: 'Thỏ' },
  { id: 'eagle', emoji: '🦅', label: 'Đại bàng' },
  { id: 'koala', emoji: '🐨', label: 'Koala' },
  { id: 'dinosaur', emoji: '🦖', label: 'Khủng long' },
  { id: 'octopus', emoji: '🐙', label: 'Bạch tuộc' },
  { id: 'crab', emoji: '🦀', label: 'Cua' },
  { id: 'bee', emoji: '🐝', label: 'Ong' },
  { id: 'turtle', emoji: '🐢', label: 'Rùa' },
  { id: 'whale', emoji: '🐳', label: 'Cá voi' },
  { id: 'parrot', emoji: '🦜', label: 'Vẹt' },
  { id: 'wolf', emoji: '🐺', label: 'Sói' },
  { id: 'owl', emoji: '🦉', label: 'Cú' },
]

/** Lấy emoji từ avatar URL (chuỗi emoji) hoặc fallback mặc định */
export function getAvatarDisplay(avatarUrl?: string): string {
  if (!avatarUrl) return '🦊'

  // Kiểm tra xem avatarUrl có phải emoji trong preset không
  const preset = AVATAR_PRESETS.find((p) => p.emoji === avatarUrl)
  if (preset) return preset.emoji

  // Nếu là URL ảnh, trả về chuỗi rỗng (component sẽ render <img>)
  return avatarUrl
}

/** Kiểm tra avatarUrl có phải là emoji hay URL ảnh */
export function isEmojiAvatar(avatarUrl?: string): boolean {
  if (!avatarUrl) return true
  return !avatarUrl.startsWith('http')
}
