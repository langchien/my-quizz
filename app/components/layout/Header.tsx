import { ModeToggle } from '@/components/themes/ModeToggle'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/config/pages'
import { Github } from 'lucide-react'
import { Link } from 'react-router'
import LogoFull from './quizz_logo_full.png'
import LogoIcon from './quizz_logo_icon.png'
import { UserMenu } from './UserMenu'

export const Header: React.FC = () => {
  return (
    <header className='sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='mx-auto container flex h-full items-center justify-between px-4'>
        <Link to='/' className='flex items-center'>
          <img src={LogoIcon} alt='My Quizz' className='h-10 w-auto md:hidden' />
          <img src={LogoFull} alt='My Quizz' className='hidden h-10 w-auto md:block' />
        </Link>

        <div className='flex items-center gap-3'>
          <Button variant='ghost' size='sm' asChild>
            <Link
              to={PAGES.MY_GITHUB}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2'
            >
              <Github className='h-4 w-4' />
              <span className='hidden sm:inline'>Source</span>
            </Link>
          </Button>

          <ModeToggle />

          <UserMenu />
        </div>
      </div>
    </header>
  )
}
