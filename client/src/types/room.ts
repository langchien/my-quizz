export type RoomStatus = 'waiting' | 'playing' | 'showing_leaderboard' | 'finished'

export interface GameSession {
  id: string // Firebase Document ID
  roomCode: string // 5-6 digit alphanumeric unique room code
  quizId: string
  quizTitle?: string // Lưu kèm để hiển thị lịch sử mà không cần query thêm
  hostId: string
  status: RoomStatus
  currentQuestionIndex: number // -1 if not started (waiting lobby)
  questionActiveUntil: number | null // epoch timestamp in milliseconds indicating response window
  createdAt: string // ISO string
  finishedAt?: string // ISO string
  mode: 'live' | 'solo'
}

export interface Participant {
  id: string // Participant ID (Firebase doc ID or custom guest ID)
  name: string
  sessionId: string
  score: number
  streak: number
  isHost: boolean
  joinedAt: string // ISO string
}

export interface PlayerAnswer {
  id: string
  sessionId: string
  participantId: string
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
  pointsEarned: number
  responseTimeMs: number // Response time in milliseconds
  submittedAt: string // ISO string
}

// ─── Solo Mode Types ─────────────────────────

export interface SoloAnswer {
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
  pointsEarned: number
  responseTimeMs: number
}

export interface SoloProgress {
  quizId: string
  currentQuestionIndex: number
  answers: SoloAnswer[]
  score: number
  streak: number
  startedAt: string // ISO string
  isPaused: boolean
}

export interface SoloResult {
  id?: string // Firestore doc ID (nếu lưu cloud)
  quizId: string
  quizTitle: string
  userId?: string // undefined nếu guest
  totalQuestions: number
  correctCount: number
  score: number
  maxPossibleScore: number
  answers: SoloAnswer[]
  redemptionAnswers?: SoloAnswer[] // Câu làm lại
  completedAt: string // ISO string
}
