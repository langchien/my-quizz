---
description: Quy trình phát triển một module chức năng mới
---

# Quy Trình Phát Triển Module

Mỗi module (chức năng) trong dự án phải tuân thủ nghiêm ngặt quy trình 7 bước sau:

1.  **Database (Prisma)**
    - Định nghĩa hoặc cập nhật Schema trong `prisma/schema.prisma`.
    - Chạy migration: `npx prisma migrate dev --name <ten_thay_doi>`.
    - **Lưu ý**: Chỉ dùng Prisma ở bước này.

2.  **Type Sync (Supabase)**
    - Update type cho Frontend để đồng bộ với DB.
    - Chạy: `npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" > app/types/supabase.ts` (hoặc lệnh tương tự trong `package.json`).

3.  **UI/UX (Shadcn/UI + Tailwind)**
    - Dựng giao diện tĩnh (Mockup) sử dụng Shadcn/UI components.
    - Đảm bảo Responsive Mobile-First.

4.  **Integration (React Query + Supabase SDK)**
    - Viết Custom Hook (vd: `useQuizList`, `useCreateQuiz`) trong folder `app/features/<module>/api/`.
    - Sử dụng `supabase-js` để gọi API (có RLS).
    - Dùng React Query để cache và quản lý trạng thái loading/error.

5.  **State Management (Zustand)**
    - Nếu có state phức tạp (vd: danh sách câu trả lời đang chọn, form wizard), dùng Zustand store.

6.  **Logic & Testing**
    - Ráp API vào UI.
    - Tự test luồng cơ bản (Happy Case & Error Case).
    - (Optional) Viết Unit Test nếu logic phức tạp.

7.  **Organization & Promotion (Tổ chức code)**
    - **Feature Isolation**: Mọi thứ (components, hooks, utils) chỉ dùng cho module thì để trong `app/features/<module>/`.
    - **Promotion Rule**: Khi một thành phần được sử dụng bởi **2 features trở lên**, hãy tách nó ra:
      - UI Components -> `app/components/ui` hoặc `app/components/common`.
      - Hooks/Utils -> `app/hooks` hoặc `app/lib`.
    - **No Cross-Feature Imports**: Tránh import trực tiếp từ feature này sang feature khác (Circular Dependency). Hãy đẩy phần chung xuống `app/components` hoặc `app/lib`.
