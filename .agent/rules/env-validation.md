---
trigger: manual
description: Quy định về xử lý biến môi trường
---

# Environment Variables Validation

Tất cả biến môi trường (`.env`) **BẮT BUỘC** phải được validate trước khi sử dụng trong ứng dụng.

## Nguyên tắc

1.  **Centralized Config**: Không bao giờ dùng `import.meta.env.VITE_...` hoặc `process.env...` trực tiếp trong component hoặc logic.
2.  **Strict Validation**: Sử dụng `zod` để validate kiểu dữ liệu và sự tồn tại của biến.
3.  **Fail Fast**: Nếu biến môi trường thiếu hoặc sai định dạng, ứng dụng phải **Crash** ngay lập tức (throw error) và log ra console rõ ràng lỗi.

## Implementation Pattern

Tạo file `src/config/env.ts` (hoặc `src/lib/env.ts`):

```typescript
import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  // Thêm các biến khác...
})

// Validate ngay khi file này được import
const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const envConfig = parsedEnv.data
```

## Sử dụng

```typescript
import { envConfig } from '@/config/env'

const url = envConfig.VITE_SUPABASE_URL // Type-safe & Guaranteed to exist
```
