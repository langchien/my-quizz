import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { z } from 'zod'

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1, 'VITE_FIREBASE_API_KEY is required'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'VITE_FIREBASE_AUTH_DOMAIN is required'),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'VITE_FIREBASE_PROJECT_ID is required'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'VITE_FIREBASE_STORAGE_BUCKET is required'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'VITE_FIREBASE_MESSAGING_SENDER_ID is required'),
  VITE_FIREBASE_APP_ID: z.string().min(1, 'VITE_FIREBASE_APP_ID is required'),
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from system and .env files
  const env = loadEnv(mode, process.cwd(), '')
  const parsed = envSchema.safeParse(env)

  if (!parsed.success) {
    console.error('\n\x1b[41m\x1b[37m%s\x1b[0m', ' ❌ Configuration Error: Environment variables are invalid: ')
    const formattedErrors = parsed.error.format()
    Object.entries(formattedErrors).forEach(([key, value]) => {
      if (key !== '_errors' && value && typeof value === 'object' && '_errors' in value) {
        console.error('\x1b[31m%s\x1b[0m', `👉 [Missing or Invalid] ${key}: ${(value as any)._errors.join(', ')}`)
      }
    })
    console.error('')
    process.exit(1)
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})

