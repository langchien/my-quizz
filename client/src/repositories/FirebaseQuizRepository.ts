import { db } from '@/lib/firebase'
import type { IQuizRepository } from '@/repositories/IQuizRepository'
import type { Quiz } from '@/types/quiz'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

export class FirebaseQuizRepository implements IQuizRepository {
  private collectionName = 'quizzes'

  async createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
    const docRef = doc(collection(db, this.collectionName))
    const now = new Date().toISOString()
    const newQuiz: Quiz = {
      ...quizData,
      id: docRef.id,
      createdAt: now,
      updatedAt: now,
      playCount: quizData.playCount ?? 0,
    }

    await setDoc(docRef, newQuiz)
    return newQuiz
  }

  async getQuizzesByCreator(creatorId: string): Promise<Quiz[]> {
    const q = query(collection(db, this.collectionName), where('creatorId', '==', creatorId))
    const querySnapshot = await getDocs(q)
    const quizzes: Quiz[] = []
    querySnapshot.forEach((doc) => {
      quizzes.push({ playCount: 0, ...doc.data() } as Quiz)
    })

    // Sort descending by createdAt in client to avoid requiring a composite index immediately in Firestore
    return quizzes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { playCount: 0, ...docSnap.data() } as Quiz
    }
    return null
  }

  async updateQuiz(id: string, data: Partial<Omit<Quiz, 'id' | 'createdAt'>>): Promise<Quiz> {
    const docRef = doc(db, this.collectionName, id)
    const now = new Date().toISOString()

    const updateData = {
      ...data,
      updatedAt: now,
    }

    await updateDoc(docRef, updateData)

    // Return the fully updated quiz
    const updatedSnap = await getDoc(docRef)
    return { playCount: 0, ...updatedSnap.data() } as Quiz
  }

  async deleteQuiz(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }

  async searchPublicQuizzes(
    keyword?: string,
    category?: string,
    difficulty?: string,
  ): Promise<Quiz[]> {
    const q = query(collection(db, this.collectionName), where('isPublished', '==', true))
    const querySnapshot = await getDocs(q)

    let results: Quiz[] = []
    querySnapshot.forEach((doc) => {
      results.push({ playCount: 0, ...doc.data() } as Quiz)
    })

    // Client-side filtering (Firestore free tier doesn't support full-text search)
    if (keyword) {
      const lower = keyword.toLowerCase()
      results = results.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(lower) ||
          quiz.description?.toLowerCase().includes(lower),
      )
    }

    if (category) {
      results = results.filter((quiz) => quiz.category === category)
    }

    if (difficulty) {
      results = results.filter((quiz) => quiz.difficulty === difficulty)
    }

    // Sort by playCount descending (most popular first)
    return results.sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
  }

  async incrementPlayCount(quizId: string): Promise<void> {
    const docRef = doc(db, this.collectionName, quizId)
    await updateDoc(docRef, {
      playCount: increment(1),
    })
  }
}
