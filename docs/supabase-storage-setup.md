# Supabase Storage - Avatar Bucket Setup

Hướng dẫn thiết lập Storage bucket cho upload avatar trong ứng dụng.

---

## 1. Tạo Bucket

1. Truy cập **Supabase Dashboard** → **Storage**
2. Click **New bucket**
3. Cấu hình:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **Yes** (để hiển thị avatar không cần auth token)
   - **Allowed MIME types**: `image/*`
   - **File size limit**: `2MB`

---

## 2. Thiết lập RLS Policies

Vào **Storage** → **Policies** → bucket `avatars` → **New Policy**

### Policy 1: Cho phép xem avatar (Public Read)

```sql
-- Policy name: Public can view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**Hoặc qua UI:**

- Policy name: `Public can view avatars`
- Allowed operation: `SELECT`
- Target roles: `public` (anon)
- USING expression: `bucket_id = 'avatars'`

---

### Policy 2: Cho phép upload avatar (Authenticated Upload)

```sql
-- Policy name: Users can upload own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Giải thích:**

- `auth.uid()::text` - ID của user đang đăng nhập
- `(storage.foldername(name))[1]` - Lấy folder đầu tiên trong path
- Code upload sử dụng path: `{userId}/{filename}` nên policy này đảm bảo user chỉ upload vào folder của mình

**Qua UI:**

- Policy name: `Users can upload own avatar`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression:
  ```
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  ```

---

### Policy 3: Cho phép cập nhật avatar (Authenticated Update)

```sql
-- Policy name: Users can update own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

### Policy 4: Cho phép xóa avatar cũ (Authenticated Delete)

```sql
-- Policy name: Users can delete own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 3. Chạy tất cả policies bằng SQL Editor

Vào **SQL Editor** và chạy toàn bộ:

```sql
-- 1. Public Read
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 2. Authenticated Upload
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Authenticated Update
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Authenticated Delete
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 4. Kiểm tra

Sau khi thiết lập xong:

1. Đăng nhập vào app
2. Vào trang **Profile** (`/profile`)
3. Click vào biểu tượng camera trên avatar
4. Chọn file ảnh (< 2MB)
5. Xác nhận ảnh được upload và hiển thị

---

## Troubleshooting

### Lỗi "new row violates row-level security policy"

- Kiểm tra policy `INSERT` đã được tạo đúng chưa
- Đảm bảo path upload có format `{userId}/{filename}`

### Lỗi "The resource was not found"

- Kiểm tra bucket `avatars` đã được tạo chưa
- Kiểm tra bucket có public access không

### Avatar không hiển thị

- Kiểm tra policy `SELECT` cho phép public access
- Kiểm tra URL avatar có đúng format không
