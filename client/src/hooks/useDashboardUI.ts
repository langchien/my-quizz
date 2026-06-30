import { useTheme } from '@/components/theme-provider'
import { useCallback, useState } from 'react'

/**
 * Custom hook cho UI state trên trang Dashboard.
 * Quản lý tab, import dialog, và theme toggle.
 */
export function useDashboardUI() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'quizzes' | 'history' | 'explore'>('quizzes')
  const [isImportOpen, setIsImportOpen] = useState(false)

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const openImportDialog = useCallback(() => {
    setIsImportOpen(true)
  }, [])

  const closeImportDialog = useCallback(() => {
    setIsImportOpen(false)
  }, [])

  return {
    theme,
    activeTab,
    setActiveTab,
    isImportOpen,
    openImportDialog,
    closeImportDialog,
    toggleTheme,
  }
}
