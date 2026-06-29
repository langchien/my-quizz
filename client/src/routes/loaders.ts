import { redirect, type LoaderFunctionArgs } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { quizService } from '@/services/quizService'

/**
 * Loader cho trang Dashboard.
 * Lấy danh sách quizzes của user hiện tại.
 * Chạy SAU khi auth đã initialized (App.tsx đảm bảo).
 */
export async function dashboardLoader() {
  const user = useAuth.getState().user
  if (!user) throw redirect('/login')

  const quizzes = await quizService.getQuizzesByCreator(user.uid)
  return { quizzes }
}

/**
 * Loader cho trang QuizEditor (edit mode).
 * Lấy quiz theo ID từ URL params.
 * Trả về null cho create mode (không có :id).
 */
export async function quizEditorLoader({ params }: LoaderFunctionArgs) {
  const { id } = params
  if (!id) return { quiz: null }

  const quiz = await quizService.getQuizById(id)
  if (!quiz) {
    throw new Response('Không tìm thấy bộ câu hỏi', { status: 404 })
  }

  return { quiz }
}

/**
 * Loader cho trang SoloPlay.
 * Lấy quiz theo quizId từ URL params (public, không cần auth).
 */
export async function soloLoader({ params }: LoaderFunctionArgs) {
  const { quizId } = params
  console.log('=== soloLoader: quizId ===', quizId)
  if (!quizId) {
    throw new Response('Thiếu mã quiz', { status: 400 })
  }

  try {
    const quiz = await quizService.getQuizById(quizId)
    console.log('=== soloLoader: quiz found ===', quiz)
    if (!quiz) {
      console.warn('=== soloLoader: quiz not found in firestore, throwing 404 ===')
      throw new Response('Không tìm thấy bộ câu hỏi', { status: 404 })
    }
    return quiz
  } catch (err) {
    console.error('=== soloLoader: error ===', err)
    throw err
  }
}
