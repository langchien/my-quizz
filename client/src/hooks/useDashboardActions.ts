import { useAuth } from '@/hooks/useAuth'
import { quizService } from '@/services/quizService'
import { roomService } from '@/services/roomService'
import { useCallback, useState } from 'react'
import { useNavigate, useRevalidator } from 'react-router'
import { toast } from 'sonner'

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
    async (quizId: string, quizTitle?: string) => {
      if (!user) return
      setHostingQuizId(quizId)
      const toastId = toast.loading('Đang tạo phòng...')
      try {
        const { sessionId } = await roomService.createLiveSession(quizId, user.uid, quizTitle)
        toast.dismiss(toastId)
        navigate(`/host/${sessionId}`)
      } catch (err) {
        console.error(err)
        toast.error('Không thể tạo phòng lúc này', { id: toastId })
      } finally {
        setHostingQuizId(null)
      }
    },
    [user, navigate],
  )

  const [importing, setImporting] = useState(false)

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

  // Import quiz mới và lưu vào DB
  const handleImportQuiz = useCallback(
    async (parsedData: { title?: string; description?: string; questions: any[] }) => {
      if (!user) {
        toast.error('Vui lòng đăng nhập để thực hiện chức năng này.')
        return
      }
      if (!parsedData.title) {
        toast.error('Tiêu đề Quiz không được để trống.')
        return
      }

      setImporting(true)
      try {
        await quizService.createQuiz({
          title: parsedData.title.trim(),
          description: parsedData.description?.trim() || '',
          questions: parsedData.questions,
          creatorId: user.uid,
          isPublished: false, // Mặc định lưu nháp
          playCount: 0,
        })
        revalidator.revalidate()
        toast.success('Import bộ câu hỏi thành công!')
      } catch (err: any) {
        console.error('Error importing quiz:', err)
        toast.error(err.message || 'Lỗi khi import bộ câu hỏi')
      } finally {
        setImporting(false)
      }
    },
    [user, revalidator],
  )

  return {
    handleHost,
    handleDelete,
    handleImportQuiz,
    hostingQuizId,
    importing,
    isRevalidating: revalidator.state === 'loading',
  }
}
