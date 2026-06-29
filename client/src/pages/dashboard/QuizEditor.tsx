import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuizzes } from '@/hooks/useQuizzes'
import type { Question, AnswerOption } from '@/types/quiz'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react'

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

export default function QuizEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getQuizById, createQuiz, updateQuiz } = useQuizzes()

  const isEditMode = !!id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([defaultQuestion()])

  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditMode && id) {
      loadQuiz(id)
    }
  }, [id, isEditMode])

  const loadQuiz = async (quizId: string) => {
    setLoading(true)
    try {
      const quiz = await getQuizById(quizId)
      if (quiz) {
        setTitle(quiz.title)
        setDescription(quiz.description || '')
        setIsPublished(quiz.isPublished)
        setQuestions(quiz.questions?.length > 0 ? quiz.questions : [defaultQuestion()])
      } else {
        setError('Không tìm thấy bài trắc nghiệm')
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải bài trắc nghiệm')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Validate
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

      if (isEditMode && id) {
        await updateQuiz(id, quizData)
      } else {
        await createQuiz(quizData)
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu bài trắc nghiệm')
      setSaving(false)
    }
  }

  const addQuestion = () => {
    setQuestions([...questions, defaultQuestion()])
  }

  const removeQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      setError('Bài trắc nghiệm phải có ít nhất 1 câu hỏi')
      return
    }
    const newQuestions = [...questions]
    newQuestions.splice(qIndex, 1)
    setQuestions(newQuestions)
  }

  const updateQuestion = (qIndex: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions]
    newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value }
    setQuestions(newQuestions)
  }

  const updateOption = (qIndex: number, oIndex: number, field: keyof AnswerOption, value: any) => {
    const newQuestions = [...questions]
    const newOptions = [...newQuestions[qIndex].options]

    // If setting a correct answer, uncheck others for multiple choice single answer
    if (field === 'isCorrect' && value === true) {
      newOptions.forEach((opt) => (opt.isCorrect = false))
    }

    newOptions[oIndex] = { ...newOptions[oIndex], [field]: value }
    newQuestions[qIndex].options = newOptions
    setQuestions(newQuestions)
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-rose-500/30 border-t-rose-500'></div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20 dark:bg-slate-950'>
      <header className='sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-4'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className='text-xl font-bold text-gray-800 dark:text-slate-100'>
              {isEditMode ? 'Chỉnh sửa Quiz' : 'Tạo Quiz mới'}
            </h1>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              onClick={() => setIsPublished(!isPublished)}
              className={
                isPublished ? 'border-green-200 bg-green-50 text-green-600' : 'text-gray-500'
              }
            >
              {isPublished ? 'Đã Công khai' : 'Lưu Nháp'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className='gap-2 bg-rose-600 text-white hover:bg-rose-700'
            >
              <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu lại'}
            </Button>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-5xl px-4 py-8'>
        {error && (
          <div className='mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400'>
            <span>{error}</span>
            <Button variant='ghost' size='sm' onClick={() => setError('')}>
              Đóng
            </Button>
          </div>
        )}

        <Card className='mb-8 border-gray-200 shadow-sm dark:border-slate-800'>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
            <CardDescription>Tiêu đề và mô tả cho bộ câu hỏi của bạn.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>
                Tiêu đề Quiz <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='title'
                placeholder='VD: Kiểm tra kiến thức Lịch sử lớp 12'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='text-lg'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Mô tả (tùy chọn)</Label>
              <Textarea
                id='description'
                placeholder='Mô tả ngắn gọn về bộ câu hỏi...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-gray-800 dark:text-slate-100'>
              Danh sách câu hỏi ({questions.length})
            </h2>
          </div>

          {questions.map((q, qIndex) => (
            <Card
              key={q.id}
              className='relative overflow-hidden border-gray-200 shadow-sm dark:border-slate-800'
            >
              <div className='absolute top-0 left-0 h-full w-2 bg-blue-500'></div>
              <CardHeader className='flex flex-row items-start justify-between pb-2'>
                <div className='font-semibold text-gray-500 dark:text-gray-400'>
                  Câu hỏi {qIndex + 1}
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-red-500 hover:bg-red-50 hover:text-red-600'
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 size={18} />
                </Button>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label>
                    Nội dung câu hỏi <span className='text-red-500'>*</span>
                  </Label>
                  <Textarea
                    placeholder='Nhập nội dung câu hỏi...'
                    value={q.content}
                    onChange={(e) => updateQuestion(qIndex, 'content', e.target.value)}
                    className='text-lg font-medium'
                    rows={2}
                  />
                </div>

                <div className='flex gap-4'>
                  <div className='flex-1 space-y-2'>
                    <Label>Thời gian (giây)</Label>
                    <Select
                      value={q.timeLimit.toString()}
                      onValueChange={(v) => updateQuestion(qIndex, 'timeLimit', parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn thời gian' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='10'>10 giây</SelectItem>
                        <SelectItem value='20'>20 giây</SelectItem>
                        <SelectItem value='30'>30 giây</SelectItem>
                        <SelectItem value='60'>60 giây</SelectItem>
                        <SelectItem value='90'>90 giây</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex-1 space-y-2'>
                    <Label>Điểm</Label>
                    <Select
                      value={q.points.toString()}
                      onValueChange={(v) => updateQuestion(qIndex, 'points', parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn điểm' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='500'>500 điểm</SelectItem>
                        <SelectItem value='1000'>1000 điểm (Tiêu chuẩn)</SelectItem>
                        <SelectItem value='2000'>2000 điểm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-3'>
                  <Label>
                    Các đáp án (Đánh dấu vào đáp án đúng) <span className='text-red-500'>*</span>
                  </Label>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {q.options.map((opt, oIndex) => {
                      const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500']
                      const bgColor = colors[oIndex % colors.length]

                      return (
                        <div key={opt.id} className='group relative flex items-center'>
                          <div
                            className={`absolute top-[1px] left-[1px] flex h-[calc(100%-2px)] w-12 cursor-pointer items-center justify-center rounded-l-md text-lg font-bold text-white ${bgColor} opacity-90 transition-opacity hover:opacity-100`}
                            onClick={() => updateOption(qIndex, oIndex, 'isCorrect', true)}
                          >
                            {opt.isCorrect && (
                              <CheckCircle2 size={24} className='text-white drop-shadow-md' />
                            )}
                          </div>
                          <Input
                            value={opt.content}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, 'content', e.target.value)
                            }
                            placeholder={`Lựa chọn ${oIndex + 1}`}
                            className={`h-12 pl-16 shadow-sm ${opt.isCorrect ? 'border-2 border-gray-400 dark:border-gray-500' : 'border-gray-200 dark:border-slate-800'}`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={addQuestion}
            variant='outline'
            className='w-full gap-2 border-2 border-dashed border-gray-300 py-8 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-gray-100'
          >
            <Plus size={20} /> Thêm câu hỏi
          </Button>
        </div>
      </main>
    </div>
  )
}
