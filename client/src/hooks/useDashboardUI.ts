import { useTheme } from '@/components/theme-provider'
import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router'

/**
 * Custom hook cho UI state trên trang Dashboard.
 * Quản lý tab, import dialog, và theme toggle.
 */
export function useDashboardUI() {
  const { theme, setTheme } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = (searchParams.get('tab') as 'quizzes' | 'history' | 'explore') || 'quizzes'

  const setActiveTab = useCallback(
    (tab: 'quizzes' | 'history' | 'explore') => {
      setSearchParams(
        (prev) => {
          prev.set('tab', tab)
          return prev
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

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
