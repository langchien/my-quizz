import { useCallback, useState } from 'react'
import { useNavigate, useRevalidator } from 'react-router'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { quizService } from '@/services/quizService'
import { roomService } from '@/services/roomService'

/**
 * Custom hook cho các actions trên trang Dashboard.
 * Bao gồm: Host game session, Delete quiz (với revalidation).
 */
export function useDashboardActions() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const [hostingQuizId, setHostingQuizId] = useState<string | null>(null)

  // Tạo live session và navigate đến host page
  const handleHost = useCallback(
    async (quizId: string) => {
      if (!user) return
      setHostingQuizId(quizId)
      try {
        const { sessionId } = await roomService.createLiveSession(quizId, user.uid)
        navigate(`/host/${sessionId}`)
      } catch (err) {
        console.error(err)
        toast.error('Không thể tạo phòng lúc này')
      } finally {
        setHostingQuizId(null)
      }
    },
    [user, navigate],
  )

  // Xóa quiz và revalidate loader data
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await quizService.deleteQuiz(id)
        revalidator.revalidate()
        toast.success('Đã xóa bộ câu hỏi thành công')
      } catch (err: any) {
        console.error('Error deleting quiz:', err)
        toast.error(err.message || 'Lỗi khi xóa bộ câu hỏi')
      }
    },
    [revalidator],
  )

  return {
    handleHost,
    handleDelete,
    hostingQuizId,
    isRevalidating: revalidator.state === 'loading',
  }
}
