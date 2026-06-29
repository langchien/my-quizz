import { useTheme } from '@/components/theme-provider'
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
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useDashboardActions } from '@/hooks/useDashboardActions'
import type { Quiz } from '@/types/quiz'
import { Edit, Moon, Play, Plus, Sun, Trash2 } from 'lucide-react'
import { useLoaderData, useNavigate } from 'react-router'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  // Data từ dashboardLoader — không cần useEffect!
  const { quizzes } = useLoaderData() as { quizzes: Quiz[] }

  // Logic tách ra custom hook
  const { handleHost, handleDelete, isRevalidating } = useDashboardActions()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className='min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-slate-950'>
      <header className='bg-linear-to-r from-red-600 via-rose-500 to-orange-500 text-white shadow-lg'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-4'>
          <h1
            className='cursor-pointer text-2xl font-bold tracking-tight'
            onClick={() => navigate('/dashboard')}
          >
            My-Quizz
          </h1>
          <div className='flex items-center gap-4'>
            <span className='hidden text-white/90 sm:inline-block'>
              Xin chào, {user?.displayName || user?.email}
            </span>

            <button
              onClick={toggleTheme}
              className='flex items-center justify-center rounded-lg bg-white/20 p-2 backdrop-blur-md transition-all hover:bg-white/30'
              aria-label='Toggle Dark Mode'
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={logout}
              className='rounded-lg bg-white/20 px-4 py-2 font-medium backdrop-blur-md transition-all hover:bg-white/30'
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-4 py-8'>
        <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h2 className='text-2xl font-semibold text-gray-800 dark:text-slate-100'>
              Bộ câu hỏi của tôi
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Quản lý và tổ chức các bài trắc nghiệm của bạn.
            </p>
          </div>
          <Button
            onClick={() => navigate('/dashboard/quiz/new')}
            className='gap-2 bg-rose-600 text-white hover:bg-rose-700'
          >
            <Plus size={16} /> Tạo Quiz mới
          </Button>
        </div>

        {isRevalidating ? (
          <div className='flex items-center justify-center py-20'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-rose-500/30 border-t-rose-500'></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className='rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900'>
            <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-950/50'>
              <Plus size={32} />
            </div>
            <h3 className='mb-2 text-xl font-medium text-gray-800 dark:text-slate-200'>
              Bạn chưa có bộ câu hỏi nào
            </h3>
            <p className='mb-6 text-gray-500 dark:text-gray-400'>
              Hãy tạo bộ câu hỏi đầu tiên của bạn để bắt đầu trò chơi!
            </p>
            <Button
              onClick={() => navigate('/dashboard/quiz/new')}
              className='bg-rose-600 text-white hover:bg-rose-700'
            >
              Bắt đầu tạo Quiz
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className='flex flex-col border-gray-200 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800'
              >
                <CardHeader>
                  <div className='flex items-start justify-between gap-2'>
                    <CardTitle className='line-clamp-1 flex-1 text-xl' title={quiz.title}>
                      {quiz.title}
                    </CardTitle>
                    {quiz.isPublished ? (
                      <span className='inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-900/30 dark:text-green-400'>
                        Công khai
                      </span>
                    ) : (
                      <span className='inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset dark:bg-slate-800 dark:text-slate-300'>
                        Bản nháp
                      </span>
                    )}
                  </div>
                  <CardDescription className='mt-2 line-clamp-2'>
                    {quiz.description || 'Không có mô tả'}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-1'>
                  <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                    <div className='flex flex-col'>
                      <span className='font-medium text-gray-900 dark:text-gray-100'>
                        {quiz.questions?.length || 0}
                      </span>
                      <span className='text-xs'>Câu hỏi</span>
                    </div>
                    <div className='h-8 w-px bg-gray-200 dark:bg-slate-700'></div>
                    <div className='flex flex-col'>
                      <span className='font-medium text-gray-900 dark:text-gray-100'>
                        {new Date(quiz.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className='text-xs'>Cập nhật</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between gap-2 border-t border-gray-100 bg-gray-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30'>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='gap-1 px-2 text-slate-600 dark:text-slate-300'
                      onClick={() => navigate(`/dashboard/quiz/${quiz.id}/edit`)}
                    >
                      <Edit size={16} /> <span className='hidden sm:inline'>Sửa</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          className='gap-1 px-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950'
                        >
                          <Trash2 size={16} /> <span className='hidden sm:inline'>Xóa</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Bộ câu hỏi{' '}
                            <span className='font-semibold text-gray-900 dark:text-white'>
                              "{quiz.title}"
                            </span>{' '}
                            sẽ bị xóa vĩnh viễn khỏi hệ thống.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(quiz.id)}
                            className='bg-red-600 text-white hover:bg-red-700'
                          >
                            Xóa vĩnh viễn
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <Button
                    size='sm'
                    className='gap-2 border-0 bg-linear-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600'
                    onClick={() => handleHost(quiz.id)}
                  >
                    <Play size={16} /> Host
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
