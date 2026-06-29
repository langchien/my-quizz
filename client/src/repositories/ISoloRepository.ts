import type { SoloResult } from '@/types/room'

export interface ISoloRepository {
  saveResult(result: Omit<SoloResult, 'id'>): Promise<string>
  getResultsByUser(userId: string): Promise<SoloResult[]>
}
