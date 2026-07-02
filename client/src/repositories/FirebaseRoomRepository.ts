import { db } from '@/lib/firebase'
import type { IRoomRepository } from '@/repositories/IRoomRepository'
import type { GameSession, Participant, PlayerAnswer, RoomStatus } from '@/types/room'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

export class FirebaseRoomRepository implements IRoomRepository {
  private sessionsCol = 'sessions'

  private getParticipantsCol(sessionId: string) {
    return collection(db, this.sessionsCol, sessionId, 'participants')
  }

  private getAnswersCol(sessionId: string) {
    return collection(db, this.sessionsCol, sessionId, 'answers')
  }

  async createSession(sessionData: Omit<GameSession, 'id' | 'createdAt'>): Promise<string> {
    const docRef = doc(collection(db, this.sessionsCol))
    const now = new Date().toISOString()

    const newSession: GameSession = {
      ...sessionData,
      id: docRef.id,
      createdAt: now,
    }

    await setDoc(docRef, newSession)
    return newSession.id
  }

  async getSessionById(sessionId: string): Promise<GameSession | null> {
    const docRef = doc(db, this.sessionsCol, sessionId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return docSnap.data() as GameSession
  }

  async getSessionByCode(roomCode: string): Promise<GameSession | null> {
    const q = query(
      collection(db, this.sessionsCol),
      where('roomCode', '==', roomCode.toUpperCase()),
      limit(1),
    )
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    return querySnapshot.docs[0].data() as GameSession
  }

  async updateSessionStatus(
    sessionId: string,
    status: RoomStatus,
    currentQuestionIndex?: number,
    questionActiveUntil?: number | null,
  ): Promise<void> {
    const docRef = doc(db, this.sessionsCol, sessionId)
    const updateData: any = { status }

    if (currentQuestionIndex !== undefined) {
      updateData.currentQuestionIndex = currentQuestionIndex
    }
    if (questionActiveUntil !== undefined) {
      updateData.questionActiveUntil = questionActiveUntil
    }
    if (status === 'finished') {
      updateData.finishedAt = new Date().toISOString()
    }

    await updateDoc(docRef, updateData)
  }

  async getParticipantInSession(sessionId: string, name: string): Promise<Participant | null> {
    const q = query(this.getParticipantsCol(sessionId), where('name', '==', name), limit(1))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return null
    }
    return querySnapshot.docs[0].data() as Participant
  }

  async addParticipant(participantData: Omit<Participant, 'id' | 'joinedAt'>): Promise<string> {
    const participantsRef = this.getParticipantsCol(participantData.sessionId)
    const docRef = doc(participantsRef)
    const now = new Date().toISOString()

    const newParticipant: Participant = {
      ...participantData,
      id: docRef.id,
      joinedAt: now,
    }

    await setDoc(docRef, newParticipant)
    return newParticipant.id
  }

  async updateParticipantScore(
    sessionId: string,
    participantId: string,
    score: number,
    streak: number,
  ): Promise<void> {
    const docRef = doc(this.getParticipantsCol(sessionId), participantId)
    await updateDoc(docRef, {
      score: increment(score),
      streak,
    })
  }

  async submitAnswer(answerData: Omit<PlayerAnswer, 'id' | 'submittedAt'>): Promise<void> {
    const docRef = doc(this.getAnswersCol(answerData.sessionId))
    const now = new Date().toISOString()

    const newAnswer: PlayerAnswer = {
      ...answerData,
      id: docRef.id,
      submittedAt: now,
    }

    await setDoc(docRef, newAnswer)
  }

  onSessionChange(sessionId: string, callback: (session: GameSession | null) => void): () => void {
    const docRef = doc(db, this.sessionsCol, sessionId)
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as GameSession)
        } else {
          callback(null)
        }
      },
      (error) => {
        console.error('Error listening to session:', error)
      },
    )
  }

  onParticipantsChange(
    sessionId: string,
    callback: (participants: Participant[]) => void,
  ): () => void {
    const q = query(this.getParticipantsCol(sessionId))
    return onSnapshot(
      q,
      (querySnapshot) => {
        const participants: Participant[] = []
        querySnapshot.forEach((docSnap) => {
          participants.push(docSnap.data() as Participant)
        })
        callback(participants)
      },
      (error) => {
        console.error('Error listening to participants:', error)
      },
    )
  }

  onAnswersChange(
    sessionId: string,
    questionId: string,
    callback: (answers: PlayerAnswer[]) => void,
  ): () => void {
    const q = query(this.getAnswersCol(sessionId), where('questionId', '==', questionId))
    return onSnapshot(
      q,
      (querySnapshot) => {
        const answers: PlayerAnswer[] = []
        querySnapshot.forEach((docSnap) => {
          answers.push(docSnap.data() as PlayerAnswer)
        })
        callback(answers)
      },
      (error) => {
        console.error('Error listening to answers:', error)
      },
    )
  }

  // ─── History queries ───────────────────────────

  async getSessionsByHost(hostId: string): Promise<GameSession[]> {
    const q = query(
      collection(db, this.sessionsCol),
      where('hostId', '==', hostId),
      where('status', '==', 'finished'),
    )
    const querySnapshot = await getDocs(q)
    const sessions: GameSession[] = []
    querySnapshot.forEach((docSnap) => {
      sessions.push(docSnap.data() as GameSession)
    })

    // Sort by createdAt descending (client-side to avoid composite index)
    return sessions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  async getParticipants(sessionId: string): Promise<Participant[]> {
    const q = query(this.getParticipantsCol(sessionId))
    const querySnapshot = await getDocs(q)
    const participants: Participant[] = []
    querySnapshot.forEach((docSnap) => {
      participants.push(docSnap.data() as Participant)
    })

    // Sort by score descending
    return participants.sort((a, b) => b.score - a.score)
  }
}
