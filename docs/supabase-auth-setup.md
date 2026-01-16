# Hướng Dẫn Cấu Hình Supabase Authentication

> **Yêu cầu**: Bạn cần có sẵn Supabase Project. Nếu chưa có, hãy tạo tại [https://supabase.com](https://supabase.com)

## 1. Cấu Hình Google OAuth Provider

### 1.1. Trong Supabase Dashboard

1. Vào **Authentication** → **Providers**
2. Tìm và bật **Google** provider
3. Điền thông tin từ Google Cloud Console:
   - **Client ID**: `your-google-client-id`
   - **Client Secret**: `your-google-client-secret`
4. Copy **Redirect URL** (sẽ có dạng):
   ```
   https://<project-ref>.supabase.co/auth/v1/callback
   ```

### 1.2. Trong Google Cloud Console

> Bạn đã biết cách cấu hình bên Google. Chỉ cần đảm bảo:

1. **Authorized redirect URIs** bao gồm Redirect URL từ Supabase
2. Nếu dev local, thêm cả:
   ```
   http://localhost:5173/auth/callback
   ```

---

## 2. Cấu Hình Email Authentication

### 2.1. Bật Email Provider

1. Vào **Authentication** → **Providers**
2. **Email** provider mặc định đã được bật

### 2.2. Cấu Hình Email Templates (Optional)

1. Vào **Authentication** → **Email Templates**
2. Customize các template:
   - **Confirm signup**: Email xác nhận đăng ký
   - **Reset password**: Email đặt lại mật khẩu
   - **Magic link**: Email đăng nhập không cần mật khẩu

### 2.3. Cấu Hình SMTP (Production)

> Mặc định Supabase dùng built-in email (giới hạn 4 emails/giờ). Để production:

1. Vào **Project Settings** → **Authentication**
2. Scroll đến **SMTP Settings**
3. Điền thông tin SMTP server (Resend, SendGrid, Mailgun, etc.)

---

## 3. Cấu Hình URL Redirects

### 3.1. Site URL

1. Vào **Authentication** → **URL Configuration**
2. **Site URL**: URL chính của ứng dụng
   - Development: `http://localhost:5173`
   - Production: `https://your-domain.com`

### 3.2. Redirect URLs (Quan trọng!)

Thêm các URL được phép redirect sau khi auth:

```
http://localhost:5173/auth/callback
http://localhost:5173
https://your-domain.com/auth/callback
https://your-domain.com
```

> ⚠️ **Lưu ý**: Supabase sử dụng exact match. URL phải khớp chính xác!

---

## 4. Biến Môi Trường

Đảm bảo file `.env` có các biến sau:

```env
# Supabase
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

> Lấy thông tin này từ **Project Settings** → **API**

---

## 5. RLS Policies cho User

### 5.1. Bật RLS cho bảng User

```sql
-- Trong Supabase SQL Editor
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
```

### 5.2. Policies cơ bản

```sql
-- Cho phép user đọc thông tin của chính mình
CREATE POLICY "Users can view own profile" ON "User"
  FOR SELECT
  USING (auth.uid()::text = id);

-- Cho phép user cập nhật thông tin của chính mình
CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE
  USING (auth.uid()::text = id);

-- Cho phép insert khi tạo user mới (từ auth trigger)
CREATE POLICY "Enable insert for authenticated users" ON "User"
  FOR INSERT
  WITH CHECK (auth.uid()::text = id);
```

---

## 6. Tự Động Sync User từ Auth

### 6.1. Tạo Database Function

Khi user đăng ký qua Supabase Auth, tự động tạo record trong bảng `User`:

```sql
-- Function tạo user profile sau khi đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, "displayName", "avatarUrl")
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6.2. Tạo Trigger

```sql
-- Trigger chạy khi có user mới trong auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 7. Checklist Xác Nhận

- [x] Bật Google provider trong Supabase
- [x] Cấu hình Google Cloud Console với Redirect URL đúng
- [x] Thêm Redirect URLs trong Supabase (localhost + production)
- [x] Cấu hình Site URL
- [x] Thêm biến môi trường `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`
- [x] Bật RLS cho bảng User
- [x] Tạo trigger sync user từ auth.users

---

## 8. Test Cấu Hình

Sau khi cấu hình xong, bạn có thể test bằng cách:

1. Chạy app: `npm run dev`
2. Truy cập trang Login
3. Click "Đăng nhập với Google"
4. Kiểm tra redirect về `/auth/callback`
5. Kiểm tra bảng `User` có record mới không

> 🎉 Nếu tất cả hoạt động, bạn đã cấu hình thành công!
