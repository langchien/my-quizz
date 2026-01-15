import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('features/welcome/pages/home.tsx'),
  route('todo', 'features/todo/pages/todo.tsx'),
] satisfies RouteConfig
