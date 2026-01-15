import { Card } from '@/components/ui/card'
import { PAGES } from '@/config/pages'
import { cn } from '@/lib/utils'
import { ChevronRightIcon, Plus, Zap } from 'lucide-react'
import { Link } from 'react-router'

interface ActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  variant?: 'primary' | 'secondary'
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  href,
  variant = 'secondary',
}) => {
  return (
    <Card
      className={cn(
        `group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10`,
        {
          'border-primary/50 bg-linear-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10':
            variant === 'primary',
        },
      )}
    >
      <Link to={href} className='block p-6'>
        <div className='flex items-start gap-4'>
          <div
            className={cn(
              `flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110`,
              {
                'bg-primary text-primary-foreground': variant === 'primary',
                'bg-secondary text-secondary-foreground': variant === 'secondary',
              },
            )}
          >
            {icon}
          </div>

          <div className='flex-1'>
            <h3 className='mb-1 text-lg font-semibold'>{title}</h3>
            <p className='text-sm text-muted-foreground'>{description}</p>
          </div>

          <ChevronRightIcon className='h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1' />
        </div>
      </Link>
    </Card>
  )
}

export const QuickActions: React.FC = () => {
  return (
    <section className='mx-auto container px-4 py-8'>
      <div className='mx-auto max-w-2xl space-y-4'>
        <ActionCard
          variant='primary'
          icon={<Zap />}
          title='Bắt đầu thi thử'
          description='Chọn quiz và làm bài ngay'
          href={PAGES.QUIZZES}
        />

        <ActionCard
          icon={<Plus />}
          title='Tạo đề mới'
          description='Tự tạo bộ câu hỏi của bạn'
          href={PAGES.CREATE_QUIZ}
        />
      </div>
    </section>
  )
}
