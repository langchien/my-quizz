import { collection, doc, getDocs, query, setDoc, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { SoloResult } from '@/types/room'
import type { ISoloRepository } from '@/repositories/ISoloRepository'

export class FirebaseSoloRepository implements ISoloRepository {
  private collectionName = 'solo_results'

  async saveResult(result: Omit<SoloResult, 'id'>): Promise<string> {
    const docRef = doc(collection(db, this.collectionName))
    const newResult: SoloResult = {
      ...result,
      id: docRef.id,
    }
    await setDoc(docRef, newResult)
    return docRef.id
  }

  async getResultsByUser(userId: string): Promise<SoloResult[]> {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
    )
    const querySnapshot = await getDocs(q)
    const results: SoloResult[] = []
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as SoloResult)
    })

    // Sort by completedAt descending (client-side to avoid composite index)
    return results.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    )
  }
}
