import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/card'
import { CheckCircle, Sparkles, Zap } from 'lucide-react'
import { ImportTodosModal, TodoForm, TodoList } from '../components'

export default function Todo1Page() {
  return (
    <div className='min-h-screen'>
      <Header />

      {/* Hero Section */}
      <div className='relative overflow-hidden border-b border-border/50'>
        <div className='absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none' />
        <div className='container mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            <div className='text-center md:text-left'>
              <div className='flex items-center gap-2 justify-center md:justify-start mb-2'>
                <span className='px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full flex items-center gap-1'>
                  <Zap className='h-3 w-3' />
                  React Query
                </span>
              </div>
              <h1 className='text-3xl md:text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent w-fit'>
                Todo List
              </h1>
              <p className='text-muted-foreground mt-2 max-w-md'>
                Phiên bản sử dụng <strong>React Query</strong> với caching, optimistic updates và
                auto-refetch.
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <ImportTodosModal />
              <TodoForm />
            </div>
          </div>
        </div>
      </div>

      {/* Features Cards */}
      <div className='container mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <FeatureCard
            icon={<Sparkles className='h-5 w-5' />}
            title='Auto Caching'
            description='Dữ liệu được cache tự động, giảm requests'
          />
          <FeatureCard
            icon={<Zap className='h-5 w-5' />}
            title='Optimistic Updates'
            description='UI cập nhật ngay, không cần chờ server'
          />
          <FeatureCard
            icon={<CheckCircle className='h-5 w-5' />}
            title='Auto Refetch'
            description='Tự động refetch khi focus window'
          />
        </div>
      </div>

      {/* Todo List */}
      <main className='container mx-auto px-4 pb-12'>
        <div className='max-w-2xl mx-auto'>
          <Card className='p-6'>
            <TodoList />
          </Card>
        </div>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className='flex-row gap-3 p-4'>
    <div className='p-2 bg-primary/10 rounded-lg text-primary'>{icon}</div>
    <div>
      <h3 className='font-semibold text-sm'>{title}</h3>
      <p className='text-xs text-muted-foreground'>{description}</p>
    </div>
  </Card>
)
