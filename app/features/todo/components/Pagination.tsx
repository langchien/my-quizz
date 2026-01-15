import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onPageChange: (page: number) => void
  totalCount?: number
  pageSize?: number
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  totalCount,
  pageSize,
}) => {
  // Tính range hiển thị
  const getPageNumbers = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('ellipsis-end')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis-start')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('ellipsis-start')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('ellipsis-end')
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) return null

  const showingFrom = (currentPage - 1) * (pageSize ?? 10) + 1
  const showingTo = Math.min(currentPage * (pageSize ?? 10), totalCount ?? 0)

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50'>
      {/* Info */}
      {totalCount !== undefined && pageSize !== undefined && (
        <p className='text-sm text-muted-foreground'>
          Hiển thị <span className='font-semibold text-foreground'>{showingFrom}</span> -{' '}
          <span className='font-semibold text-foreground'>{showingTo}</span> trong{' '}
          <span className='font-semibold text-foreground'>{totalCount}</span> items
        </p>
      )}

      {/* Navigation - Shadcn Pagination */}
      <ShadcnPagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
              className={cn('cursor-pointer', !hasPrevPage && 'pointer-events-none opacity-50')}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {getPageNumbers().map((page) =>
            page === 'ellipsis-start' || page === 'ellipsis-end' ? (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'cursor-pointer',
                    page === currentPage &&
                      'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => hasNextPage && onPageChange(currentPage + 1)}
              className={cn('cursor-pointer', !hasNextPage && 'pointer-events-none opacity-50')}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  )
}
