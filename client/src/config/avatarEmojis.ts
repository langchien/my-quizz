/**
 * Danh sách emoji animals/expressions preset cho avatar người chơi.
 * Dùng trong Lobby, Leaderboard, v.v.
 */
export const AVATAR_EMOJIS = [
  '🦊',
  '🐼',
  '🦁',
  '🐯',
  '🐸',
  '🐵',
  '🦄',
  '🐧',
  '🐻',
  '🦋',
  '🐱',
  '🐶',
  '🐰',
  '🦅',
  '🐨',
  '🦖',
  '🐙',
  '🦀',
  '🐝',
  '🐢',
  '🐳',
  '🦜',
  '🐺',
  '🦉',
] as const

/**
 * Gán avatar emoji cố định (deterministic) dựa trên tên người chơi.
 * Cùng một tên sẽ luôn trả về cùng emoji.
 *
 * @param name - Tên người chơi
 * @returns Emoji avatar tương ứng
 */
export function getAvatarEmoji(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  const index = Math.abs(hash) % AVATAR_EMOJIS.length
  return AVATAR_EMOJIS[index]
}
