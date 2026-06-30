import { useAuth } from '@/hooks/useAuth'
import { quizService } from '@/services/quizService'
import type { AnswerOption, Question, Quiz } from '@/types/quiz'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

// Simple ID generator to avoid adding external dependency just for UI temp IDs
const generateId = () => Math.random().toString(36).substring(2, 9)

const defaultQuestion = (): Question => ({
  id: generateId(),
  type: 'multiple_choice',
  content: '',
  timeLimit: 20,
  points: 1000,
  options: [
    { id: generateId(), content: '', isCorrect: true },
    { id: generateId(), content: '', isCorrect: false },
    { id: generateId(), content: '', isCorrect: false },
    { id: generateId(), content: '', isCorrect: false },
  ],
})

/**
 * Custom hook quản lý toàn bộ logic form QuizEditor.
 * Bao gồm: form state, question CRUD, validation, save.
 *
 * @param initialQuiz - Quiz data từ loader (null cho create mode)
 */
export function useQuizEditor(initialQuiz: Quiz | null) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const isEditMode = !!initialQuiz

  const [title, setTitle] = useState(initialQuiz?.title || '')
  const [description, setDescription] = useState(initialQuiz?.description || '')
  const [isPublished, setIsPublished] = useState(initialQuiz?.isPublished || false)
  const [questions, setQuestions] = useState<Question[]>(
    initialQuiz?.questions?.length ? initialQuiz.questions : [defaultQuestion()],
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Validate and save quiz
  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài trắc nghiệm')
      return
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.content.trim()) {
        setError(`Vui lòng nhập nội dung cho câu hỏi ${i + 1}`)
        return
      }
      const hasCorrect = q.options.some((o) => o.isCorrect)
      if (!hasCorrect) {
        setError(`Câu hỏi ${i + 1} phải có ít nhất 1 đáp án đúng`)
        return
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].content.trim()) {
          setError(`Vui lòng nhập nội dung cho lựa chọn ${j + 1} của câu hỏi ${i + 1}`)
          return
        }
      }
    }

    setSaving(true)
    setError('')

    try {
      const quizData = {
        title,
        description,
        isPublished,
        questions,
      }

      if (isEditMode && initialQuiz) {
        await quizService.updateQuiz(initialQuiz.id, quizData)
        toast.success('Cập nhật bộ câu hỏi thành công!')
      } else {
        if (!user) throw new Error('User not authenticated')
        await quizService.createQuiz({
          ...quizData,
          creatorId: user.uid,
        })
        toast.success('Tạo bộ câu hỏi mới thành công!')
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu bài trắc nghiệm')
      setSaving(false)
    }
  }, [title, description, isPublished, questions, isEditMode, initialQuiz, user, navigate])

  // Add new question
  const addQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, defaultQuestion()])
  }, [])

  // Remove question (minimum 1 question required)
  const removeQuestion = useCallback(
    (qIndex: number) => {
      if (questions.length <= 1) {
        setError('Bài trắc nghiệm phải có ít nhất 1 câu hỏi')
        return
      }
      setQuestions((prev) => {
        const next = [...prev]
        next.splice(qIndex, 1)
        return next
      })
    },
    [questions.length],
  )

  // Update a question field
  const updateQuestion = useCallback((qIndex: number, field: keyof Question, value: any) => {
    setQuestions((prev) => {
      const next = [...prev]
      next[qIndex] = { ...next[qIndex], [field]: value }
      return next
    })
  }, [])

  // Update an answer option field
  const updateOption = useCallback(
    (qIndex: number, oIndex: number, field: keyof AnswerOption, value: any) => {
      setQuestions((prev) => {
        const next = [...prev]
        const newOptions = [...next[qIndex].options]

        // If setting a correct answer, uncheck others for multiple choice single answer
        if (field === 'isCorrect' && value === true) {
          newOptions.forEach((opt) => (opt.isCorrect = false))
        }

        newOptions[oIndex] = { ...newOptions[oIndex], [field]: value }
        next[qIndex] = { ...next[qIndex], options: newOptions }
        return next
      })
    },
    [],
  )

  // Import questions
  const importQuestions = useCallback((newQuestions: Question[]) => {
    setQuestions((prev) => {
      const isFirstQuestionEmpty =
        prev.length === 1 &&
        prev[0].content.trim() === '' &&
        prev[0].options.every((o) => o.content.trim() === '')

      if (isFirstQuestionEmpty) {
        return newQuestions
      }
      return [...prev, ...newQuestions]
    })
  }, [])

  return {
    // Form state
    title,
    setTitle,
    description,
    setDescription,
    isPublished,
    setIsPublished,
    questions,

    // Status
    isEditMode,
    saving,
    error,
    setError,

    // Actions
    handleSave,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateOption,
    importQuestions,
  }
}
