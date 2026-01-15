import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { HeroSection } from '../components/HeroSection'
import { QuickActions } from '../components/QuickActions'
import { StatsCard } from '../components/StatsCard'

export function meta() {
  return [
    { title: 'My Quizz - Học tập thông minh, Thi thử hiệu quả' },
    {
      name: 'description',
      content:
        'Nền tảng quiz trực tuyến giúp bạn tạo đề thi, luyện tập và theo dõi tiến độ học tập một cách hiệu quả.',
    },
  ]
}

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        <HeroSection />
        <QuickActions />
        <StatsCard />
      </main>
      <Footer />
    </div>
  )
}
