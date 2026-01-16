import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  index('features/welcome/pages/home.tsx'),
  route('login', 'features/auth/pages/login.tsx'),
  route('register', 'features/auth/pages/register.tsx'),
  route('auth/callback', 'features/auth/pages/callback.tsx'),

  // Protected routes - yêu cầu đăng nhập
  layout('layouts/protected.tsx', [
    route('todo', 'features/todo/pages/todo.tsx'),
    route('profile', 'features/profile/pages/profile.tsx'),
    // Thêm các route cần bảo vệ ở đây
  ]),
] satisfies RouteConfig
