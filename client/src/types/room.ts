export type RoomStatus = 'waiting' | 'playing' | 'showing_leaderboard' | 'finished';

export interface GameSession {
  id: string; // Firebase Document ID
  roomCode: string; // 5-6 digit alphanumeric unique room code
  quizId: string;
  hostId: string;
  status: RoomStatus;
  currentQuestionIndex: number; // -1 if not started (waiting lobby)
  questionActiveUntil: number | null; // epoch timestamp in milliseconds indicating response window
  createdAt: string; // ISO string
  finishedAt?: string; // ISO string
  mode: 'live' | 'solo';
}

export interface Participant {
  id: string; // Participant ID (Firebase doc ID or custom guest ID)
  name: string;
  sessionId: string;
  score: number;
  streak: number;
  isHost: boolean;
  joinedAt: string; // ISO string
}

export interface PlayerAnswer {
  id: string;
  sessionId: string;
  participantId: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  responseTimeMs: number; // Response time in milliseconds
  submittedAt: string; // ISO string
}
