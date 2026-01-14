import type { Config } from '@react-router/dev/config'

export default {
  // Config options...
  // Tắt SSR để dùng SPA mode - Supabase client chỉ hoạt động trên browser
  ssr: false,
} satisfies Config
