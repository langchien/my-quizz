import { ImportQuizDialog } from '@/components/ImportQuizDialog'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
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
import { cn } from '@/lib/utils'
import type { Quiz } from '@/types/quiz'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileJson,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router'

export default function QuizEditor() {
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
    importQuestions,
  } = useQuizEditor(initialQuiz)

  const [isImportOpen, setIsImportOpen] = useState(false)

  const gameOptionColors = [
    'bg-game-option-1',
    'bg-game-option-2',
    'bg-game-option-3',
    'bg-game-option-4',
  ]

  return (
    <div className='min-h-screen bg-background pb-20'>
      <header className='sticky top-0 z-10 border-b border-border bg-card'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-4'>
          <div className='flex items-center gap-4'>
            <Link
              to='/dashboard'
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
            >
              <ArrowLeft />
            </Link>
            <h1 className='text-xl font-bold text-foreground'>
              {isEditMode ? 'Chỉnh sửa Quiz' : 'Tạo Quiz mới'}
            </h1>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              onClick={() => setIsPublished(!isPublished)}
              className={cn(
                isPublished && 'border-success/30 bg-success/10 text-success',
                !isPublished && 'text-muted-foreground',
              )}
            >
              {isPublished ? 'Đã Công khai' : 'Lưu Nháp'}
            </Button>
            <Button onClick={handleSave} disabled={saving} className='gap-2'>
              <Save data-icon='inline-start' /> {saving ? 'Đang lưu...' : 'Lưu lại'}
            </Button>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-5xl px-4 py-8'>
        {error && (
          <Alert variant='destructive' className='mb-6'>
            <AlertTriangle />
            <AlertDescription className='flex items-center justify-between'>
              <span>{error}</span>
              <Button variant='ghost' size='sm' onClick={() => setError('')}>
                <X data-icon='inline-start' /> Đóng
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card className='mb-8 border-border shadow-sm'>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
            <CardDescription>Tiêu đề và mô tả cho bộ câu hỏi của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-4'>
              <Field>
                <Label htmlFor='title'>
                  Tiêu đề Quiz <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='title'
                  placeholder='VD: Kiểm tra kiến thức Lịch sử lớp 12'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='text-lg'
                />
              </Field>
              <Field>
                <Label htmlFor='description'>Mô tả (tùy chọn)</Label>
                <Textarea
                  id='description'
                  placeholder='Mô tả ngắn gọn về bộ câu hỏi...'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-foreground'>
              Danh sách câu hỏi ({questions.length})
            </h2>
          </div>

          {questions.map((q, qIndex) => (
            <Card key={q.id} className='relative overflow-hidden border-border shadow-sm'>
              <div className='absolute top-0 left-0 h-full w-2 bg-primary' />
              <CardHeader className='flex flex-row items-start justify-between pb-2'>
                <div className='font-semibold text-muted-foreground'>Câu hỏi {qIndex + 1}</div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 />
                </Button>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-4'>
                  <Field>
                    <Label>
                      Nội dung câu hỏi <span className='text-destructive'>*</span>
                    </Label>
                    <Textarea
                      placeholder='Nhập nội dung câu hỏi...'
                      value={q.content}
                      onChange={(e) => updateQuestion(qIndex, 'content', e.target.value)}
                      className='text-lg font-medium'
                      rows={2}
                    />
                  </Field>

                  <div className='flex gap-4'>
                    <Field className='flex-1'>
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
                    </Field>
                    <Field className='flex-1'>
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
                    </Field>
                  </div>

                  <div className='flex flex-col gap-3'>
                    <Label>
                      Các đáp án (Đánh dấu vào đáp án đúng){' '}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      {q.options.map((opt, oIndex) => {
                        const bgColor = gameOptionColors[oIndex % gameOptionColors.length]

                        return (
                          <div key={opt.id} className='group relative flex items-center'>
                            <div
                              className={cn(
                                'absolute top-[1px] left-[1px] flex h-[calc(100%-2px)] w-12 cursor-pointer items-center justify-center rounded-l-md text-lg font-bold text-white opacity-90 transition-opacity hover:opacity-100',
                                bgColor,
                              )}
                              onClick={() => updateOption(qIndex, oIndex, 'isCorrect', true)}
                            >
                              {opt.isCorrect && (
                                <CheckCircle2 className='text-white drop-shadow-md' />
                              )}
                            </div>
                            <Input
                              value={opt.content}
                              onChange={(e) =>
                                updateOption(qIndex, oIndex, 'content', e.target.value)
                              }
                              placeholder={`Lựa chọn ${oIndex + 1}`}
                              className={cn(
                                'h-12 pl-16 shadow-sm',
                                opt.isCorrect ? 'border-2 border-foreground/30' : 'border-border',
                              )}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className='flex w-full flex-col gap-4 sm:flex-row'>
            <Button
              onClick={addQuestion}
              variant='outline'
              className='flex-1 gap-2 border-2 border-dashed border-border py-8 text-muted-foreground hover:bg-muted hover:text-foreground'
            >
              <Plus data-icon='inline-start' /> Thêm câu hỏi
            </Button>
            <Button
              onClick={() => setIsImportOpen(true)}
              variant='outline'
              className='flex-1 gap-2 border-2 border-dashed border-border py-8 text-muted-foreground hover:bg-muted hover:text-foreground'
            >
              <FileJson data-icon='inline-start' /> Import câu hỏi (JSON)
            </Button>
          </div>
        </div>
      </main>

      {saving && (
        <LoadingOverlay
          message={isEditMode ? 'Đang cập nhật bộ câu hỏi...' : 'Đang tạo bộ câu hỏi mới...'}
          subMessage='Vui lòng không đóng trình duyệt hoặc tải lại trang'
        />
      )}

      <ImportQuizDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={(parsedData) => importQuestions(parsedData.questions)}
        mode='questions'
      />
    </div>
  )
}
