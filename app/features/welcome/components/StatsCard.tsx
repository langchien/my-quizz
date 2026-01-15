import { Card } from '@/components/ui/card'
import { Calendar, FileCheckCorner, Star } from 'lucide-react'

interface StatItemProps {
  value: number
  label: string
  icon: React.ReactNode
}

const StatItem: React.FC<StatItemProps> = ({ value, label, icon }) => {
  return (
    <div className='flex flex-col items-center gap-2 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/5 dark:hover:bg-accent/10'>
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20'>
        {icon}
      </div>
      <div className='text-center'>
        <div className='text-2xl font-bold'>{value}</div>
        <div className='text-xs text-muted-foreground'>{label}</div>
      </div>
    </div>
  )
}

export const StatsCard: React.FC = () => {
  // TODO: Kiểm tra xem người dùng đã đăng nhập hay chưa

  const isLoggedIn = true

  if (!isLoggedIn) {
    return null
  }

  return (
    <section className='mx-auto container px-4 py-8'>
      <Card className='mx-auto max-w-2xl p-6'>
        <h2 className='mb-4 text-lg font-semibold'>Thống kê của bạn</h2>
        <div className='grid grid-cols-3 gap-4'>
          <StatItem value={12} label='Bài làm' icon={<FileCheckCorner />} />
          <StatItem value={8.5} label='Điểm TB' icon={<Star />} />
          <StatItem value={7} label='Ngày' icon={<Calendar />} />
        </div>
      </Card>
    </section>
  )
}
