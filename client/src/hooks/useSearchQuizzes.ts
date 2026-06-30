import { quizService } from '@/services/quizService'
import type { Quiz } from '@/types/quiz'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Hook quản lý state tìm kiếm quiz công khai.
 * Debounced 300ms để giảm tải Firestore.
 */
export function useSearchQuizzes() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState<string>('')
  const [difficulty, setDifficulty] = useState<string>('')
  const [results, setResults] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const search = useCallback(async (kw: string, cat: string, diff: string) => {
    setLoading(true)
    setHasSearched(true)
    try {
      const data = await quizService.searchPublicQuizzes(
        kw || undefined,
        cat || undefined,
        diff || undefined,
      )
      setResults(data)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce keyword changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      search(keyword, category, difficulty)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [keyword, category, difficulty, search])

  const clearFilters = useCallback(() => {
    setKeyword('')
    setCategory('')
    setDifficulty('')
  }, [])

  return {
    keyword,
    setKeyword,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    results,
    loading,
    hasSearched,
    clearFilters,
  }
}
