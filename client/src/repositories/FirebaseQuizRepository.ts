import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Quiz } from '@/types/quiz'
import type { IQuizRepository } from '@/repositories/IQuizRepository'

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
    }

    await setDoc(docRef, newQuiz)
    return newQuiz
  }

  async getQuizzesByCreator(creatorId: string): Promise<Quiz[]> {
    const q = query(collection(db, this.collectionName), where('creatorId', '==', creatorId))
    const querySnapshot = await getDocs(q)
    const quizzes: Quiz[] = []
    querySnapshot.forEach((doc) => {
      quizzes.push(doc.data() as Quiz)
    })

    // Sort descending by createdAt in client to avoid requiring a composite index immediately in Firestore
    return quizzes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as Quiz
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
    return updatedSnap.data() as Quiz
  }

  async deleteQuiz(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }
}
