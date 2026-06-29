import { FirebaseRoomRepository } from '@/repositories/FirebaseRoomRepository'
import type { IRoomRepository } from '@/repositories/IRoomRepository'
import type { GameSession, Participant, PlayerAnswer } from '@/types/room'

class RoomService {
  private repository: IRoomRepository

  constructor(repository: IRoomRepository) {
    this.repository = repository
  }

  // Generate a random 6 character alphanumeric code
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  async createLiveSession(
    quizId: string,
    hostId: string,
    quizTitle?: string,
  ): Promise<{ sessionId: string; roomCode: string }> {
    let roomCode = this.generateRoomCode()
    let existingSession = await this.repository.getSessionByCode(roomCode)

    // Ensure room code uniqueness (simple collision handling)
    while (existingSession) {
      roomCode = this.generateRoomCode()
      existingSession = await this.repository.getSessionByCode(roomCode)
    }

    const sessionId = await this.repository.createSession({
      quizId,
      quizTitle,
      hostId,
      roomCode,
      status: 'waiting',
      currentQuestionIndex: -1,
      questionActiveUntil: null,
      mode: 'live',
    })

    return { sessionId, roomCode }
  }

  async getSessionByCode(roomCode: string): Promise<GameSession | null> {
    return this.repository.getSessionByCode(roomCode)
  }

  async joinSession(
    roomCode: string,
    playerName: string,
  ): Promise<{ sessionId: string; participantId: string }> {
    const session = await this.repository.getSessionByCode(roomCode)
    if (!session) {
      throw new Error('Room not found')
    }

    if (session.status !== 'waiting') {
      throw new Error('Game has already started or finished')
    }

    // Check if name is already taken
    const existing = await this.repository.getParticipantInSession(session.id, playerName)
    if (existing) {
      throw new Error('Name is already taken in this room')
    }

    const participantId = await this.repository.addParticipant({
      sessionId: session.id,
      name: playerName,
      score: 0,
      streak: 0,
      isHost: false,
    })

    return { sessionId: session.id, participantId }
  }

  async startSession(sessionId: string): Promise<void> {
    await this.repository.updateSessionStatus(sessionId, 'playing', 0, null)
  }

  async nextQuestion(sessionId: string, newIndex: number, timeLimitSeconds: number): Promise<void> {
    const activeUntil = Date.now() + timeLimitSeconds * 1000
    await this.repository.updateSessionStatus(sessionId, 'playing', newIndex, activeUntil)
  }

  async showLeaderboard(sessionId: string): Promise<void> {
    await this.repository.updateSessionStatus(sessionId, 'showing_leaderboard')
  }

  async finishSession(sessionId: string): Promise<void> {
    await this.repository.updateSessionStatus(sessionId, 'finished')
  }

  // Calculate score based on time
  // Default max points: 1000
  // Minimum points for correct answer: 500 (so player still gets rewarded if correct but slow)
  calculateScore(isCorrect: boolean, responseTimeMs: number, timeLimitMs: number): number {
    if (!isCorrect) return 0

    // If response time is greater than time limit (e.g. slight delay), give minimum points
    if (responseTimeMs >= timeLimitMs) return 500

    // Decrease points based on time. Faster answer = more points.
    const proportionLeft = 1 - responseTimeMs / timeLimitMs
    // Score range: 500 to 1000
    const score = 500 + Math.round(500 * proportionLeft)
    return score
  }

  async submitAnswer(
    sessionId: string,
    participantId: string,
    questionId: string,
    selectedOptionId: string,
    isCorrect: boolean,
    responseTimeMs: number,
    timeLimitMs: number,
    currentStreak: number,
  ): Promise<void> {
    const points = this.calculateScore(isCorrect, responseTimeMs, timeLimitMs)
    const newStreak = isCorrect ? currentStreak + 1 : 0

    await this.repository.submitAnswer({
      sessionId,
      participantId,
      questionId,
      selectedOptionId,
      isCorrect,
      pointsEarned: points,
      responseTimeMs,
    })

    // Update participant score
    await this.repository.updateParticipantScore(sessionId, participantId, points, newStreak)
  }

  // Expose repository's listen methods
  onSessionChange(sessionId: string, callback: (session: GameSession | null) => void) {
    return this.repository.onSessionChange(sessionId, callback)
  }

  onParticipantsChange(sessionId: string, callback: (participants: Participant[]) => void) {
    return this.repository.onParticipantsChange(sessionId, callback)
  }

  onAnswersChange(
    sessionId: string,
    questionId: string,
    callback: (answers: PlayerAnswer[]) => void,
  ) {
    return this.repository.onAnswersChange(sessionId, questionId, callback)
  }

  // ─── History ────────────────────────────────────

  async getSessionsByHost(hostId: string) {
    return this.repository.getSessionsByHost(hostId)
  }

  async getParticipants(sessionId: string) {
    return this.repository.getParticipants(sessionId)
  }
}

export const roomService = new RoomService(new FirebaseRoomRepository())
