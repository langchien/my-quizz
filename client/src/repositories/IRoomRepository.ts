import type { GameSession, Participant, PlayerAnswer, RoomStatus } from '@/types/room'

export interface IRoomRepository {
  // Session
  createSession(sessionData: Omit<GameSession, 'id' | 'createdAt'>): Promise<string>
  getSessionById(sessionId: string): Promise<GameSession | null>
  getSessionByCode(roomCode: string): Promise<GameSession | null>
  updateSessionStatus(
    sessionId: string,
    status: RoomStatus,
    currentQuestionIndex?: number,
    questionActiveUntil?: number | null,
  ): Promise<void>

  // Participant
  getParticipantInSession(sessionId: string, name: string): Promise<Participant | null>
  addParticipant(participantData: Omit<Participant, 'id' | 'joinedAt'>): Promise<string>
  updateParticipantScore(
    sessionId: string,
    participantId: string,
    score: number,
    streak: number,
  ): Promise<void>

  // Answer
  submitAnswer(answerData: Omit<PlayerAnswer, 'id' | 'submittedAt'>): Promise<void>

  // Real-time listeners
  onSessionChange(sessionId: string, callback: (session: GameSession | null) => void): () => void
  onParticipantsChange(
    sessionId: string,
    callback: (participants: Participant[]) => void,
  ): () => void
  onAnswersChange(
    sessionId: string,
    questionId: string,
    callback: (answers: PlayerAnswer[]) => void,
  ): () => void

  // History queries
  getSessionsByHost(hostId: string): Promise<GameSession[]>
  getParticipants(sessionId: string): Promise<Participant[]>
}
