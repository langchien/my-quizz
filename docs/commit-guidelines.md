# Quy Tắc Viết Commit Message

## Tổng Quan

Dự án này sử dụng **Conventional Commits** - một quy ước đơn giản để viết commit message rõ ràng và có cấu trúc.

## Cấu Trúc Commit Message

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### 1. Type (Bắt buộc)

Loại thay đổi trong commit:

- **feat**: Thêm tính năng mới
- **fix**: Sửa lỗi
- **docs**: Thay đổi tài liệu
- **style**: Thay đổi không ảnh hưởng đến logic (format, spacing, etc.)
- **refactor**: Refactor code (không thêm feature, không fix bug)
- **perf**: Cải thiện performance
- **test**: Thêm hoặc sửa tests
- **chore**: Thay đổi build process, dependencies, tools
- **ci**: Thay đổi CI/CD configuration
- **revert**: Revert commit trước đó

### 2. Scope (Tùy chọn)

Phạm vi ảnh hưởng của commit (component, module, feature):

- `auth` - Authentication
- `quiz` - Quiz features
- `ui` - UI components
- `db` - Database/Schema
- `api` - API routes
- `home` - Home page
- `header` - Header component
- etc.

### 3. Subject (Bắt buộc)

Mô tả ngắn gọn về thay đổi:

- Sử dụng thì hiện tại, dạng mệnh lệnh: "add" không phải "added" hay "adds"
- Không viết hoa chữ cái đầu
- Không có dấu chấm (.) ở cuối
- Tối đa 50-72 ký tự

### 4. Body (Tùy chọn)

Giải thích chi tiết hơn về **WHY** (tại sao) thay đổi này, không phải **WHAT** (cái gì):

- Ngắt dòng sau 72 ký tự
- Giải thích động lực cho thay đổi
- So sánh với behavior trước đó

### 5. Footer (Tùy chọn)

Thông tin về breaking changes hoặc issue references:

- `BREAKING CHANGE:` mô tả breaking change
- `Closes #123` hoặc `Fixes #456` để link với issues

## Ví Dụ Thực Tế

### Ví dụ 1: Thêm tính năng đơn giản

```
feat(home): add welcome hero section
```

### Ví dụ 2: Thêm tính năng với body

```
feat(home): add quick actions component

Implement QuickActions component with 4 action cards:
- Create Quiz
- Browse Library
- Join Quiz
- View Statistics

Each card includes icon, title, description and hover effects
```

### Ví dụ 3: Sửa lỗi

```
fix(header): correct theme toggle icon not updating
```

### Ví dụ 4: Refactor

```
refactor(ui): extract button variants to separate config
```

### Ví dụ 5: Thay đổi database

```
feat(db): add quiz_attempts table schema

Add new table to track user quiz attempts with:
- user_id reference
- quiz_id reference
- score and completion_time fields
- timestamps
```

### Ví dụ 6: Cập nhật dependencies

```
chore(deps): upgrade react-query to v5.0.0
```

### Ví dụ 7: Thêm documentation

```
docs: add commit message guidelines
```

### Ví dụ 8: Breaking change

```
feat(auth)!: change authentication flow to use OAuth

BREAKING CHANGE: Email/password authentication is removed.
Users must now authenticate via Google OAuth.
```

## Quy Tắc Cho Dự Án Cá Nhân

Dù là dự án cá nhân, việc viết commit tốt vẫn có lợi:

### Nên:

✅ Commit nhỏ, tập trung vào một thay đổi
✅ Viết message rõ ràng ngay cả khi làm một mình
✅ Sử dụng type phù hợp (feat, fix, docs, etc.)
✅ Commit thường xuyên (mỗi khi hoàn thành một phần nhỏ)

### Có thể đơn giản hóa:

- Scope có thể bỏ qua nếu thay đổi nhỏ
- Body có thể bỏ qua nếu subject đã đủ rõ
- Footer thường không cần thiết (trừ khi có breaking change)

### Ví dụ commit đơn giản cho dự án cá nhân:

```
feat: add home page
fix: header responsive on mobile
docs: update README
chore: setup tailwind config
refactor: simplify auth logic
```

## Tools Hỗ Trợ

### Commitizen (Optional)

Nếu muốn có interactive prompt khi commit:

```bash
npm install -g commitizen
npm install -D cz-conventional-changelog
```

Sau đó dùng `git cz` thay vì `git commit`

### Commitlint (Optional)

Để enforce commit message format:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

## Tham Khảo

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
