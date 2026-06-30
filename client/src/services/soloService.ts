import { FirebaseSoloRepository } from '@/repositories/FirebaseSoloRepository'
import type { ISoloRepository } from '@/repositories/ISoloRepository'
import type { SoloAnswer, SoloProgress, SoloResult } from '@/types/room'

const STORAGE_PREFIX = 'myquizz_solo_'

class SoloService {
  private repository: ISoloRepository

  constructor(repository: ISoloRepository) {
    this.repository = repository
  }

  // ─── LocalStorage helpers ──────────────────────

  private getStorageKey(quizId: string): string {
    return `${STORAGE_PREFIX}${quizId}`
  }

  /**
   * Bắt đầu phiên Solo mới — tạo SoloProgress trong LocalStorage.
   * Nếu đã có progress cũ, sẽ bị ghi đè.
   */
  startSolo(quizId: string): SoloProgress {
    const progress: SoloProgress = {
      quizId,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      streak: 0,
      startedAt: new Date().toISOString(),
      isPaused: false,
    }
    localStorage.setItem(this.getStorageKey(quizId), JSON.stringify(progress))
    return progress
  }

  /**
   * Đọc SoloProgress từ LocalStorage (nếu có).
   * Trả về null nếu không tìm thấy.
   */
  resumeSolo(quizId: string): SoloProgress | null {
    const data = localStorage.getItem(this.getStorageKey(quizId))
    if (!data) return null

    try {
      return JSON.parse(data) as SoloProgress
    } catch {
      return null
    }
  }

  /**
   * Ghi đáp án vào progress, cập nhật score/streak, persist LocalStorage.
   */
  submitSoloAnswer(
    quizId: string,
    questionId: string,
    selectedOptionId: string,
    isCorrect: boolean,
    responseTimeMs: number,
    timeLimitMs: number,
  ): { progress: SoloProgress; pointsEarned: number } {
    const progress = this.resumeSolo(quizId)
    if (!progress) throw new Error('No active solo session')

    const pointsEarned = this.calculateScore(isCorrect, responseTimeMs, timeLimitMs)

    const answer: SoloAnswer = {
      questionId,
      selectedOptionId,
      isCorrect,
      pointsEarned,
      responseTimeMs,
    }

    progress.answers.push(answer)
    progress.score += pointsEarned
    progress.streak = isCorrect ? progress.streak + 1 : 0
    progress.currentQuestionIndex += 1

    localStorage.setItem(this.getStorageKey(quizId), JSON.stringify(progress))
    return { progress, pointsEarned }
  }

  /**
   * Đánh dấu trạng thái tạm dừng.
   */
  pauseSolo(quizId: string): void {
    const progress = this.resumeSolo(quizId)
    if (!progress) return
    progress.isPaused = true
    localStorage.setItem(this.getStorageKey(quizId), JSON.stringify(progress))
  }

  /**
   * Bỏ đánh dấu tạm dừng.
   */
  unpauseSolo(quizId: string): void {
    const progress = this.resumeSolo(quizId)
    if (!progress) return
    progress.isPaused = false
    localStorage.setItem(this.getStorageKey(quizId), JSON.stringify(progress))
  }

  /**
   * Xóa progress khỏi LocalStorage.
   */
  clearProgress(quizId: string): void {
    localStorage.removeItem(this.getStorageKey(quizId))
  }

  // ─── Redemption ────────────────────────────────

  /**
   * Lọc ra tối đa 2 câu sai để làm lại.
   */
  getRedemptionQuestions(progress: SoloProgress): SoloAnswer[] {
    return progress.answers.filter((a) => !a.isCorrect).slice(0, 2)
  }

  /**
   * Xử lý đáp án redemption — cập nhật điểm nếu trả lời đúng.
   */
  submitRedemptionAnswer(
    questionId: string,
    selectedOptionId: string,
    isCorrect: boolean,
    responseTimeMs: number,
    timeLimitMs: number,
  ): { pointsEarned: number; answer: SoloAnswer } {
    const pointsEarned = this.calculateScore(isCorrect, responseTimeMs, timeLimitMs)

    const answer: SoloAnswer = {
      questionId,
      selectedOptionId,
      isCorrect,
      pointsEarned,
      responseTimeMs,
    }

    return { pointsEarned, answer }
  }

  // ─── Scoring (cùng logic với roomService) ──────

  calculateScore(isCorrect: boolean, responseTimeMs: number, timeLimitMs: number): number {
    if (!isCorrect) return 0
    if (responseTimeMs >= timeLimitMs) return 500
    const proportionLeft = 1 - responseTimeMs / timeLimitMs
    return 500 + Math.round(500 * proportionLeft)
  }

  // ─── Complete & Save to Firestore ──────────────

  /**
   * Hoàn thành phiên Solo.
   * Nếu có userId → lưu kết quả vào Firestore.
   * Xóa progress khỏi LocalStorage.
   */
  async completeSolo(
    quizId: string,
    quizTitle: string,
    totalQuestions: number,
    userId?: string,
    redemptionAnswers?: SoloAnswer[],
  ): Promise<SoloResult> {
    const progress = this.resumeSolo(quizId)
    if (!progress) throw new Error('No active solo session')

    // Tính thêm điểm từ redemption (nếu có)
    const redemptionScore = redemptionAnswers
      ? redemptionAnswers.reduce((sum, a) => sum + a.pointsEarned, 0)
      : 0

    const result: SoloResult = {
      quizId,
      quizTitle,
      userId,
      totalQuestions,
      correctCount:
        progress.answers.filter((a) => a.isCorrect).length +
        (redemptionAnswers?.filter((a) => a.isCorrect).length || 0),
      score: progress.score + redemptionScore,
      maxPossibleScore: totalQuestions * 1000,
      answers: progress.answers,
      redemptionAnswers,
      completedAt: new Date().toISOString(),
    }

    // Lưu vào Firestore nếu có user
    if (userId) {
      const id = await this.repository.saveResult(result)
      result.id = id
    }

    // Xóa progress khỏi LocalStorage
    this.clearProgress(quizId)

    return result
  }

  // ─── Query Results ─────────────────────────────

  async getResultsByUser(userId: string): Promise<SoloResult[]> {
    return this.repository.getResultsByUser(userId)
  }
}

export const soloService = new SoloService(new FirebaseSoloRepository())
