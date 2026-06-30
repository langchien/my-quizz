import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { parseQuizJson, type ParsedQuiz } from '@/utils/importParser'
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Copy,
  FileJson,
  Sparkles,
  Upload,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface ImportQuizDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (parsedData: ParsedQuiz) => void
  mode: 'quiz' | 'questions'
}

export function ImportQuizDialog({ isOpen, onClose, onImport, mode }: ImportQuizDialogProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste')
  const [jsonText, setJsonText] = useState('')
  const [dragActive, setDragActive] = useState(false)

  // State phân tích dữ liệu
  const [parsedData, setParsedData] = useState<ParsedQuiz | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [quizTitle, setQuizTitle] = useState('')
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset state khi mở/đóng dialog
  useEffect(() => {
    if (isOpen) {
      setJsonText('')
      setParsedData(null)
      setErrorMsg(null)
      setQuizTitle('')
      setExpandedQuestions({})
      setActiveTab('paste')
    }
  }, [isOpen])

  // Phân tích JSON khi jsonText thay đổi
  useEffect(() => {
    if (!jsonText.trim()) {
      setParsedData(null)
      setErrorMsg(null)
      return
    }

    try {
      const parsed = parseQuizJson(jsonText)
      setParsedData(parsed)
      setErrorMsg(null)
      if (parsed.title) {
        setQuizTitle(parsed.title)
      } else {
        setQuizTitle('')
      }
    } catch (err: any) {
      setParsedData(null)
      setErrorMsg(err.message || 'Lỗi không xác định khi parse JSON')
    }
  }, [jsonText])

  // Xử lý khi chọn file JSON
  const handleFile = (file: File) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      toast.error('Vui lòng chọn file định dạng .json')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setJsonText(text)
    }
    reader.onerror = () => {
      toast.error('Không thể đọc file này.')
    }
    reader.readAsText(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  // Xử lý kéo thả file
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const toggleQuestionExpand = (idx: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  const handleConfirmImport = () => {
    if (!parsedData) return

    if (mode === 'quiz' && !quizTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề cho Quiz.')
      return
    }

    const finalData: ParsedQuiz = {
      ...parsedData,
      title: mode === 'quiz' ? quizTitle.trim() : parsedData.title,
    }

    onImport(finalData)
    onClose()
  }

  const handleCopyTemplate = (type: 'simplified' | 'full') => {
    const simplifiedTemplate = [
      {
        question: 'Thủ đô của Việt Nam là gì?',
        answers: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ'],
        correctIndex: 0,
      },
      {
        question: 'Chiến dịch Điện Biên Phủ kết thúc vào năm nào?',
        answers: ['1945', '1954', '1975', '1986'],
        correctAnswer: '1954',
      },
    ]

    const fullTemplate = {
      title: 'Trắc nghiệm Lịch sử',
      description: 'Bộ câu hỏi kiểm tra kiến thức lịch sử cận đại',
      questions: [
        {
          content: 'Thủ đô của Việt Nam là gì?',
          type: 'multiple_choice',
          timeLimit: 20,
          points: 1000,
          options: [
            { content: 'Hà Nội', isCorrect: true },
            { content: 'TP. Hồ Chí Minh', isCorrect: false },
            { content: 'Đà Nẵng', isCorrect: false },
          ],
        },
      ],
    }

    const templateString = JSON.stringify(
      type === 'simplified' ? simplifiedTemplate : fullTemplate,
      null,
      2,
    )

    navigator.clipboard
      .writeText(templateString)
      .then(() => {
        toast.success(`Đã copy mẫu JSON ${type === 'simplified' ? 'cơ bản' : 'đầy đủ'}!`)
      })
      .catch((err) => {
        console.error('Không thể copy:', err)
        toast.error('Không thể sao chép mẫu.')
      })
  }

  const handleFormatJson = () => {
    if (!jsonText.trim()) return
    try {
      const parsed = JSON.parse(jsonText)
      setJsonText(JSON.stringify(parsed, null, 2))
      toast.success('Đã định dạng JSON thành công!')
    } catch (err: any) {
      toast.error('JSON không hợp lệ để định dạng.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-h-[90vh] min-w-4xl overflow-y-auto border-border bg-card'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-foreground'>
            {mode === 'quiz' ? 'Import Quiz từ JSON' : 'Import câu hỏi từ JSON'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'quiz'
              ? 'Tải lên hoặc dán nội dung JSON chứa thông tin Quiz và các câu hỏi.'
              : 'Thêm nhanh câu hỏi vào Quiz hiện tại bằng dữ liệu JSON.'}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs — shadcn */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'paste' | 'upload')}
          className='my-2'
        >
          <TabsList variant='line' className='border-b border-border'>
            <TabsTrigger value='paste' className='gap-2'>
              <Clipboard data-icon='inline-start' /> Dán JSON
            </TabsTrigger>
            <TabsTrigger value='upload' className='gap-2'>
              <Upload data-icon='inline-start' /> Tải file lên
            </TabsTrigger>
          </TabsList>

          <TabsContent value='paste' className='mt-4 flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <Label htmlFor='json-input' className='text-xs text-muted-foreground'>
                  Dán chuỗi JSON định dạng Quiz vào đây:
                </Label>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-7 gap-1.5 px-2.5 text-[10px]'
                    onClick={() => handleCopyTemplate('simplified')}
                  >
                    <Copy data-icon='inline-start' /> Mẫu cơ bản
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-7 gap-1.5 px-2.5 text-[10px]'
                    onClick={() => handleCopyTemplate('full')}
                  >
                    <Copy data-icon='inline-start' /> Mẫu đầy đủ
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-7 gap-1.5 px-2.5 text-[10px]'
                    onClick={handleFormatJson}
                    disabled={!jsonText.trim() || !!errorMsg}
                  >
                    <Sparkles data-icon='inline-start' /> Định dạng
                  </Button>
                </div>
              </div>
              <Textarea
                id='json-input'
                placeholder={`Ví dụ định dạng tối giản:\n[\n  {\n    "question": "Thủ đô của Việt Nam là gì?",\n    "answers": ["Hà Nội", "TP. HCM", "Đà Nẵng"],\n    "correctIndex": 0\n  }\n]`}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className={cn(
                  '[field-sizing:normal] h-60 max-h-80 resize-y overflow-y-auto border-border bg-muted/50 font-mono text-xs break-words whitespace-pre-wrap transition-colors duration-200',
                  errorMsg && 'border-destructive focus-visible:ring-destructive',
                  parsedData && 'border-success focus-visible:ring-success',
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value='upload' className='mt-4 flex flex-col gap-4'>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-all',
                dragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary hover:bg-muted/50',
              )}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='.json'
                onChange={handleFileChange}
                className='hidden'
              />
              <FileJson className='mb-2 size-12 text-muted-foreground' />
              <p className='text-sm font-medium text-foreground'>
                Kéo thả file JSON vào đây hoặc nhấp để chọn file
              </p>
              <p className='mt-1 text-xs text-muted-foreground'>Chỉ chấp nhận file .json</p>
              {jsonText && (
                <div className='mt-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs text-success'>
                  <CheckCircle2 className='size-3.5' /> Đã tải nội dung file thành công
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className='flex flex-col gap-4'>
          {/* Hiển thị lỗi nếu parse thất bại */}
          {errorMsg && (
            <div className='flex animate-in items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive duration-200 fade-in slide-in-from-top-1'>
              <AlertCircle className='mt-0.5 size-5 shrink-0' />
              <div>
                <p className='font-semibold'>Lỗi cú pháp hoặc cấu trúc JSON:</p>
                <p className='mt-1 font-mono text-xs break-all'>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Hiển thị Xem trước (Preview) nếu parse thành công */}
          {parsedData && (
            <div className='flex animate-in flex-col gap-4 rounded-xl border border-border bg-muted/50 p-4 duration-200 fade-in'>
              <div className='flex items-center gap-2 text-success'>
                <CheckCircle2 className='size-5 shrink-0' />
                <span className='text-sm font-semibold'>Phân tích JSON thành công!</span>
              </div>

              {/* Nhập tiêu đề Quiz ở mode quiz */}
              {mode === 'quiz' && (
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='quiz-title' className='text-sm font-medium'>
                    Tiêu đề bộ Quiz <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='quiz-title'
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder='Nhập tiêu đề cho bộ Quiz này...'
                    className='bg-background'
                  />
                </div>
              )}

              {/* Tóm tắt thông tin */}
              <div className='flex flex-col gap-1 text-xs text-muted-foreground'>
                {mode === 'questions' && parsedData.title && (
                  <p>
                    <span className='font-semibold'>Tiêu đề phát hiện trong file:</span>{' '}
                    {parsedData.title}
                  </p>
                )}
                {parsedData.description && (
                  <p className='line-clamp-2'>
                    <span className='font-semibold'>Mô tả:</span> {parsedData.description}
                  </p>
                )}
                <p>
                  <span className='font-semibold'>Số lượng câu hỏi phân tích được:</span>{' '}
                  <span className='text-sm font-bold text-foreground'>
                    {parsedData.questions.length}
                  </span>{' '}
                  câu hỏi
                </p>
              </div>

              {/* Preview chi tiết câu hỏi */}
              <div className='flex flex-col gap-2 border-t border-border pt-3'>
                <p className='text-xs font-semibold text-foreground'>
                  Xem trước danh sách câu hỏi:
                </p>
                <div className='flex max-h-52 flex-col gap-2 overflow-y-auto pr-1'>
                  {parsedData.questions.map((q, qIdx) => {
                    const isExpanded = !!expandedQuestions[qIdx]
                    const correctOption = q.options.find((o) => o.isCorrect)

                    return (
                      <div
                        key={q.id}
                        className='overflow-hidden rounded-lg border border-border bg-card text-xs'
                      >
                        <button
                          type='button'
                          onClick={() => toggleQuestionExpand(qIdx)}
                          className='flex w-full items-center justify-between p-2.5 text-left font-medium transition-colors hover:bg-muted/50'
                        >
                          <span className='flex-1 truncate pr-4 text-foreground'>
                            <span className='mr-1 font-semibold text-primary'>Q{qIdx + 1}.</span>
                            {q.content}
                          </span>
                          <span className='flex shrink-0 items-center gap-2'>
                            <span className='rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground'>
                              {q.timeLimit}s | {q.points}đ
                            </span>
                            {isExpanded ? (
                              <ChevronUp className='size-3.5 text-muted-foreground' />
                            ) : (
                              <ChevronDown className='size-3.5 text-muted-foreground' />
                            )}
                          </span>
                        </button>

                        {isExpanded ? (
                          <div className='flex flex-col gap-1.5 border-t border-border bg-muted/30 p-2.5'>
                            {q.options.map((opt, optIdx) => (
                              <div
                                key={opt.id}
                                className={cn(
                                  'flex items-start gap-2 rounded p-1.5',
                                  opt.isCorrect
                                    ? 'border border-success/30 bg-success/10 font-medium text-success'
                                    : 'text-muted-foreground',
                                )}
                              >
                                <span className='shrink-0 font-semibold'>
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{opt.content}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          correctOption && (
                            <div className='flex items-center gap-1 px-2.5 pb-2 text-[11px] text-success'>
                              <span className='shrink-0 font-semibold'>Đáp án đúng:</span>
                              <span className='truncate'>{correctOption.content}</span>
                            </div>
                          )
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className='mt-4'>
          <Button variant='outline' onClick={onClose} type='button'>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirmImport}
            disabled={!parsedData || (mode === 'quiz' && !quizTitle.trim())}
            className='gap-2'
            type='button'
          >
            <CheckCircle2 data-icon='inline-start' /> Xác nhận Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
