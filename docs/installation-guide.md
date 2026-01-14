# Hướng Dẫn Cài Đặt Tech Stack - My Quizz

> **Lưu ý**: Hướng dẫn này giả định bạn đã có Node.js (v18+) và npm được cài đặt.

---

## 📋 Mục Lục

1. [Khởi Tạo Dự Án](#1-khởi-tạo-dự-án)
2. [Cài Đặt Prisma](#2-cài-đặt-prisma)
3. [Cài Đặt Supabase Client](#3-cài-đặt-supabase-client)
4. [Cài Đặt TailwindCSS & Shadcn/UI](#4-cài-đặt-tailwindcss--shadcnui)
5. [Cài Đặt State Management](#5-cài-đặt-state-management)
6. [Cài Đặt Form Libraries](#6-cài-đặt-form-libraries)
7. [Cài Đặt Dev Tools](#7-cài-đặt-dev-tools)
8. [Cấu Hình Environment Variables](#8-cấu-hình-environment-variables)
9. [Checklist Hoàn Thành](#9-checklist-hoàn-thành)

---

## 1. Khởi Tạo Dự Án

### 1.1. Tạo Git Repository

```bash
git init
git branch -M main
```

### 1.2. Khởi Tạo React Router v7

```bash
npx create-react-router@latest .
```

**Chọn các options**:

- Template: `default` (hoặc nhấn Enter)
- Install dependencies: `Yes`

### 1.3. Kiểm Tra Cài Đặt

```bash
npm run dev
```

Mở `http://localhost:5173` để kiểm tra.

---

## 2. Cài Đặt Prisma

### 2.1. Cài Đặt Dependencies

```bash
# Dev dependencies (chỉ dùng để migrate)
npm install -D prisma tsx

# KHÔNG CẦN cài @prisma/client vì chỉ dùng Supabase Client
```

### 2.2. Khởi Tạo Prisma

```bash
npx prisma init
```

**Kết quả**: Tạo thư mục `prisma/` và file `.env`

### 2.3. Cấu Hình `prisma/schema.prisma`

Mở file `prisma/schema.prisma` và cập nhật:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Ví dụ model User
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2.4. Cấu Hình Connection String

Trong file `.env`, thêm:

```env
# Lấy từ Supabase Dashboard > Settings > Database > Connection String
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Hoặc Direct Connection (cho migration)
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

**Lưu ý**: Dùng **Direct Connection** cho migration, không dùng pooler.

### 2.5. Chạy Migration Đầu Tiên

```bash
npx prisma migrate dev --name init
```

---

## 3. Cài Đặt Supabase Client

### 3.1. Cài Đặt Package

```bash
npm install @supabase/supabase-js
```

### 3.2. Tạo Supabase Client

Tạo file `app/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3.3. Cấu Hình Environment Variables

Trong file `.env`:

```env
# Lấy từ Supabase Dashboard > Settings > API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3.4. Generate Types từ Supabase

```bash
# Cài Supabase CLI (nếu chưa có)
npm install -D supabase

# Generate types
npx supabase gen types typescript --project-id your-project-id > app/types/supabase.ts
```

### 3.5. Update Supabase Client với Types

Cập nhật `app/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

---

## 4. Cấu Hình TailwindCSS & Shadcn/UI

### 4.1. TailwindCSS v4 (✅ Đã Có Sẵn)

**Khi chạy `npx create-react-router@latest`, TailwindCSS v4 đã được cài đặt tự động.**

Kiểm tra trong `package.json`:

```json
{
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.13",
    "tailwindcss": "^4.1.13"
  }
}
```

**File cấu hình có sẵn**:

- `app/app.css` - Import Tailwind directives
- `vite.config.ts` - Plugin Tailwind đã được config

✅ **Không cần cài đặt thêm gì!**

### 4.2. Cài Đặt Utilities

```bash
npm install clsx tailwind-merge
```

### 4.3. Tạo `cn` Utility

Tạo file `app/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 4.4. Cài Đặt Shadcn/UI

```bash
# Cài CLI
npx shadcn@latest init
```

**Chọn options**:

- Style: `New York` hoặc `Default`
- Base color: `Slate` (hoặc theo ý thích)
- CSS variables: `Yes`

### 4.5. Thêm Components

```bash
# Ví dụ: Button, Input, Card
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
```

### 4.6. Cài Đặt Icons

```bash
npm install lucide-react
```

---

## 5. Cài Đặt State Management

### 5.1. TanStack Query (React Query)

```bash
npm install @tanstack/react-query
```

**Setup Provider** trong `app/root.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  )
}
```

### 5.2. Zustand (Global State)

```bash
npm install zustand
```

**Ví dụ store** (`app/stores/auth.ts`):

```typescript
import { create } from 'zustand'

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

---

## 6. Cài Đặt Form Libraries

### 6.1. React Hook Form

```bash
npm install react-hook-form
```

### 6.2. Zod (Validation)

```bash
npm install zod @hookform/resolvers
```

**Ví dụ sử dụng**:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return <form onSubmit={handleSubmit(onSubmit)}>{/* ... */}</form>
}
```

---

## 7. Cài Đặt Dev Tools

### 7.1. ESLint & Prettier (Đã cài)

Nếu chưa có, xem lại cuộc trò chuyện trước hoặc chạy:

```bash
npm install -D prettier eslint @eslint/js @eslint/compat typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### 7.2. Cấu Hình Scripts

Trong `package.json`:

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\""
  }
}
```

---

## 8. Cấu Hình Environment Variables

### 8.1. Tạo `.env` File

```env
# Database (Prisma - Direct Connection)
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Supabase (Frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 8.2. Tạo `.env.example`

```env
# Database
DATABASE_URL=

# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 8.3. Cập Nhật `.gitignore`

```gitignore
.env
.env.local
node_modules
build
.react-router
```

---

## 9. Checklist Hoàn Thành

### Core Setup

- [x] React Router v7 đã khởi tạo
- [x] Git repository đã init
- [x] `npm run dev` chạy thành công

### Database & Backend

- [x] Prisma đã cài đặt (`prisma`, `tsx`)
- [x] `schema.prisma` đã cấu hình
- [x] `DATABASE_URL` đã set trong `.env`
- [x] Migration đầu tiên đã chạy thành công
- [x] Supabase Client đã setup (`@supabase/supabase-js`)
- [x] Supabase types đã generate

### Frontend Libraries

- [x] TailwindCSS đã hoạt động
- [x] `cn` utility đã tạo
- [x] Shadcn/UI đã init
- [x] Lucide React icons đã cài
- [x] TanStack Query đã setup
- [x] Zustand đã cài (nếu cần)

### Form & Validation

- [x] React Hook Form đã cài
- [x] Zod đã cài

### Dev Tools

- [x] ESLint đã cấu hình
- [x] Prettier đã cấu hình
- [x] npm scripts đã thêm (`lint`, `format`)

### Environment

- [x] `.env` đã tạo và cấu hình
- [x] `.env.example` đã tạo
- [x] `.gitignore` đã cập nhật

---

## 🚀 Bước Tiếp Theo

Sau khi hoàn thành checklist:

1. **Test toàn bộ setup**:

   ```bash
   npm run typecheck
   npm run lint
   npm run format
   npm run dev
   ```

2. **Bắt đầu Module 1.1** theo `project-plan.md`:
   - Implement Authentication
   - Setup RLS Policies
   - Generate Supabase Types

---

## 📚 Tài Liệu Tham Khảo

- [React Router v7 Docs](https://reactrouter.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Shadcn/UI Docs](https://ui.shadcn.com)
