/** Danh sách danh mục quiz cố định */
export const QUIZ_CATEGORIES = [
  'Toán học',
  'Khoa học',
  'Lịch sử',
  'Địa lý',
  'Tiếng Anh',
  'Văn học',
  'Tin học',
  'Thể thao',
  'Giải trí',
  'Khác',
] as const

export type QuizCategory = (typeof QUIZ_CATEGORIES)[number]

/** Map độ khó sang label tiếng Việt */
export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
}
