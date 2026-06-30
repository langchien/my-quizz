import { Header } from '@/components/Header'
import { HistoryTab } from '@/components/HistoryTab'
import { ImportQuizDialog } from '@/components/ImportQuizDialog'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboardActions } from '@/hooks/useDashboardActions'
import { useDashboardUI } from '@/hooks/useDashboardUI'
import { cn } from '@/lib/utils'
import type { Quiz } from '@/types/quiz'
import { BookOpen, Clock, Edit, FileJson, Play, Plus, Trash2 } from 'lucide-react'
import { Link, useLoaderData } from 'react-router'

export default function Dashboard() {
  const { quizzes } = useLoaderData() as { quizzes: Quiz[] }

  // Logic
  const { handleHost, handleDelete, handleImportQuiz, importing, isRevalidating } =
    useDashboardActions()

  // UI state
  const { activeTab, setActiveTab, isImportOpen, openImportDialog, closeImportDialog } =
    useDashboardUI()

  return (
    <div className='min-h-screen bg-background transition-colors duration-300'>
      <Header />

      <main className='mx-auto max-w-7xl px-4 py-8'>
        {/* Tab Navigation — shadcn Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'quizzes' | 'history')}
          className='mb-8'
        >
          <TabsList variant='line' className='border-b border-border'>
            <TabsTrigger value='quizzes' className='gap-2'>
              <BookOpen data-icon='inline-start' /> Bộ câu hỏi
            </TabsTrigger>
            <TabsTrigger value='history' className='gap-2'>
              <Clock data-icon='inline-start' /> Lịch sử
            </TabsTrigger>
          </TabsList>

          {/* Tab: Bộ câu hỏi */}
          <TabsContent value='quizzes' className='mt-6'>
            <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
              <div>
                <h2 className='text-2xl font-semibold text-foreground'>Bộ câu hỏi của tôi</h2>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Quản lý và tổ chức các bài trắc nghiệm của bạn.
                </p>
              </div>
              <div className='flex w-full gap-2 sm:w-auto'>
                <Button
                  onClick={openImportDialog}
                  variant='outline'
                  className='w-full gap-2 sm:w-auto'
                >
                  <FileJson data-icon='inline-start' /> Import từ JSON
                </Button>
                <Link
                  to='/dashboard/quiz/new'
                  className={cn(buttonVariants(), 'w-full gap-2 sm:w-auto')}
                >
                  <Plus data-icon='inline-start' /> Tạo Quiz mới
                </Link>
              </div>
            </div>

            {isRevalidating ? (
              <div className='flex items-center justify-center py-20'>
                <Spinner className='size-10 text-primary' />
              </div>
            ) : quizzes.length === 0 ? (
              <div className='rounded-2xl border border-dashed border-border bg-card py-16 text-center shadow-sm'>
                <div className='mb-4 inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Plus size={32} />
                </div>
                <h3 className='mb-2 text-xl font-medium text-foreground'>
                  Bạn chưa có bộ câu hỏi nào
                </h3>
                <p className='mb-6 text-muted-foreground'>
                  Hãy tạo bộ câu hỏi đầu tiên của bạn để bắt đầu trò chơi!
                </p>
                <div className='flex items-center justify-center gap-4'>
                  <Link to='/dashboard/quiz/new' className={cn(buttonVariants(), 'gap-2')}>
                    Bắt đầu tạo Quiz
                  </Link>
                  <Button onClick={openImportDialog} variant='outline'>
                    Import từ JSON
                  </Button>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {quizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className='flex flex-col border-border shadow-sm transition-shadow hover:shadow-md'
                  >
                    <CardHeader>
                      <div className='flex items-start justify-between gap-2'>
                        <CardTitle className='line-clamp-1 flex-1 text-xl' title={quiz.title}>
                          {quiz.title}
                        </CardTitle>
                        {quiz.isPublished ? (
                          <Badge variant='success'>Công khai</Badge>
                        ) : (
                          <Badge variant='secondary'>Bản nháp</Badge>
                        )}
                      </div>
                      <CardDescription className='mt-2 line-clamp-2'>
                        {quiz.description || 'Không có mô tả'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='flex-1'>
                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <div className='flex flex-col'>
                          <span className='font-medium text-foreground'>
                            {quiz.questions?.length || 0}
                          </span>
                          <span className='text-xs'>Câu hỏi</span>
                        </div>
                        <Separator orientation='vertical' className='h-8' />
                        <div className='flex flex-col'>
                          <span className='font-medium text-foreground'>
                            {new Date(quiz.updatedAt).toLocaleDateString('vi-VN')}
                          </span>
                          <span className='text-xs'>Cập nhật</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className='flex justify-between gap-2 border-t border-border bg-muted/30 p-4'>
                      <div className='flex gap-2'>
                        <Link
                          to={`/dashboard/quiz/${quiz.id}/edit`}
                          className={cn(
                            buttonVariants({ variant: 'outline', size: 'sm' }),
                            'gap-1 px-2',
                          )}
                        >
                          <Edit data-icon='inline-start' />{' '}
                          <span className='hidden sm:inline'>Sửa</span>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant='destructive' size='sm' className='gap-1 px-2'>
                              <Trash2 data-icon='inline-start' />{' '}
                              <span className='hidden sm:inline'>Xóa</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Bộ câu hỏi{' '}
                                <span className='font-semibold text-foreground'>
                                  "{quiz.title}"
                                </span>{' '}
                                sẽ bị xóa vĩnh viễn khỏi hệ thống.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(quiz.id)}
                                className='text-destructive-foreground bg-destructive hover:bg-destructive/80'
                              >
                                Xóa vĩnh viễn
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <div className='flex gap-2'>
                        <Button
                          variant='gradient-orange'
                          size='sm'
                          className='gap-2'
                          onClick={() => handleHost(quiz.id, quiz.title)}
                        >
                          <Play data-icon='inline-start' /> Host
                        </Button>
                        <Link
                          to={`/solo/${quiz.id}`}
                          className={cn(
                            buttonVariants({ variant: 'outline', size: 'sm' }),
                            'gap-2',
                          )}
                        >
                          <BookOpen data-icon='inline-start' /> Tự luyện
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Lịch sử */}
          <TabsContent value='history' className='mt-6'>
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </main>

      <ImportQuizDialog
        isOpen={isImportOpen}
        onClose={closeImportDialog}
        onImport={handleImportQuiz}
        mode='quiz'
      />

      {importing && (
        <LoadingOverlay
          message='Đang import bộ câu hỏi mới...'
          subMessage='Vui lòng không đóng trình duyệt hoặc tải lại trang'
        />
      )}
    </div>
  )
}
