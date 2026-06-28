# TÀI LIỆU PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG (SAD)

**Tên dự án:** My-Quizz (Nền tảng Quiz tương tác cho Người dùng & Người chơi)
**Tham chiếu:** [Wayground (Quizizz)](https://wayground.com/?lng=vi)
**Phiên bản tài liệu:** 1.0
**Ngày cập nhật:** 28/06/2025

> **Cách dùng checklist:** Đánh dấu `- [x]` khi hoàn thành mục tương ứng. Mỗi mục con nên được tích chỉ khi nội dung/tính năng đã xong và (nếu có) đã kiểm thử cơ bản.

---

## TIẾN ĐỘ TỔNG QUAN

| Phần | Mô tả                    | Trạng thái |
| ---- | ------------------------ | ---------- |
| 1    | Tổng quan dự án          | - [ ]      |
| 2    | Đặc tả yêu cầu           | - [ ]      |
| 3    | Phân tích hệ thống       | - [ ]      |
| 4    | Thiết kế hệ thống        | - [ ]      |
| 5    | Kiểm thử & triển khai    | - [ ]      |
| 6    | Checklist triển khai MVP | - [ ]      |

---

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

_Mục đích: xác định bối cảnh, phạm vi và mục tiêu của nền tảng quiz tương tự Wayground._

- [ ] **Hoàn thành toàn bộ Phần 1**

### 1.1. Bối cảnh và Mục tiêu

- [ ] **Bối cảnh:** Người dùng cần công cụ tạo bài kiểm tra tương tác, theo dõi kết quả người chơi thay vì bài trắc nghiệm giấy/Excel tĩnh.
- [ ] **Mục tiêu chính:**
  - [ ] Người dùng tạo và quản lý quiz (câu hỏi trắc nghiệm, thời gian, điểm).
  - [ ] Người chơi tham gia quiz qua mã phòng hoặc link — không cần đăng ký phức tạp (MVP).
  - [ ] Hiển thị kết quả, bảng xếp hạng sau mỗi phiên chơi.
  - [ ] Giao diện thân thiện, responsive trên máy tính và điện thoại.

### 1.2. Khảo sát hiện trạng (AS-IS)

- [ ] **Tài liệu/thực trạng đã khảo sát:**
  - [ ] Quy trình người dùng ra đề và chấm điểm hiện tại.
  - [ ] Công cụ đang dùng (Google Form, Kahoot, Wayground, giấy,...).
- [ ] **Pain-points đã ghi nhận:**
  - [ ] Tạo đề mất thời gian, khó tái sử dụng câu hỏi.
  - [ ] Người chơi thiếu hứng thú với bài kiểm tra truyền thống.
  - [ ] Khó theo dõi tiến độ từng người chơi theo thời gian thực.

### 1.3. Phạm vi hệ thống (Scope)

- [ ] **Trong phạm vi MVP (Phiên bản cơ bản):**
  - [ ] Đăng ký / đăng nhập người dùng.
  - [ ] CRUD quiz và câu hỏi (trắc nghiệm một đáp án).
  - [ ] Tạo phiên chơi (Live hoặc Solo) với mã rút gọn (Chữ + Số).
  - [ ] Người chơi tham gia bằng tên + mã phòng.
  - [ ] **Hai chế độ chơi cốt lõi (Core Features):**
    - **1. Thi đấu Live (Real-time):** Chơi đồng loạt, có màn hình Host điều khiển, thi đua trực tiếp.
    - **2. Tự luyện (Solo / Async):** Người chơi làm bài theo nhịp độ cá nhân (Giao bài tập về nhà / Luyện tập).
  - [ ] Màn hình kết quả và leaderboard sau phiên.
  - [ ] Lịch sử phiên chơi cho người dùng.

- [ ] **Ngoài phạm vi MVP (Giai đoạn sau):**
  - [ ] AI sinh câu hỏi tự động.
  - [ ] Thư viện quiz cộng đồng.
  - [ ] Tích hợp Google Classroom / SSO (Google, Clever).
  - [ ] Nhiều loại câu hỏi (kéo thả, điền khuyết, tự luận).
  - [ ] Accommodations (điều chỉnh riêng cho từng người chơi).
  - [ ] Ứng dụng mobile native (iOS/Android).

---

## 2. ĐẶC TẢ YÊU CẦU HỆ THỐNG (SYSTEM REQUIREMENTS)

_Chuyển đổi nghiệp vụ quiz platform thành yêu cầu phần mềm._

- [ ] **Hoàn thành toàn bộ Phần 2**

### 2.1. Xác định tác nhân (Actors)

- [ ] **Người dùng (User):** Tạo tài khoản, quiz, phòng chơi; xem báo cáo.
- [ ] **Người chơi (Guest):** Tham gia phòng bằng mã, làm bài, xem điểm cá nhân.
- [ ] **Quản trị viên (Admin)** _(tùy chọn MVP):_ Quản lý người dùng, nội dung vi phạm.
- [ ] **Hệ thống ngoại vi** _(giai đoạn sau):_ Email (xác thực), OAuth (Google).

### 2.2. Biểu đồ Use Case (Use Case Diagrams)

- [ ] **Use Case tổng quan** đã vẽ (Người dùng / Người chơi / Admin).
- [ ] **Use Case phân rã — Quản lý Quiz:**
  - [ ] Tạo quiz mới.
  - [ ] Thêm/sửa/xóa câu hỏi.
  - [ ] Xuất bản / lưu nháp quiz.
- [ ] **Use Case phân rã — Phiên chơi Live:**
  - [ ] Host mở phòng (generate mã).
  - [ ] Người chơi join phòng.
  - [ ] Host bắt đầu câu hỏi.
  - [ ] Người chơi trả lời trong thời gian quy định.
  - [ ] Hiển thị kết quả & leaderboard.

### 2.3. Đặc tả Use Case chi tiết

- [ ] **UC-01: Đăng ký / Đăng nhập người dùng**
  - [ ] Tiền điều kiện, luồng chính, luồng ngoại lệ, hậu điều kiện.

- [ ] **UC-02: Tạo và chỉnh sửa Quiz**
  - [ ] Tiền điều kiện, luồng chính, luồng ngoại lệ, hậu điều kiện.

- [ ] **UC-03: Host phiên Live Quiz**
  - [ ] Tiền điều kiện, luồng chính, luồng ngoại lệ, hậu điều kiện.

- [ ] **UC-04: Người chơi tham gia và làm bài**
  - [ ] Tiền điều kiện, luồng chính, luồng ngoại lệ, hậu điều kiện.

- [ ] **UC-05: Xem kết quả & báo cáo**
  - [ ] Tiền điều kiện, luồng chính, luồng ngoại lệ, hậu điều kiện.

### 2.4. Yêu cầu phi chức năng (Non-functional Requirements)

- [ ] **Hiệu năng:** Phản hồi API < 500ms; hỗ trợ ≥ 50 người chơi/phòng đồng thời (MVP).
- [ ] **Bảo mật:** Hash mật khẩu (bcrypt/argon2); JWT/session; phân quyền User/Guest.
- [ ] **Usability:** Responsive; hỗ trợ Chrome, Firefox, Edge; UI rõ ràng cho lớp học.
- [ ] **Real-time:** WebSocket/Socket.IO cho cập nhật phòng chơi và leaderboard.
- [ ] **Độ tin cậy:** Uptime mục tiêu 99% (production).

---

## 3. PHÂN TÍCH HỆ THỐNG (SYSTEM ANALYSIS)

_Phân rã yêu cầu quiz platform thành luồng nghiệp vụ và thực thể dữ liệu._

- [ ] **Hoàn thành toàn bộ Phần 3**

### 3.1. Biểu đồ hoạt động và Phân cấp chức năng

- [ ] **BFD (Phân cấp chức năng)** đã vẽ:
  - [ ] Quản lý người dùng.
  - [ ] Quản lý Quiz & Câu hỏi.
  - [ ] Quản lý Phiên chơi (Session/Room).
  - [ ] Báo cáo & Thống kê.

- [ ] **Activity Diagram** đã vẽ:
  - [ ] Luồng Host mở phòng → người chơi join → chơi → kết thúc.
  - [ ] Luồng Tạo quiz → thêm câu hỏi → lưu.

### 3.2. Biểu đồ trình tự (Sequence Diagram)

- [ ] **Sequence: Người chơi join phòng** (Client → API → DB → WebSocket broadcast).
- [ ] **Sequence: Nộp đáp án** (Client → API → tính điểm → cập nhật leaderboard).
- [ ] **Sequence: Host chuyển câu hỏi tiếp theo.**

### 3.3. Mô hình thực thể liên kết (ERD)

- [ ] **ERD tổng quan** đã vẽ và thống nhất.
- [ ] **Thực thể chính đã xác định:**
  - [ ] `User` (người dùng).
  - [ ] `Quiz` (tiêu đề, mô tả, trạng thái draft/published).
  - [ ] `Question` (nội dung, thời gian, điểm).
  - [ ] `AnswerOption` (đáp án, isCorrect).
  - [ ] `GameSession` / `Room` (mã phòng, quizId, trạng thái).
  - [ ] `Participant` (tên hiển thị, sessionId).
  - [ ] `PlayerAnswer` (participantId, questionId, đáp án, điểm, thời gian).

### 3.4. Logic Game & Xử lý Ngoại lệ (Game Rules & Exceptions)

- [ ] **Tính điểm (Gợi ý công thức):** Điểm dựa trên độ chính xác và tốc độ.
  - _Công thức tham khảo:_ `Điểm = Điểm_cơ_bản + (Điểm_thưởng * (Thời_gian_còn_lại / Tổng_thời_gian))`
  - _Ví dụ:_ Max 1000 điểm/câu (500 điểm đúng mặc định + max 500 điểm tốc độ). Trả lời sai nhận 0 điểm.
- [ ] **Mã phòng (Room Code):** Chữ + số ngẫu nhiên, ngắn gọn (VD: `A8X2N`).
- [ ] **Hiển thị Bảng xếp hạng:** Chỉ hiển thị **Top 3** người điểm cao nhất để giao diện gọn gàng.
- [ ] **Tính năng riêng cho chế độ Solo (Tự luyện):**
  - **Tuỳ chỉnh:** Cho phép tắt đếm ngược thời gian, xáo trộn câu hỏi, xáo trộn đáp án.
  - **Chuỗi (Streak Bonus):** Trả lời đúng liên tiếp để nhân hệ số điểm (hoặc cộng thêm hiệu ứng lửa cháy), tạo cảm giác cuốn hút.
  - **Câu hỏi cứu mạng (Redemption):** Khi làm xong, người chơi được trao cơ hội làm lại 1-2 câu đã sai để gỡ điểm.
  - **Flashcard Mode:** Cho phép lướt xem lại lý thuyết/đáp án chi tiết ngay sau khi hoàn thành.
- [ ] **Xử lý Ngoại lệ (Vào trễ / Tạm dừng / Rớt mạng):**
  - **Thi đấu Live (Vào trễ):** Người chơi được phép nhập mã join phòng khi trò chơi đang diễn ra (chỉ bắt đầu từ câu hiện tại).
  - **Tự luyện Solo (Tạm dừng):** Người chơi có thể thoát ra giữa chừng, lần sau nhập đúng mã phòng sẽ được Resume làm tiếp phần còn lại (Lưu state vào DB hoặc LocalStorage).
  - **Rớt mạng:** Tự động map session qua `localStorage` (hoặc Mã phòng + Tên cũ) để khôi phục tiến độ mà không bị tính là thoát game.

---

## 4. THIẾT KẾ HỆ THỐNG (SYSTEM DESIGN)

_Bản thiết kế kỹ thuật để triển khai code._

- [ ] **Hoàn thành toàn bộ Phần 4**

### 4.1. Thiết kế Kiến trúc (Architecture Design)

- [ ] **Kiến trúc đã chọn:** Client-only kết nối trực tiếp BaaS (Backend-as-a-Service). Code áp dụng cấu trúc **Repository Pattern** để đảm bảo khả năng mở rộng/đổi backend (sang NestJS) sau này mà không sửa UI (đã quy định trong AGENTS.md).
- [ ] **Stack công nghệ MVP đã chốt:**
  - [ ] **Frontend:** ReactJS + React Router (Data mode).
  - [ ] **UI Kit & Styling:** shadcn/ui + Tailwind CSS.
  - [ ] **Backend, Database & Auth:** Firebase (Firestore, Firebase Auth).
  - [ ] **Real-time State Management:** Firebase Firestore Realtime Listeners (`onSnapshot`).
- [ ] **Component Diagram:** Vẽ luồng: React Components → Custom Hooks → Services (Tính toán/Logic) → Repositories (Gọi Firebase).

### 4.2. Thiết kế Cơ sở dữ liệu (Database Design)

- [ ] **Schema vật lý** đã viết (bảng, cột, kiểu dữ liệu).
- [ ] **Ràng buộc:** Primary key, Foreign key, NOT NULL, UNIQUE (email, roomCode).
- [ ] **Index:** quizId, sessionId, roomCode.
- [ ] **Migration** đã tạo và chạy thành công trên môi trường Dev.

### 4.3. Thiết kế Lớp & API (Class & API Design)

- [ ] **Class Diagram** _(hoặc module diagram)_ cho các service chính.
- [ ] **API REST đã đặc tả:**

| #   | Method | Endpoint                     | Mô tả                        | Done  |
| --- | ------ | ---------------------------- | ---------------------------- | ----- |
| 1   | POST   | `/api/auth/register`         | Đăng ký người dùng            | - [ ] |
| 2   | POST   | `/api/auth/login`            | Đăng nhập                    | - [ ] |
| 3   | GET    | `/api/quizzes`               | Danh sách quiz của người dùng | - [ ] |
| 4   | POST   | `/api/quizzes`               | Tạo quiz                     | - [ ] |
| 5   | PUT    | `/api/quizzes/:id`           | Cập nhật quiz                | - [ ] |
| 6   | DELETE | `/api/quizzes/:id`           | Xóa quiz                     | - [ ] |
| 7   | POST   | `/api/quizzes/:id/questions` | Thêm câu hỏi                 | - [ ] |
| 8   | POST   | `/api/sessions`              | Tạo phòng chơi (host)        | - [ ] |
| 9   | POST   | `/api/sessions/join`         | Người chơi join bằng mã        | - [ ] |
| 10  | GET    | `/api/sessions/:id/results`  | Kết quả phiên chơi           | - [ ] |

- [ ] **WebSocket Events đã đặc tả:**

| Event                  | Hướng | Mô tả                         | Done  |
| ---------------------- | ----- | ----------------------------- | ----- |
| `room:player-joined`   | S→C   | Người chơi mới vào phòng        | - [ ] |
| `room:start-question`  | S→C   | Bắt đầu câu hỏi               | - [ ] |
| `room:submit-answer`   | C→S   | Người chơi nộp đáp án           | - [ ] |
| `room:question-result` | S→C   | Kết quả câu hỏi + leaderboard | - [ ] |
| `room:game-finished`   | S→C   | Kết thúc phiên                | - [ ] |

### 4.4. Thiết kế Giao diện (UI/UX Mockups)

- [ ] **UI Kit:** Không dựng mockup chi tiết từ đầu, hệ thống sẽ được xây dựng và tuỳ biến trực tiếp qua các component của **shadcn/ui**.
- [ ] **Screen Flow** đã phác thảo (Landing → Login → Dashboard → ...).
- [ ] **Màn hình cần xây dựng:**
  - [ ] Trang chủ / Landing.
  - [ ] Đăng nhập / Đăng ký người dùng.
  - [ ] Dashboard người dùng (danh sách quiz).
  - [ ] Trang tạo/sửa Quiz.
  - [ ] Trang Host — Lobby chờ người chơi.
  - [ ] Trang Host — Đang chơi (điều khiển câu hỏi).
  - [ ] Trang Người chơi — Nhập mã phòng + tên.
  - [ ] Trang Người chơi — Chơi quiz.
  - [ ] Trang Kết quả / Leaderboard.
  - [ ] Trang Lịch sử phiên (người dùng).

---

## 5. KẾ HOẠCH TRIỂN KHAI VÀ KIỂM THỬ (DEPLOYMENT & TEST PLAN)

- [ ] **Hoàn thành toàn bộ Phần 5**

### 5.1. Chiến lược Kiểm thử (Test Strategy)

- [ ] **Unit Test:** Service tính điểm, validation, auth.
- [ ] **Integration Test:** API CRUD quiz, join room.
- [ ] **E2E / Manual Test:** Luồng host → 2+ người chơi join → chơi hết → xem kết quả.
- [ ] **Test Cases** đã viết theo UC-01 → UC-05.

### 5.2. Yêu cầu Môi trường & Triển khai (Free Tier)

- [ ] **Frontend Hosting:** Triển khai trên **Vercel** (Miễn phí, cấu hình zero-config cho React/Vite, tự động CI/CD khi push code lên GitHub).
- [ ] **Backend & Database:** **Firebase Spark Plan** (Gói Miễn phí cực rộng rãi: 50k reads/day, 20k writes/day, 1GB storage - dư dả cho MVP).
- [ ] **Biến môi trường** (`.env.example`) đã tạo: Các config kết nối Firebase (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`,...).
- [ ] **Môi trường Dev:** Chạy local (`npm run dev`) trỏ trực tiếp đến DB Firebase dự án Dev.

---

## 6. CHECKLIST TRIỂN KHAI MVP (THEO THỨ TỰ CODE)

_Checklist thực thi — tích từng mục khi code xong và chạy được._

- [ ] **Hoàn thành toàn bộ MVP**

### 6.1. Khởi tạo dự án

- [ ] Tạo repo và cấu trúc thư mục (frontend / backend / docs).
- [ ] Cài đặt dependencies (package.json, lock file).
- [ ] Cấu hình ESLint / Prettier / Git ignore.
- [ ] README hướng dẫn chạy local.

### 6.2. Backend — Nền tảng

- [ ] Khởi tạo server (Express/NestJS).
- [ ] Kết nối database + migration/schema.
- [ ] Middleware: CORS, JSON parser, error handler.
- [ ] Auth: Register, Login, JWT middleware.
- [ ] Model/Schema: User, Quiz, Question, AnswerOption.

### 6.3. Backend — Quiz CRUD

- [ ] API tạo/sửa/xóa/lấy danh sách Quiz.
- [ ] API thêm/sửa/xóa Câu hỏi và Đáp án.
- [ ] Validation dữ liệu đầu vào (tiêu đề, ≥2 đáp án, đúng 1 đáp án đúng).
- [ ] Phân quyền: chỉ owner quiz mới được sửa/xóa.

### 6.4. Backend — Phiên chơi Real-time

- [ ] Model: GameSession, Participant, PlayerAnswer.
- [ ] API tạo phòng (sinh mã 6 ký tự unique).
- [ ] API join phòng (tên hiển thị + mã).
- [ ] Socket.IO: join room, broadcast danh sách người chơi.
- [ ] Socket.IO: host start question → gửi câu hỏi cho client.
- [ ] Socket.IO: nhận đáp án → tính điểm (đúng + bonus thời gian).
- [ ] Socket.IO: kết thúc câu hỏi → gửi leaderboard.
- [ ] Socket.IO: kết thúc game → lưu kết quả.

### 6.5. Frontend — Auth & Dashboard

- [ ] Trang Login / Register.
- [ ] Lưu token, protected routes.
- [ ] Dashboard: danh sách quiz (tạo mới, sửa, xóa, nút "Host").

### 6.6. Frontend — Tạo Quiz

- [ ] Form tạo/sửa quiz (tiêu đề, mô tả).
- [ ] UI thêm câu hỏi trắc nghiệm (nội dung, thời gian, các đáp án).
- [ ] Đánh dấu đáp án đúng; preview quiz.

### 6.7. Frontend — Host Live Game

- [ ] Màn hình lobby: hiển thị mã phòng, QR _(tùy chọn)_, danh sách người chơi.
- [ ] Nút "Bắt đầu" → chuyển sang màn hình điều khiển.
- [ ] Hiển thị câu hỏi hiện tại, số người đã trả lời, bảng xếp hạng.
- [ ] Nút "Câu tiếp theo" / "Kết thúc".

### 6.8. Frontend — Người chơi chơi Quiz (Live & Solo)

- [ ] Trang nhập mã phòng + tên (không cần đăng nhập).
- [ ] **Luồng Live:** Màn hình chờ host → Chơi theo nhịp của host → Xem bảng xếp hạng chung.
- [ ] **Luồng Solo:** Chơi theo nhịp cá nhân → Hỗ trợ Pause/Resume → Màn hình Redemption (Cứu mạng câu sai).
- [ ] Màn hình câu hỏi: timer đếm ngược, chọn đáp án, hiển thị feedback ngay lập tức (hiệu ứng đúng/sai, thông báo Streak).
- [ ] Màn hình kết quả cuối: Tổng điểm, hạng, tỷ lệ đúng/sai, và nút "Review (Flashcards)".

### 6.9. Hoàn thiện & Demo

- [ ] Responsive cơ bản (mobile + desktop).
- [ ] Xử lý lỗi thân thiện (mã phòng sai, hết thời gian, mất kết nối).
- [ ] Seed data demo (1 người dùng, 1 quiz mẫu).
- [ ] Demo end-to-end: 1 người dùng + ≥2 người chơi chơi thử.
- [ ] Ghi lại video/screenshot demo _(tùy chọn)_.

---

## GHI CHÚ & QUYẾT ĐỊNH THIẾT KẾ

_Ghi các quyết định quan trọng khi triển khai để tham chiếu sau này._

| Ngày | Quyết định | Lý do |
| ---- | ---------- | ----- |
|      |            |       |
|      |            |       |
