import { cn } from '@/lib/utils'
import { ClipboardList, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { usePaginatedTodos } from '../hooks/usePaginatedTodos'
import { Pagination } from './Pagination'
import { TodoItem } from './TodoItem'

const PAGE_SIZE = 10

export const TodoList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
  } = usePaginatedTodos({
    page: currentPage,
    pageSize: PAGE_SIZE,
  })

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-16 gap-4'>
        <div className='relative'>
          <div className='absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse' />
          <Loader2 className='h-10 w-10 text-primary animate-spin relative' />
        </div>
        <p className='text-sm text-muted-foreground animate-pulse'>Đang tải danh sách...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 gap-3',
          'bg-destructive/5 rounded-xl border border-destructive/20',
        )}
      >
        <p className='text-destructive font-medium'>Lỗi khi tải dữ liệu</p>
        <p className='text-sm text-muted-foreground'>{error?.message}</p>
      </div>
    )
  }

  if (!paginatedData || paginatedData.data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 gap-4'>
        <div className='p-4 bg-muted/30 rounded-full'>
          <ClipboardList className='h-12 w-12 text-muted-foreground/50' />
        </div>
        <div className='text-center'>
          <p className='text-muted-foreground font-medium'>Chưa có todo nào</p>
          <p className='text-sm text-muted-foreground/70'>Hãy thêm todo đầu tiên của bạn!</p>
        </div>
      </div>
    )
  }

  const { data: todos, totalCount, totalPages, hasNextPage, hasPrevPage } = paginatedData

  // Tính completed count cho trang hiện tại
  const completedCount = todos.filter((t) => t.completed).length
  const pageItemCount = todos.length

  return (
    <div className='space-y-4'>
      {/* Progress */}
      <div className='flex items-center justify-between px-2'>
        <p className='text-sm text-muted-foreground'>
          <span className='font-semibold text-foreground'>{completedCount}</span> / {pageItemCount}{' '}
          hoàn thành (trang này)
        </p>
        <div className='flex items-center gap-2'>
          <div className='h-2 w-24 bg-muted rounded-full overflow-hidden'>
            <div
              className='h-full bg-linear-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out'
              style={{ width: `${(completedCount / pageItemCount) * 100}%` }}
            />
          </div>
          <span className='text-xs text-muted-foreground font-mono'>
            {Math.round((completedCount / pageItemCount) * 100)}%
          </span>
        </div>
      </div>

      {/* List */}
      <div className='space-y-2'>
        {todos.map((todo, index) => (
          <div key={todo.id} style={{ animationDelay: `${index * 50}ms` }}>
            <TodoItem todo={todo} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={setCurrentPage}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
