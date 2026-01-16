# Kế Hoạch Phát Triển Dự Án "My Quizz"

## 1. Mục Tiêu Dự Án

Xây dựng ứng dụng Quiz platform với hai mục tiêu chính:

1.  **Phase 1**: Phục vụ nhu cầu cá nhân (Tạo đề, Thi thử, Xem kết quả).
2.  **Phase 2**: Mở rộng thành Mini Game Realtime (Nhiều người chơi cùng lúc, đua top).

## 2. Roadmap Chi Tiết

### Phase 1: Personal Practice Platform (MVP)

**Mục tiêu**: Xây dựng nền tảng vững chắc, db schema chuẩn, và luồng thi cơ bản.

- **Module 1.1: Project Setup & Authentication**
  - [x] Khởi tạo dự án React Router v7 + Vite.
  - [x] Cấu hình TailwindCSS + CN (shadcn/ui compatible utils).
  - [x] Setup Supabase Project & Prisma Schema ban đầu.
  - [x] Trang chủ (Welcome Page).
  - [x] Chức năng Đăng ký / Đăng nhập (Google OAuth & Email).
  - [x] Bảo vệ Route (Private Routes).
  - [ ] Thiết lập RLS Policies cho User ownership (Resource-based Authorization).
  - [ ] Generate Supabase Types từ Prisma Schema.

- **Module 1.2: Quiz Management (CRUD)**
  - [ ] Database Schema cho `Quiz` và `Question`.
  - [ ] Giao diện tạo bộ đề mới.
  - [ ] Giao diện thêm/sửa/xóa câu hỏi (Multiple choice).
  - [ ] Upload ảnh cho câu hỏi (Optional - dùng Supabase Storage).
  - [ ] Validation logic (Tối thiểu 1 câu hỏi, phải có đáp án đúng).
  - [ ] Preview Quiz trước khi publish.

- **Module 1.3: Taking Quiz (Exam Interface)**
  - [ ] Giao diện làm bài thi (Tương tác mượt mà, không load lại trang).
  - [ ] Logic tính điểm & đồng hồ đếm ngược.
  - [ ] Nộp bài và xem kết quả ngay lập tức.
  - [ ] Xử lý trường hợp hết giờ (Auto-submit).
  - [ ] Lưu progress (Tránh mất dữ liệu khi reload).
  - [ ] Prevent cheating (Disable copy/paste, F12 - Optional).

- **Module 1.4: History & Analytics**
  - [ ] Lưu lịch sử làm bài (`Attempt`).
  - [ ] Trang thống kê cá nhân (Số bài đã làm, điểm trung bình).

- **Module 1.5: Testing & Deployment**
  - [ ] Unit tests cho logic tính điểm.
  - [ ] Integration tests cho Quiz flow.
  - [ ] Setup CI/CD (GitHub Actions + Vercel/Netlify).
  - [ ] Environment variables management.
  - [ ] Error tracking (Sentry - Optional).

### Phase 2: Realtime Multiplayer Minigame

**Mục tiêu**: Ứng dụng Supabase Realtime để làm game đua top.

- **Module 2.1: Realtime Infrastructure**
  - [ ] Nghiên cứu & Demo POC với Supabase Realtime (Presence & Broadcast).
  - [ ] Schema cho `Room`, `GameSession`, `PlayerState`.
  - [ ] Xử lý disconnect/reconnect của người chơi.
  - [ ] Sync state khi người chơi join giữa chừng.
  - [ ] Cleanup Room khi tất cả người chơi rời đi.

- **Module 2.2: Lobby System**
  - [ ] Tạo phòng (Host).
  - [ ] Tham gia phòng (qua mã/link).
  - [ ] Sảnh chờ (Lobby) hiển thị danh sách người chơi realtime.

- **Module 2.3: Gameplay Loop**
  - [ ] Host bắt đầu game -> Đồng bộ chuyển câu hỏi cho tất cả.
  - [ ] Người chơi trả lời -> Gửi kết quả về server.
  - [ ] Server (hoặc Host logic) tính điểm và cập nhật Leaderboard realtime.
  - [ ] Kết thúc game & Trao giải.

## 3. Chiến Lược Phát Triển

- **Mobile First**: Giao diện tối ưu cho điện thoại.
- **Supabase Centric**: Tận dụng tối đa Auth, DB, Realtime của Supabase.
- **Strict Typing**: Dùng TypeScript chặt chẽ, generate types tự động từ DB.

---

_Tài liệu này sẽ được cập nhật liên tục trong quá trình phát triển._
