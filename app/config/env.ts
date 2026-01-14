import { z } from 'zod'

/**
 * Schema validation cho các biến môi trường
 * Tất cả biến môi trường phải được validate trước khi sử dụng
 */
const envSchema = z.object({
  // Supabase Configuration
  VITE_SUPABASE_URL: z
    .url('VITE_SUPABASE_URL phải là URL')
    .refine((url) => url.includes('supabase.co'), 'VITE_SUPABASE_URL phải là URL Supabase'),

  VITE_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'VITE_SUPABASE_ANON_KEY không được để trống')
    .refine((key) => key.startsWith('eyJ'), 'VITE_SUPABASE_ANON_KEY phải là JWT token'),
})

/**
 * Lấy env variables từ import.meta.env (Vite)
 * Trong SPA mode, biến môi trường được inject vào client bundle
 */
const getEnvVariables = () => {
  // Vite tự động inject VITE_* variables vào import.meta.env
  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
}

/**
 * Validate environment variables ngay khi file này được import
 * Nếu validation thất bại, ứng dụng sẽ crash ngay lập tức (Fail Fast)
 */
const parsedEnv = envSchema.safeParse(getEnvVariables())

if (!parsedEnv.success) {
  console.error('❌ Lỗi biến môi trường:')
  parsedEnv.error.issues.forEach((error) => {
    console.error(`  - ${error.path.join('.')}: ${error.message}`)
  })
  throw new Error('Environment variables validation failed')
}

/**
 * Export validated environment config
 * Type-safe và đảm bảo tất cả biến đều tồn tại
 */
export const envConfig = parsedEnv.data

/**
 * Type helper để sử dụng trong code
 */
export interface IEnvConfig extends z.infer<typeof envSchema> {}
