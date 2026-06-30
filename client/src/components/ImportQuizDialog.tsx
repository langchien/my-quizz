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
import { Textarea } from '@/components/ui/textarea'
import { parseQuizJson, type ParsedQuiz } from '@/utils/importParser'
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Copy,
  FileJson,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-h-[90vh] min-w-4xl overflow-y-auto border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-gray-900 dark:text-slate-100'>
            {mode === 'quiz' ? 'Import Quiz từ JSON' : 'Import câu hỏi từ JSON'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'quiz'
              ? 'Tải lên hoặc dán nội dung JSON chứa thông tin Quiz và các câu hỏi.'
              : 'Thêm nhanh câu hỏi vào Quiz hiện tại bằng dữ liệu JSON.'}
          </DialogDescription>
        </DialogHeader>

        {/* Custom Tabs */}
        <div className='my-2 flex border-b border-gray-200 dark:border-slate-800'>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'paste'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Clipboard size={16} /> Dán JSON
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Upload size={16} /> Tải file lên
          </button>
        </div>

        {/* Tab content */}
        <div className='my-2 space-y-4'>
          {activeTab === 'paste' ? (
            <div className='space-y-2'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <Label htmlFor='json-input' className='text-xs text-gray-500 dark:text-slate-400'>
                  Dán chuỗi JSON định dạng Quiz vào đây:
                </Label>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-7 gap-1.5 border-slate-200 px-2.5 text-[10px] text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                    onClick={() => handleCopyTemplate('simplified')}
                  >
                    <Copy size={12} /> Mẫu cơ bản
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-7 gap-1.5 border-slate-200 px-2.5 text-[10px] text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                    onClick={() => handleCopyTemplate('full')}
                  >
                    <Copy size={12} /> Mẫu đầy đủ
                  </Button>
                </div>
              </div>
              <Textarea
                id='json-input'
                placeholder={`Ví dụ định dạng tối giản:\n[\n  {\n    "question": "Thủ đô của Việt Nam là gì?",\n    "answers": ["Hà Nội", "TP. HCM", "Đà Nẵng"],\n    "correctIndex": 0\n  }\n]`}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className='[field-sizing:normal] h-60 max-h-80 resize-y overflow-y-auto border-gray-200 bg-gray-50/50 font-mono text-xs break-words whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-950/30'
              />
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-all ${
                dragActive
                  ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/10'
                  : 'border-gray-300 hover:border-rose-500 hover:bg-gray-50/50 dark:border-slate-700 dark:hover:bg-slate-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='.json'
                onChange={handleFileChange}
                className='hidden'
              />
              <FileJson className='mb-2 h-12 w-12 text-gray-400' />
              <p className='text-sm font-medium text-gray-700 dark:text-slate-300'>
                Kéo thả file JSON vào đây hoặc nhấp để chọn file
              </p>
              <p className='mt-1 text-xs text-gray-400'>Chỉ chấp nhận file .json</p>
              {jsonText && (
                <div className='mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400'>
                  <CheckCircle2 size={14} /> Đã tải nội dung file thành công
                </div>
              )}
            </div>
          )}

          {/* Hiển thị lỗi nếu parse thất bại */}
          {errorMsg && (
            <div className='flex animate-in items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 duration-200 fade-in slide-in-from-top-1 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400'>
              <AlertCircle className='mt-0.5 h-5 w-5 shrink-0' />
              <div>
                <p className='font-semibold'>Lỗi cú pháp hoặc cấu trúc JSON:</p>
                <p className='mt-1 font-mono text-xs break-all'>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Hiển thị Xem trước (Preview) nếu parse thành công */}
          {parsedData && (
            <div className='animate-in space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 duration-200 fade-in dark:border-slate-800 dark:bg-slate-900/50'>
              <div className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                <CheckCircle2 className='h-5 w-5 shrink-0' />
                <span className='text-sm font-semibold'>Phân tích JSON thành công!</span>
              </div>

              {/* Nhập tiêu đề Quiz ở mode quiz */}
              {mode === 'quiz' && (
                <div className='space-y-2'>
                  <Label htmlFor='quiz-title' className='text-sm font-medium'>
                    Tiêu đề bộ Quiz <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='quiz-title'
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder='Nhập tiêu đề cho bộ Quiz này...'
                    className='bg-white dark:bg-slate-950'
                  />
                </div>
              )}

              {/* Tóm tắt thông tin */}
              <div className='space-y-1 text-xs text-gray-500 dark:text-slate-400'>
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
                  <span className='text-sm font-bold text-gray-900 dark:text-white'>
                    {parsedData.questions.length}
                  </span>{' '}
                  câu hỏi
                </p>
              </div>

              {/* Preview chi tiết câu hỏi */}
              <div className='space-y-2 border-t border-gray-200 pt-3 dark:border-slate-800'>
                <p className='text-xs font-semibold text-gray-700 dark:text-slate-300'>
                  Xem trước danh sách câu hỏi:
                </p>
                <div className='max-h-52 space-y-2 overflow-y-auto pr-1'>
                  {parsedData.questions.map((q, qIdx) => {
                    const isExpanded = !!expandedQuestions[qIdx]
                    const correctOption = q.options.find((o) => o.isCorrect)

                    return (
                      <div
                        key={q.id}
                        className='overflow-hidden rounded-lg border border-gray-200 bg-white text-xs dark:border-slate-800 dark:bg-slate-950'
                      >
                        <button
                          type='button'
                          onClick={() => toggleQuestionExpand(qIdx)}
                          className='flex w-full items-center justify-between p-2.5 text-left font-medium transition-colors hover:bg-gray-50 dark:hover:bg-slate-900/50'
                        >
                          <span className='flex-1 truncate pr-4'>
                            <span className='mr-1 font-semibold text-rose-500 dark:text-rose-400'>
                              Q{qIdx + 1}.
                            </span>
                            {q.content}
                          </span>
                          <span className='flex shrink-0 items-center gap-2'>
                            <span className='rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-slate-800'>
                              {q.timeLimit}s | {q.points}đ
                            </span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        </button>

                        {isExpanded ? (
                          <div className='space-y-1.5 border-t border-gray-100 bg-gray-50/30 p-2.5 dark:border-slate-800/80 dark:bg-slate-950'>
                            {q.options.map((opt, optIdx) => (
                              <div
                                key={opt.id}
                                className={`flex items-start gap-2 rounded p-1.5 ${
                                  opt.isCorrect
                                    ? 'border border-green-200 bg-green-50 font-medium text-green-700 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-400'
                                    : 'text-gray-600 dark:text-slate-400'
                                }`}
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
                            <div className='flex items-center gap-1 px-2.5 pb-2 text-[11px] text-green-600 dark:text-green-400'>
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
            className='gap-2 bg-rose-600 text-white hover:bg-rose-700'
            type='button'
          >
            <CheckCircle2 size={16} /> Xác nhận Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
