---
trigger: always_on
---

# Architecture and Folder Structure

**Dự án:** Nền tảng quiz tương tác (tham chiếu Wayground/Quizizz), web nội bộ.
**Tài liệu:** `docs/Phan_Tich_Thiet_Ke_He_Thong.md`

## Stack

- **Hiện tại (MVP):** Firebase Auth + Firestore + React + React Router (client-only, data mode)
- **Sau này:** NestJS + React (API REST + Socket.io)

Mọi code mới phải **tách lớp** để đổi backend mà **không rewrite UI**.

## Cấu trúc thư mục

```text
client/src/
  types/           # Domain types thuần (Quiz, Room, Participant…) — KHÔNG import firebase
  services/        # Interface + orchestration (quizService, roomService, authService)
  repositories/    # Firebase adapter implements interface (firebaseQuizRepository…)
  hooks/           # useQuizzes, useLiveRoom, useAuth — gọi services
  routes/          # React Router — chỉ UI + hooks
  components/      # Presentational — chỉ UI + hooks
  lib/firebase.ts  # Init Firebase duy nhất
```
