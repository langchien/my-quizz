# Hướng Dẫn Tích Hợp Supabase & React Router v7

Tài liệu này giúp bạn làm quen với **Supabase** từ góc nhìn của một developer đã thành thạo **React Router v7**.

## 1. Tư Duy (Mindset Shift)

Khi chuyển từ React thuần sang **Supabase** + **React Router v7 (Loader/Action)**:

| Khái niệm cũ                     | React Router v7 + Supabase                                             |
| :------------------------------- | :--------------------------------------------------------------------- |
| `useEffect` để fetch data        | **Loader**: Fetch data server-side (hoặc client-side trước khi render) |
| `onSubmit` + API call            | **Action**: Xử lý form submit, gọi Supabase mutate data                |
| Backend API riêng (Express/Nest) | **Supabase SDK**: Gọi trực tiếp DB từ Loader/Action (có RLS bảo vệ)    |
| Redux/Context cho User Auth      | **Supabase Auth**: Hàm `supabase.auth.getSession()` trong Loader       |

## 2. Setup Cơ Bản

### 2.1. Cài đặt Client

```bash
npm install @supabase/supabase-js
```

### 2.2. Tạo Instance (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'
// Import Type được generate từ Database (Quan trọng!)
import { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

> **Mẹo**: Nhớ chạy `npx supabase gen types typescript ...` mỗi khi sửa DB để có gợi ý code xịn xò.

## 3. Pattern Tích Hợp (Best Practices)

### 3.1. Fetch Data với Loader

Không cần `useEffect`. Hãy load dữ liệu ngay trong route definition.

**Route Config (`app/routes/quiz.$id.tsx`):**

```typescript
import { useLoaderData } from "react-router";
import { supabase } from "~/lib/supabase";
import type { Route } from "./+types/quiz.$id";

// Loader chạy trước khi component render
export async function loader({ params }: Route.LoaderArgs) {
  const { data, error } = await supabase
    .from("Quiz")
    .select("*, Question(*)")
    .eq("id", params.id)
    .single();

  if (error) throw new Response("Not Found", { status: 404 });
  return { quiz: data };
}

export default function QuizDetail() {
  const { quiz } = useLoaderData<typeof loader>(); // Type-safe data!

  return (
    <div>
      <h1>{quiz.title}</h1>
      {/* Render câu hỏi */}
    </div>
  );
}
```

### 3.2. Mutate Data với Action

Xử lý Form submit chuẩn HTML/React Router.

**Component:**

```tsx
import { Form } from 'react-router'

// ...
;<Form method='post'>
  <input name='title' />
  <button type='submit'>Tạo Quiz</button>
</Form>
```

**Action (`app/routes/new-quiz.tsx`):**

```typescript
import { redirect } from 'react-router'
import { supabase } from '~/lib/supabase'
import type { Route } from './+types/new-quiz'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const title = formData.get('title') as string

  // Gọi Supabase
  const { data, error } = await supabase.from('Quiz').insert([{ title }]).select().single()

  if (error) return { error: error.message }

  // Redirect về trang chi tiết
  return redirect(`/quiz/${data.id}`)
}
```

## 4. Bảo Mật (Row Level Security - RLS)

Vì chúng ta gọi DB trực tiếp từ Client (hoặc Loader), **RLS là bắt buộc**.

- Trong Supabase Dashboard -> Authentication -> Policies.
- Ví dụ policy cho bảng `Quiz`:
  - **Enable Read**: `true` (Ai cũng xem được Public Quiz).
  - **Enable Insert/Update**: `auth.uid() == owner_id` (Chỉ chủ sở hữu được sửa).

## 5. Next Steps

1.  Cài đặt Supabase project.
2.  Lấy `SUPABASE_URL` và `ANON_KEY`.
3.  Thử viết một Loader đơn giản lấy danh sách user/quiz.
