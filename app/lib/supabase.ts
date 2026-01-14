import { envConfig } from '@/config/env'
import type { Database } from '@/types/supabase'
import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client Instance
 *
 * QUAN TRỌNG:
 * - Chỉ sử dụng trong React Components (Client-side)
 * - KHÔNG sử dụng Prisma Client trong React Components
 */
export const supabase = createClient<Database>(
  envConfig.VITE_SUPABASE_URL,
  envConfig.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true, // Lưu session
      autoRefreshToken: true, // Tự động refresh token
      detectSessionInUrl: true, // Phát hiện session từ URL
    },
  },
)
