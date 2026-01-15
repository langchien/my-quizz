import { CircleCheck } from 'lucide-react'

export const HeroSection: React.FC = () => {
  return (
    <section className='bg-primary px-4 py-16 text-primary-foreground'>
      <div className='mx-auto container text-center'>
        <div className='mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm animate-in fade-in zoom-in duration-500'>
          <CircleCheck className='size-10' />
        </div>

        <h1 className='mb-4 text-4xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 sm:text-5xl'>
          My Quizz
        </h1>

        <p className='mx-auto max-w-2xl text-lg opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 sm:text-xl'>
          Đây là trang template sử dụng React Query + Supabase để CRUD
        </p>
      </div>
    </section>
  )
}
