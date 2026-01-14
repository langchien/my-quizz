# Hướng Dẫn Sử Dụng Supabase

> **Tài liệu chính thức**: [https://supabase.com/docs](https://supabase.com/docs)

Tài liệu này cung cấp cái nhìn tổng quan về hệ sinh thái Supabase, các giới hạn của gói miễn phí (Free Tier), và hướng dẫn tích hợp vào dự án ReactJS + Prisma.

## 1. Tổng Quan Dịch Vụ & Giới Hạn Free Tier

Supabase là một giải pháp Backend-as-a-Service (BaaS) thay thế Firebase, dựa trên nền tảng PostgreSQL.

### Các dịch vụ chính & Giới hạn (Free Plan)

| Dịch vụ            | Chức năng                                  | Giới hạn Free Tier (Cập nhật mới nhất) | Lưu ý quan trọng                                                                                      |
| :----------------- | :----------------------------------------- | :------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **Database**       | Postgres Database đầyV đủ tính năng        | **500 MB** dung lượng                  | Đủ cho khoảng 1-2 triệu dòng project nhỏ. Tự động pause sau 7 ngày không hoạt động (cần vào bật lại). |
| **Authentication** | Quản lý user, login (Google, FB, Email...) | **50,000 MAU** (Monthly Active Users)  | Rất hào phóng. Hỗ trợ sẵn JWT.                                                                        |
| **Realtime**       | Lắng nghe thay đổi DB, Broadcast tin nhắn  | **200 Concurrent Connections**         | Tối đa 200 người kết nối cùng lúc. 2 triệu tin nhắn/tháng.                                            |
| **Storage**        | Lưu trữ file (ảnh, video)                  | **1 GB** lưu trữ                       | Băng thông tải ra: 2 GB/tháng.                                                                        |
| **Edge Functions** | Serverless functions (Deno)                | **500,000 invocations**/tháng          | Dùng cho logic phức tạp phía server.                                                                  |

---

## 2. Kiến Trúc Tích Hợp (ReactJS + Prisma + Supabase)

Trong dự án này, chúng ta sử dụng mô hình "Hybrid":

1.  **Quản lý Cấu trúc (Schema)**: Dùng **Prisma**.
    - Tất cả bảng, quan hệ định nghĩa tại `schema.prisma`.
    - Dùng `npx prisma migrate dev` để đẩy lên Supabase.
2.  **Truy vấn dữ liệu (Frontend)**: Dùng **Supabase JS Client**.
    - Kết nối trực tiếp từ React tới Supabase.
    - Bảo mật bằng **RLS (Row Level Security)**.
3.  **Realtime**: Dùng **Supabase Realtime**.

---

## 3. Cài Đặt & Cấu Hình

### Cài đặt Package

```bash
npm install @supabase/supabase-js
```

### Khởi tạo Client (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

// Lấy từ biến môi trường (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Key is missing!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 4. Ví Dụ Sử Dụng (Patterns)

### 4.1. Fetch Data (Kết hợp React Query)

Ví dụ lấy danh sách câu hỏi (Questions) cho Game.

**File:** `src/features/game/api/useQuestions.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface Question {
  id: string
  content: string
  // ...
}

export const useQuestions = (quizId: string) => {
  return useQuery({
    queryKey: ['questions', quizId],
    queryFn: async () => {
      // Gọi trực tiếp SDK Supabase
      const { data, error } = await supabase
        .from('Question') // Tên bảng phải khớp schema.prisma (thường Prisma migrate giữ nguyên case)
        .select('*')
        .eq('quizId', quizId)

      if (error) throw new Error(error.message)
      return data as Question[]
    },
    enabled: !!quizId, // Chỉ chạy khi có quizId
  })
}
```

### 4.2. Realtime (Ví dụ cho Mini Game)

Ví dụ lắng nghe sự kiện "Người chơi mới tham gia" (Broadcast hoặc Presence) hoặc "Trạng thái phòng thay đổi".

**File:** `src/features/game/hooks/useGameRoom.ts`

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const useGameRoom = (roomId: string) => {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    // Tạo subscription vào channel của phòng
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes', // Lắng nghe thay đổi DB (ví dụ: điểm số)
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'Score', // Tên bảng điểm
          filter: `roomId=eq.${roomId}`, // Chỉ nhận event của phòng này
        },
        (payload) => {
          console.log('Điểm số thay đổi:', payload)
          // Update state logic here...
        },
      )
      .on(
        'broadcast', // Lắng nghe tin nhắn từ Server/Host gửi tới (nhanh hơn DB)
        { event: 'game_start' },
        (payload) => {
          console.log('Game bắt đầu!', payload)
          // Navigate to play screen
        },
      )
      .subscribe()

    // Cleanup khi component unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  return { messages }
}
```

### 4.3. Authentication (Login)

**File:** `src/features/auth/hooks/useLogin.ts`

```typescript
import { supabase } from '@/lib/supabase'

export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) console.error('Lỗi login:', error.message)
  return data
}
```

## 5. Lưu Ý Quan Trọng (Về Type)

Vì chúng ta dùng Prisma để tạo bảng, nhưng dùng Supabase Client để fetch, nên cần đồng bộ Type.

1.  Chạy: `npx supabase gen types typescript --project-id ... > src/types/supabase.ts`
2.  Khi khởi tạo client, truyền Type vào để có gợi ý code (Intellisense):

```typescript
// src/lib/supabase.ts update
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase' // File được gen ra

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

Lúc này khi gõ `supabase.from('...')` sẽ tự động gợi ý tên bảng chính xác.
