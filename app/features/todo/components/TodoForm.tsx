import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { useCreateTodo } from '../hooks/useTodos'

const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề').max(100, 'Tiêu đề không quá 100 ký tự'),
})

type CreateTodoForm = z.infer<typeof CreateTodoSchema>

export const TodoForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const createMutation = useCreateTodo()

  const form = useForm<CreateTodoForm>({
    resolver: zodResolver(CreateTodoSchema),
    defaultValues: {
      title: '',
    },
  })

  const onSubmit = async (values: CreateTodoForm) => {
    await createMutation.mutateAsync({ title: values.title })
    form.reset()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'gap-2 bg-linear-to-r from-primary to-primary/80',
            'hover:from-primary/90 hover:to-primary/70',
            'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30',
            'transition-all duration-300 hover:scale-105',
          )}
        >
          <Plus className='h-4 w-4' />
          <span>Thêm Todo</span>
          <Sparkles className='h-3 w-3 opacity-70' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <Plus className='h-5 w-5 text-primary' />
            </div>
            Thêm Todo Mới
          </DialogTitle>
          <DialogDescription>Nhập tiêu đề cho todo của bạn</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 pt-2'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ví dụ: Học React Query...'
                      className={cn(
                        'transition-all duration-200',
                        'focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      )}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsOpen(false)}
                disabled={createMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type='submit'
                disabled={createMutation.isPending}
                className={cn(
                  'min-w-[100px] gap-2',
                  'bg-linear-to-r from-primary to-primary/80',
                  'hover:from-primary/90 hover:to-primary/70',
                )}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Đang tạo...
                  </>
                ) : (
                  'Tạo Todo'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
