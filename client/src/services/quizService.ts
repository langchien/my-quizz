import { FirebaseQuizRepository } from '@/repositories/FirebaseQuizRepository'
import type { IQuizRepository } from '@/repositories/IQuizRepository'
import type { Quiz } from '@/types/quiz'

class QuizService {
  private repository: IQuizRepository

  constructor(repository: IQuizRepository) {
    this.repository = repository
  }

  async createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
    return this.repository.createQuiz(quizData)
  }

  async getQuizzesByCreator(creatorId: string): Promise<Quiz[]> {
    return this.repository.getQuizzesByCreator(creatorId)
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    return this.repository.getQuizById(id)
  }

  async updateQuiz(id: string, data: Partial<Omit<Quiz, 'id' | 'createdAt'>>): Promise<Quiz> {
    return this.repository.updateQuiz(id, data)
  }

  async deleteQuiz(id: string): Promise<void> {
    return this.repository.deleteQuiz(id)
  }

  async searchPublicQuizzes(
    keyword?: string,
    category?: string,
    difficulty?: string,
  ): Promise<Quiz[]> {
    return this.repository.searchPublicQuizzes(keyword, category, difficulty)
  }

  async incrementPlayCount(quizId: string): Promise<void> {
    return this.repository.incrementPlayCount(quizId)
  }
}

export const quizService = new QuizService(new FirebaseQuizRepository())
