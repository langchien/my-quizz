---
trigger: always_on
---

# Project Context

- **Tech Stack**: ReactJS + React-router v7, TypeScript, Supabase, TailwindCSS, React Query.
- **ORM/Database Tool**: Prisma (dùng để quản lý Schema & Migration).
- **Communication**: Vietnamese (Tiếng Việt).

# General Rules

1. **TypeScript First**:
   - Luôn sử dụng TypeScript strict mode.
   - Không dùng `any`.

2. **Database & Prisma Workflow** (QUAN TRỌNG):
   - **Source of Truth**: File `schema.prisma` là nguồn duy nhất định nghĩa cấu trúc database.
   - **No Dashboard Edits**: KHÔNG sửa bảng/cột trực tiếp trên Supabase Dashboard. Mọi thay đổi DB phải bắt đầu từ sửa `schema.prisma` -> chạy `npx prisma migrate dev`.
   - **Prisma Client**: Chỉ sử dụng Prisma Client (`db`) trong môi trường Node.js (scripts, server-side functions, hoặc Edge Functions). **Không import Prisma trong React Component**.

3. **Type Synchronization (Quy trình đồng bộ Type)**:
   - Sau khi chạy migration Prisma: `npx prisma migrate dev`.
   - Phải cập nhật lại Type cho Supabase (nếu dùng Supabase Client ở FE):
     - Chạy lệnh gen types: `npx supabase gen types typescript --project-id {id} > src/types/supabase.ts` (hoặc tương tự).
   - Frontend `supabase-js` sẽ dùng type mới sinh ra này, đảm bảo `schema.prisma` khớp hoàn toàn với code React.

4. **Data Fetching Strategy**:
   - Dùng `supabase-js` + `React Query` để fetch data trực tiếp (tận dụng RLS).

5. **Security**:
   - RLS (Row Level Security) vẫn là lớp bảo mật chính.
   - Dù dùng Prisma để migrate, hãy nhớ viết policy RLS trên Supabase Dashboard hoặc qua migration SQL riêng.
