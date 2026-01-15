import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2, FileJson, Loader2, Upload, XCircle } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { useImportTodos } from '../hooks/useImportTodos'
import type { ImportTodoItem } from '../types'

// Zod schema cho validation
const ImportTodoItemSchema = z.object({
  id: z.string().uuid('ID phải là UUID hợp lệ').optional(),
  title: z.string().min(1, 'Tiêu đề không được trống').max(100, 'Tiêu đề tối đa 100 ký tự'),
  completed: z.boolean().optional().default(false),
})

const ImportTodosSchema = z.array(ImportTodoItemSchema).min(1, 'Cần ít nhất 1 todo để import')

// Form schema
const PasteFormSchema = z.object({
  jsonContent: z.string().min(1, 'Vui lòng nhập nội dung JSON'),
})

type PasteFormValues = z.infer<typeof PasteFormSchema>

interface ValidationResult {
  isValid: boolean
  data?: ImportTodoItem[]
  errors?: string[]
}

export const ImportTodosModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('paste')

  const importMutation = useImportTodos()

  const form = useForm<PasteFormValues>({
    resolver: zodResolver(PasteFormSchema),
    defaultValues: {
      jsonContent: '',
    },
  })

  // Validate JSON content
  const validateJson = (content: string): ValidationResult => {
    try {
      const parsed = JSON.parse(content)

      // Ensure it's an array
      if (!Array.isArray(parsed)) {
        return {
          isValid: false,
          errors: ['Dữ liệu phải là một mảng JSON'],
        }
      }

      // Validate with Zod
      const result = ImportTodosSchema.safeParse(parsed)

      if (!result.success) {
        const errors = result.error.issues.map((err) => `[${err.path.join('.')}] ${err.message}`)
        return { isValid: false, errors }
      }

      return { isValid: true, data: result.data }
    } catch {
      return {
        isValid: false,
        errors: ['JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.'],
      }
    }
  }

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const result = validateJson(content)
        setValidationResult(result)

        if (result.isValid) {
          form.setValue('jsonContent', content)
        }
      }
      reader.readAsText(file)
    },
    [form],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
  })

  // Handle paste validation
  const handleValidate = () => {
    const content = form.getValues('jsonContent')
    const result = validateJson(content)
    setValidationResult(result)
  }

  // Handle import
  const handleImport = async () => {
    if (!validationResult?.isValid || !validationResult.data) return

    try {
      const result = await importMutation.mutateAsync(validationResult.data)

      if (result.skippedCount > 0) {
        toast.warning(
          `Đã import ${result.insertedCount} todos. Bỏ qua ${result.skippedCount} items do trùng ID.`,
          {
            description: result.skippedItems.map((item) => `• ${item.title}`).join('\n'),
          },
        )
      } else {
        toast.success(`Đã import thành công ${result.insertedCount} todos!`)
      }

      // Reset state
      setIsOpen(false)
      setValidationResult(null)
      form.reset()
    } catch (error) {
      toast.error('Lỗi khi import todos', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
      })
    }
  }

  // Reset on tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'upload' | 'paste')
    setValidationResult(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'gap-2',
            'hover:border-primary/50 hover:bg-primary/5',
            'transition-all duration-300',
          )}
        >
          <FileJson className='h-4 w-4' />
          Import JSON
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <FileJson className='h-5 w-5 text-primary' />
            </div>
            Import Todos từ JSON
          </DialogTitle>
          <DialogDescription>
            Upload file JSON hoặc paste nội dung JSON để import nhiều todos cùng lúc
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className='mt-4'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='paste' className='gap-2'>
              <FileJson className='h-4 w-4' />
              Paste JSON
            </TabsTrigger>
            <TabsTrigger value='upload' className='gap-2'>
              <Upload className='h-4 w-4' />
              Upload File
            </TabsTrigger>
          </TabsList>

          {/* Paste Tab */}
          <TabsContent value='paste' className='space-y-4 mt-4'>
            <Textarea
              placeholder={`[
  { "title": "Todo 1", "completed": false },
  { "title": "Todo 2", "completed": true, "id": "uuid-optional" }
]`}
              className='min-h-[150px] font-mono text-sm'
              {...form.register('jsonContent')}
            />
            <Button type='button' variant='outline' className='w-full' onClick={handleValidate}>
              Kiểm tra JSON
            </Button>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value='upload' className='mt-4'>
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer',
                'transition-all duration-200',
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
              )}
            >
              <input {...getInputProps()} />
              <Upload
                className={cn(
                  'h-10 w-10 mx-auto mb-4',
                  isDragActive ? 'text-primary' : 'text-muted-foreground',
                )}
              />
              {isDragActive ? (
                <p className='text-primary font-medium'>Thả file vào đây...</p>
              ) : (
                <>
                  <p className='text-muted-foreground'>
                    Kéo thả file JSON vào đây, hoặc{' '}
                    <span className='text-primary font-medium'>click để chọn file</span>
                  </p>
                  <p className='text-xs text-muted-foreground/70 mt-2'>Chỉ hỗ trợ file .json</p>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Validation Result */}
        {validationResult && (
          <div
            className={cn(
              'p-4 rounded-lg border mt-4',
              validationResult.isValid
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-destructive/10 border-destructive/30',
            )}
          >
            {validationResult.isValid ? (
              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-green-600'>
                  <CheckCircle2 className='h-5 w-5' />
                  <span className='font-medium'>
                    JSON hợp lệ! Tìm thấy {validationResult.data?.length} todos
                  </span>
                </div>

                {/* Preview */}
                <div className='max-h-[120px] overflow-y-auto space-y-1'>
                  {validationResult.data?.slice(0, 5).map((item, index) => (
                    <div
                      key={item.id ?? index}
                      className='flex items-center gap-2 text-sm p-2 bg-background/50 rounded'
                    >
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          item.completed ? 'bg-green-500' : 'bg-muted-foreground/50',
                        )}
                      />
                      <span className='truncate flex-1'>{item.title}</span>
                      {item.id && (
                        <span className='text-xs text-muted-foreground font-mono'>
                          {item.id.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  ))}
                  {validationResult.data && validationResult.data.length > 5 && (
                    <p className='text-xs text-muted-foreground text-center py-1'>
                      ... và {validationResult.data.length - 5} items khác
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-destructive'>
                  <XCircle className='h-5 w-5' />
                  <span className='font-medium'>JSON không hợp lệ</span>
                </div>
                <ul className='space-y-1 max-h-[100px] overflow-y-auto'>
                  {validationResult.errors?.map((error, index) => (
                    <li key={index} className='flex items-start gap-2 text-sm text-destructive/80'>
                      <AlertCircle className='h-4 w-4 mt-0.5 shrink-0' />
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className='flex justify-end gap-3 mt-4'>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={!validationResult?.isValid || importMutation.isPending}
            className={cn(
              'min-w-[120px] gap-2',
              'bg-linear-to-r from-primary to-primary/80',
              'hover:from-primary/90 hover:to-primary/70',
            )}
          >
            {importMutation.isPending ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Đang import...
              </>
            ) : (
              <>
                <CheckCircle2 className='h-4 w-4' />
                Import {validationResult?.data?.length ?? 0} todos
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
