import { useAuth } from '@/hooks/useAuth'
import { quizService } from '@/services/quizService'
import type { Quiz } from '@/types/quiz'
import { useCallback, useState } from 'react'

export function useQuizzes() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuizzes = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data = await quizService.getQuizzesByCreator(user.uid)
      setQuizzes(data)
    } catch (err: any) {
      console.error('Error fetching quizzes:', err)
      setError(err.message || 'Lỗi khi tải danh sách bộ câu hỏi')
    } finally {
      setLoading(false)
    }
  }, [user])

  const createQuiz = useCallback(
    async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'creatorId'>) => {
      if (!user) throw new Error('User not authenticated')

      setLoading(true)
      setError(null)
      try {
        const newQuiz = await quizService.createQuiz({
          ...quizData,
          creatorId: user.uid,
        })
        setQuizzes((prev) => [newQuiz, ...prev])
        return newQuiz
      } catch (err: any) {
        console.error('Error creating quiz:', err)
        setError(err.message || 'Lỗi khi tạo bộ câu hỏi')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  const updateQuiz = useCallback(
    async (id: string, quizData: Partial<Omit<Quiz, 'id' | 'createdAt'>>) => {
      setLoading(true)
      setError(null)
      try {
        const updatedQuiz = await quizService.updateQuiz(id, quizData)
        setQuizzes((prev) => prev.map((q) => (q.id === id ? updatedQuiz : q)))
        return updatedQuiz
      } catch (err: any) {
        console.error('Error updating quiz:', err)
        setError(err.message || 'Lỗi khi cập nhật bộ câu hỏi')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const deleteQuiz = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await quizService.deleteQuiz(id)
      setQuizzes((prev) => prev.filter((q) => q.id !== id))
    } catch (err: any) {
      console.error('Error deleting quiz:', err)
      setError(err.message || 'Lỗi khi xóa bộ câu hỏi')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getQuizById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const quiz = await quizService.getQuizById(id)
      return quiz
    } catch (err: any) {
      console.error('Error fetching quiz by id:', err)
      setError(err.message || 'Lỗi khi lấy thông tin bộ câu hỏi')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuizById,
  }
}
