export const PAGES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH_CALLBACK: '/auth/callback',

  // Protected routes
  TODO: '/todo',
  PROFILE: '/profile',
  QUIZZES: '/quizzes',
  QUIZ: '/quizzes/:id',
  CREATE_QUIZ: '/create-quiz',

  // External
  MY_GITHUB: 'https://github.com/langchien/my-quizz',
} as const
