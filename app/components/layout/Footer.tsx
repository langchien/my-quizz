export const Footer: React.FC = () => {
  return (
    <footer className='h-16 border-t'>
      <div className='mx-auto container flex h-full items-center justify-center px-4'>
        <p className='text-sm text-muted-foreground'>
          © {new Date().getFullYear()} My Quizz Platform
        </p>
      </div>
    </footer>
  )
}
