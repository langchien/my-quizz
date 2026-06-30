const ADJECTIVES = [
  'Vui Vẻ',
  'Thông Minh',
  'Lanh Lợi',
  'Nhanh Nhẹn',
  'Dũng Cảm',
  'Tinh Nghịch',
  'Hào Hứng',
  'Siêu Phàm',
  'Đáng Yêu',
  'Năng Động',
  'Tài Giỏi',
  'Hài Hước',
  'Kiên Cường',
  'Sáng Tạo',
  'Lém Lỉnh',
  'Bền Bỉ',
  'Hoạt Bát',
  'Tháo Vát',
  'Xinh Xắn',
  'Hồn Nhiên',
]

const ANIMALS = [
  'Hổ',
  'Mèo',
  'Cáo',
  'Thỏ',
  'Gấu',
  'Sói',
  'Đại Bàng',
  'Cú Mèo',
  'Rồng',
  'Sư Tử',
  'Cá Heo',
  'Chim Sẻ',
  'Gà Trống',
  'Bướm',
  'Rùa',
  'Chuồn Chuồn',
  'Voi',
  'Hươu',
  'Khỉ',
  'Ong Mật',
]

/**
 * Sinh nickname ngẫu nhiên tiếng Việt vui nhộn.
 * Pattern: "{Con vật} {Tính từ}" — ví dụ: "Hổ Vui Vẻ", "Mèo Thông Minh"
 * ~400 tổ hợp khả dụng.
 */
export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  return `${animal} ${adj}`
}
