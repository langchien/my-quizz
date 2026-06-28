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
- [ ] **1.1. Cấu hình Firebase Console**
  - [ ] Tạo project Firebase (ví dụ: `my-quizz-dev`).
  - [ ] Bật Firebase Authentication (Email/Password).
  - [ ] Bật Firestore Database (chọn chế độ test/mở rule đọc ghi cho môi trường phát triển).
- [ ] **1.2. Khởi tạo & Cài đặt Thư viện phía Client**
  - [ ] Cài đặt firebase SDK: `npm install firebase` trong thư mục `client`.
  - [ ] Cài đặt Lucide React để dùng icons: `npm install lucide-react`.
  - [ ] Cài đặt React Router DOM: `npm install react-router-dom`.
- [ ] **1.3. Cấu hình Firebase Connection**
  - [ ] Tạo file `.env` và `.env.example` chứa thông tin kết nối Firebase.
  - [ ] Tạo file [firebase.ts](file:///p:/Nodejs/my-quizz/client/src/lib/firebase.ts) khởi tạo Firebase App, Auth, và Firestore.
- [ ] **1.4. Định nghĩa Domain Types (client/src/types)**
  - [ ] Tạo file `user.ts` (User profile).
  - [ ] Tạo file `quiz.ts` (Quiz, Question, AnswerOption).
  - [ ] Tạo file `room.ts` (GameSession/Room, Participant, PlayerAnswer, Leaderboard).

---

### PHẦN 2: THÀNH PHẦN AUTHENTICATION & ROUTING
- [ ] **2.1. Thiết kế Repository & Service cho Auth**
  - [ ] Định nghĩa `IAuthRepository` interface.
  - [ ] Triển khai `FirebaseAuthRepository` sử dụng Firebase Auth.
  - [ ] Tạo `authService` điều phối logic đăng nhập, đăng ký, đăng xuất.
- [ ] **2.2. Viết Custom Hook `useAuth`**
  - [ ] Quản lý trạng thái đăng nhập toàn cục (`currentUser`, `loading`).
- [ ] **2.3. Cấu hình React Router & Layout**
  - [ ] Tạo các trang: `/login`, `/register`, `/dashboard`.
  - [ ] Thiết lập `ProtectedRoute` để bảo vệ các trang yêu cầu đăng nhập.
- [ ] **2.4. Phát triển Giao diện Đăng ký / Đăng nhập (Shadcn + Premium CSS)**
  - [ ] Giao diện Glassmorphism cực đẹp, hiệu ứng background gradient chuyển động mượt mà.

---

### PHẦN 3: CRUD QUIZ & CÂU HỎI (DASHBOARD)
- [ ] **3.1. Thiết kế Repository & Service cho Quiz**
  - [ ] Định nghĩa `IQuizRepository` interface.
  - [ ] Triển khai `FirebaseQuizRepository` kết nối Firestore (`quizzes` collection).
  - [ ] Tạo `quizService` xử lý CRUD nghiệp vụ.
- [ ] **3.2. Viết Custom Hook `useQuizzes`**
  - [ ] Quản lý danh sách quiz của user đăng nhập, tải dữ liệu, xử lý lỗi.
- [ ] **3.3. Phát triển UI Dashboard**
  - [ ] Giao diện danh sách Quiz với các thẻ (cards) hiển thị số lượng câu hỏi, thời gian, nút bắt đầu Host game (Live hoặc Solo).
  - [ ] Chức năng xóa quiz với modal confirm của Shadcn UI.
- [ ] **3.4. Phát triển UI Tạo và Chỉnh sửa Quiz**
  - [ ] Form nhập thông tin Quiz (Tiêu đề, mô tả).
  - [ ] UI thêm/sửa/xóa câu hỏi trắc nghiệm: nhập câu hỏi, set thời gian (10s, 20s, 30s...), set điểm, định nghĩa 4 câu trả lời và đánh dấu đáp án đúng.

---

### PHẦN 4: CHẾ ĐỘ CHƠI LIVE (REAL-TIME GAME SESSION)
- [ ] **4.1. Thiết kế Repository & Service cho Live Game**
  - [ ] Định nghĩa `IRoomRepository` interface.
  - [ ] Triển khai `FirebaseRoomRepository` sử dụng Firestore Real-time Listeners (`onSnapshot`) để lắng nghe sự thay đổi của phòng (`sessions`), danh sách người chơi (`participants`), và câu trả lời (`answers`).
  - [ ] Tạo `roomService` xử lý logic game (tạo phòng, join phòng, cập nhật câu hỏi hiện tại, tính điểm).
- [ ] **4.2. Viết Custom Hook `useLiveRoom`**
  - [ ] Trạng thái đồng bộ real-time cho Host và Player.
- [ ] **4.3. Phát triển UI phía Host (Người tổ chức)**
  - [ ] **Màn hình Lobby Chờ:** Hiển thị mã phòng gồm 5-6 ký tự chữ + số ngẫu nhiên, danh sách người chơi tham gia real-time. Có nút "Bắt đầu".
  - [ ] **Màn hình Câu hỏi đang diễn ra:** Hiển thị nội dung câu hỏi, đếm ngược thời gian, số lượng người chơi đã nộp bài. Nút "Kết thúc câu hỏi" hoặc tự động kết thúc khi hết giờ.
  - [ ] **Màn hình Leaderboard câu hỏi:** Hiển thị top 3/5 người chơi điểm cao nhất sau câu hỏi đó kèm hiệu ứng hoạt họa tăng điểm.
  - [ ] **Màn hình Kết thúc game:** Hiển thị bục vinh quang (Podium) vinh danh Top 3 người chơi thắng cuộc.
- [ ] **4.4. Phát triển UI phía Player (Người chơi)**
  - [ ] **Màn hình Vào phòng:** Nhập mã phòng và tên hiển thị (không cần tài khoản).
  - [ ] **Màn hình Chờ Host bắt đầu:** Animation động tạo cảm giác hồi hộp.
  - [ ] **Màn hình Trả lời:** Hiển thị 4 nút màu sắc lớn tương ứng 4 đáp án (hoặc hiển thị cả nội dung câu hỏi tùy thiết kế). Có thanh tiến trình đếm ngược.
  - [ ] **Màn hình Phản hồi:** Hiển thị ngay lập tức kết quả Đúng/Sai, số điểm nhận được (tính theo công thức chính xác + tốc độ), và chuỗi trả lời đúng (Streak).

---

### PHẦN 5: CHẾ ĐỘ CHƠI SOLO (TỰ LUYỆN - ASYNC)
- [ ] **5.1. Thiết kế logic Solo Play**
  - [ ] Tạo `useSoloRoom` hook.
  - [ ] Quản lý trạng thái làm bài lưu tạm vào Firestore (hoặc LocalStorage) để hỗ trợ Pause/Resume.
- [ ] **5.2. Tính năng Redemption (Cứu mạng)**
  - [ ] Ở cuối game Solo, lọc ra các câu trả lời sai và hiển thị cho người chơi làm lại 1-2 câu để cải thiện điểm số.
- [ ] **5.3. Tính năng Review Flashcards**
  - [ ] Sau khi kết thúc bài Solo, cho phép lướt qua các thẻ flashcard để xem câu hỏi, đáp án đã chọn và đáp án đúng kèm giải thích lý thuyết.

---

### PHẦN 6: LỊCH SỬ CHƠI & BÁO CÁO (REPORTS)
- [ ] **6.1. Trang Lịch sử phiên (Cho Host)**
  - [ ] Hiển thị danh sách các phiên chơi đã tổ chức trong quá khứ.
  - [ ] Chi tiết từng phiên: danh sách người chơi, số câu đúng/sai của từng người, điểm tổng kết.
- [ ] **6.2. Trang Lịch sử tự luyện (Cho Player)**
  - [ ] Hiển thị lịch sử các bài Solo đã hoàn thành (lưu ở LocalStorage hoặc liên kết tài khoản nếu có đăng nhập).
