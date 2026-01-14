# Quy trình làm việc với Prisma & Database Schema

Tài liệu này hướng dẫn quy trình tiêu chuẩn khi làm việc với Database (Supabase) thông qua Prisma trong dự án.

## 1. Nguyên tắc cốt lõi (Core Principles)

1.  **Source of Truth**: File `schema.prisma` là nguồn duy nhất định nghĩa cấu trúc database.
2.  **No Dashboard Edits**: **KHÔNG** sửa, thêm, xóa bảng hoặc cột trực tiếp trên Supabase Dashboard. Mọi thay đổi DB phải bắt đầu từ code.
3.  **Sync Types**: Sau khi sửa DB, phải cập nhật ngay Typescript types (cho Supabase client).

## 2. Quy trình Cập nhật Schema (Workflow)

Khi bạn cần thay đổi cấu trúc dữ liệu (vd: thêm bảng mới, thêm trường vào bảng existing):

### Bước 1: Chỉnh sửa `schema.prisma`

Mở file `prisma/schema.prisma` và thực hiện thay đổi.

```prisma
// Ví dụ: Thêm trường phone vào model User
model User {
  // ... các trường cũ
  phone String?
}
```

### Bước 2: Tạo Migration & Apply

Sử dụng lệnh `prisma migrate dev` để sinh ra file migration SQL và áp dụng ngay lập tức vào database development.

```bash
npx prisma migrate dev --name <mô_tả_ngắn_gọn>
```

**Ví dụ:**

```bash
npx prisma migrate dev --name add_phone_to_user
```

> **Lưu ý**: Lệnh này sẽ tự động chạy `prisma generate` để cập nhật Prisma Client.

### Bước 3: Cập nhật Type cho Supabase (Frontend)

Đây là bước **BẮT BUỘC** để Frontend nhận biết được thay đổi mới.

Chạy lệnh sau để generate lại file types từ schema thực tế trên Supabase:

```bash
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" > src/types/supabase.ts
```

_(Thay `$SUPABASE_PROJECT_ID` bằng project ID thực tế hoặc đảm bảo biến môi trường đã được set)._

## 3. Quy định về Data Access

### Client-side (Frontend / React Components)

- **Sử dụng**: `supabase-js` client kết hợp `React Query`.
- **Bảo mật**: Dựa vào **RLS (Row Level Security)** trên database.
- **Tuyệt đối không**: Import `PrismaClient` trực tiếp vào component React.

### Server-side (Scripts / Edge Functions / API)

- **Sử dụng**: `PrismaClient` (biến `db` từ lib) nếu cần quyền truy cập trực tiếp hoặc các query phức tạp.
- **Lưu ý**: Prisma Client thường bypass RLS, hãy cẩn thận khi dùng.

## 4. Bảo mật (Security)

- Khi tạo bảng mới trong `schema.prisma`, đừng quên vào Supabase Dashboard hoặc viết migration SQL để **Enable RLS** và thêm **RLS Policies**.
- Prisma không tự động quản lý RLS policies, bạn phải tự định nghĩa chúng cho các bảng mới.

## 5. Troubleshooting Common Issues

- **Lỗi lệch migration**: Nếu database local nát quá hoặc conflict migration, dùng lệnh reset (Cẩn thận: mất data local!):
  ```bash
  npx prisma migrate reset
  ```
