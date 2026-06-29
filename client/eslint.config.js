import js from '@eslint/js'
import globals from 'globals'
import reactHooks, { rules } from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    }, 
    rules: {
      // Giữ mức warn để nhắc nhở cải thiện kiểu dữ liệu
      '@typescript-eslint/no-explicit-any': 'warn',
      // Nhắc nhở dọn dẹp code thừa
      '@typescript-eslint/no-unused-vars': 'warn',
      // Cảnh báo sử dụng setState trong useEffect thay vì báo lỗi (tránh block build)
      'react-hooks/set-state-in-effect': 'warn',
      // Tắt cảnh báo thư viện không tương thích (chủ yếu do TanStack Table với React Compiler) vì React Compiler sẽ tự skip
      'react-hooks/incompatible-library': 'off',
      // Cảnh báo dùng thẻ <img> thay vì <Image> của Next.js
      // '@next/next/no-img-element': 'warn',
      // Cảnh báo khi mảng dependencies của useEffect/useCallback bị thiếu biến
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
      'react-hooks/immutability': 'warn'
    },
  },
  
])
