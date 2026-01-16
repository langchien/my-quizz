import { PAGES } from '@/config/pages'
import { supabase } from '@/lib/supabase'
import { Outlet, redirect } from 'react-router'
import type { Route } from './+types/protected'

/**
 * Protected Layout
 *
 * Layout này sử dụng clientLoader để kiểm tra authentication.
 * Nếu user chưa đăng nhập, sẽ redirect về /login.
 *
 * Sử dụng: Wrap các route cần bảo vệ trong layout này
 *
 * @example
 * // Trong routes.ts
 * import { layout, route } from '@react-router/dev/routes'
 *
 * export default [
 *   layout('layouts/protected.tsx', [
 *     route('dashboard', 'features/dashboard/pages/dashboard.tsx'),
 *     route('profile', 'features/profile/pages/profile.tsx'),
 *   ]),
 * ]
 */

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Lưu URL hiện tại để redirect sau khi login
    const url = new URL(request.url)
    const redirectTo = url.pathname + url.search
    return redirect(`${PAGES.LOGIN}?redirectTo=${encodeURIComponent(redirectTo)}`)
  }

  return {
    user: session.user,
  }
}

// Đảm bảo clientLoader luôn chạy trước khi render
clientLoader.hydrate = true as const

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  // loaderData.user chứa thông tin user đã xác thực
  return <Outlet context={{ user: loaderData.user }} />
}
