import { QuizPreviewModal } from '@/components/QuizPreviewModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { DIFFICULTY_LABELS, QUIZ_CATEGORIES } from '@/config/quizCategories'
import { useSearchQuizzes } from '@/hooks/useSearchQuizzes'
import type { Quiz } from '@/types/quiz'
import { BookOpen, HelpCircle, Search, Trophy, X } from 'lucide-react'
import { useState } from 'react'

/**
 * Component tìm kiếm quiz công khai.
 * Bao gồm thanh search, filters (category, difficulty), và grid kết quả.
 */
export function QuizSearch() {
  const {
    keyword,
    setKeyword,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    results,
    loading,
    hasSearched,
    clearFilters,
  } = useSearchQuizzes()

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  const hasFilters = keyword || category || difficulty

  return (
    <div className='flex flex-col gap-6'>
      {/* Search Bar + Filters */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Tìm kiếm quiz theo tiêu đề...'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className='h-11 pl-10'
          />
        </div>

        <div className='flex gap-2'>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className='w-36'>
              <SelectValue placeholder='Danh mục' />
            </SelectTrigger>
            <SelectContent>
              {QUIZ_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className='w-32'>
              <SelectValue placeholder='Độ khó' />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant='ghost' size='icon' onClick={clearFilters} title='Xóa bộ lọc'>
              <X className='size-4' />
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className='flex items-center justify-center py-20'>
          <Spinner className='size-10 text-primary' />
        </div>
      ) : results.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {results.map((quiz) => (
            <Card
              key={quiz.id}
              className='flex cursor-pointer flex-col border-border shadow-sm transition-shadow hover:shadow-md'
              onClick={() => setSelectedQuiz(quiz)}
            >
              {/* Gradient thumbnail */}
              <div className='h-24 rounded-t-lg bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400' />

              <CardHeader className='pb-2'>
                <div className='flex items-start justify-between gap-2'>
                  <CardTitle className='line-clamp-1 flex-1 text-lg' title={quiz.title}>
                    {quiz.title}
                  </CardTitle>
                  {quiz.difficulty && (
                    <Badge
                      variant={
                        quiz.difficulty === 'easy'
                          ? 'success'
                          : quiz.difficulty === 'hard'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {DIFFICULTY_LABELS[quiz.difficulty]}
                    </Badge>
                  )}
                </div>
                <CardDescription className='line-clamp-2'>
                  {quiz.description || 'Không có mô tả'}
                </CardDescription>
              </CardHeader>

              <CardContent className='flex-1'>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <HelpCircle className='size-3.5' />
                    <span>{quiz.questions?.length || 0} câu</span>
                  </div>
                  <Separator orientation='vertical' className='h-4' />
                  <div className='flex items-center gap-1'>
                    <Trophy className='size-3.5' />
                    <span>{quiz.playCount || 0} lượt</span>
                  </div>
                  {quiz.category && (
                    <>
                      <Separator orientation='vertical' className='h-4' />
                      <div className='flex items-center gap-1'>
                        <BookOpen className='size-3.5' />
                        <span>{quiz.category}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>

              <CardFooter className='border-t border-border bg-muted/30 p-3'>
                <Button variant='ghost' size='sm' className='w-full gap-2'>
                  <Search className='size-4' /> Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : hasSearched ? (
        <div className='rounded-2xl border border-dashed border-border bg-card py-16 text-center shadow-sm'>
          <div className='mb-4 inline-flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
            <Search className='size-8' />
          </div>
          <h3 className='mb-2 text-xl font-medium text-foreground'>Không tìm thấy quiz nào</h3>
          <p className='text-muted-foreground'>
            Thử thay đổi từ khóa hoặc bộ lọc để tìm kết quả phù hợp hơn.
          </p>
        </div>
      ) : (
        <div className='rounded-2xl border border-dashed border-border bg-card py-16 text-center shadow-sm'>
          <div className='mb-4 inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <Search className='size-8' />
          </div>
          <h3 className='mb-2 text-xl font-medium text-foreground'>Khám phá quiz công khai</h3>
          <p className='text-muted-foreground'>
            Tìm kiếm bộ câu hỏi từ cộng đồng để tự luyện hoặc thách đấu bạn bè.
          </p>
        </div>
      )}

      {/* Preview Modal */}
      <QuizPreviewModal
        quiz={selectedQuiz}
        open={!!selectedQuiz}
        onOpenChange={(open) => {
          if (!open) setSelectedQuiz(null)
        }}
      />
    </div>
  )
}
