# My-Quizz — Agent Instructions

> **Hệ thống Rule (Single source of truth)** cho Antigravity AI coding agent hiện đã được chia nhỏ theo domain và quản lý tập trung trong thư mục `.agents/`.
> Mọi thay đổi về rule/workflow cần được cập nhật vào đúng file tương ứng trong `.agents/`.

**Dự án:** Nền tảng quiz tương tác (tham chiếu Wayground/Quizizz), web nội bộ.
**Tài liệu:** `docs/Phan_Tich_Thiet_Ke_He_Thong.md`

## Danh sách quy tắc và quy trình

Các quy tắc (Rules) và quy trình (Workflows) chi tiết nằm ở các file sau:

- **Kiến trúc & Cấu trúc:** `.agents/rules/01-architecture.md`
- **Quy tắc Import:** `.agents/rules/02-imports.md`
- **React UI:** `.agents/rules/03-react-ui.md`
- **Backend Services & Repository:** `.agents/rules/04-backend-services.md`
- **Firestore:** `.agents/rules/05-firestore.md`
- **Workflow & Conventions:** `.agents/workflows/06-workflow.md`

---

## Cấu trúc thư mục Agent

| File / Thư mục       | Ý nghĩa                                                                           |
| -------------------- | --------------------------------------------------------------------------------- |
| `.agents/rules/`     | Chứa các quy tắc code, kiến trúc                                                  |
| `.agents/skills/`    | Chứa các bộ kỹ năng (React, Shadcn, Vercel...) giúp Agent tối ưu hóa code sinh ra |
| `.agents/workflows/` | Chứa các quy trình làm việc chung                                                 |

## Ngôn ngữ sử dụng

- Dự án nhằm phục vụ cho người Việt Nam và sử dụng tiếng Việt, vì vậy các phần liên quan đến hiển thị ngôn ngữ hãy để tiếng việt
