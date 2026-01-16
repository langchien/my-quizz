-- Tạo function delete_user để cho phép user xóa tài khoản của chính mình
-- Function này chạy với SECURITY DEFINER để có quyền xóa user từ auth.users

-- Drop function nếu đã tồn tại
DROP FUNCTION IF EXISTS public.delete_user();

-- Tạo function delete_user
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Lấy user_id của người đang đăng nhập
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Không tìm thấy phiên đăng nhập';
  END IF;

  -- Xóa dữ liệu user từ bảng User (Prisma model)
  -- Sử dụng dynamic SQL để tránh lỗi nếu bảng không tồn tại
  BEGIN
    DELETE FROM public."User" WHERE id = current_user_id::text;
  EXCEPTION WHEN undefined_table THEN
    -- Bỏ qua nếu bảng không tồn tại
    NULL;
  END;
  
  -- Xóa user từ auth.users
  DELETE FROM auth.users WHERE id = current_user_id;
END;
$$;

-- Grant quyền execute cho authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;

-- Thêm comment mô tả function
COMMENT ON FUNCTION public.delete_user() IS 'Cho phép user xóa tài khoản của chính mình. Chỉ user đã đăng nhập mới có thể gọi function này.';
