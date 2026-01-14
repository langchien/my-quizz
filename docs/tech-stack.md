# Công Nghệ & Thư Viện Sử Dụng (Tech Stack)

## 1. Core Framework

- **Runtime**: Node.js (Development), React (Browser).
- **Framework**: **React Router v7** (Framework Mode).
  - Khởi tạo bằng: `npx create-react-router@latest`.
  - Sử dụng tính năng SSR/SPA hybrid, loaders, actions, routes config file.
- **Language**: **TypeScript** (Strict mode).
- **Build Tool**: Vite (được tích hợp sẵn).

## 2. Backend & Database (BaaS)

- **Platform**: **Supabase**.
- **Database**: PostgreSQL.
- **Authentication**: Supabase Auth (Email/Password + Google).
- **Realtime**: Supabase Realtime (Channels, Broadcast, Presence).
- **Schema Management**: **Prisma ORM**.
  - **Chỉ dùng để**: Định nghĩa model (`schema.prisma`) và chạy migration (`prisma migrate dev`).
  - **Tuyệt đối không**: Sử dụng Prisma Client (`db`) trong code sản phẩm (Runtime). Mọi thao tác thêm/sửa/xóa/lấy dữ liệu phải dùng **Supabase SDK**.

## 3. Frontend Libraries

### UI & Styling

- **TailwindCSS**: Styling framework chính.
- **Shadcn/UI**: Thư viện UI Component chính (ưu tiên sử dụng).
- **clsx / tailwind-merge**: Tiện ích xử lý class name động.
- **Lucide React**: Icon set.

### State Management & Data Fetching

- **TanStack Query (React Query)**: Quản lý Server State (cache, loading, error, refetch).
- **Supabase JS Client**: SDK kết nối DB & Auth.
- **Zustand**: Quản lý Global Client State chính (Theme, Auth Session, Game State).
- **React Context**: Hạn chế dùng, chỉ dùng cho Provider thư viện nếu cần thiết.

### Form Handling

- **React Hook Form**: Quản lý form (Login, Create Quiz) hiệu năng cao.
- **Zod**: Validation schema (kết hợp tốt với React Hook Form và backend validation).

## 4. Dev Tools

- **ESLint + Prettier**: Linter & Formatter.
- **Git**: Version control.

---

## 5. Quy Trình Phát Triển Module

Mỗi module (chức năng) sẽ đi theo quy trình:

1.  **Database**: Định nghĩa Schema trong Prisma -> Migrate.
2.  **Type**: Generate lại Type cho Supabase.
3.  **UI/UX**: Dựng giao diện tĩnh (Mockup).
4.  **Integration**: Viết hook (React Query) kết nối Supabase.
5.  **Logic**: Xử lý nghiệp vụ.
6.  **Test**: Tự test luồng cơ bản.
