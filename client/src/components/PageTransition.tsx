import { type ReactNode, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Reusable wrapper để apply View Transition cho page content.
 * Dùng `view-transition-name: page-content` với key=pathname để
 * mỗi trang có một unique transition name.
 *
 * Sử dụng: Bao quanh JSX root của mỗi page component.
 * Khi navigate (với <Link viewTransition>), browser sẽ snapshot
 * và animate giữa old/new page.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  // Dùng ref để giữ tên stable trong component lifecycle
  const nameRef = useRef(
    `page-${pathname
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')}`,
  )

  return (
    <div style={{ viewTransitionName: nameRef.current }} className='contents'>
      {children}
    </div>
  )
}
