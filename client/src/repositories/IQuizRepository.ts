import type { Quiz } from '@/types/quiz'

export interface IQuizRepository {
  createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz>
  getQuizzesByCreator(creatorId: string): Promise<Quiz[]>
  getQuizById(id: string): Promise<Quiz | null>
  updateQuiz(id: string, data: Partial<Omit<Quiz, 'id' | 'createdAt'>>): Promise<Quiz>
  deleteQuiz(id: string): Promise<void>
  searchPublicQuizzes(keyword?: string, category?: string, difficulty?: string): Promise<Quiz[]>
  incrementPlayCount(quizId: string): Promise<void>
}
