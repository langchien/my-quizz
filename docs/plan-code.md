# KẾ HOẠCH TRIỂN KHAI CODE (CODE IMPLEMENTATION PLAN)

Dự án: **My-Quizz** (Nền tảng Quiz tương tác)
Tham chiếu thiết kế: [Phan_Tich_Thiet_Ke_He_Thong.md](file:///p:/Nodejs/my-quizz/docs/Phan_Tich_Thiet_Ke_He_Thong.md)
Kiến trúc: **Repository Pattern** để dễ dàng chuyển đổi Backend/Database sau này.

---

## KIẾN TRÚC MỤC TIÊU (DIRECTORY STRUCTURE)

Để đảm bảo UI độc lập với Firebase, cấu trúc code trong `client/src/` được quy định như sau:

```text
client/src/
  types/           # Domain types thuần (Quiz, Question, Room, Participant, PlayerAnswer...) - KHÔNG import firebase
  services/        # Interfaces + Business Logic (authService, quizService, roomService)
  repositories/    # Triển khai interface gọi Firebase (firebaseAuthRepository, firebaseQuizRepository...)
  hooks/           # Custom hooks kết nối Services với Components (useAuth, useQuizzes, useLiveRoom, useSoloRoom)
  routes/          # React Router cấu hình định tuyến UI
  components/      # UI Components (Presentational) + Shadcn UI
    ui/            # Shadcn UI components (button, input, dialog, toast...)
  lib/
    firebase.ts    # Khởi tạo Firebase SDK (chỗ duy nhất import firebase app)
```

---

## TIẾN ĐỘ & KẾ HOẠCH CHI TIẾT (CHECKLIST)

### PHẦN 1: THIẾT LẬP NỀN TẢNG (FOUNDATION & CORE SETUP)

- [x] **1.1. Cấu hình Firebase Console**
  - [x] Tạo project Firebase (ví dụ: `my-quizz-dev`).
  - [x] Bật Firebase Authentication (Email/Password).
  - [x] Bật Firestore Database (chọn chế độ test/mở rule đọc ghi cho môi trường phát triển).
- [x] **1.2. Khởi tạo & Cài đặt Thư viện phía Client**
  - [x] Cài đặt firebase SDK: `npm install firebase` trong thư mục `client`.
  - [x] Cài đặt Lucide React để dùng icons: `npm install lucide-react`.
  - [x] Cài đặt React Router DOM: `npm install react-router-dom`.
- [x] **1.3. Cấu hình Firebase Connection**
  - [x] Tạo file `.env` và `.env.example` chứa thông tin kết nối Firebase.
  - [x] Tạo file [firebase.ts](file:///p:/Nodejs/my-quizz/client/src/lib/firebase.ts) khởi tạo Firebase App, Auth, và Firestore.
- [x] **1.4. Định nghĩa Domain Types (client/src/types)**
  - [x] Tạo file `user.ts` (User profile).
  - [x] Tạo file `quiz.ts` (Quiz, Question, AnswerOption).
  - [x] Tạo file `room.ts` (GameSession/Room, Participant, PlayerAnswer, Leaderboard).

---

### PHẦN 2: THÀNH PHẦN AUTHENTICATION & ROUTING

- [x] **2.1. Thiết kế Repository & Service cho Auth**
  - [x] Định nghĩa `IAuthRepository` interface.
  - [x] Triển khai `FirebaseAuthRepository` sử dụng Firebase Auth.
  - [x] Tạo `authService` điều phối logic đăng nhập, đăng ký, đăng xuất.
- [x] **2.2. Viết Custom Hook `useAuth`**
  - [x] Quản lý trạng thái đăng nhập toàn cục (`currentUser`, `loading`).
- [x] **2.3. Cấu hình React Router & Layout**
  - [x] Tạo các trang: `/login`, `/register`, `/dashboard`.
  - [x] Thiết lập `ProtectedRoute` để bảo vệ các trang yêu cầu đăng nhập.
- [x] **2.4. Phát triển Giao diện Đăng ký / Đăng nhập (Shadcn + Premium CSS)**
  - [x] Giao diện Glassmorphism cực đẹp, hiệu ứng background gradient chuyển động mượt mà.

---

### PHẦN 3: CRUD QUIZ & CÂU HỎI (DASHBOARD)

- [x] **3.1. Thiết kế Repository & Service cho Quiz**
  - [x] Định nghĩa `IQuizRepository` interface.
  - [x] Triển khai `FirebaseQuizRepository` kết nối Firestore (`quizzes` collection).
  - [x] Tạo `quizService` xử lý CRUD nghiệp vụ.
- [x] **3.2. Viết Custom Hook `useQuizzes`**
  - [x] Quản lý danh sách quiz của user đăng nhập, tải dữ liệu, xử lý lỗi.
- [x] **3.3. Phát triển UI Dashboard**
  - [x] Giao diện danh sách Quiz với các thẻ (cards) hiển thị số lượng câu hỏi, thời gian, nút bắt đầu Host game (Live hoặc Solo).
  - [x] Chức năng xóa quiz với modal confirm của Shadcn UI.
- [x] **3.4. Phát triển UI Tạo và Chỉnh sửa Quiz**
  - [x] Form nhập thông tin Quiz (Tiêu đề, mô tả).
  - [x] UI thêm/sửa/xóa câu hỏi trắc nghiệm: nhập câu hỏi, set thời gian (10s, 20s, 30s...), set điểm, định nghĩa 4 câu trả lời và đánh dấu đáp án đúng.

---

### PHẦN 4: CHẾ ĐỘ CHƠI LIVE (REAL-TIME GAME SESSION)

- [x] **4.1. Thiết kế Repository & Service cho Live Game**
  - [x] Định nghĩa `IRoomRepository` interface.
  - [x] Triển khai `FirebaseRoomRepository` sử dụng Firestore Real-time Listeners (`onSnapshot`) để lắng nghe sự thay đổi của phòng (`sessions`), danh sách người chơi (`participants`), và câu trả lời (`answers`).
  - [x] Tạo `roomService` xử lý logic game (tạo phòng, join phòng, cập nhật câu hỏi hiện tại, tính điểm).
- [x] **4.2. Viết Custom Hook `useLiveRoom`**
  - [x] Trạng thái đồng bộ real-time cho Host và Player.
- [x] **4.3. Phát triển UI phía Host (Người tổ chức)**
  - [x] **Màn hình Lobby Chờ:** Hiển thị mã phòng gồm 5-6 ký tự chữ + số ngẫu nhiên, danh sách người chơi tham gia real-time. Có nút "Bắt đầu".
  - [x] **Màn hình Câu hỏi đang diễn ra:** Hiển thị nội dung câu hỏi, đếm ngược thời gian, số lượng người chơi đã nộp bài. Nút "Kết thúc câu hỏi" hoặc tự động kết thúc khi hết giờ.
  - [x] **Màn hình Leaderboard câu hỏi:** Hiển thị top 3/5 người chơi điểm cao nhất sau câu hỏi đó kèm hiệu ứng hoạt họa tăng điểm.
  - [x] **Màn hình Kết thúc game:** Hiển thị bục vinh quang (Podium) vinh danh Top 3 người chơi thắng cuộc.
- [x] **4.4. Phát triển UI phía Player (Người chơi)**
  - [x] **Màn hình Vào phòng:** Nhập mã phòng và tên hiển thị (không cần tài khoản).
  - [x] **Màn hình Chờ Host bắt đầu:** Animation động tạo cảm giác hồi hộp.
  - [x] **Màn hình Trả lời:** Hiển thị 4 nút màu sắc lớn tương ứng 4 đáp án (hoặc hiển thị cả nội dung câu hỏi tùy thiết kế). Có thanh tiến trình đếm ngược.
  - [x] **Màn hình Phản hồi:** Hiển thị ngay lập tức kết quả Đúng/Sai, số điểm nhận được (tính theo công thức chính xác + tốc độ), và chuỗi trả lời đúng (Streak).

---

### PHẦN 5: CHẾ ĐỘ CHƠI SOLO (TỰ LUYỆN - ASYNC)

- [x] **5.1. Thiết kế logic Solo Play**
  - [x] Tạo `useSoloRoom` hook.
  - [x] Quản lý trạng thái làm bài lưu tạm vào Firestore (hoặc LocalStorage) để hỗ trợ Pause/Resume.
- [x] **5.2. Tính năng Redemption (Cứu mạng)**
  - [x] Ở cuối game Solo, lọc ra các câu trả lời sai và hiển thị cho người chơi làm lại 1-2 câu để cải thiện điểm số.
- [x] **5.3. Tính năng Review Flashcards**
  - [x] Sau khi kết thúc bài Solo, cho phép lướt qua các thẻ flashcard để xem câu hỏi, đáp án đã chọn và đáp án đúng kèm giải thích lý thuyết.

---

### PHẦN 6: LỊCH SỬ CHƠI & BÁO CÁO (REPORTS)

- [x] **6.1. Trang Lịch sử phiên (Cho Host)**
  - [x] Hiển thị danh sách các phiên chơi đã tổ chức trong quá khứ.
  - [x] Chi tiết từng phiên: danh sách người chơi, số câu đúng/sai của từng người, điểm tổng kết.
- [x] **6.2. Trang Lịch sử tự luyện (Cho Player)**
  - [x] Hiển thị lịch sử các bài Solo đã hoàn thành (lưu ở LocalStorage hoặc liên kết tài khoản nếu có đăng nhập).

---

> **Ghi chú:** Các phần dưới đây (7–11) được bổ sung từ phân tích chi tiết [Wayground](https://wayground.com) (cả trạng thái guest và đã đăng nhập), ngày 30/06/2025.

---

### PHẦN 7: CẢI TIẾN DASHBOARD & TRẢI NGHIỆM NGƯỜI DÙNG

> **Ưu tiên:** Cao — Dashboard là trang chính người dùng tương tác hàng ngày.

- [x] **7.1. Quiz Info Modal (Preview trước khi chơi)**
  - [x] Tạo component `QuizPreviewModal` hiển thị khi click vào quiz card.
  - [x] Hiển thị: thumbnail/ảnh bìa, tiêu đề, mô tả, số câu hỏi, lượt chơi, ngày tạo.
  - [x] 3 nút hành động: **Tự luyện (Practice)**, **Thách đấu bạn bè (Challenge Friends)**, **Host Live**.
  - [x] Nút **Chia sẻ (Share)** — copy link quiz.
  - [x] **Files:** `components/QuizPreviewModal.tsx` [NEW]

- [x] **7.2. Quiz Metadata mở rộng**
  - [x] Thêm fields vào `Quiz` type: `thumbnail`, `playCount`, `difficulty`, `category`.
  - [x] Hiển thị `playCount` (lượt chơi), `difficulty` (Dễ/Trung bình/Khó), `category` trên quiz card.
  - [x] Tự động tăng `playCount` mỗi khi có phiên chơi mới.
  - [x] **Files:** `types/quiz.ts` [MODIFY], `repositories/FirebaseQuizRepository.ts` [MODIFY]

- [x] **7.3. Sinh nickname ngẫu nhiên (Nickname Generator)**
  - [x] Tạo utility `generateNickname()` — tên tiếng Việt vui nhộn (ví dụ: "Hổ Vui Vẻ", "Mèo Thông Minh").
  - [x] Nút 🔄 bên cạnh ô nhập tên ở JoinRoom và Solo Setup.
  - [x] **Files:** `utils/nicknameGenerator.ts` [NEW], `pages/player/JoinRoom.tsx` [MODIFY]

- [x] **7.4. Activity Tabs (3 sub-tabs thay thế tab Lịch sử)**
  - [x] **Đang chơi (Running)**: Game đang dở dang (Solo chưa xong, Live đang diễn ra).
  - [x] **Đã hoàn thành (Completed)**: Lịch sử game đã kết thúc.
  - [x] **Đã tạo (Created)**: Danh sách quiz do user tạo.
  - [x] Empty state thân thiện với illustration + nút CTA (tham khảo Wayground).
  - [x] **Files:** `components/ActivityTabs.tsx` [NEW], `pages/dashboard/Dashboard.tsx` [MODIFY]

- [x] **7.5. Tìm kiếm Quiz công khai**
  - [x] Thanh search trên Dashboard — tìm quiz theo tiêu đề (`isPublished = true`).
  - [x] Kết quả hiển thị dạng grid cards với metadata.
  - [x] Filter theo category/difficulty.
  - [x] **Files:** `components/QuizSearch.tsx` [NEW], `repositories/IQuizRepository.ts` [MODIFY], `repositories/FirebaseQuizRepository.ts` [MODIFY]

---

### PHẦN 8: GAME SETUP & CẤU HÌNH TRƯỚC KHI CHƠI

> **Ưu tiên:** Cao — Wayground luôn có màn hình setup trước mỗi game.

- [x] **8.1. Màn hình Game Setup (Pre-game Configuration)**
  - [x] Tạo page `/solo/:quizId/setup` hiển thị trước khi vào game Solo.
  - [x] Hiển thị thông tin quiz (tên, số câu, tác giả) + nút Share.
  - [x] Nhập tên người chơi + nút sinh nickname ngẫu nhiên.
  - [x] Toggle settings: **Timer** (bật/tắt đếm ngược), **Xáo trộn câu hỏi**, **Xáo trộn đáp án**.
  - [x] Nút "Bắt đầu" để vào game.
  - [x] **Files:** `pages/solo/SoloSetup.tsx` [NEW], `routes/AppRoutes.tsx` [MODIFY]

- [x] **8.2. Game Themes — 3 themes đơn giản**
  - [x] **Classic** (tím/gradient — mặc định, giữ nguyên giao diện hiện tại).
  - [x] **Dark Mode** (nền tối hoàn toàn, chữ sáng).
  - [x] **Focus** (tối giản, ít animation, nền trung tính).
  - [x] Chọn theme tại màn hình Setup hoặc Settings, lưu vào localStorage.
  - [x] Theme áp dụng CSS variables cho toàn bộ giao diện game.
  - [x] **Files:** `config/gameThemes.ts` [NEW], `components/ThemeSelector.tsx` [NEW]

- [x] **8.3. Cải tiến giao diện câu hỏi**
  - [x] Hỗ trợ 2-6 đáp án (thay vì cố định 4) — update `Question` type, QuizEditor, và giao diện chơi.
  - [x] Hiển thị ảnh kèm câu hỏi (thêm field `imageUrl` vào `Question`) + zoom ảnh khi click.
  - [x] Progress counter "1/8" phía trên câu hỏi (tương tự Wayground).
  - [x] **Files:** `types/quiz.ts` [MODIFY], `pages/dashboard/QuizEditor.tsx` [MODIFY], `pages/solo/SoloPlay.tsx` [MODIFY], `pages/host/LiveHost.tsx` [MODIFY], `pages/player/LivePlayer.tsx` [MODIFY]

---

### PHẦN 9: CẢI TIẾN LIVE ROOM (PHÒNG THI ĐẤU TRỰC TIẾP)

> **Ưu tiên:** Trung bình — Chức năng cốt lõi đã có, cần mở rộng.

- [x] **9.1. Challenge Friends (Người chơi tự tạo phòng)**
  - [x] Cho phép user đã đăng nhập tạo phòng Live từ quiz công khai.
  - [x] Luồng: Chọn quiz → "Thách đấu bạn bè" → tạo phòng → chia sẻ mã → chờ → Start.
  - [x] Người tạo trở thành Host của game.
  - [x] **Files:** `pages/player/ChallengeSetup.tsx` [NEW], `services/roomService.ts` [MODIFY], `routes/AppRoutes.tsx` [MODIFY]

- [x] **9.2. Cải tiến Lobby**
  - [x] Hiển thị mã phòng lớn + nút **Copy mã** + nút **Chia sẻ link trực tiếp**.
  - [x] Avatar ngẫu nhiên cho mỗi người chơi (emoji/icon từ danh sách preset).
  - [x] Animation slide-in khi người chơi mới tham gia.
  - [x] **Files:** `pages/host/LiveHost.tsx` [MODIFY], `pages/player/LivePlayer.tsx` [MODIFY]

- [x] **9.3. Chia sẻ quiz & phòng (Share)**
  - [x] Component `ShareButton` — copy link quiz hoặc mã phòng vào clipboard.
  - [x] Toast "Đã sao chép!" khi copy thành công.
  - [x] **Files:** `components/ShareButton.tsx` [NEW]

---

### PHẦN 10: QUẢN LÝ TÀI KHOẢN CÁ NHÂN (USER PROFILE & SETTINGS)

> **Ưu tiên:** Cao — Thiếu hoàn toàn, cần bổ dung đầy đủ.

- [ ] **10.1. Mở rộng User type & Repository**
  - [ ] Thêm fields vào `User` type:
    - `username`: Tên đăng nhập duy nhất.
    - `firstName`, `lastName`: Tách riêng họ và tên.
    - `grade`: Lớp/cấp học (Lớp 1-12, Đại học, Khác).
    - `role`: `'student' | 'teacher' | 'admin'`.
    - `age`: Số tuổi (tùy chọn).
    - `avatarUrl`: URL ảnh đại diện (chọn từ danh sách preset).
    - `useCase`: Mục đích sử dụng (K-12, Doanh nghiệp, Đại học, Gia sư).
    - `preferences`: `{ theme, language }`.
    - `onboardingCompleted`: boolean — đã hoàn thành onboarding chưa.
  - [ ] Tạo `IUserRepository` interface + `FirebaseUserRepository`.
  - [ ] Tạo `userService` điều phối logic user.
  - [ ] **Files:** `types/user.ts` [MODIFY], `repositories/IUserRepository.ts` [NEW], `repositories/FirebaseUserRepository.ts` [NEW], `services/userService.ts` [NEW]

- [ ] **10.2. Onboarding Wizard khi đăng ký (4 bước)**
  - [ ] **Bước 1**: Nhập Họ + Tên.
  - [ ] **Bước 2**: Mục đích sử dụng — Trường học K-12, Doanh nghiệp, Đại học, Gia sư/Tự học.
  - [ ] **Bước 3**: Vai trò — Học sinh, Giáo viên, Quản trị viên.
  - [ ] **Bước 4**: Chọn độ tuổi/lớp học + chọn avatar từ danh sách preset.
  - [ ] Redirect đến Onboarding sau khi đăng ký lần đầu (nếu `onboardingCompleted = false`).
  - [ ] Lưu tất cả vào Firestore `users` collection.
  - [ ] **Files:** `pages/auth/Onboarding.tsx` [NEW], `routes/AppRoutes.tsx` [MODIFY]

- [ ] **10.3. Trang Cài đặt (`/settings`)**
  - [ ] **👤 Profile:**
    - Username (đổi được, kiểm tra unique).
    - Name (Tên hiển thị).
    - Grade (lớp/cấp).
    - Language (mặc định tiếng Việt).
  - [ ] **🎮 Game settings:**
    - Game Theme mặc định (chọn từ 3 themes: Classic, Dark, Focus).
  - [ ] **🔒 Account settings:**
    - Đổi mật khẩu (`updatePassword` Firebase Auth).
    - Xóa tài khoản (xác nhận → xóa Firestore data + Auth user).
    - Đăng xuất.
  - [ ] Footer: Liên hệ, Điều khoản, Chính sách bảo mật.
  - [ ] **Files:** `pages/profile/SettingsPage.tsx` [NEW], `routes/AppRoutes.tsx` [MODIFY]

- [ ] **10.4. Dropdown Menu Header cải tiến**
  - [ ] Thay nút "Đăng xuất" bằng **Avatar + Dropdown** (shadcn DropdownMenu).
  - [ ] Dropdown: Username, Email → Cài đặt → Đăng xuất.
  - [ ] Trên header: thêm nút **"Tạo Quiz"**.
  - [ ] **Files:** `components/Header.tsx` [MODIFY], `components/UserDropdown.tsx` [NEW]

- [ ] **10.5. Avatar từ danh sách preset**
  - [ ] Tạo danh sách ~20 avatar (emoji animals/expressions) cho user chọn.
  - [ ] Hiển thị avatar đã chọn trên Header, Lobby, và Leaderboard.
  - [ ] Chọn avatar trong Onboarding (bước 4) và trong Settings.
  - [ ] **Files:** `config/avatarPresets.ts` [NEW], `components/AvatarPicker.tsx` [NEW]

---

### PHẦN 11: NÂNG CAO TRẢI NGHIỆM (UX POLISH)

> **Ưu tiên:** Thấp — Tối ưu sau khi các phần core hoàn thành.

- [ ] **11.1. Toast/Notification System**
  - [ ] Sử dụng shadcn `Sonner` toast cho thông báo toàn ứng dụng.
  - [ ] Áp dụng: thành công tạo quiz, lỗi kết nối, copy link, xóa quiz, v.v.

- [ ] **11.2. View Transitions (Chuyển trang mượt mà)**
  - [ ] Thêm React View Transitions cho animation chuyển trang (Dashboard → Game, Game → Results).
  - [ ] Shared element animation cho quiz card → quiz detail.

- [ ] **11.3. Responsive Mobile**
  - [ ] Rà soát và cải thiện responsive cho tất cả các trang trên mobile.
  - [ ] Bottom navigation bar cho mobile.

---

## THỨ TỰ TRIỂN KHAI ĐỀ XUẤT

| #   | Phần                   | Mô tả                                        | Lý do ưu tiên                          |
| --- | ---------------------- | -------------------------------------------- | -------------------------------------- |
| 1   | **10.1 + 10.2**        | User type mở rộng + Onboarding Wizard 4 bước | Foundation — nhiều phần khác phụ thuộc |
| 2   | **10.3 + 10.4 + 10.5** | Settings + Header Dropdown + Avatar Preset   | Quản lý tài khoản hoàn chỉnh           |
| 3   | **7.1 + 7.3**          | Quiz Preview Modal + Nickname Generator      | UX Dashboard cải thiện                 |
| 4   | **7.4**                | Activity Tabs (Running/Completed/Created)    | Thay thế tab Lịch sử cũ                |
| 5   | **8.1 + 8.2**          | Game Setup + 3 Themes (Classic/Dark/Focus)   | Nâng trải nghiệm game                  |
| 6   | **8.3**                | Cải tiến câu hỏi (2-6 đáp án, ảnh)           | Nâng cao quiz editor                   |
| 7   | **9.1 + 9.3**          | Challenge Friends + Share                    | Tính năng xã hội                       |
| 8   | **7.2 + 7.5**          | Quiz Metadata + Search                       | Khám phá quiz                          |
| 9   | **11**                 | UX Polish (Toasts, Transitions, Mobile)      | Hoàn thiện cuối                        |
