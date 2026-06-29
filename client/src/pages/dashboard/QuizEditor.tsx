import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useQuizEditor } from '@/hooks/useQuizEditor'
import type { Quiz } from '@/types/quiz'
import { ArrowLeft, CheckCircle2, Plus, Save, Trash2 } from 'lucide-react'
import { useLoaderData, useNavigate } from 'react-router'

export default function QuizEditor() {
  const navigate = useNavigate()

  // Data từ quizEditorLoader (null cho create mode)
  const loaderData = useLoaderData() as { quiz: Quiz | null } | undefined
  const initialQuiz = loaderData?.quiz ?? null

  // Toàn bộ logic form nằm trong custom hook
  const {
    title,
    setTitle,
    description,
    setDescription,
    isPublished,
    setIsPublished,
    questions,
    isEditMode,
    saving,
    error,
    setError,
    handleSave,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateOption,
  } = useQuizEditor(initialQuiz)

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

      {saving && (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300'>
          <div className='flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200'>
            <div className='relative flex h-16 w-16 items-center justify-center'>
              {/* Outer rotating ring */}
              <div className='absolute inset-0 rounded-full border-4 border-rose-500/20 border-t-rose-600 animate-spin' />
              {/* Inner reverse rotating ring */}
              <div className='absolute h-10 w-10 rounded-full border-4 border-rose-500/10 border-b-rose-500 animate-spin [animation-duration:1.5s] [animation-direction:reverse]' />
              {/* Pulsing core dot */}
              <div className='h-4 w-4 rounded-full bg-rose-600 animate-pulse' />
            </div>
            <div className='text-center space-y-1.5'>
              <p className='text-base font-semibold text-slate-800 dark:text-slate-100'>
                {isEditMode ? 'Đang cập nhật bộ câu hỏi...' : 'Đang tạo bộ câu hỏi mới...'}
              </p>
              <p className='text-xs text-slate-400 dark:text-slate-500'>
                Vui lòng không đóng trình duyệt hoặc tải lại trang
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
